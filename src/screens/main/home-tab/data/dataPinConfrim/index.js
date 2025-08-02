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
import {useBillPay, useBillValidate} from '../../../../../hooks/billing.hook';
import Loader from '../../../../../components/modals/Loader';
import {CommonActions} from '@react-navigation/native';
import CustomToast from '../../../../../global/components/CustomToast';
import {useGetVitualBalance} from '../../../../../hooks/virtual.hook';
import useBiometricAuth from '../../../../../hooks/biometric.hook';
import BiometricComponent from '../../../../../components/biometric/biometric_component';

const DataPaymentPin = props => {
  const navigation = props.navigation;
  const route = props.route;
  const {data: selectedPlan, phoneNumber} = route.params;
  const {isBiometricExist,} = useBiometricAuth();
  const {mutate: confirmPasscode, isLoading, status} = useConfirmPasscode();
  const {mutate: dataBill, status: billStatus} = useBillPay();
  const {mutate: validateBill, status: validateStatus} = useBillValidate();
  const [otp, setOtp] = useState();
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('error');
  const {data: balanceData, refetch: refetchBalance} = useGetVitualBalance();
  const userBalance = balanceData?.data?.balance / 100;

  const userValidate = {
    billerCode: selectedPlan?.biller_code,
    itemCode: selectedPlan?.item_code,
    customer: phoneNumber,
  };

  const userInfo = {
    billerCode: selectedPlan?.biller_code,
    amountEntered: selectedPlan?.amount,
    itemCode: selectedPlan?.item_code,
    customerId: phoneNumber,
    description:"Data"
  };
  console.log(userBalance, 'hhhhss');

  const showToast = (message, type = 'error') => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);

    setTimeout(() => {
      setToastVisible(false);
    }, 3000);
  };

  const handleVerify = () => {
    if (userBalance < selectedPlan?.amount) {
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

    const userData = {
      passcode: otp,
    };


    

    confirmPasscode(userData, {
      onSuccess: data => {
        if (data) {
          completeTransaction();
        } else {
          
          const screenError =
            data?.error ||
            'Passcode confirmation failed. Please try again.';
          showToast(screenError);
          navigation.navigate('PaymentError', {screenError});
        }
      },
      onError: error => {
        const errorMessage =
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          'An error occurred. Please try again.';
        showToast(errorMessage);
        navigation.navigate('PaymentError', {screenError: errorMessage});
      },
    });
  };

  const completeTransaction = ()=>{
    validateBill(userValidate, {
      onSuccess: validateResponse => {
        if (validateResponse?.data != null) {
          dataBill(userInfo, {
            onSuccess: DataResponse => {
              if (DataResponse) {
                navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{name: 'PaymentSucess'}],
                  }),
                );
              } else {
                const screenError =
                DataResponse?.error ||
                DataResponse?.response?.data?.error ||
                  'Data purchase failed. Please try again.';
                showToast(screenError);
                navigation.navigate('PaymentError', {screenError});
              }
            },
            onError: dataError => {
              const errorMessage =
                dataError?.response?.data?.message ||
                dataError?.response?.data?.error ||
                'Data purchase failed. Please try again.';
              showToast(errorMessage);
              navigation.navigate('PaymentError', {
                screenError: errorMessage,
              });
            },
          });
        } else {
          const screenError =
          validateResponse?.error ||
          validateResponse?.response?.data?.error ||
            'Bill validation failed. Please try again.';
          showToast(screenError);
          navigation.navigate('PaymentError', {screenError});
        }
      },
      onError: validateError => {
        const errorMessage =
          validateError?.response?.data?.message ||
          validateError?.response?.data?.error ||
          'An error occurred during validation. Please try again.';
        showToast(errorMessage);
        navigation.navigate('PaymentError', {screenError: errorMessage});
      },
    });
  }

  const makeTransaction = ()=>{
    if (userBalance < selectedPlan?.amount) {
      const screenError = 'Insufficient funds. Please top up your account.';
      showToast(screenError);
      navigation.navigate('PaymentError', {screenError});
      return;
    }
    completeTransaction();
  }
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
              style={tw`mt-8  flex flex-row items-center justify-center p-4  rounded-lg mt-[300]`}
              >
              <BiometricComponent signin={true} onComplete={makeTransaction}  />
            </View>
          )}

          <View style={tw`pb-5 w-full mt-10`}>
            <CustomButton
              onPress={handleVerify}
              style={styles.btn1}
              text={`Pay ₦${selectedPlan?.amount
                .toFixed(2)
                .replace(/\d(?=(\d{3})+\.)/g, '$&,')}`}
            />
          </View>
        </View>
      </ScrollView>
      {(status === 'pending' ||
        billStatus === 'pending' ||
        validateStatus === 'pending') && <Loader />}
      {toastVisible && <CustomToast message={toastMessage} type={toastType} />}
    </ScreenView>
  );
};

export default DataPaymentPin;
