import {Alert, Platform} from 'react-native';
import messaging from '@react-native-firebase/messaging';
// import './firbase.config'; // Import to ensure Firebase is initialized

export async function requestUserPermission() {
  try {
    if (Platform.OS === 'ios') {
      await messaging().registerDeviceForRemoteMessages();
    }

    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('✅ Push notification permission granted.');
      await getFCMToken();
    } else {
      console.log('❌ Push notification permission denied.');
    }
  } catch (error) {
    console.error('Error requesting push permission:', error);
  }
}

/**
 * Get FCM token
 */
export async function getFCMToken() {
  try {
    const token = await messaging().getToken();
    console.log('📲 FCM Token:', token);
    return token;
  } catch (error) {
    console.error('Error getting FCM token:', error);
  }
}

/**
 * Setup notification listeners
 */
export function setupNotificationListeners() {
  // Foreground
  const unsubscribeOnMessage = messaging().onMessage(async remoteMessage => {
    console.log('📩 Foreground message:', remoteMessage);
    Alert.alert(
      remoteMessage.notification?.title || 'Notification',
      remoteMessage.notification?.body || '',
    );
  });

  // Background & quit
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
