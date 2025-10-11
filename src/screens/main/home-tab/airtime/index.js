import React, {useState, useContext} from 'react';
import {View, Text, ScrollView} from 'react-native';
import {styles} from './style';
import {ScreenView} from '../../../../global/wrappers';
import {WHITE} from '../../../../global/theme';
import Header from '../../../../global/components/Header';
import tw from 'twrnc';
import Plan from '../../../../components/airtime/Plan';
import {AirtimePlans} from '../../../../constants/data/airtime';
import NumberInput from '../../../../components/airtime/NumberInput';
import {CustomButton} from '../../../../global/components';
import Amount from '../../../../components/airtime/Amount';
import Toast from 'react-native-toast-message';
import ContactListModal from '../../../../components/modals/ContactListModal';
import SierraLeoneForm from '../../../../components/SierraLeone/SierraLeoneForm';
import {AuthContext} from '../../../../global/wrappers/AuthProvider';
import NetworkPerformance from '../../../../components/airtime/NetworkPerformance';
import {formatAmount} from '../../../../utils/format';

const Airtime = props => {
  const {country} = useContext(AuthContext);
  const {navigation} = props;
  const [selectedAmount, setSelectedAmount] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [contactIndex, setContactIndex] = useState(null);

  const [providerStatus, setProviderStatus] = useState(null);
  const handleAmountChange = val => {
    const raw = val.replace(/[^0-9]/g, '');
    setSelectedAmount(formatAmount(raw));
  };

  const isFormValid = !!phoneNumber && !!selectedAmount;
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
        text1: 'Amount Missing',
        text2: 'Please enter an amount.',
      });
    } else {
      navigation.navigate('AirtimePaymentPin', {
        phoneNumber,
        selectedAmount,
        country,
        providerName: providerStatus?.name || null,
      });
    }
  };

  return (
    <ScreenView style={styles.container} light color={WHITE}>
      <View style={tw`px-3 pt-2`}>
        <Header
          navigation={() => navigation.goBack()}
          ImageSource={require('../../../../../assets/icons/filter.png')}
          title="Airtime"
          showContact={true}
          iconName="add-circle"
          imagePress={() => setShowModal(true)}
          setShowModal={setShowModal}
        />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.viewContainer}>
        {country === 'Sierra Leone' ? (
          <SierraLeoneForm
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            selectedAmount={selectedAmount}
            handleAmountChange={handleAmountChange}
            showPhone={true}
          />
        ) : (
          <View>
            <View style={tw`pt-4 gap-5`}>
              <NumberInput
                phoneNumber={phoneNumber}
                setPhoneNumber={setPhoneNumber}
              />
              <NetworkPerformance
                phoneNumber={phoneNumber}
                onStatusChange={setProviderStatus}
                country={country}
              />
              <Text style={tw`text-gray-700 font-semibold text-[16px]`}>
                Flash sales
              </Text>
              <View style={tw`flex flex-wrap flex-row justify-between`}>
                {AirtimePlans.map((plan, index) => (
                  <View key={index} style={tw`w-1/5 m-1`}>
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
            <Amount
              amount={selectedAmount}
              onAmountChange={handleAmountChange}
              country={country}
            />
          </View>
        )}
      </ScrollView>

      <View style={tw`pb-5 mt-5 w-full px-3`}>
        <CustomButton
          onPress={handleNext}
          style={styles.btn1}
          text={'Pay'}
          disabled={!isFormValid}
        />
      </View>

      <Toast />
      <ContactListModal
        showModal={showModal}
        setShowModal={setShowModal}
        setselectedContact={setPhoneNumber}
        selectedIndex={contactIndex}
        setSelectedIndex={setContactIndex}
      />
    </ScreenView>
  );
};

export default Airtime;
