import React, { useRef, useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { styles } from './style';
import { ScreenView } from '../../../global/wrappers';
import { BLACK, PRIMARY_COLOR, WHITE } from '../../../global/theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { CustomButton } from '../../../global/components';
import { useVerifyOtp, useVerifyForgotPasswordOtp, useSendOtp } from '../../../hooks/auth.hook';
import OTPTextView from 'react-native-otp-textinput';
import Toast from 'react-native-toast-message';
import Loader from '../../../components/modals/Loader';
import tw from 'twrnc';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OtpScreen = ({ navigation, route }) => {
  let otpRef = useRef(null);
  const { isVerified, resetPassword = false } = route.params || {};
  const { mutate: verifyOtp, status: verifyStatus } = useVerifyOtp();
  const { mutate: verifyForgotOtp, status: verifyForgotStatus } = useVerifyForgotPasswordOtp();
  const { mutate: sendOtp, status: resendStatus } = useSendOtp();
  const status = resetPassword ? verifyForgotStatus : verifyStatus;

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [resendEnabled, setResendEnabled] = useState(false);
  const { emailAddress } = route.params;
  const triggerSendOnLoad = route.params?.triggerSend || false;
  useEffect(() => {
    if (triggerSendOnLoad) {
      handleResendOtp();
    }
  }, [])

  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else {
      setResendEnabled(true);
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [timer]);

  const maskEmail = email => {
    const [name, domain] = email.split('@');
    if (name.length <= 3) {
      return email;
    }
    const maskedName = name.substring(0, 3) + '*****';
    return `${maskedName}@${domain}`;
  };


  const handleVerify = () => {
    const userData = {
      emailAddress,
      otp: otp,
    };

    const mutate = resetPassword ? verifyForgotOtp : verifyOtp;
    mutate(userData, {
      onSuccess: data => {
        if (data) {

          if (resetPassword) {
            navigation.navigate('reset-password-screen', {emailAddress});
          } else {

            navigation.navigate('create-pin-screen');
            AsyncStorage.setItem('authEmail', emailAddress); //stores email for further verification in app.

            Toast.show({
              type: 'success',
              text1: 'confirm sucessful',
              text2: '',
            });
          }
        } else {
          Toast.show({
            type: 'error',
            text1: 'Verification failed',
            text2: 'The OTP entered is incorrect or expired.',
          });
        }
      },
      onError: error => {
        console.log(error)
        Toast.show({
          type: 'error',
          text1: 'Verification Error',
          text2:
            error?.response?.data?.message ||
            error?.response?.data?.error ||
            error?.message ||
            'An error occurred. Please try again.',
        });
      },
    });
  };

  const handleResendOtp = () => {
    sendOtp(
      { emailAddress },
      {
        onSuccess: data => {
          if (data) {
            Toast.show({
              type: 'success',
              text1: 'OTP resent successfully',
              text2: 'Check your email for the OTP.',
            });
            setResendEnabled(false);
            setTimer(60);
          } else {
            Toast.show({
              type: 'error',
              text1: 'Resend failed',
              text2: 'Unexpected response from the server.',
            });
          }
        },
        onError: error => {
          Toast.show({
            type: 'error',
            text1: 'Resend Error',
            text2:
              error?.response?.data?.message ||
              error?.response?.data?.error ||
              error?.message ||
              'Failed to resend OTP. Please try again.',
          });
          setResendEnabled(false);
          setTimer(60);
        },
      },
    );
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
            <Text style={styles.text1}>
              {isVerified ? 'Verify it’s you' : 'Confirm your email address'}
            </Text>
            <Text style={styles.text11}>
              We sent a code to{' '}
              <Text style={tw`font-bold text-gray-500`}>
                {' '}
                ({maskEmail(emailAddress)})
              </Text>
              . Enter it here to verify your identity.
            </Text>
          </View>

          <View style={styles.v2}>
            {/* OTP Input */}
            <OTPTextView
              ref={e => (otpRef = e)}
              inputCellLength={1}
              containerStyle={styles.containerOtp}
              textInputStyle={styles.inputOtp}
              handleTextChange={val => setOtp(val)}
              tintColor={PRIMARY_COLOR}
              inputCount={6}
              secureTextEntry={true}
              keyboardType={'number-pad'}
            />
          </View>

          <View style={styles.v3}>
            {resendEnabled ? (
              <TouchableOpacity onPress={handleResendOtp}>
                <Text style={[styles.text13, { color: PRIMARY_COLOR }]}>
                  Resend Code
                </Text>
              </TouchableOpacity>
            ) : (
              <Text style={styles.text13}>
                Resend Code in{' '}
                <Text style={{ color: PRIMARY_COLOR }}>{timer}s</Text>
              </Text>
            )}
          </View>

          <CustomButton
            onPress={handleVerify}
            style={styles.btn1}
            text={'Continue'}
          />
        </View>
      </ScrollView>
      {status === 'pending' && <Loader />}
      {resendStatus === 'pending' && <Loader />}
    </ScreenView>
  );
};

export default OtpScreen;
