import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  Modal,
  Platform,
} from 'react-native';
import {styles} from './style';
import {ScreenView} from '../../../../global/wrappers';
import {WHITE, PRIMARY_COLOR} from '../../../../global/theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Header from '../../../../global/components/Header';
import tw from 'twrnc';
import Plan from '../../../../components/airtime/Plan';
import {ElectPlans} from '../../../../constants/data/airtime';
import Amount from '../../../../components/airtime/Amount';
import {CustomButton} from '../../../../global/components';
import ElectModal from '../../../../components/modals/ElectModal';
import PaymentItemModal from '../../../../components/modals/PaymentItemModal';
import {useBillerProducts, useBpBillValidate, useNbBillValidate} from '../../../../hooks/billing.hook';
import Loader from '../../../../components/modals/Loader';
import Toast from 'react-native-toast-message';
import {useBillValidate, useBillPay} from '../../../../hooks/billing.hook';

const Electricity = props => {
  const navigation = props.navigation;

  const [selectedProvider, setSelectedProvider] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalItemVisible, setItemModalVisible] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState('');
  const [selectedMeter, setSelectedMeter] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [userDetails, setUserDetails] = useState(null);
  const [userError, setUserErroe] = useState('');
  const [isValidationSuccessful, setIsValidationSuccessful] = useState(false);
  const billerId = selectedProvider?.biller_code;
  // const {data, isLoading, error} = useBillerProducts(billerId);
  const {mutate: validateBill, status} = useBpBillValidate();
  // const isPrepaid = selectedPayment?.name.toLowerCase().includes('prepaid');
  // const filteredData = data?.data.filter(biller =>
  //   isPrepaid
  //     ? biller.biller_name.toLowerCase().includes('prepaid')
  //     : biller.biller_name.toLowerCase().includes('postpaid'),
  // );
  const handleMeterBlur = (meterNumber) => {
    if(isValidationSuccessful) return // don't validate after successful validation
    if (meterNumber && meterNumber.length > 6 && selectedProvider && selectedPayment ) {
     
      const userValidate = {
        // electricCompany: selectedProvider?.NAME,
        // meterNo: meterNumber,
        // description:"Electricity"
        disco: selectedProvider?.ID,
        meter: meterNumber,
      };

      console.log(userValidate)
      validateBill(userValidate, {
        onSuccess: async response => {
          console.log('Response from validation:', response);
          try {
            if (response?.data != null) {
              
              Toast.show({
                type: 'success',
                text1: 'Validation Successful',
                text2: response?.message || 'Meter number is valid',
              });
              setUserDetails(response?.data);
              setIsValidationSuccessful(true);
            } else {
              console.log(response)
              Toast.show({
                type: 'error',
                text1: 'Validation Failed',
                text2: response?.message || 'Unable to Verify Meter Number Please Try Again',
              });
              setUserErroe('Unable to Verify Meter Number Please Try Again');
              setUserDetails(null)
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
        onError: error => {
          Toast.show({
            type: 'error',
            text1: 'Validation Error',
            text2: error?.resonse?.message || 'Failed to validate the meter number',
          });
          // setIsValidating(false);
          setIsValidationSuccessful(false);
        },
      });
    }else{
      Toast.show({
        type: 'error',
        text1: 'Incomplete Field',
        text2: 'Please select provider',
      });
    }
  };

  const handleNext = () => {
    
    if(userDetails == null){
      Toast.show({
        type: 'error',
        text1: 'Validation Failed',
        text2: 'Please check the meter number and try again',
      });
      return
    }
    if (!selectedProvider) {
      Toast.show({
        type: 'error',
        text1: 'Missing Field',
        text2: 'Please select a service provider',
      });
    } 
    else if (!selectedPayment) {
      Toast.show({
        type: 'error',
        text1: 'Missing Field',
        text2: 'Please select a payment item',
      });
    } 
    else if (!selectedMeter) {
      Toast.show({
        type: 'error',
        text1: 'Missing Field',
        text2: 'Please enter a meter number',
      });
    } else if (!selectedAmount) {
      Toast.show({
        type: 'error',
        text1: 'Missing Field',
        text2: 'Please select or enter an amount',
      });
      return
    }
    // else if(selectedProvider.PRODUCT && selectedProvider.PRODUCT.length && (selectedAmount?.replace(',','') > selectedProvider.PRODUCT[0].MAXIMUM_AMOUNT || selectedAmount?.replace(',','') < selectedProvider.PRODUCT[0].MINIMUN_AMOUNT )){ //nelobyte
    else if(selectedProvider.ID  && (selectedAmount?.replace(',','') < userDetails.minVendAmount || selectedAmount?.replace(',','') > userDetails.maxVendAmount )){
     console.log(selectedProvider.ID)
      Toast.show({  
        type: 'error',
        text1: 'Invalid Amount',
        text2: `Please input a valid amount, Min: ${userDetails?.minVendAmount} Max: ${userDetails?.maxVendAmount} `,
      });
      return
    }
    else {
      
      navigation.navigate('ElectricPaymentPin', {
        selectedProvider,
        selectedAmount,
        selectedMeter,
        selectedPayment: selectedPayment.PRODUCT_ID,
        phoneNumber
      });
    }
  };

  const formatAmount = value => {
    let cleanedValue = value.replace(/[^0-9.]/g, '');
    let [integer, decimal] = cleanedValue.split('.');
    if (integer) {
      integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    return decimal ? `${integer}.${decimal}` : integer;
  };
  const handleAmountChange = newAmount => {
    const formattedValue = formatAmount(newAmount);
    setSelectedAmount(formattedValue);
  };
  const handleMeterChange = meterNumber => {

    setSelectedMeter(meterNumber);

    if(meterNumber.length >= 10){
      handleMeterBlur(meterNumber)
    }else{
      setIsValidationSuccessful(false)
    }
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const selectCompany = company => {
    setSelectedProvider(company);
  };
  const selectPayment = payment => {
    setSelectedPayment(payment);
  };

  const proceed = () => {
    closeModal();
  };
  const proceedItem = () => {
    closeModal();
  };
  return (
    <ScreenView style={styles.container} light color={WHITE}>
      <View style={tw`px-3 pt-2`}>
        <Header
          navigation={() => {
            navigation.goBack();
          }}
          ImageSource={require('../../../../../assets/icons/filter.png')}
          title="Electricity"
          showIcon={false}
          iconName="add-circle"
          imagePress={() => {}}
        />
      </View>
      <ScrollView style={styles.viewContainer}>
        <View style={styles.view1}>
          <View style={tw`flex gap-4 w-full items-center`}>
            <View style={tw`mt-2 gap-2 w-full`}>
              <Text style={tw`text-gray-900 font-medium text-[14px]`}>
                Service Provider
              </Text>
              <TouchableOpacity
                onPress={openModal}
                style={tw`relative w-full border border-[#D0D5DD] rounded-[10px] items-center justify-between flex-row px-3 ${Platform.OS == 'android'?'py-3':'py-4'}`}>
                <View style={tw`gap-2 flex flex-row items-center`}>
                  {selectedProvider && selectedProvider.logo_url ? (
                    <>
                      {selectedProvider.logo_url.endsWith('.svg') ? (
                        <selectedProvider.logo_url
                          width="25"
                          height="25"
                          uri={selectedProvider.logo_url}
                        />
                      ) : (
                        <Image
                          source={{uri: selectedProvider.logo_url}}
                          style={tw`w-[25px] h-[25px] mr-3`}
                        />
                      )}
                    </>
                  ) : null}
                  <Text style={tw`text-gray-900`}>
                    {selectedProvider
                      ? selectedProvider.NAME
                      : 'Service Provider'}
                  </Text>
                </View>

                <Ionicons name="chevron-down" size={13} />
              </TouchableOpacity>
            </View>
             
              <View style={tw`mt-2 gap-2 w-full`}>
              <Text style={tw`text-gray-900 font-medium text-[14px]`}>
                Account/Meter Type 
              </Text>
              <TouchableOpacity
                onPress={() => setItemModalVisible(true)}
                style={tw`relative w-full border border-[#D0D5DD] rounded-[10px] items-center justify-between flex-row px-3 py-3`}>
                <View style={tw`gap-2 flex flex-row items-center`}>
                  <Text style={tw`text-gray-900 font-normal`}>
                    {/* NELOBYTE */}
                    {/* {selectedPayment ? selectedPayment.PRODUCT_TYPE : 'Meter Type'} */}
                    {selectedPayment ? selectedPayment.PRODUCT_ID : 'Meter Type'}
                  </Text>
                </View>
                <Ionicons name="chevron-down" size={13} />
              </TouchableOpacity>
            </View>


            <View style={tw`gap-2 w-full`}>
              <Text style={tw`text-gray-900 font-medium text-[14px]`}>
                Meter Number
              </Text>

              <TextInput
                placeholder="Enter Meter Number"
                placeholderTextColor="gray"
                value={selectedMeter}
                keyboardType="numeric"
                onChangeText={handleMeterChange}
                onBlur={handleMeterBlur}
                style={tw`border border-[#D0D5DD] rounded-[10px] p-4 ${Platform.OS == 'android'?'py-2':'py-4'} text-black`}
              />

              {userDetails ? (
                <View style={tw`p-2 bg-green-100 w-[80%] rounded-md`}>
                  <Text style={tw`text-[12px] text-black`}>
                    Name: {userDetails?.name || 'N/A'}
                  </Text>
                  {/* <Text style={tw`text-[12px] text-[#666]`}>
                    Address: {userDetails?.data?.address || 'N/A'}
                  </Text> */}
                </View>
              ) : userError ? (
                <View style={tw`p-2 bg-pink-100 w-[80%] rounded-md`}>
                  <Text style={tw`text-[12px] text-red-500`}>{userError}</Text>
                </View>
              ) : (
                <View></View>
              )}
            </View>
            
            <View style={tw`gap-2 w-full`}>
              <Text style={tw`text-gray-900 font-medium text-[14px]`}>
                Phone Number
              </Text>

              <TextInput
                placeholder="Enter Phone Number"
                placeholderTextColor="gray"
                value={phoneNumber}
                keyboardType="numeric"
                onChangeText={(val)=>setPhoneNumber(val)}
               
                style={tw`border border-[#D0D5DD] rounded-[10px] p-4 ${Platform.OS == 'android'?'py-2':'py-4'}  text-black`}
              />

            
            </View>
          </View>

          <View style={tw`pt-7 gap-3 w-full`}>
            <Text style={tw`text-gray-700 font-semibold text-[16px]`}>
              Select Amount
            </Text>
            <View style={tw`flex flex-wrap flex-row justify-between`}>
              {ElectPlans.map((plan, index) => (
                <View key={index} style={tw`w-[22%] m-1`}>
                  <Plan
                    dataSize={plan.amount}
                    duration={plan.buttonText}
                    onPress={() =>
                      setSelectedAmount(
                        formatAmount(plan.realAmount.toString()),
                      )
                    }
                  />
                </View>
              ))}
            </View>

            <Amount
              amount={selectedAmount}
              onAmountChange={handleAmountChange}
            />
          </View>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={closeModal}>
            <View style={tw`flex-1 justify-end bg-black bg-opacity-50`}>
              <ElectModal
                selectCompany={selectCompany}
                closeModal={closeModal}
                proceed={proceed}
                activeCompany={selectedProvider}
              />
            </View>
          </Modal>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalItemVisible}
            onRequestClose={closeModal}>
            <View style={tw`flex-1 justify-end bg-black bg-opacity-50`}>
              <PaymentItemModal
                selectPaymentItem={selectPayment}
                closeModal={() => setItemModalVisible(false)}
                proceed={proceedItem}
                companies={selectedProvider?.PRODUCT ?? [{PRODUCT_ID:'prepaid',PRODUCT_TYPE:'prepaid'},{PRODUCT_ID:'postpaid',PRODUCT_TYPE:'postpaid'}]}
              />
            </View>
          </Modal>
          <View style={tw`pb-5 w-full pt-5`}>
            <CustomButton
              text="Proceed"
              onPress={handleNext}
              disabled={!isValidationSuccessful}
            />
          </View>
        </View>
      </ScrollView>
      { status === 'pending' ? <Loader /> : null}
    </ScreenView>
  );
};

export default Electricity;
