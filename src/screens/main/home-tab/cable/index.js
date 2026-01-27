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
import Loader from '../../../../components/modals/Loader';
import {AuthContext} from '../../../../global/wrappers/AuthProvider';
import {useBpCheckCable} from '../../../../hooks/billing.hook';

const Cable = props => {
  const {country} = useContext(AuthContext);
  const navigation = props.navigation;
  const [modalVisible, setModalVisible] = useState(false);
  const [optionsModalVisible, setOptionsModalVisible] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [smartCardNumber, setSmartCardNumber] = useState('');
  const [userName, setUserName] = useState('');
  const {mutate: validateCable, status: cableStatus} = useBpCheckCable();

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);
  const closeOptionsModal = () => setOptionsModalVisible(false);

  const selectCompany = company => {
    setSelectedProvider(company);
    closeModal();
    setUserName('');
  };

  const selectOption = plan => {
    setSelectedOption(plan);
  };

  const handleSmartCardChange = val => {
    setSmartCardNumber(val);
    setUserName('');

    if (country === 'Nigeria' && val.length >= 7 && selectedProvider) {
      console.log(selectedProvider, 'hhdhd');

      validateCable(
        {
          smartCardNo: val?.toLowerCase(),
          cableTv: selectedProvider?.ID?.toLowerCase(),
        },
        {
          onSuccess: res => {
            const name = res?.data?.customer_name;
            if (name) {
              setUserName(name);
              Toast.show({
                type: 'success',
                text1: 'Smart Card Validated',
                text2: name,
              });
            } else {
              setUserName('error:Unable to fetch name');
            }
          },
          onError: error => {
            const msg =
              error?.response?.data?.error ||
              error?.response?.data?.message ||
              'Invalid smart card number';
            setUserName(`error:${msg}`);
          },
        },
      );
    }
  };

  const handleNext = () => {
    if (!selectedProvider || !selectedOption || !smartCardNumber) {
      let missingFields = [];
      if (!selectedProvider) missingFields.push('Service Provider');
      if (!selectedOption) missingFields.push('Service Plan');
      if (!smartCardNumber) missingFields.push('Smart Card Number');

      Toast.show({
        text1: 'Missing Fields',
        text2: `Please fill out: ${missingFields.join(', ')}`,
        type: 'error',
      });
      return;
    }

    const userValidate = {
      cableTv: selectedProvider?.ID,
      smartCardNo: smartCardNumber,
      packageId: selectedOption?.PACKAGE_ID,
      selectedAmount: selectedOption?.PACKAGE_AMOUNT,
      country,
    };

    navigation.navigate('CablePaymentPin', userValidate);
  };

  return (
    <ScreenView style={styles.container} light color={WHITE}>
      <View style={tw`px-3 pt-2`}>
        <Header
          navigation={() => navigation.goBack()}
          ImageSource={require('../../../../../assets/icons/filter.png')}
          title="Cable"
          showIcon={false}
        />
      </View>

      <ScrollView style={styles.viewContainer}>
        <View style={styles.view1}>
          <View style={tw`flex gap-4 w-full`}>
            {/* Provider */}
            <View style={tw`mt-2 gap-2`}>
              <Text style={tw`text-gray-900 font-medium text-[14px]`}>
                Service Provider
              </Text>
              <TouchableOpacity
                onPress={openModal}
                style={tw`border border-[#D0D5DD] rounded-[10px] flex-row justify-between px-3 py-3`}>
                <Text style={tw`text-[#98A2B3]`}>
                  {selectedProvider ? selectedProvider?.ID : 'Service Provider'}
                </Text>
                <Ionicons name="chevron-down" size={13} />
              </TouchableOpacity>
            </View>

            {/* Plan */}
            <View style={tw`mt-2 gap-2`}>
              <Text style={tw`text-gray-900 font-medium text-[14px]`}>
                Select Plan
              </Text>
              <TouchableOpacity
                onPress={() => {
                  if (selectedProvider) setOptionsModalVisible(true);
                  else
                    Toast.show({
                      text1: 'Select Provider',
                      text2: 'Please select a provider first.',
                      type: 'error',
                    });
                }}
                style={tw`border border-[#D0D5DD] rounded-[10px] flex-row justify-between px-3 py-3`}>
                <Text style={tw`text-[#98A2B3]`}>
                  {selectedOption
                    ? selectedOption?.PACKAGE_NAME
                    : 'Service plan'}
                </Text>
                <Ionicons name="chevron-down" size={13} />
              </TouchableOpacity>
            </View>

            {/* Smart Card */}
            <View style={tw`mt-2 gap-2`}>
              <Text style={tw`text-gray-900 font-medium text-[14px]`}>
                Smart Card Number
              </Text>
              <TextInput
                placeholder="Enter Smart Card Number"
                placeholderTextColor="gray"
                style={tw`border border-[#D0D5DD] rounded-[10px] p-3 text-black`}
                value={smartCardNumber}
                keyboardType="numeric"
                onChangeText={handleSmartCardChange}
              />

              {userName ? (
                userName.startsWith('error:') ? (
                  <View
                    style={tw`flex-row items-center mt-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2`}>
                    <Ionicons
                      name="alert-circle"
                      size={16}
                      color="#DC2626"
                      style={tw`mr-2`}
                    />
                    <Text style={tw`text-red-700 text-[13px]`}>
                      {userName.replace('error:', '')}
                    </Text>
                  </View>
                ) : (
                  <View
                    style={tw`flex-row items-center mt-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2`}>
                    <Ionicons
                      name="checkmark-circle"
                      size={16}
                      color="#16A34A"
                      style={tw`mr-2`}
                    />
                    <Text style={tw`text-green-700 text-[13px]`}>
                      Name: {userName}
                    </Text>
                  </View>
                )
              ) : null}
            </View>

            {/* Amount */}
            <View style={tw`pt-4`}>
              <Amount
                amount={`${selectedOption?.PACKAGE_AMOUNT ?? ''}`}
                editable={false}
                country={country}
              />
            </View>
          </View>

          {/* Modals */}
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
                products={selectedProvider}
              />
            </View>
          </Modal>

          {/* Button */}
          <View style={tw`pb-5 pt-10 w-full`}>
            <CustomButton
              onPress={handleNext}
              style={tw` w-full`}
              text={'Pay'}
              disabled={
                !selectedProvider ||
                !selectedOption ||
                !smartCardNumber ||
                userName.startsWith('error:')
              }
            />
          </View>
        </View>
      </ScrollView>

      {cableStatus === 'pending' && <Loader />}
    </ScreenView>
  );
};

export default Cable;
