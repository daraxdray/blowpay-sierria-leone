import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { styles } from './style';
import { ScreenView } from '../../../../global/wrappers';
import { WHITE } from '../../../../global/theme';
import Header from '../../../../global/components/Header';
import tw from 'twrnc';
import Plan from '../../../../components/airtime/Plan';
import { AirtimePlans } from '../../../../constants/data/airtime';
import NumberInput from '../../../../components/airtime/NumberInput';
import { CustomButton } from '../../../../global/components';
import Amount from '../../../../components/airtime/Amount';
import { useBillerProducts } from '../../../../hooks/billing.hook';
import Toast from 'react-native-toast-message';
import ContactListModal from '../../../../components/modals/ContactListModal';
import { ELEVATION_LEVELS_MAP } from 'react-native-paper/lib/typescript/components/Menu/Menu';

const Airtime = props => {
  const navigation = props.navigation;

  const [selectedAmount, setSelectedAmount] = useState('');
  const [billerId, setBillerId] = useState('BIL099');
  const [billerDataId, setBillerDataId] = useState('BIL099');
  const { data, isLoading, error } = useBillerProducts(billerId);
  const [selectedContact, setSelectedContact] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [contactIndex, setContactIndex] = useState(null);

  const handlePhoneNumber = number => {
    setPhoneNumber(number); // Update phone number state
  };

  const [airtimeProducts, setAirtimeProducts] = useState([]);

  const formatAmount = value => {
    let cleanedValue = value.replace(/[^0-9.]/g, '');
    let [integer, decimal] = cleanedValue.split('.');
    if (integer) {
      integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    return decimal ? `${integer}.${decimal}` : integer;
  };

  useEffect(() => {
    if (data) {
      const products = data.data?.filter(product => product.is_airtime);
      setAirtimeProducts(products || []);
    }
  }, [data]);

  const [phoneNumber, setPhoneNumber] = useState('');
  const handleAmountChange = newAmount => {
    const formattedValue = formatAmount(newAmount);
    setSelectedAmount(formattedValue);
  };

  const isFormValid =
    phoneNumber && selectedAmount && airtimeProducts.length > 0;

  const handleNext = () => {
    if (!phoneNumber) {
      Toast.show({
        type: 'error',
        text1: 'Phone Number Missing',
        text2: 'Please enter a valid phone number.',
      });
    } else if (!selectedAmount) {
      Toast.show({
        type: 'error',
        text1: 'Amount Not Selected',
        text2: 'Please select an amount.',
      });
    } else if (airtimeProducts.length === 0) {
      Toast.show({
        type: 'error',
        text1: 'Airtime Product Not Available',
        text2: 'No airtime products available for this biller.',
      });
    } else if (billerId == null) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Biller',
        text2: 'You have to select a biller network before proceeding.',
      });
    }

    else if (isFormValid) {
      navigation.navigate('AirtimePaymentPin', {
        phoneNumber,
        airtimeProducts,
        selectedAmount,
      });
    }
  };

  return (
    <ScreenView style={styles.container} light color={WHITE}>
      <View style={tw`px-3 pt-2`}>
        <Header
          navigation={() => {
            navigation.goBack();
          }}
          ImageSource={require('../../../../../assets/icons/filter.png')}
          title="Airtime"
          showContact={true}
          iconName="add-circle"
          imagePress={handlePhoneNumber}
          setShowModal={setShowModal}
        />
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.viewContainer}>
        <View style={styles.view1}>
          <NumberInput
            onOptionSelect={setBillerId}
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            dataOptionSelect={setBillerDataId}
          />
          <View style={tw` pt-4 gap-5`}>
            <Text style={tw`text-gray-700 font-semibold text-[16px]`}>
              Flash sales
            </Text>
            <View style={tw`flex flex-wrap flex-row justify-between`}>
              {AirtimePlans.map((plan, index) => (
                <View key={index} style={tw`w-1/5 m-1 `}>
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
          </View>
          <Amount amount={selectedAmount} onAmountChange={handleAmountChange} />
        </View>
      </ScrollView>
      <View style={tw`pb-5 mt-5 w-full px-3`}>
        <CustomButton
          onPress={handleNext}
          style={styles.btn1}
          text={'Pay'}
          disabled={!isFormValid}
        />
      </View>
      {/* Toast Message */}
      <Toast />
      <ContactListModal showModal={showModal} setShowModal={setShowModal} setselectedContact={setPhoneNumber} selectedIndex={contactIndex} setSelectedIndex={setContactIndex} />
    </ScreenView>
  );
};

export default Airtime;
