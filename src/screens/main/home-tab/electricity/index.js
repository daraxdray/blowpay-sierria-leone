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
import Header from '../../../../global/components/Header';
import tw from 'twrnc';
import Plan from '../../../../components/airtime/Plan';
import {ElectPlans} from '../../../../constants/data/airtime';
import Amount from '../../../../components/airtime/Amount';
import {CustomButton} from '../../../../global/components';
import ElectModal from '../../../../components/modals/ElectModal';
import PaymentItemModal from '../../../../components/modals/PaymentItemModal';
import Toast from 'react-native-toast-message';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {formatAmount, removeCommas} from '../../../../utils/format';
import SierraLeoneForm from '../../../../components/SierraLeone/SierraLeoneForm';
import {useSpValidateBill} from '../../../../hooks/billing.hook';
import {AuthContext} from '../../../../global/wrappers/AuthProvider';

const Electricity = props => {
  const {navigation} = props;
  const {country} = useContext(AuthContext);
  const [selectedAmount, setSelectedAmount] = useState('');
  const [selectedMeter, setSelectedMeter] = useState('');
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalItemVisible, setModalItemVisible] = useState(false);
  const {mutate, status} = useSpValidateBill();

  const handleAmountChange = val => {
    const raw = val.replace(/[^0-9]/g, '');
    setSelectedAmount(formatAmount(raw));
  };

  const isFormValid = !!selectedAmount && !!selectedMeter && !!selectedProvider;
  const handleNext = () => {
    if (!isFormValid) {
      return Toast.show({
        type: 'error',
        text1: 'Missing Fields',
        text2: 'Please fill all required fields',
      });
    }

    if (country === 'Sierra Leone') {
      mutate(
        {
          amount: removeCommas(selectedAmount),
          recipient: selectedMeter,
          category: 'EDSA',
        },
        {
          onSuccess: res => {
            Toast.show({
              type: 'success',
              text1: 'Meter Validated',
              text2: res?.data?.customerName || 'Validation successful',
            });
            navigation.navigate('ElectricPaymentPin', {
              selectedProvider,
              selectedPayment,
              country: country,
              selectedMeter,
              selectedAmount: removeCommas(selectedAmount),
              validationData: res?.data,
            });
          },
          onError: transferError => {
            const errorMessage =
              transferError?.response?.data?.error ||
              transferError?.response?.data?.message ||
              transferError?.error ||
              'Error: Electricity purchase failed. Please try again.';

            Toast.show(errorMessage);
            navigation.navigate('PaymentError', {screenError: errorMessage});
          },
        },
      );
    } else {
      navigation.navigate('ElectricPaymentPin', {
        selectedProvider,
        selectedPayment,
        selectedMeter,
        country: country,
        selectedAmount: removeCommas(selectedAmount),
      });
    }
  };

  return (
    <ScreenView style={styles.container} light color={WHITE}>
      <View style={tw`px-3 pt-2`}>
        <Header
          navigation={() => navigation.goBack()}
          ImageSource={require('../../../../../assets/icons/filter.png')}
          title="Electricity"
          showIcon={false}
        />
      </View>
      <ScrollView style={styles.viewContainer}>
        {country === 'Sierra Leone' ? (
          <SierraLeoneForm
            selectedProvider={selectedProvider}
            setSelectedProvider={setSelectedProvider}
            selectedMeter={selectedMeter}
            setSelectedMeter={setSelectedMeter}
            selectedAmount={selectedAmount}
            handleAmountChange={handleAmountChange}
            openProviderModal={() => setModalVisible(true)}
            showProvider={true}
            showMeter={true}
          />
        ) : (
          <View style={tw`gap-6`}>
            <View>
              <Text style={tw`text-gray-700 font-semibold text-[14px]`}>
                Service Provider
              </Text>
              <TouchableOpacity
                onPress={() => setModalVisible(true)}
                style={tw`border border-[#D0D5DD] rounded-lg mt-2 p-3 flex-row justify-between`}>
                <Text>
                  {selectedProvider
                    ? selectedProvider?.NAME
                    : 'Select Provider'}
                </Text>
                <Ionicons name="chevron-down" size={14} />
              </TouchableOpacity>
            </View>
            <View>
              <Text style={tw`text-gray-700 font-semibold text-[14px]`}>
                Account/Meter Type
              </Text>
              <TouchableOpacity
                onPress={() => setModalItemVisible(true)}
                style={tw`border border-[#D0D5DD] rounded-lg mt-2 p-3 flex-row justify-between`}>
                <Text>
                  {selectedPayment
                    ? selectedPayment.PRODUCT_ID
                    : 'Select Meter Type'}
                </Text>
                <Ionicons name="chevron-down" size={14} />
              </TouchableOpacity>
            </View>
            <View>
              <Text style={tw`text-gray-700 font-semibold text-[14px]`}>
                Meter Number
              </Text>
              <TextInput
                style={tw`border border-[#D0D5DD] rounded-lg mt-2 p-3 text-[14px]`}
                placeholder="Enter meter number"
                keyboardType="numeric"
                value={selectedMeter}
                onChangeText={setSelectedMeter}
              />
            </View>
            <View style={tw`pt-4 gap-3`}>
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
          </View>
        )}
      </ScrollView>

      <View style={tw`pb-5 mt-5 w-full px-3`}>
        <CustomButton
          onPress={handleNext}
          style={styles.btn1}
          text={'Proceed'}
          loading={status === 'pending'}
          disabled={!isFormValid}
        />
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={tw`flex-1 justify-end bg-black bg-opacity-50`}>
          <ElectModal
            selectCompany={company => {
              setSelectedProvider(company);
              setModalVisible(false);
            }}
            closeModal={() => setModalVisible(false)}
            activeCompany={selectedProvider}
            country={country}
          />
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalItemVisible}
        onRequestClose={() => setModalItemVisible(false)}>
        <View style={tw`flex-1 justify-end bg-black bg-opacity-50`}>
          <PaymentItemModal
            selectPaymentItem={payment => {
              setSelectedPayment(payment);
              setModalItemVisible(false);
            }}
            closeModal={() => setModalItemVisible(false)}
            companies={
              selectedProvider?.PRODUCT ?? [
                {PRODUCT_ID: 'prepaid', PRODUCT_TYPE: 'Prepaid'},
                {PRODUCT_ID: 'postpaid', PRODUCT_TYPE: 'Postpaid'},
              ]
            }
          />
        </View>
      </Modal>

      <Toast />
    </ScreenView>
  );
};

export default Electricity;
