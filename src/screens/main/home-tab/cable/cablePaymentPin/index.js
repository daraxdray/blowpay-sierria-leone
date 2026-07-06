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
import {useCablePay, useSpBillPayment} from '../../../../../hooks/billing.hook';
import Loader from '../../../../../components/modals/Loader';
import {CommonActions, useNavigation} from '@react-navigation/native';
import {useGetVitualBalance} from '../../../../../hooks/virtual.hook';
import useBiometricAuth from '../../../../../hooks/biometric.hook';
import useTransactionGuard from '../../../../../hooks/useTransactionGuard';
import BiometricComponent from '../../../../../components/biometric/biometric_component';
import {unformatAmount, getCurrencySymbol} from '../../../../../utils/format';

const CablePaymentPin = props => {
  const {cableTv, smartCardNo, packageId, selectedAmount, country} =
    props?.route?.params;
  const navigation = useNavigation();
  const rawValue = parseFloat(unformatAmount(selectedAmount));
  const {data: balanceData} = useGetVitualBalance();
  const userBalance = balanceData?.data?.balance / 100;
  const {mutate: confirmPasscode, status: passcodeStatus} =
    useConfirmPasscode();
  const {mutate: cableBill, status: billStatus} = useCablePay();
  const {mutate: spBillPayment, status: spBillStatus} = useSpBillPayment();
  const [otp, setOtp] = useState('');
  const {isBiometricReady} = useBiometricAuth();
  const {canSubmit, begin, end} = useTransactionGuard();

  const processBillPayment = () => {
    if (country === 'Sierra Leone') {
      const payload = {
        body: rawValue,
        recipient: smartCardNo,
        category: 'DSTV',
        description: `Cable payment for ${cableTv}`,
      };
      spBillPayment(payload, {
        onSuccess: DataResponse => {
          if (DataResponse) {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [
                  {
                    name: 'PaymentSucess',
                    params: {
                      message:
                        'Your payment was successful, Get more details from transaction history',
                    },
                  },
                ],
              }),
            );
          } else {
            end();
            const screenError =
              DataResponse?.error || 'Cable payment failed. Please try again.';
            navigation.navigate('PaymentError', {screenError});
          }
        },
        onError: err => {
          end();
          const errorMessage =
            err?.response?.data?.error ||
            err?.response?.data?.message ||
            'Error: Cable payment failed. Please try again.';
          navigation.navigate('PaymentError', {screenError: errorMessage});
        },
      });
    } else {
      const userInfo = {
        smartCard: smartCardNo,
        provider: cableTv,
        tariffClass: packageId,
        amount: selectedAmount,
      };

      cableBill(userInfo, {
        onSuccess: DataResponse => {
          if (DataResponse) {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [
                  {
                    name: 'PaymentSucess',
                    params: {
                      message:
                        'Your payment was successful, Get more details from transaction history',
                    },
                  },
                ],
              }),
            );
          } else {
            end();
            const screenError =
              DataResponse?.error || 'Cable payment failed. Please try again.';
            navigation.navigate('PaymentError', {screenError});
          }
        },
        onError: transferError => {
          end();
          const errorMessage =
            transferError?.response?.data?.error ||
            transferError?.response?.data?.message ||
            'Error: Cable payment failed. Please try again.';
          navigation.navigate('PaymentError', {screenError: errorMessage});
        },
      });
    }
  };

  // Balance check + provider routing shared by manual PIN entry and
  // biometric success, so neither path can skip the funds check.
  const makeTransaction = () => {
    if (userBalance < rawValue) {
      end();
      const screenError = 'Insufficient funds. Please top up your account.';
      navigation.navigate('PaymentError', {screenError});
      return;
    }
    processBillPayment();
  };

  const handleBiometricComplete = () => {
    if (!canSubmit()) return;
    begin();
    makeTransaction();
  };

  const handleVerify = () => {
    if (!canSubmit()) return;

    if (otp.length !== 6) {
      const screenError = 'Please enter a valid 6-digit passcode.';
      navigation.navigate('PaymentError', {screenError});
      return;
    }

    begin();
    confirmPasscode(
      {passcode: otp},
      {
        onSuccess: data => {
          if (data) {
            makeTransaction();
          } else {
            end();
            const screenError =
              data?.error ||
              data?.message ||
              'Passcode confirmation failed. Please try again.';
            navigation.navigate('PaymentError', {screenError});
          }
        },
        onError: error => {
          end();
          const errorMessage =
            error?.response?.data?.error ||
            error?.response?.data?.message ||
            'An error occurred. Please try again.';
          navigation.navigate('PaymentError', {screenError: errorMessage});
        },
      },
    );
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
              handleTextChange={setOtp}
              tintColor={PRIMARY_COLOR}
              inputCount={6}
              secureTextEntry={true}
              keyboardType={'number-pad'}
            />
          </View>
          {isBiometricReady && (
            <View
              style={tw`mt-[300] flex flex-row items-center justify-center p-4 rounded-lg`}>
              <BiometricComponent signin={true} onComplete={handleBiometricComplete} />
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
      {(passcodeStatus === 'pending' ||
        billStatus === 'pending' ||
        spBillStatus === 'pending') && <Loader />}
    </ScreenView>
  );
};
export default CablePaymentPin;
