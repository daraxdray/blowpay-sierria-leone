import React, {useState, useContext} from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Modal,
} from 'react-native';
import {styles} from './style';
import {ScreenView} from '../../../../global/wrappers';
import {WHITE} from '../../../../global/theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Header from '../../../../global/components/Header';
import tw from 'twrnc';
import Amount from '../../../../components/airtime/Amount';
import {CustomButton} from '../../../../global/components';
import CableModal from '../../../../components/modals/CableModal';
import CablePlanModal from '../../../../components/modals/CablePlanModel';
import Toast from 'react-native-toast-message';
import {
  useCableValidate,
  useSpValidateBill,
} from '../../../../hooks/billing.hook';
import Loader from '../../../../components/modals/Loader';
import {AuthContext} from '../../../../global/wrappers/AuthProvider';

const Cable = props => {
  const {country} = useContext(AuthContext);
  const navigation = props.navigation;
  const [modalVisible, setModalVisible] = useState(false);
  const [optionsModalVisible, setOptionsModalVisible] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [smartCardNumber, setSmartCardNumber] = useState('');
  const [userDetails, setUserDetails] = useState('');
  const [userError, setUserErroe] = useState('');
  const [isValidationSuccessful, setIsValidationSuccessful] = useState(false);
  const spValidate = useSpValidateBill();
  const cableValidate = useCableValidate();
  const {mutate: validateBill, status: validateStatus} =
    country === 'Sierra Leone' ? spValidate : cableValidate;
  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const closeOptionsModal = () => {
    setOptionsModalVisible(false);
  };

  const selectCompany = company => {
    setSelectedProvider(company);
    closeModal();
  };

  const selectOption = company => {
    setSelectedOption(company);
  };

  const handleNext = () => {
    if (!selectedProvider || !selectedOption || !smartCardNumber) {
      let missingFields = [];
      if (!selectedProvider) {
        missingFields.push('Service Provider');
      }
      if (!selectedOption) {
        missingFields.push('Service Plan');
      }
      if (!smartCardNumber) {
        missingFields.push('Smart Card Number');
      }

      Toast.show({
        text1: 'Missing Fields',
        text2: `Please fill out: ${missingFields.join(', ')}`,
        type: 'error',
      });
      return;
    }
    const userValidate = {
      cableTv: selectedProvider.ID,
      smartCardNo: smartCardNumber,
      packageId: selectedOption.PACKAGE_ID,
      selectedAmount: selectedOption?.PACKAGE_AMOUNT,
      country,
    };
    navigation.navigate('CablePaymentPin', userValidate);
  };

  const proceed = () => {
    if (selectedProvider) {
      setOptionsModalVisible(true);
    } else {
      Toast.show({
        text1: 'Select a Plan',
        text2: 'Please select a plan to proceed.',
        type: 'error',
      });
    }
  };

  const handleSmartCardBlur = val => {
    if (val && val.length >= 10 && selectedOption) {
      let userValidate;

      if (country === 'Sierra Leone') {
        userValidate = {
          amount: selectedOption?.PACKAGE_AMOUNT,
          recipient: val,
          category: 'DSTV',
        };
      } else {
        userValidate = {
          cableTv: selectedProvider.ID,
          smartCardNo: val,
        };
      }
      validateBill(userValidate, {
        onSuccess: async response => {
          console.log('VALIDATION RESPONSE:', response);
          try {
            if (response && response?.customer_name !== '') {
              Toast.show({
                type: 'success',
                text1: 'Validation Successful',
                text2: response?.message || 'card number is valid',
              });
              setUserDetails(response?.data);
              setIsValidationSuccessful(true);
            } else {
              Toast.show({
                type: 'error',
                text1: 'Validation Failed',
                text2: 'Please check the card number and try again',
              });
              setUserErroe('Please check the card number and try again');
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
        onError: () => {
          Toast.show({
            text1: 'Validation Failed',
            text2: 'Invalid Smart Card Number. Please try again.',
            type: 'error',
          });
        },
      });
      setIsValidationSuccessful(false);
    }
    setSmartCardNumber(val);
  };

  return (
    <ScreenView style={styles.container} light color={WHITE}>
      <View style={tw`px-3 pt-2`}>
        <Header
          navigation={() => {
            navigation.goBack();
          }}
          ImageSource={require('../../../../../assets/icons/filter.png')}
          title="Cable"
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
                Service Provider
              </Text>
              <TouchableOpacity
                onPress={openModal}
                style={tw`relative w-full border border-[#D0D5DD] rounded-[10px] items-center justify-between flex-row px-3 py-3`}>
                <Text style={tw`text-[#98A2B3]`}>
                  {selectedProvider ? selectedProvider.ID : 'Service Provider'}
                </Text>
                <Ionicons name="chevron-down" size={13} />
              </TouchableOpacity>
            </View>
            <View style={tw`mt-2 gap-2`}>
              <Text style={tw`text-gray-900 font-medium text-[14px]`}>
                Select Plan
              </Text>
              <TouchableOpacity
                onPress={proceed}
                style={tw`relative w-full border border-[#D0D5DD] rounded-[10px] items-center justify-between flex-row px-3 py-3`}>
                <Text style={tw`text-[#98A2B3]`}>
                  {selectedOption
                    ? `${selectedOption.PACKAGE_NAME}`
                    : 'Service plan'}
                </Text>
                <Ionicons name="chevron-down" size={13} />
              </TouchableOpacity>
            </View>

            <View style={tw`mx-5 gap-2 w-full`}>
              <Text style={tw`text-gray-900 font-medium text-[14px]`}>
                Smart Card Number
              </Text>
              <TextInput
                placeholder="Enter Smart Card Number"
                placeholderTextColor="gray"
                style={tw`border border-[#D0D5DD] rounded-[10px] p-3 py-2 text-black`}
                value={smartCardNumber}
                keyboardType="numeric"
                onChangeText={handleSmartCardBlur}
              />
              {userDetails ? (
                <View style={tw`p-2 bg-green-100 w-[80%] rounded-md`}>
                  <Text style={tw`text-[12px] text-black`}>
                    Name: {userDetails?.customer_name || 'No user Available'}
                  </Text>
                </View>
              ) : userError ? (
                <View style={tw`p-2 bg-pink-100 w-[80%] rounded-md`}>
                  <Text style={tw`text-[12px] text-red-500`}>{userError}</Text>
                </View>
              ) : (
                <View />
              )}
            </View>
          </View>
          <View style={tw`pt-6 gap-5 w-full`}>
            <Amount
              amount={`${selectedOption?.PACKAGE_AMOUNT ?? ''}`}
              editable={false}
              country={country}
            />
          </View>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={closeModal}>
            <View style={tw`flex-1 justify-end bg-black bg-opacity-50`}>
              <CableModal
                selectCompany={selectCompany}
                closeModal={closeModal}
                country={country}
              />
            </View>
          </Modal>
          <Modal
            animationType="slide"
            transparent={true}
            visible={optionsModalVisible}
            onRequestClose={closeOptionsModal}>
            <View style={tw`flex-1 justify-end bg-black bg-opacity-50`}>
              <CablePlanModal
                closeModal={closeOptionsModal}
                selectOption={selectOption}
                country={country}
                products={selectedProvider?.PRODUCT}
              />
            </View>
          </Modal>
          <View style={tw`pb-5 w-full pt-5`}>
            <CustomButton
              onPress={handleNext}
              style={styles.btn1}
              text={'Pay'}
              disabled={
                !selectedProvider ||
                !selectedOption ||
                !smartCardNumber ||
                !isValidationSuccessful
              }
            />
          </View>
        </View>
      </ScrollView>
      {/* <Toast ref={ref => Toast.setRef(ref)} /> */}
      {validateStatus === 'pending' && <Loader />}
    </ScreenView>
  );
};

export default Cable;
