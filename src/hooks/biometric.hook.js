import {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';
import ReactNativeBiometrics from 'react-native-biometrics';
import {CommonActions, useNavigation} from '@react-navigation/native';
import Toast from 'react-native-toast-message';

const rnBiometric = new ReactNativeBiometrics();

const useBiometricAuth = () => {
  const [isBiometricExist, setisBiometricExist] = useState(false);
  const [keyFound, setKeyFound] = useState(null);
  const [bmEnabled, setBmEnabled] = useState(null);
  const [bmPass, setBmPass] = useState(null);
  const navigation = useNavigation();

  const checkBiometricSupport = async () => {
    try {
      const biometryType = await Keychain.getSupportedBiometryType();
      if (biometryType) {
        setisBiometricExist(true);
        const bmStatus = await AsyncStorage.getItem('bmEnabled');
        setBmEnabled(bmStatus);
        setKeyFound(bmStatus === 'true' ? 'enabled' : null);
      } else {
        setisBiometricExist(false);
      }
    } catch (error) {
      console.error('Biometric support check failed', error);
    }
  };

  // Verify biometric once with simplePrompt then persist the enabled flag.
  // Returns true if the user confirmed, false if cancelled or failed.
  const createKey = async () => {
    try {
      const {success} = await rnBiometric.simplePrompt({
        promptMessage: 'Confirm biometric to enable',
        cancelButtonText: 'Cancel',
      });
      if (success) {
        await AsyncStorage.setItem('bmEnabled', 'true');
        setKeyFound('enabled');
        setBmEnabled('true');
        Toast.show({text1: 'Biometric enabled'});
        return true;
      }
      return false;
    } catch (error) {
      Toast.show({text1: 'Could not enable biometric, please try again'});
      return false;
    }
  };

  const deleteKey = async () => {
    await AsyncStorage.removeItem('bmEnabled');
    setKeyFound(null);
    setBmEnabled(null);
    Toast.show({text1: 'Biometric deactivated'});
  };

  // Show the OS fingerprint / Face ID prompt
  const promptSignIn = async () => {
    if (!keyFound) {
      Toast.show({text1: 'Biometric not set up. Please use your PIN.'});
      return;
    }
    try {
      const {success} = await rnBiometric.simplePrompt({
        promptMessage: 'Sign in',
        cancelButtonText: 'Use PIN',
      });
      if (success) {
        setBmPass(true);
      }
    } catch (error) {
      console.error('Biometric sign-in failed', error);
      Toast.show({
        type: 'error',
        text1: 'Biometric failed',
        text2: 'Please use your PIN instead',
      });
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
    setBmEnabled,
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
