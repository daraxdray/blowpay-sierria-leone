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
import {useBillPay, useBillValidate, useCablePay, useCableValidate} from '../../../../../hooks/billing.hook';
import Loader from '../../../../../components/modals/Loader';
import {CommonActions, useNavigation} from '@react-navigation/native';
import CustomToast from '../../../../../global/components/CustomToast';
import {useGetVitualBalance} from '../../../../../hooks/virtual.hook';
import useBiometricAuth from '../../../../../hooks/biometric.hook';
import BiometricComponent from '../../../../../components/biometric/biometric_component';

const CablePaymentPin = props => {
  const  {cableTv, smartCardNo, packageId, selectedAmount} = props?.route?.params;
  const navigation = useNavigation();
  // const isPrepaid = selectedPayment.name.toLowerCase().includes('prepaid');
  // const filteredData = data.data.filter(biller =>
  //   isPrepaid
  //     ? biller.biller_name.toLowerCase().includes('prepaid')
  //     : biller.biller_name.toLowerCase().includes('postpaid'),
  // );
  const unformatAmount = formattedValue => formattedValue.replace(/,/g, '');
  const rawValue = unformatAmount(selectedAmount);
  const { data: balanceData, refetch: refetchBalance } = useGetVitualBalance();
  const userBalance = balanceData?.data?.balance / 100;

  const { mutate: confirmPasscode, status: passcodeStatus } =
    useConfirmPasscode();
  
  const { mutate: cableBill, status: billStatus } = useCablePay();
  const [otp, setOtp] = useState('');

  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('error');

  const { isBiometricExist, } = useBiometricAuth();

  // const userValidate = {
  //   billerCode: filteredData[0]?.biller_code,
  //   itemCode: filteredData[0]?.item_code,
  //   customer: selectedMeter,
  //   description: "Electricity"
  // };

  // const showToast = (message, type = 'error') => {
  //   setToastMessage(message);
  //   setToastType(type);
  //   setToastVisible(true);

  //   setTimeout(() => {
  //     setToastVisible(false);
  //   }, 3000);
  // };

  const handleVerify = () => {
    if (userBalance < rawValue) {
      const screenError = 'Insufficient funds. Please top up your account.';
      // showToast(screenError);
      navigation.navigate('PaymentError', { screenError });
      return;
    }

    if (otp.length === 6) {
      // const userInfo = {
      //   billerCode: filteredData[0]?.biller_code,
      //   amountEntered: rawValue,
      //   customerId: selectedMeter,
      //   itemCode: filteredData[0]?.item_code,
      //   description: "Electricity"
      // };

      confirmPasscode(
        { passcode: otp },
        {
          onSuccess: data => {
            if (data) {
              completeTransaction()
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

  const processBillPayment = userInfo => {
    cableBill(userInfo, {
      onSuccess: DataResponse => {
        if (DataResponse) {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'PaymentSucess' ,
                params:{message:"Your payment was successful, Get more details from transaction history"}}],

            }),
          );
        } else {
          const screenError =
            DataResponse?.error ||
            'Electricity purchase failed. Please try again.';
          // showToast(screenError);
          navigation.navigate('PaymentError', { screenError });


        }
      },
      onError: transferError => {
        console.log(transferError?.response?.data )

        const errorMessage =
        transferError?.error ||
        transferError?.response?.data?.error || 
          transferError?.response?.data?.message ||
          'Error: Electricity purchase failed. Please try again.';
        // showToast(errorMessage);
        navigation.navigate('PaymentError', { screenError: errorMessage });
      },
    });
  };

  const makeTransaction = () => {
    if (userBalance < rawValue) {
      const screenError = 'Insufficient funds. Please top up your account.';
      // showToast(screenError);
      navigation.navigate('PaymentError', { screenError });
      return;
    }
    completeTransaction()

  }

  const completeTransaction = () => {
    const userInfo = {cableTv, smartCardNo, packageId}
    processBillPayment(userInfo);
   
  }

  return (
    <ScreenView style={styles.container} light color={WHITE}>
      <ScrollView style={styles.viewContainer}>
        <View style={styles.view1}>
          <Header
            navigation={() => navigation.goBack()}
            ImageSource={require('../../../../../../assets/icons/filter.png')}
            title=""
            showIcon={false}
            iconName="add-circle"
            imagePress={() => { }}
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

          {isBiometricExist && (
            <View
              style={tw`mt-8  flex flex-row items-center justify-center p-4  rounded-lg mt-[300]`}
            >
              <BiometricComponent signin={true} onComplete={makeTransaction} />
            </View>
          )}
          <View style={tw`pb-5 w-full mt-10`}>
            <CustomButton
              onPress={handleVerify}
              style={styles.btn1}
              text={`Pay ₦${selectedAmount}`}
            />
          </View>
        </View>
      </ScrollView>

      {(passcodeStatus === 'pending' ||
        
        billStatus === 'pending') && <Loader />}

      {/* {toastVisible && <CustomToast message={toastMessage} type={toastType} />} */}
    </ScreenView>
  );
};


export default CablePaymentPin;
