import React, {useState, useEffect, useContext} from 'react';
import {View, Text, Image, ScrollView, Modal} from 'react-native';
import {styles} from './style';
import {ScreenView} from '../../../../global/wrappers';
import {WHITE} from '../../../../global/theme';
import Header from '../../../../global/components/Header';
import tw from 'twrnc';
import NumberInput from '../../../../components/airtime/NumberInput';
import Tabs from '../../../../components/payWithQr/Tabs';
import PlansList from '../../../../components/airtime/Plans';
import {useGetBpDataPlans} from '../../../../hooks/billing.hook';
import Loader from '../../../../components/modals/Loader';
import Toast from 'react-native-toast-message';
import ConfirmDataModal from '../../../../components/modals/ConfirmDataModal';
import ContactListModal from '../../../../components/modals/ContactListModal';
import NetworkPerformance from '../../../../components/airtime/NetworkPerformance';
import {AuthContext} from '../../../../global/wrappers/AuthProvider';
import ServiceUnavailable from '../../../../components/SierraLeone/ServiceUnavailable';

const Data = props => {
  const {navigation} = props;
  const {country} = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('Hot');
  const [airtimeProducts, setAirtimeProducts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [contactIndex, setContactIndex] = useState(null);
  const [providerStatus, setProviderStatus] = useState(null);
  const serviceProvider = providerStatus?.name || 'MTN';

  const {data: dataPlans, error, status} = useGetBpDataPlans(serviceProvider);

  const tabs = [
    'Hot',
    'Daily',
    'Weekly',
    'Monthly',
    '2-Months',
    '3-Months',
    'Yearly',
  ];

  useEffect(() => {
    console.log(JSON.stringify(dataPlans, null, 2), 'dataPlans in Data screen');
    if (Array.isArray(dataPlans?.data?.data)) {
      const products = dataPlans.data.data;
      setAirtimeProducts(products);
    } else {
      console.log('no products found in dataPlans');
    }
  }, [dataPlans]);
  const handlePlanSelect = plan => {
    if (phoneNumber.length !== 11) {
      Toast.show({
        text1: 'Invalid Phone Number',
        text2: 'Please enter an 11-digit phone number.',
        type: 'error',
      });
      return;
    }
    setSelectedPlan(plan);
    setModalVisible(true);
  };

  const renderPlans = () => {
    if (!airtimeProducts || airtimeProducts.length === 0) {
      return <Text>No plans available</Text>;
    }

    const extractValidityDays = (validity = '') => {
      const lower = validity.toLowerCase();

      if (lower.includes('day')) {
        const match = validity.match(/(\d+)/);
        return match ? parseInt(match[1], 10) : 1;
      }

      if (lower.includes('week')) {
        const match = validity.match(/(\d+)/);
        return match ? parseInt(match[1], 10) * 7 : 7;
      }

      if (lower.includes('month')) {
        const match = validity.match(/(\d+)/);
        return match ? parseInt(match[1], 10) * 30 : 30;
      }

      if (lower.includes('year') || lower.includes('365')) {
        return 365;
      }

      return null;
    };

    const categorizedProducts = daysRange => {
      return airtimeProducts.filter(product => {
        const validityPeriod = extractValidityDays(product?.validity);
        return validityPeriod && daysRange(validityPeriod);
      });
    };

    switch (activeTab) {
      case 'Daily':
        return (
          <PlansList
            plans={categorizedProducts(days => days > 0 && days <= 5)}
            onPlanSelect={handlePlanSelect}
            country={country}
          />
        );
      case 'Weekly':
        return (
          <PlansList
            plans={categorizedProducts(days => days >= 7 && days < 14)}
            onPlanSelect={handlePlanSelect}
            country={country}
          />
        );
      case 'Monthly':
        return (
          <PlansList
            plans={categorizedProducts(days => days >= 25 && days <= 31)}
            onPlanSelect={handlePlanSelect}
            country={country}
          />
        );
      case '2-Months':
        return (
          <PlansList
            plans={categorizedProducts(days => days > 31 && days <= 60)}
            onPlanSelect={handlePlanSelect}
            country={country}
          />
        );
      case '3-Months':
        return (
          <PlansList
            plans={categorizedProducts(days => days > 60 && days <= 90)}
            onPlanSelect={handlePlanSelect}
            country={country}
          />
        );
      case 'Yearly':
        return (
          <PlansList
            plans={categorizedProducts(days => days >= 360)}
            onPlanSelect={handlePlanSelect}
            country={country}
          />
        );
      default:
        return (
          <PlansList
            plans={airtimeProducts}
            onPlanSelect={handlePlanSelect}
            country={country}
          />
        );
    }
  };

  if (status === 'pending') {
    return <Loader />;
  }
  if (country?.toLowerCase() === 'sierra leone') {
    return (
      <ScreenView style={styles.container} light color={WHITE}>
        <Header
          navigation={() => navigation.goBack()}
          ImageSource={require('../../../../../assets/icons/filter.png')}
          title="Data Purchase"
          iconName="add-circle"
          imagePress={() => console.log('Second Icon Pressed')}
          setShowModal={setShowModal}
        />
        <ServiceUnavailable />
      </ScreenView>
    );
  }
  return (
    <ScreenView style={styles.container} light color={WHITE}>
      <View style={styles.view1}>
        <Header
          navigation={() => navigation.goBack()}
          ImageSource={require('../../../../../assets/icons/filter.png')}
          title="Data Purchase"
          showContact={true}
          iconName="add-circle"
          imagePress={() => console.log('Second Icon Pressed')}
          setShowModal={setShowModal}
        />

        <NumberInput
          phoneNumber={phoneNumber}
          setPhoneNumber={setPhoneNumber}
        />
        <NetworkPerformance
          phoneNumber={phoneNumber}
          onStatusChange={setProviderStatus}
          country={country}
        />
        {error ? (
          <Text>Error fetching products</Text>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.viewContainer}>
            <View style={tw`p-3 pt-6 gap-5`}>
              <Text style={tw`text-gray-700 ml-5 font-semibold text-[13px]`}>
                Flash sales
              </Text>
              <Tabs
                tabs={tabs}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
              {renderPlans()}
            </View>
            <View style={tw`mt-5 items-center w-full`}>
              <Image
                source={require('../../../../../assets/images/airtimeBanner.png')}
                resizeMode={'contain'}
              />
            </View>
          </ScrollView>
        )}
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={tw`flex-1 justify-end bg-black bg-opacity-50`}>
          <ConfirmDataModal
            data={selectedPlan}
            closeModal={() => setModalVisible(false)}
            phoneNumber={phoneNumber}
            providerStatus={providerStatus}
          />
        </View>
      </Modal>
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

export default Data;
