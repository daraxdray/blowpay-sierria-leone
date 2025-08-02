import React, {useEffect, useRef, useState} from 'react';
import {View, Text, ScrollView, TouchableOpacity} from 'react-native';
import {styles} from './style';
import {ScreenView} from '../../../global/wrappers';
import {BLACK, PRIMARY_COLOR, WHITE} from '../../../global/theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import OTPTextView from 'react-native-otp-textinput';
import {useSetPasscode} from '../../../hooks/auth.hook';
import Loader from '../../../components/modals/Loader';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CreatePin = props => {
  const navigation = props.navigation;
  let otpRef = useRef(null);
  const {mutate: setPasscode, status} = useSetPasscode();

  const [loading, setLoading] = useState(false);

  // useEffect(()=>{
  //   const load = async ()=>{
  //     const isLoggedIn = JSON.parse( await AsyncStorage.getItem('Login'));
  //     if(isLoggedIn){
          
  //       if(isLoggedIn?.status == 'inactive'){
  //         navigation.navigate('otp-screen', { emailAddress: isLoggedIn?.emailAddress, });
  //       }
  //     }
  //   }
  //   load()
  // },[])

  

  const _setOtp = value => {
    console.log('OTP Value:', value); // Check what's being logged here
    setOtp(value);

    if (value.length === 6) {
      handleVerify(value);
    }
  };
  const [otp, setOtp] = useState();
  const handleVerify = value => {
    const userData = {
      passcode: value,
    };

    setPasscode(userData, {
      onSuccess: data => {
        if (data) {
          navigation.navigate('ConfirmPin');
          
          Toast.show({
            type: 'success',
            text1: 'Passcode Creation sucessful',
            text2: '',
          });
        } else {
          Toast.show({
            type: 'error',
            text1: 'Passcode Creation  failed',
          });
        }
      },
      onError: error => {
        Toast.show({
          type: 'error',
          text1: 'Passcode Creation ',
          text2: 
          error?.response.data.error ||
          error?.message ||
           'An error occurred. Please try again.',
        });
      },
    });
  };

  return (
    <ScreenView style={styles.container} light color={WHITE}>
      <ScrollView style={styles.viewContainer}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.btn}
            activeOpacity={0.65}
            onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={13} color={BLACK} />
          </TouchableOpacity>
        </View>
        <View style={styles.view1}>
          <View style={styles.v1}>
            <Text style={styles.text1}>Create a 6-digit PIN</Text>
            <Text style={styles.text11}>
              You’ll use this PIN to sign in and confirm transactions.
            </Text>
          </View>

          <View style={styles.v2}>
            <OTPTextView
              ref={e => (otpRef = e)}
              inputCellLength={1}
              containerStyle={styles.containerOtp}
              textInputStyle={styles.inputOtp}
              handleTextChange={val => _setOtp(val)}
              tintColor={PRIMARY_COLOR}
              inputCount={6}
              secureTextEntry={true}
              keyboardType={'number-pad'}
            />
          </View>

          <View style={styles.v3}>
            {/* <Text style={styles.text13}>Resend Code <Text style={{color: PRIMARY_COLOR}}>59:23</Text> </Text>*/}
               {/* <CustomButton*/}
            {/*        onPress={() => navigation.navigate('otp-screen')}*/}
            {/*        style={styles.btn1}*/}
            {/*        text={"Submit Email"}*/}
            {/*    /> */}
          </View>
        </View>
      </ScrollView>
      {status === 'pending' && <Loader />}
    </ScreenView>
  );
};

export default CreatePin;
