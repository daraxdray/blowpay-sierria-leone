import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import tw from 'twrnc';
import { styles } from './style';
import { ScreenView } from '../../../../global/wrappers';
import { BLACK, WHITE } from '../../../../global/theme';
import Toast from 'react-native-toast-message';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as Keychain from 'react-native-keychain';
import { useConfirmPasscode, useLoginPasscode } from '../../../../hooks/auth.hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../../../../components/modals/Loader';
import { CommonActions } from '@react-navigation/native';
import OTPTextView from 'react-native-otp-textinput';
import ReactNativeBiometrics from 'react-native-biometrics';
import BiometricComponent from '../../../../components/biometric/biometric_component';
import useBiometricAuth from '../../../../hooks/biometric.hook';
import { useDispatch } from 'react-redux';
import { loginSuccess, logout } from '../../../../contexts/actions/user';
import { useGetVitualAcc } from '../../../../hooks/virtual.hook';
import { getUserPincode, saveUserCredentials } from '../../../../utils/storage';
import { useGetUser } from '../../../../hooks/user.hook';

const TransactionPinScreen = props => {
  const navigation = props.navigation;
  const params = props?.route?.params;

  const [otp, setOtp] = useState('');
  const { mutate: confirmPasscode, status } = useConfirmPasscode();
  const { mutate: loginPasscode, status:loggingInPasscode } = useLoginPasscode();
  const [userData, setUserData] = useState(null);
  const { data: virtualData, refetch, } = useGetVitualAcc();
  const [useBio, setUseBio] = useState(false);
  const {data:user} = useGetUser();

  const dispatch = useDispatch();

  // useEffect(()=>{
  //   if(Platform.OS == 'android' && (user?.data == undefined || user?.message == "Unauthorized")){
  //     AsyncStorage.removeItem('bPK');
  //     AsyncStorage.removeItem('bmEnabled');
     
  //    dispatch(logout())
     
  //    navigation.dispatch(
  //      CommonActions.reset({
  //        index: 0,
  //        routes: [{name: 'walkthrough-screen'}],
  //      }),
  //    );
  //   }
    
  // },[user])
  const loadUserData = async () => {
    try {
      const savedUserData = await AsyncStorage.getItem('userData');
      if (savedUserData) {
        setUserData(JSON.parse(savedUserData));
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

  useEffect(() => {
    // checkBiometricSupport();
    loadUserData();
  }, []);

  const handleBiometric = async () => {
    const det = await getUserPincode();
    if (det?.pincode) {
      handleOtpChange(det.pincode);
    }
  }
  //approve login
  const authorizeLogin = (data) => {
    console.log("AUTHORZE LOGIN STATUS",data)
    if (data?.message === 'Unauthorized') {
      dispatch(logout())
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'TransactionPinScreen' }],
        }),
      );
    } else {
      dispatch(loginSuccess())
      // console.warn(params);
      // console.warn(props?.route?.params?.currentRoute); 
      //check if an existing route was passed else nvaigate home.
      if (props?.route?.params?.currentRoute) {
        // navigation.navigate(props?.route?.params?.currentRoute);
        navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [{ name: 'bottom-tab' },
            { name: props?.route?.params?.currentRoute }
            ],
          }),);
      } else {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'bottom-tab' }],
          }),);
      }


    }
  }
  const handleOtpChange = async otpValue => {
    setOtp(otpValue);
    const email = await AsyncStorage.getItem('authEmail');
  
    if (otpValue.length === 6) {
      const userData = { passcode: otpValue, emailAddress:email};

      if(Platform.OS == 'android'){
        await confirmPasscode(userData, {
          onSuccess: async data => {
            await saveUserCredentials(email, otpValue);
            authorizeLogin(data);
          },
          onError: error => {

            Toast.show({
              type: 'error',
              text1: 'Error',
              text2: ('Error', error.response?.data?.error ?? "Unable to authorize pin"),
            });
            setOtp('');
          },
        });
      }else{

         loginPasscode(userData, {
          onSuccess: async data => {
            await saveUserCredentials(email, otpValue);
            authorizeLogin(data);
          },
          onError: error => {

            Toast.show({
              type: 'error',
              text1: 'Error',
              text2: ('Error', error.response?.data?.error ?? "Unable to authorize pin"),
            });
            setOtp('');
          },
        });
      }
      
    }
  };

  useEffect(() => {
    const checkUserPin = async () => {
      return await getUserPincode();
    }
    checkUserPin().then((res) => {

      
      if (res) {
        setUseBio(true);
      }
    })

  }, [])
  return (
    <ScreenView style={styles.container} light color={WHITE}>
      <View style={tw`flex-1 justify-center items-center`}>
        <View style={tw`flex-1 justify-center w-full`}>
          <ScrollView style={styles.viewContainer}>
            <View
              style={tw`gap-10 flex flex-1 items-center justify-center mt-30`}>
              <View style={tw`flex justify-center items-center`}>
                <Text style={tw`text-[#2D2D2D] font-bold text-[18px] pb-2`}>
                  Welcome Back, {userData?.user?.firstName}
                </Text>
                <Text style={tw`text-[#7F7F7F] font-normal text-[14px]`}>
                  Enter your pin
                </Text>
              </View>

              <View style={tw`flex-1 justify-center items-center`}>
                <OTPTextView
                  inputCellLength={1}
                  containerStyle={styles.containerOtp}
                  textInputStyle={styles.inputOtp}
                  handleTextChange={handleOtpChange}
                  tintColor={'#F25B3E'}
                  inputCount={6}
                  secureTextEntry={true}
                  keyboardType={'number-pad'}
                />


                {useBio && <View style={tw`mt-8  flex flex-row items-center justify-center p-4  rounded-lg mt-[300]`} >
                  <BiometricComponent signin={true} fromRoute={props?.params?.currentRoute ?? ''} onComplete={handleBiometric} />
                </View>}


                <View className='flex flex-row item-center  '>

                  <TouchableOpacity
                    style={tw`flex-row justify-center items-center  mt-5`}
                    onPress={async () => {
                      dispatch(logout())
                      await AsyncStorage.removeItem('Login');
                      navigation.dispatch(
                        CommonActions.reset({
                          index: 0,
                          routes: [{ name: 'walkthrough-screen' }],
                        }),
                      );
                    }}>
                    <Text style={tw`text-red-500 text-[14px] font-bold`}>
                      Sign out
                    </Text>

                  </TouchableOpacity>
                  <TouchableOpacity
                    style={tw`flex-row justify-center items-center  mt-5 mt-100`}
                    onPress={async () => {

                      if(user?.data?.isPasscodeSet){
                        navigation.dispatch(
                          CommonActions.reset({
                            index: 0,
                            routes: [{ name: 'PinOtpScreen' }],
                          }),
                        );
                      }
                      else{
                        navigation.dispatch(
                          CommonActions.reset({
                            index: 0,
                            routes: [{ name: 'otp-screen', params: {emailAddress:user?.data?.emailAddress} }],
                          }),
                        );
                      }
                      
                    }}>
                    <Text style={tw`text-black text-[14px]  font-bold `}>
                      Reset Pin
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
      {(status === 'pending' || loggingInPasscode == 'pending') && <Loader />}
    </ScreenView>
  );
};

export default TransactionPinScreen;
