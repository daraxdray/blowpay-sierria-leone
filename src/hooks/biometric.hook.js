import {useState, useEffect, useCallback} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';
import ReactNativeBiometrics from 'react-native-biometrics';
import {CommonActions, useNavigation} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import {getUserPincode} from '../utils/storage';

const rnBiometric = new ReactNativeBiometrics();
const BM_ENABLED_KEY = 'bmEnabled';

const useBiometricAuth = () => {
  const [isBiometricExist, setisBiometricExist] = useState(false);
  const [keyFound, setKeyFound] = useState(null);
  const [bmEnabled, setBmEnabled] = useState(null);
  const [hasStoredPin, setHasStoredPin] = useState(false);
  const [bmPass, setBmPass] = useState(null);
  const navigation = useNavigation();

  // The only signal callers should use to decide whether biometric UI can
  // actually do anything useful right now: hardware+enrolled, user opted in,
  // and a PIN is actually sitting in Keychain to auto-submit.
  const isBiometricReady = isBiometricExist && bmEnabled === 'true' && hasStoredPin;

  const checkBiometricSupport = useCallback(async () => {
    try {
      const biometryType = await Keychain.getSupportedBiometryType();
      const exists = !!biometryType;
      setisBiometricExist(exists);

      if (!exists) {
        setKeyFound(null);
        setBmEnabled(null);
        setHasStoredPin(false);
        return;
      }

      const bmStatus = await AsyncStorage.getItem(BM_ENABLED_KEY);
      setBmEnabled(bmStatus);
      setKeyFound(bmStatus === 'true' ? 'enabled' : null);

      try {
        const credentials = await getUserPincode();
        setHasStoredPin(!!credentials?.pincode);
      } catch (pinError) {
        console.error('Failed to check stored PIN', pinError);
        setHasStoredPin(false);
      }
    } catch (error) {
      console.error('Biometric support check failed', error);
      setisBiometricExist(false);
      setKeyFound(null);
      setHasStoredPin(false);
    }
  }, []);

  // Verify biometric once with simplePrompt then persist the enabled flag.
  // Returns true if the user confirmed, false if cancelled or failed - callers
  // (e.g. the Settings toggle) must only reflect "enabled" state on a true
  // return, never optimistically.
  const createKey = async () => {
    try {
      const {success} = await rnBiometric.simplePrompt({
        promptMessage: 'Confirm biometric to enable',
        cancelButtonText: 'Cancel',
      });
      if (success) {
        await AsyncStorage.setItem(BM_ENABLED_KEY, 'true');
        setKeyFound('enabled');
        setBmEnabled('true');
        const credentials = await getUserPincode().catch(() => null);
        setHasStoredPin(!!credentials?.pincode);
        Toast.show({text1: 'Biometric enabled'});
        return true;
      }
      return false;
    } catch (error) {
      console.error('Biometric enable failed', error);
      Toast.show({
        type: 'error',
        text1: 'Could not enable biometric, please try again',
      });
      return false;
    }
  };

  // Disable flow - always clears local state even if AsyncStorage throws, so
  // the UI never gets stuck showing biometrics as enabled.
  const deleteKey = async () => {
    try {
      await AsyncStorage.removeItem(BM_ENABLED_KEY);
    } catch (error) {
      console.error('Failed to clear biometric flag', error);
    } finally {
      setKeyFound(null);
      setBmEnabled(null);
      Toast.show({text1: 'Biometric deactivated'});
    }
  };

  // Show the OS fingerprint / Face ID prompt. Returns true only on a
  // confirmed success so callers never mistake a cancel/failure for success.
  const promptSignIn = async () => {
    if (!isBiometricExist) {
      Toast.show({
        type: 'error',
        text1: 'Biometric not available on this device.',
      });
      return false;
    }
    if (bmEnabled !== 'true') {
      Toast.show({text1: 'Biometric not set up. Please use your PIN.'});
      return false;
    }
    if (!hasStoredPin) {
      Toast.show({text1: 'Please sign in with your PIN first.'});
      return false;
    }
    try {
      const {success} = await rnBiometric.simplePrompt({
        promptMessage: 'Sign in',
        cancelButtonText: 'Use PIN',
      });
      if (success) {
        setBmPass(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Biometric sign-in failed', error);
      Toast.show({
        type: 'error',
        text1: 'Biometric failed',
        text2: 'Please use your PIN instead',
      });
      return false;
    }
  };

  const handleBiometricAuth = async () => {
    await promptSignIn();
  };

  useEffect(() => {
    checkBiometricSupport();
  }, []);

  const navigateHome = (fromRoute = '') => {
    if (fromRoute === '') {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'bottom-tab'}],
        }),
      );
    } else {
      navigation.navigate(fromRoute);
    }
  };

  return {
    isBiometricExist,
    keyFound,
    bmEnabled,
    hasStoredPin,
    isBiometricReady,
    checkBiometricSupport,
    handleBiometricAuth,
    navigateHome,
    promptSignIn,
    createKey,
    deleteKey,
    bmPass,
    setBmPass,
  };
};

export default useBiometricAuth;
