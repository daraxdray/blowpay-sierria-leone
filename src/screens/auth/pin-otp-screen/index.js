import React, {useRef, useState, useEffect} from 'react';
import {View, Text, ScrollView, TouchableOpacity} from 'react-native';

import {ScreenView} from '../../../global/wrappers';
import {BLACK, PRIMARY_COLOR, WHITE} from '../../../global/theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {CustomButton} from '../../../global/components';
import {useOtpReset, useSendOtp4Pin} from '../../../hooks/user.hook';
import OTPTextView from 'react-native-otp-textinput';
import Toast from 'react-native-toast-message';
import Loader from '../../../components/modals/Loader';
import tw from 'twrnc';
import { styles } from './style.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { saveUserCredentials } from '../../../utils/storage';

const PinOtpScreen = ({ navigation }) => {
  let otpRef = useRef(null);
  const { mutate: verifyOtp, status } = useOtpReset();
  const { mutate: sendOtp, status: resendStatus } = useSendOtp4Pin();

  const [emailAddress, setEmailAddress] = useState('');
  const [otp, setOtp] = useState('');
  const [passcode, setPasscode] = useState('');
  const [confirmPasscode, setConfirmPasscode] = useState('');
  const [step, setStep] = useState(1); // Tracks the current step: 1=OTP, 2=Create PIN, 3=Confirm PIN
  const [timer, setTimer] = useState(60);
  const [resendEnabled, setResendEnabled] = useState(false);

  useEffect(() => {
    const initializeEmail = async () => {
      const email = await AsyncStorage.getItem('authEmail');
      setEmailAddress(email);
      sendOtp({ email });
    };

    initializeEmail();
  }, []);

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

  const handleResendOtp = () => {
    // sendOtp({ emailAddress }, {
    //   onSuccess: () => {
    //     Toast.show({
    //       type: 'success',
    //       text1: 'OTP resent successfully',
    //       text2: 'Check your email for the OTP.',
    //     });
    //     setResendEnabled(false);
    //     setTimer(60);
    //   },
    //   onError: error => {
    //     Toast.show({
    //       type: 'error',
    //       text1: 'Resend Error',
    //       text2: error?.response?.data?.error || error?.message || 'Failed to resend OTP.',
    //     });
    //   },
    // });
  };

  
  const handleVerify = () => {
    if (step === 1 && otp) {
      setStep(2); // Move to Create PIN step
    } else if (step === 2 && passcode) {
      setStep(3); // Move to Confirm PIN step
    } else if (step === 3 && passcode && confirmPasscode) {
      if (passcode !== confirmPasscode) {
        Toast.show({
          type: 'error',
          text1: 'PIN Mismatch',
          text2: 'Passcode and confirm passcode do not match.',
        });
        return;
      }

      const payload = {
        otp,
        passcode,
        confirmPasscode,
      };
      
      verifyOtp(payload, {
        onSuccess: async () => {
          // Resync the biometric-stored PIN copy so Face ID/fingerprint keeps
          // working with the new PIN instead of silently auto-submitting the
          // old (now-invalid) one on the lock screen.
          if (emailAddress) {
            await saveUserCredentials(emailAddress, passcode);
          }
          navigation.navigate('bottom-tab');
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: 'Your PIN has been set successfully.',
          });
        },
        onError: error => {
          Toast.show({
            type: 'error',
            text1: 'Verification Error',
            text2: error?.response?.data?.error || error?.message || 'An error occurred.',
          });
        },
      });
    }
  };

  const maskEmail = email => {
    const [name, domain] = email.split('@');
    if (name.length <= 3) {
      return email;
    }
    const maskedName = name.substring(0, 3) + '*****';
    return `${maskedName}@${domain}`;
  };

  return (
    <ScreenView style={styles.container} light color={WHITE}>
      <ScrollView style={styles.viewContainer}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.btn}
            activeOpacity={0.65}
            onPress={() => navigation.navigate('walkthrough-screen')}>
            <Ionicons name="chevron-back" size={13} color={BLACK} />
          </TouchableOpacity>
        </View>
        <View style={styles.view1}>
          {step === 1 && (
            <>
              <Text style={styles.text1}>Verify it’s you</Text>
              <Text style={styles.text11}>
                We sent a code to{' '}
                <Text style={tw`font-bold text-gray-500`}>
                  ({maskEmail(emailAddress)})
                </Text>. Enter it here to verify your identity.
              </Text>
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
            </>
          )}

          {step === 2 && (
            <>
              <Text style={styles.text1}>Create a New PIN</Text>
              <OTPTextView
                placeholder="Enter new PIN"
                secureTextEntry={true}
                inputCount={6}
                containerStyle={styles.containerOtp}
                textInputStyle={styles.inputOtp}
                keyboardType="number-pad"
                handleTextChange={val => setPasscode(val)}
              />
            </>
          )}

          {step === 3 && (
            <>
              <Text style={styles.text1}>Confirm Your PIN</Text>
              <OTPTextView
                placeholder="Confirm new PIN"
                secureTextEntry={true}
                inputCount={6}
                containerStyle={styles.containerOtp}
                textInputStyle={styles.inputOtp}
                keyboardType="number-pad"
                handleTextChange={val => setConfirmPasscode(val)}
              />
              
            </>
          )}

          <View style={styles.v3}>
            {resendEnabled && step === 1 ? (
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
            text={step === 3 ? 'Set PIN' : 'Continue'}
          />
          {
            step === 3 &&  <TouchableOpacity onPress={()=>setStep(2)}>
            <Text style={[styles.text13, { color: PRIMARY_COLOR }]}>
              Enter New Pin Again
            </Text>
          </TouchableOpacity>
           }
        </View>
      </ScrollView>
      {(status === 'pending' || resendStatus === 'pending') && <Loader />}
    </ScreenView>
  );
};

export default PinOtpScreen;
