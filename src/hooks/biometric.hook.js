import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';
import ReactNativeBiometrics from 'react-native-biometrics';
import { Alert, Platform, ToastAndroid } from 'react-native';
import { CommonActions, useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

const useBiometricAuth = () => {
  const rnBiometric = new ReactNativeBiometrics();
  const [isBiometricExist, setisBiometricExist] = useState(false); //checks if device supports biometric
  const [keyFound, setKeyFound] = useState(null); // handles the publiv key found if biometric is activated
  const [bmEnabled, setBmEnabled] = useState(null); //status of biometric enabled
  const [bmPass, setBmPass] = useState(null); //status of biometric authenntication
  const navigation = useNavigation();
  let epochTimeSeconds = Math.round((new Date()).getTime() / 1000).toString()
  let payload = epochTimeSeconds + 'login with biometric'
        
  // Function to check for biometric support and retrieve the stored key
  const checkBiometricSupport = async () => {
    try {
      const result = await Keychain.getSupportedBiometryType();
      if (result) {
        setisBiometricExist(true);
        const storedKey = await AsyncStorage.getItem('bPK'); // Retrieve the stored key
        const bmStatus = await AsyncStorage.getItem('bmEnabled'); // Retrieve the status of biometric
        setBmEnabled(bmStatus)//set the status of the bm
        setKeyFound(storedKey); //set the stored key
      } else {
        setisBiometricExist(false);
      }
    } catch (error) {
      console.error('Biometric support check failed', error);
    }
  };

  
  //∞∞CREATE KEY WHEN USER NOT LOGGEDIN WITH BIO∞∞∞∞/
  const createKey = ()=>{  
    rnBiometric.createKeys()
  .then((resultObject) => {
    const { publicKey } = resultObject
     AsyncStorage.setItem('bPK', publicKey); // store the pubKey of bio
    AsyncStorage.setItem('bmEnabled', 'true');//store status of biometric enabled
                
    
  }).catch((e)=>{
    Toast.show(
      'Something went wrong, please proceed without biometric',
      ToastAndroid.LONG
    );
  })
  }
  //∞∞∞∞END∞∞∞∞∞∞∞∞∞////


   const deleteKey = async () => {
        await rnBiometric.deleteKeys();
        await AsyncStorage.removeItem('bPK');
        await AsyncStorage.removeItem('bmEnabled');
        setKeyFound(false);
        Toast.show({text1:'Biometric deactivated'});
          
        
    };

  // Function to prompt biometric sign-in
  const promptSignIn = async () => {
    if (!keyFound) {
      Toast.show({text1:
        'Please use PIN instead, you have not activated your biometric'},
      );
    } else {
      try {
        const resultObject = await rnBiometric.createSignature({
          promptMessage: 'Sign in',
          payload: payload, // Define your payload if needed
        });
        
        const { success, signature } = resultObject;
        if (success) {
          // console.log('Biometric authentication succeeded with signature:', signature);
          setBmPass(true);
          Toast.show({
            type: 'success',
        text1:  'Biometric Successful',
        text2: 'You have successfully authenticated your app.',
           
          }
          );
          // Continue with your logic after successful authentication
        }
      } catch (error) {
        console.error('Biometric sign-in failed', error);
        Toast.show({type:'error',
          text1:'Biometric Failed',
        }
        );
      }
    }
  };

  // Function to handle biometric authentication flow
  const handleBiometricAuth = async () => {
    try {
      await promptSignIn();
    } catch (error) {
      console.error('Biometric authentication failed', error);
      Alert.alert('Error', 'Biometric authentication failed.');
    }
  };

  // Run the check for biometric support when the hook initializes
  useEffect(() => {
    checkBiometricSupport();
  }, []);

  const navigateHome = (fromRoute = '')=>{
    if(fromRoute == ''){
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'bottom-tab'}],
        }),
      );
    }else{
      navigation.navigate(fromRoute);
    }
  }
  

  return {
    isBiometricExist,
    keyFound,
    bmEnabled, //
    setBmEnabled,
    handleBiometricAuth,
    navigateHome,
    promptSignIn,
    createKey,
    deleteKey,
    bmPass,
    setBmPass
  };
};

export default useBiometricAuth;