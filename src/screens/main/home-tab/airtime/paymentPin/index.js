import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { styles } from './style';
import { ScreenView } from '../../../../../global/wrappers';
import { PRIMARY_COLOR, WHITE } from '../../../../../global/theme';
import Header from '../../../../../global/components/Header';
import tw from 'twrnc';
import OTPTextView from 'react-native-otp-textinput';
import { CustomButton } from '../../../../../global/components';
import { useConfirmPasscode } from '../../../../../hooks/auth.hook';
import Toast from 'react-native-toast-message';
import { useTransfer } from '../../../../../hooks/virtual.hook';
import { CommonActions } from '@react-navigation/native';
import useBiometricAuth from '../../../../../hooks/biometric.hook';
import BiometricComponent from '../../../../../components/biometric/biometric_component';
import Loader from '../../../../../components/modals/Loader';

const PaymentPin = props => {
  const navigation = props.navigation;
  const route = props.route;
  const { amount, accNum } = route.params;
  const { mutate: confirmPasscode, status } = useConfirmPasscode();
  const { mutate: transfer } = useTransfer();
  const [otp, setOtp] = useState();
  const {isBiometricExist,keyFound, handleBiometricAuth} = useBiometricAuth();
  const unformatAmount = formattedValue => {
    return formattedValue.replace(/,/g, '');
  };
  const rawValue = unformatAmount(amount);
  const handleVerify = () => {
    if (otp?.length === 6) {
      const userData = {
        passcode: otp,
      };

      confirmPasscode(userData, {
        onSuccess: data => {
          if (data) {
            const transferData = {
              amount: rawValue,
              accountNumber: accNum,
              description:"Transfer"
            };

            transfer(transferData, {
              onSuccess: transferResponse => {
                console.log("uiuhiu",transferResponse);

                if (transferResponse) {
                  navigation.dispatch(
                    CommonActions.reset({
                      index: 0,
                      routes: [{ name: 'PaymentSucess' }],
                    }),
                  );
                } else {
                  Toast.show({
                    type: 'error',
                    text1:
                      transferResponse?.message ||
                      transferResponse?.data?.message ||
                      'Transfer failed. Please try again.',
                    text2: 'Please try again.',
                  });
                }
              },
              onError: transferError => {
              
                const errorMessage = 
                transferError?.response?.data?.error ||
                  transferError?.response?.data?.message ||
                  'Transfer failed. Please try again.';
                Toast.show({
                  type: 'error',
                  text1: 'Transfer failed',
                  text2: errorMessage,
                });
              },
            });
          } else {
            Toast.show({
              type: 'error',
              text1: 'Passcode confirmation failed',
              text2: 'Please try again.',
            });
          }
        },
        onError: error => {
          const errorMessage =
          transferError?.response?.data?.error ||
            error?.response?.data?.message ||
            'An error occurred. Please try again.';
          Toast.show({
            type: 'error',
            text1: 'Passcode confirmation failed',
            text2: errorMessage,
          });
        },
      });
    } else {
      Toast.show({
        type: 'error',
        text1: 'Invalid OTP',
        text2: 'Please enter a valid 6-digit passcode.',
      });
    }
  };

  const makeTransfer = ()=>{
    const transferData = {
      amount: rawValue,
      accountNumber: accNum,
      description:"Transfer"
    };

    transfer(transferData, {
      onSuccess: transferResponse => {
        console.log("poiop",transferResponse);

        if (transferResponse) {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'PaymentSucess' }],
            }),
          );
        } else {

          Toast.show({
            type: 'error',
            text1:
              transferResponse?.data?.message ||
              'Transfer failed. Please try again.',
            text2: 'Please try again.',
          });
        }
      },
      onError: transferError => {
       
        
        const errorMessage =
        transferError?.response?.data?.error ||
          transferError?.response?.data?.message ||
          'Transfer failed. Please try again.';
        Toast.show({
          type: 'error',
          text1: 'Transfer failed',
          text2: errorMessage,
        });
      },
    });
  }
  return (
    <ScreenView style={styles.container} light color={WHITE}>
      <ScrollView style={styles.viewContainer}>
        <View style={styles.view1}>
          <Header
            navigation={() => {
              navigation.goBack();
            }}
            // 7245545428
            ImageSource={require('../../../../../../assets/icons/filter.png')}
            title=""
            showIcon={false}
            iconName="add-circle"
            imagePress={() => console.log('Second Icon Pressed')}
          />
          <View style={tw`flex items-center gap-3`}>
            <Text style={tw`text-[#2D2D2D] font-semibold text-[24px]`}>
              Enter PIN to Pay
            </Text>
            <Text style={tw`text-[#7F7F7F] font-normal text-[14px]`}>
              Enter PIN to confirm transaction
            </Text>
          </View>
          <View style={styles.v2}>
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
          {isBiometricExist && (
            <View
              style={tw`mt-3  flex flex-row items-center justify-center p-4  rounded-lg mt-[100]`}
              >
              <BiometricComponent signin={true} onComplete={makeTransfer}  />
            </View>
          )}
          <View style={tw`pb-5 w-full mt-10`}>
            <CustomButton
              onPress={handleVerify}
              style={styles.btn1}
              text={`Transfer`}
            />
          </View>
        </View>
        {status == 'pending' && <Loader/>}
      </ScrollView>
    </ScreenView>
  );
};

export default PaymentPin;
