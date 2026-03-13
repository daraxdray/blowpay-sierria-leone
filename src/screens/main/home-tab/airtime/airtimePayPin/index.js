import React, {useState} from 'react';
import {View, Text, ScrollView} from 'react-native';
import {styles} from './style';
import {ScreenView} from '../../../../../global/wrappers';
import {PRIMARY_COLOR, WHITE} from '../../../../../global/theme';
import Header from '../../../../../global/components/Header';
import tw from 'twrnc';
import OTPTextView from 'react-native-otp-textinput';
import {CustomButton} from '../../../../../global/components';
import {useConfirmPasscode} from '../../../../../hooks/auth.hook';
import {useBpAirtime} from '../../../../../hooks/billing.hook';
import Loader from '../../../../../components/modals/Loader';
import {CommonActions} from '@react-navigation/native';
import CustomToast from '../../../../../global/components/CustomToast';
import {useGetVitualBalance} from '../../../../../hooks/virtual.hook';
import useBiometricAuth from '../../../../../hooks/biometric.hook';
import {useSpBillPayment} from '../../../../../hooks/billing.hook';
import BiometricComponent from '../../../../../components/biometric/biometric_component';
import {unformatAmount, getCurrencySymbol} from '../../../../../utils/format';

const AirtimePaymentPin = props => {
  const navigation = props.navigation;
  const route = props.route;
  const {providerName, phoneNumber, selectedAmount, country} = route.params;
  console.log(providerName, phoneNumber, selectedAmount, country, 'providerName, phoneNumber, selectedAmount, country');
  const {mutate: confirmPasscode, status} = useConfirmPasscode();
  const {mutate: Bpairtime, status: bill} = useBpAirtime();
  const [otp, setOtp] = useState();
  const {mutate: buyAirtime, status: sierraStatus} = useSpBillPayment();
  const [toastMessage, setToastMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [toastType, setToastType] = useState('error');
  const {data: balanceData} = useGetVitualBalance();
  const userBalance = balanceData?.data?.balance / 100;
  const {isBiometricExist} = useBiometricAuth();
  const rawValue = unformatAmount(selectedAmount);
  const showToast = (message, type = 'error') => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);

    setTimeout(() => {
      setToastVisible(false);
    }, 3000);
  };

  const makeTransaction = () => {
    if (userBalance < rawValue) {
      const screenError = 'Insufficient funds. Please top up your account.';
      showToast(screenError);
      navigation.navigate('PaymentError', {screenError});
      return;
    }
    completeTransaction();
  };

  const completeTransaction = () => {
    if (country === 'Sierra Leone') {
      // Sierra Leone flow
      buyAirtime(
        {
          amount: rawValue,
          recipient: phoneNumber,
          category: 'Airtime',
        },
        {
          onSuccess: () => {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'PaymentSucess'}],
              }),
            );
          },
          onError: err => {
            const screenError =
              err?.response?.data?.message ||
              err?.response?.data?.error ||
              'Airtime purchase failed. Please try again.';
            showToast(screenError);
            navigation.navigate('PaymentError', {screenError});
          },
        },
      );
    } else {
      Bpairtime(
        {
          provider: providerName,
          phone: phoneNumber,
          amount: rawValue,
        },
        {
          onSuccess: () => {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'PaymentSucess'}],
              }),
            );
          },
          onError: err => {
            const screenError =
              err?.response?.data?.message ||
              err?.response?.data?.error ||
              'Airtime purchase failed. Please try again.';
            showToast(screenError);
            navigation.navigate('PaymentError', {screenError});
          },
        },
      );
    }
  };

  const handleVerify = () => {
    if (userBalance < rawValue) {
      const screenError = 'Insufficient funds. Please top up your account.';
      showToast(screenError);
      navigation.navigate('PaymentError', {screenError});
      return;
    }

    if (otp?.length !== 6) {
      const screenError = 'Please enter a valid 6-digit passcode.';
      showToast(screenError);
      navigation.navigate('PaymentError', {screenError});
      return;
    }

    const userData = {passcode: otp};

    confirmPasscode(userData, {
      onSuccess: async data => {
        if (data.error == null && data.message != null) {
          completeTransaction();
        }
      },
      onError: error => {
        const screenError =
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          'An error occurred. Please try again.';
        showToast(screenError);
        navigation.navigate('PaymentError', {screenError});
      },
    });
  };

  return (
    <ScreenView style={styles.container} light color={WHITE}>
      <ScrollView style={styles.viewContainer}>
        <View style={styles.view1}>
          <Header
            navigation={() => {
              navigation.goBack();
            }}
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
              style={tw`mt-8  flex flex-row items-center justify-center p-4  rounded-lg mt-[300]`}>
              <BiometricComponent signin={true} onComplete={makeTransaction} />
            </View>
          )}

          <View style={tw`pb-5 w-full mt-10`}>
            <CustomButton
              onPress={handleVerify}
              style={styles.btn1}
              text={`Pay ${getCurrencySymbol(country)}${selectedAmount}`}
            />
          </View>
        </View>
      </ScrollView>
      {status === 'pending' && <Loader />}
      {sierraStatus === 'pending' && <Loader />}
      {bill === 'pending' && <Loader />}
      {toastVisible && <CustomToast message={toastMessage} type={toastType} />}
    </ScreenView>
  );
};

export default AirtimePaymentPin;
