import {Alert, Platform} from 'react-native';
import messaging, {
  AuthorizationStatus,
} from '@react-native-firebase/messaging';
import {request, check, PERMISSIONS, RESULTS} from 'react-native-permissions';

const NOTIFICATION_PROMPT_TITLE = 'Enable notifications';
const NOTIFICATION_PROMPT_MESSAGE =
  'Stay updated on your transactions and important account alerts. Allow notifications?';

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const IOS_FCM_RETRY_ATTEMPTS = 3;
const IOS_FCM_RETRY_DELAY_MS = 1500;

/**
 * Check if running on iOS simulator
 */
const isIOSSimulator = async () => {
  if (Platform.OS !== 'ios') return false;
  
  try {
    // Try to check if device is registered - simulators will fail
    const isRegistered = await messaging().isDeviceRegisteredForRemoteMessages;
    return !isRegistered;
  } catch (error) {
    // If we get a simulator error, return true
    if (error?.message?.includes('simulator')) {
      return true;
    }
    return false;
  }
};

/**
 * Request notification permission
 */
export async function requestUserPermission() {
  try {
    if (Platform.OS === 'ios') {
      // Check if simulator first
      const isSimulator = await isIOSSimulator();
      if (isSimulator) {
        console.log('⚠️ Running on iOS simulator - FCM not available');
        return;
      }

      // Only register once - check if already registered
      const isRegistered = await messaging().isDeviceRegisteredForRemoteMessages;
      if (!isRegistered) {
        await messaging().registerDeviceForRemoteMessages();
      }

      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === AuthorizationStatus.AUTHORIZED ||
        authStatus === AuthorizationStatus.PROVISIONAL;
      
      if (enabled) {
        console.log('✅ Push notification permission granted.');
        await delay(1000); // Brief delay for APNs registration
        await getFCMToken();
      } else {
        console.log('❌ Push notification permission denied.');
      }
      return;
    }

    if (Platform.OS === 'android' && Platform.Version >= 33) {
      const status = await request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
      if (status === RESULTS.GRANTED) {
        console.log('✅ Push notification permission granted.');
        await getFCMToken();
      } else {
        console.log('❌ Push notification permission denied.');
      }
      return;
    }

    // Android < 13: notifications allowed by default
    await getFCMToken();
  } catch (error) {
    console.error('Error requesting push permission:', error);
  }
}

/**
 * Returns true if notifications are allowed
 */
export async function hasNotificationPermission() {
  if (Platform.OS === 'ios') {
    const authStatus = await messaging().hasPermission();
    return (
      authStatus === AuthorizationStatus.AUTHORIZED ||
      authStatus === AuthorizationStatus.PROVISIONAL
    );
  }
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    const status = await check(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
    return status === RESULTS.GRANTED;
  }
  return true;
}

export function promptForNotificationPermission() {
  Alert.alert(
    NOTIFICATION_PROMPT_TITLE,
    NOTIFICATION_PROMPT_MESSAGE,
    [
      {text: 'Not now', style: 'cancel'},
      {text: 'Allow', onPress: () => requestUserPermission()},
    ],
    {cancelable: true}
  );
}

export async function promptForNotificationPermissionIfNeeded() {
  try {
    const granted = await hasNotificationPermission();
    if (!granted) {
      promptForNotificationPermission();
    }
  } catch (error) {
    console.error('Error checking notification permission:', error);
  }
}

/**
 * Get FCM token with simulator detection
 */
export async function getFCMToken() {
  const isIOS = Platform.OS === 'ios';

  // Check for simulator on iOS
  if (isIOS) {
    const isSimulator = await isIOSSimulator();
    if (isSimulator) {
      console.log('⚠️ iOS Simulator detected - skipping FCM token retrieval');
      return undefined;
    }
  }

  const tryGetToken = async () => {
    try {
      const token = await messaging().getToken();
      if (token) {
        console.log('📲 FCM Token:', token);
      }
      return token;
    } catch (error) {
      // Check if simulator error
      if (error?.message?.includes('simulator')) {
        console.log('⚠️ Simulator detected in getToken()');
        return undefined;
      }
      throw error;
    }
  };

  if (isIOS) {
    // Register once before retry loop
    const isRegistered = await messaging().isDeviceRegisteredForRemoteMessages;
    if (!isRegistered) {
      await messaging().registerDeviceForRemoteMessages();
      await delay(1000); // Wait for registration
    }

    // Retry logic for real devices
    for (let attempt = 1; attempt <= IOS_FCM_RETRY_ATTEMPTS; attempt++) {
      try {
        const token = await tryGetToken();
        if (token) return token;
        
        // Token not available yet, wait and retry
        if (attempt < IOS_FCM_RETRY_ATTEMPTS) {
          console.log(
            `📲 FCM token not ready (attempt ${attempt}/${IOS_FCM_RETRY_ATTEMPTS}), retrying...`,
          );
          await delay(IOS_FCM_RETRY_DELAY_MS);
        }
      } catch (error) {
        const isRetryable =
          error?.message?.includes('APNS') ||
          error?.message?.includes('APNs') ||
          error?.code === 'messaging/unknown';

        if (isRetryable && attempt < IOS_FCM_RETRY_ATTEMPTS) {
          console.log(`Retrying FCM token (attempt ${attempt})...`);
          await delay(IOS_FCM_RETRY_DELAY_MS);
        } else {
          console.error('Error getting FCM token:', error);
          return undefined;
        }
      }
    }
    return undefined;
  }

  // Android
  try {
    return await tryGetToken();
  } catch (error) {
    console.error('Error getting FCM token:', error);
    return undefined;
  }
}

/**
 * Setup notification listeners
 */
export function setupNotificationListeners() {
  const unsubscribeOnMessage = messaging().onMessage(async remoteMessage => {
    console.log('📩 Foreground message:', remoteMessage);
    Alert.alert(
      remoteMessage.notification?.title || 'Notification',
      remoteMessage.notification?.body || '',
    );
  });

  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('📡 Background message:', remoteMessage);
  });

  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log('📬 Opened from background:', remoteMessage.notification);
  });

  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log('📥 Opened from quit state:', remoteMessage.notification);
      }
    });

  return unsubscribeOnMessage;
}