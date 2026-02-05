import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import tw from 'twrnc';
import { ScreenView } from '../../../../../global/wrappers';
import { CustomButton } from '../../../../../global/components';
import { styles } from './style';


import { PRIMARY_COLOR, WHITE } from '../../../../../global/theme';
import OTPTextView from 'react-native-otp-textinput';
import Header from '../../../../../global/components/Header';
import Toast from 'react-native-toast-message';
import Loader from '../../../../../components/modals/Loader';
import { useBettingFund } from '../../../../../hooks/billing.hook';
import { useGetVitualBalance } from '../../../../../hooks/virtual.hook';
import useBiometricAuth from '../../../../../hooks/biometric.hook';
import BiometricComponent from '../../../../../components/biometric/biometric_component';
import { useConfirmPasscode } from '../../../../../hooks/auth.hook';
import { CommonActions } from '@react-navigation/native';
import { getCurrencySymbol } from '../../../../../utils/format';
import { AuthContext } from '../../../../../global/wrappers/AuthProvider';

const BettingPaymentPin = (props) => {
  const navigation = props.navigation;
  const { country } = useContext(AuthContext);
  const { customerId = '', bettingCompany = '', amount = 0 } = props.route.params || {};
  const [pin, setPin] = useState('');
  const { mutate: fundBetting, status: fundingStatus } = useBettingFund();
  const { isBiometricExist, } = useBiometricAuth();
  const { mutate: confirmPasscode, status: passcodeStatus } =
    useConfirmPasscode();


  const { data: balanceData, refetch: refetchBalance } = useGetVitualBalance();
  const userBalance = balanceData?.data?.balance / 100;

  const handlePinChange = (value) => {
    setPin(value);
  };

  const handlePayment = () => {

    const paymentData = {
      customerId,
      bettingCompany,
      amount,
      pin
    };

    fundBetting(paymentData, {
      onSuccess: (response) => {
        Toast.show({
          type: 'success',
          text1: 'Payment Successful',
          text2: response.message || 'Your betting account has been funded successfully',
        });

        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{
              name: 'PaymentSucess',
              params: { message: `You have successfully funded your ${bettingCompany} account`,}
            }],

          }),
        );

        // Navigate to success page or home
        
      },
      onError: (error) => {
        console.log('Payment error:', error);
        Toast.show({
          type: 'error',
          text1: 'Payment Failed',
          text2: error.message || 'Please try again later',
        });
      },
    });
  };


  const handleVerify = () => {
    if (userBalance < amount) {
      const screenError = 'Insufficient funds. Please top up your account.';
      // showToast(screenError);
      navigation.navigate('PaymentError', { screenError });
      return;
    }

    if (pin.length !== 6) {
      Toast.show({
        type: 'error',
        text1: 'Invalid PIN',
        text2: 'Please enter a 4-digit PIN',
      });
      return;
    }

    if (pin.length === 6) {
      // const userInfo = {
      //   billerCode: filteredData[0]?.biller_code,
      //   amountEntered: rawValue,
      //   customerId: selectedMeter,
      //   itemCode: filteredData[0]?.item_code,
      //   description: "Electricity"
      // };

      confirmPasscode(
        { passcode: pin },
        {
          onSuccess: data => {
            if (data) {
              handlePayment()
            } else {

              const screenError =
                data?.error ||
                data?.message ||
                'Passcode confirmation failed. Please try again.';
              // showToast(screenError);
              navigation.navigate('PaymentError', { screenError });
            }
          },
          onError: error => {
            const errorMessage =
              error?.response?.data?.error ||
              error?.response?.data?.message ||
              'An error occurred. Please try again.';
            // showToast(errorMessage);
            navigation.navigate('PaymentError', { screenError: errorMessage });
          },
        },
      );
    } else {
      const screenError = 'Please enter a valid 6-digit passcode.';
      // showToast(screenError);
      navigation.navigate('PaymentError', { screenError });
    }
  };

  return (
    <ScreenView style={tw`flex-1`} light color={WHITE}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={tw`flex-1`}>
        <View style={tw`px-3 pt-2`}>
          <Header
            navigation={() => navigation.goBack()}
            title="Enter PIN"
            showIcon={false}
          />
        </View>
        <ScrollView style={tw`flex-1 px-4`}>
          <View style={tw`items-center justify-center py-6`}>


            <View style={tw`w-full my-6`}>
              <Text style={tw`text-sm text-gray-700 mb-2 text-center`}>
                Enter your 6-digit PIN to authorize this transaction
              </Text>
              <OTPTextView
                inputCellLength={1}
                containerStyle={styles.containerOtp}
                textInputStyle={styles.inputOtp}
                handleTextChange={setPin}
                tintColor={PRIMARY_COLOR}
                inputCount={6}
                secureTextEntry={true}
                keyboardType={'number-pad'}
              />
            </View>

            <Text style={tw`text-base text-[${PRIMARY_COLOR}] text-center mb-4`}>
              You're about to fund {bettingCompany} account with {getCurrencySymbol(country)}{amount}
            </Text>
            {isBiometricExist && (
              <View
                style={tw`mt-8  flex flex-row items-center justify-center p-4  rounded-lg mt-[300]`}
              >
                <BiometricComponent signin={true} onComplete={handlePayment} />
              </View>
            )}



            <View style={tw`w-full mt-8`}>
              <CustomButton
                onPress={handleVerify}
                text="Confirm Payment"
                disabled={pin.length !== 6 || fundingStatus === 'pending'}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      {fundingStatus === 'pending' && <Loader />}
    </ScreenView>
  );
};

export default BettingPaymentPin;