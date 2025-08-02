import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { ScreenView } from '../../../../global/wrappers';
import { WHITE } from '../../../../global/theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Header from '../../../../global/components/Header';
import tw from 'twrnc';
import Amount from '../../../../components/airtime/Amount';
import { CustomButton } from '../../../../global/components';
import BettingModal from '../../../../components/modals/BettingModal';
import Toast from 'react-native-toast-message';
import { useBettingValidate, useBettingFund } from '../../../../hooks/billing.hook';
import Loader from '../../../../components/modals/Loader';
import { styles } from './style';

const FundBetting = props => {
  const navigation = props.navigation;
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [customerId, setCustomerId] = useState('');
  const [amount, setAmount] = useState('');
  const [userDetails, setUserDetails] = useState('');
  const [userError, setUserError] = useState('');
  const [isValidationSuccessful, setIsValidationSuccessful] = useState(false);
  
  const { mutate: validateBetting, status: validateStatus } = useBettingValidate();

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const selectProvider = provider => {
    setSelectedProvider(provider);
    closeModal();
  };

  const handleNext = () => {
    if (!selectedProvider || !customerId || !amount) {
      let missingFields = [];
      if (!selectedProvider) missingFields.push('Betting Provider');
      if (!customerId) missingFields.push('Customer ID');
      if (!amount) missingFields.push('Amount');

      Toast.show({
        text1: 'Missing Fields',
        text2: `Please fill out: ${missingFields.join(', ')}`,
        type: 'error',
      });
      return;
    }

    if(!validateAmount(amount)){ return false};

    // Prepare the data for payment
    const paymentData = {
      customerId: customerId,
      bettingCompany: selectedProvider.PRODUCT_CODE,
      amount: parseFloat(amount)
    };

    console.log("PAYMENT DATA", paymentData);

    navigation.navigate('BettingPaymentPin', paymentData);
  };

  const handleCustomerIdBlur = () => {
    if (customerId && selectedProvider) {
      // Prepare the data for validation
      const userValidate = {
        customerId: customerId,
        bettingCompany: selectedProvider.PRODUCT_CODE,
        // amount: parseFloat(amount)
      };
      
      console.log("VALIDATE", userValidate);

      validateBetting(userValidate, {
        onSuccess: async response => {
          try {
            if (response && response.data && response.data.customer_name && 
                !response.data.customer_name.includes("Error")) {
              
              Toast.show({
                type: 'success',
                text1: 'Validation Successful',
                text2: response.message || 'Customer ID is valid',
              });
              setUserDetails(response.data);
              setIsValidationSuccessful(true);
            } else {
              Toast.show({
                type: 'error',
                text1: 'Validation Failed',
                text2: 'Please check the customer ID and try again',
              });
              setUserError('Please check the customer ID and try again');
              setIsValidationSuccessful(false);
            }
          } catch (error) {
            console.log('Error processing the response:', error);
            Toast.show({
              type: 'error',
              text1: 'Error',
              text2: 'An unexpected error occurred',
            });
            setIsValidationSuccessful(false);
          }
        },
        onError: (error) => {
          console.log('Validation error:', error);
          Toast.show({
            text1: 'Validation Failed',
            text2: 'Invalid Customer ID. Please try again.',
            type: 'error',
          });
        },
      });
    }
  };

  // Validate amount is within provider's min and max limits
  const validateAmount = (value) => {
    if (!selectedProvider) return;
    
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;
    
    if (numValue < selectedProvider.MINAMOUNT) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Amount',
        text2: `Minimum amount is ₦${selectedProvider.MINAMOUNT}`,
      });
      return false;
    }
    
    if (numValue > selectedProvider.MAXAMOUNT) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Amount',
        text2: `Maximum amount is ₦${selectedProvider.MAXAMOUNT}`,
      });
      return false;
    }
    
    return true;
  };

  const handleAmountChange = (value) => {
 
    setAmount(value);
  };

  return (
    <ScreenView style={styles.container} light color={WHITE}>
      <View style={tw`px-3 pt-2`}>
        <Header
          navigation={() => {
            navigation.goBack();
          }}
          ImageSource={require('../../../../../assets/icons/filter.png')}
          title="Betting"
          showIcon={false}
          iconName="add-circle"
          imagePress={() => console.log('Second Icon Pressed')}
        />
      </View>
      <ScrollView style={styles.viewContainer}>
        <View style={styles.view1}>
          <View style={tw`flex gap-4 w-full items-center`}>
            <View style={tw`mt-2 gap-2`}>
              <Text style={tw`text-gray-900 font-medium text-[14px]`}>
                Betting Provider
              </Text>
              <TouchableOpacity
                onPress={openModal}
                style={tw`relative w-full border border-[#D0D5DD] rounded-[10px] items-center justify-between flex-row px-3 py-4`}>
                <Text style={tw`text-[#98A2B3]`}>
                  {selectedProvider
                    ? selectedProvider.PRODUCT_CODE
                    : 'Select Provider'}
                </Text>
                <Ionicons name="chevron-down" size={13} />
              </TouchableOpacity>
            </View>

            <View style={tw`mt-2 gap-2 w-full`}>
              <Text style={tw`text-gray-900 font-medium text-[14px]`}>
                Customer ID
              </Text>
              <TextInput
                placeholder="Enter Customer ID"
                placeholderTextColor="gray"
                style={tw`border border-[#D0D5DD] rounded-[10px] p-3 py-4 text-black`}
                value={customerId}
                keyboardType="numeric"
                onChangeText={setCustomerId}
                onBlur={handleCustomerIdBlur}
              />
              {userDetails ? (
                <View style={tw`p-2 bg-green-100 w-[80%] rounded-md`}>
                  <Text style={tw`text-[12px] text-black`}>
                    Name: {userDetails?.customer_name || 'N/A'}
                  </Text>
                </View>
              ) : userError ? (
                <View style={tw`p-2 bg-pink-100 w-[80%] rounded-md`}>
                  <Text style={tw`text-[12px] text-red-500`}>{userError}</Text>
                </View>
              ) : (
                <View></View>
              )}
            </View>
          </View>
          <View style={tw`pt-6 gap-5 w-full`}>
            <Amount
              amount={amount}
              onAmountChange={handleAmountChange}
              editable={true}
            />
            {selectedProvider && (
              <Text style={tw`text-gray-600 text-[12px] text-center`}>
                Min: ₦{selectedProvider.MINAMOUNT} | Max: ₦{selectedProvider.MAXAMOUNT}
              </Text>
            )}
          </View>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={closeModal}>
            <View style={tw`flex-1 justify-end bg-black bg-opacity-50`}>
              <BettingModal
                selectProvider={selectProvider}
                closeModal={closeModal}
              />
            </View>
          </Modal>
          <View style={tw`pb-5 w-full pt-5`}>
            <CustomButton
              onPress={handleNext}
              style={styles.btn1}
              text={'Fund Account'}
              disabled={
                !selectedProvider ||
                !customerId ||
                !amount ||
                !isValidationSuccessful
              }
            />
          </View>
        </View>
      </ScrollView>
      {validateStatus === 'pending' && <Loader />}
    </ScreenView>
  );
};

export default FundBetting;