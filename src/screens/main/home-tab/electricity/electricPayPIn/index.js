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
import {
  useByPBillPay,
  useSpBillPayment,
} from '../../../../../hooks/billing.hook';
import Loader from '../../../../../components/modals/Loader';
import {CommonActions} from '@react-navigation/native';
import CustomToast from '../../../../../global/components/CustomToast';
import {useGetVitualBalance} from '../../../../../hooks/virtual.hook';
import BiometricComponent from '../../../../../components/biometric/biometric_component';
import useBiometricAuth from '../../../../../hooks/biometric.hook';
import {unformatAmount, getCurrencySymbol} from '../../../../../utils/format';

const ElectricPaymentPin = ({navigation, route}) => {
  const {selectedProvider, selectedMeter, selectedAmount, country} =
    route.params;

  const rawValue = unformatAmount(selectedAmount);

  const {data: balanceData} = useGetVitualBalance();
  const userBalance = balanceData?.data?.balance / 100;

  const {mutate: confirmPasscode, status: passcodeStatus} =
    useConfirmPasscode();
  const {mutate: electricBill, status: billStatus} = useByPBillPay();
  const {mutate: buyAirtime, status: spBillStatus} = useSpBillPayment();

  const [otp, setOtp] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('error');
  const {isBiometricExist} = useBiometricAuth();

  const showToast = (message, type = 'error') => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  };
  console.log(
    selectedProvider,
    'selectedProvider',
    selectedMeter,
    'selectedMeter',
    rawValue,
    'selectedAmount',
  );
  const handleVerify = otpInput => {
    if (userBalance < rawValue) {
      const screenError = 'Insufficient funds. Please top up your account.';
      showToast(screenError);
      navigation.navigate('PaymentError', {screenError});
      return;
    }

    if (otpInput.length !== 6) {
      const screenError = 'Please enter a valid 6-digit passcode.';
      showToast(screenError);
      navigation.navigate('PaymentError', {screenError});
      return;
    }

    confirmPasscode(
      {passcode: otpInput},
      {
        onSuccess: data => {
          if (data?.message) {
            if (country === 'Sierra Leone') {
              completeTransactionSL();
            } else {
              completeTransaction();
            }
          } else {
            const screenError =
              data?.error || 'Passcode confirmation failed. Please try again.';
            showToast(screenError);
            navigation.navigate('PaymentError', {screenError});
          }
        },
        onError: error => {
          const errorMessage =
            error?.response?.data?.message ||
            'An error occurred. Please try again.';
          showToast(errorMessage);
          navigation.navigate('PaymentError', {screenError: errorMessage});
        },
      },
    );
  };

  const completeTransaction = () => {
    const userInfo = {
      disco: selectedProvider?.ID,
      amount: rawValue,
      meter: selectedMeter,
    };

    electricBill(userInfo, {
      onSuccess: DataResponse => {
        console.log(DataResponse);

        if (DataResponse) {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [
                {
                  name: 'PaymentSucess',
                  params: {
                    message:
                      'Your payment was successful. Get token from transaction history.',
                    data: DataResponse?.data,
                  },
                },
              ],
            }),
          );
        } else {
          const screenError =
            DataResponse?.error ||
            'Electricity purchase failed. Please try again.';
          showToast(screenError);
          console.log(
            DataResponse,
            'DataResponse',
            DataResponse?.error,
            'error',
          );

          navigation.navigate('PaymentError', {screenError});
        }
      },
      onError: transferError => {
        const errorMessage =
          transferError?.response?.data?.error ||
          transferError?.response?.data?.message ||
          'Error: Electricity purchase failed. Please try again.';

        if (errorMessage?.toLowerCase().includes('successful transaction')) {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [
                {
                  name: 'PaymentSucess',
                  params: {
                    message:
                      'Your payment was successful. Get token from transaction history.',
                    data: transferError?.response?.data,
                  },
                },
              ],
            }),
          );
        } else {
          showToast(errorMessage);
          navigation.navigate('PaymentError', {screenError: errorMessage});
        }
      },
    });
  };
  const completeTransactionSL = () => {
    const payload = {
      category: 'EDSA',
      amount: rawValue,
      recipient: selectedMeter,
    };

    buyAirtime(payload, {
      onSuccess: res => {
        if (res) {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [
                {
                  name: 'PaymentSucess',
                  params: {
                    message: 'Your electricity payment was successful.',
                    data: res?.data,
                  },
                },
              ],
            }),
          );
        } else {
          const screenError = res?.error || 'Payment failed. Please try again.';
          showToast(screenError);
          navigation.navigate('PaymentError', {screenError});
        }
      },
      onError: error => {
        const screenError =
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          'Payment failed. Please try again.';
        showToast(screenError);
        navigation.navigate('PaymentError', {screenError});
      },
    });
  };

  const handleOtp = otpInput => {
    setOtp(otpInput);
    if (otpInput.length === 6) {
      handleVerify(otpInput);
    }
  };

  return (
    <ScreenView style={styles.container} light color={WHITE}>
      <ScrollView style={styles.viewContainer}>
        <View style={styles.view1}>
          <Header
            navigation={() => navigation.goBack()}
            ImageSource={require('../../../../../../assets/icons/filter.png')}
            title=""
            showIcon={false}
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
              handleTextChange={handleOtp}
              tintColor={PRIMARY_COLOR}
              inputCount={6}
              secureTextEntry={true}
              keyboardType={'number-pad'}
            />
          </View>

          {isBiometricExist && (
            <View
              style={tw`mt-8 flex flex-row items-center justify-center p-4 rounded-lg mt-[300]`}>
              <BiometricComponent
                signin={true}
                onComplete={() => {
                  if (country === 'Sierra Leone') {
                    completeTransactionSL();
                  } else {
                    completeTransaction();
                  }
                }}
              />
            </View>
          )}

          <View style={tw`pb-5 w-full mt-10`}>
            <CustomButton
              onPress={() => handleVerify(otp)}
              style={styles.btn1}
              text={`Pay ${getCurrencySymbol(country)}${selectedAmount}`}
            />
          </View>
        </View>
      </ScrollView>

      {(passcodeStatus === 'pending' ||
        billStatus === 'pending' ||
        spBillStatus === 'pending') && <Loader />}

      {toastVisible && <CustomToast message={toastMessage} type={toastType} />}
    </ScreenView>
  );
};

export default ElectricPaymentPin;
