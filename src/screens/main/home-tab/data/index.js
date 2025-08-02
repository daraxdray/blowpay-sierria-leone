import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  ScrollView,
  Modal,
  TouchableOpacity,
} from 'react-native';
import {styles} from './style';
import {ScreenView} from '../../../../global/wrappers';
import {WHITE} from '../../../../global/theme';
import Header from '../../../../global/components/Header';
import tw from 'twrnc';
import NumberInput from '../../../../components/airtime/NumberInput';
import Tabs from '../../../../components/payWithQr/Tabs';
import PlansList from '../../../../components/airtime/Plans';
import {useBillerProducts} from '../../../../hooks/billing.hook';
import Loader from '../../../../components/modals/Loader';
import Toast from 'react-native-toast-message';
import ConfirmDataModal from '../../../../components/modals/ConfirmDataModal';
import ContactListModal from '../../../../components/modals/ContactListModal';

const Data = props => {
  const {navigation} = props;
  const [activeTab, setActiveTab] = useState('Hot');
  const [billerId, setBillerId] = useState('BIL108');
  const [airtimeProducts, setAirtimeProducts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showModal,setShowModal] = useState(false);
  const [contactIndex,setContactIndex] = useState(null);

  const tabs = [
    'Hot',
    'Daily',
    'Weekly',
    'Monthly',
    '2-Months',
    '3-Months',
    'Yearly',
  ];

  const {data, isLoading, error} = useBillerProducts(billerId);

  useEffect(() => {
    if (data && Array.isArray(data.data)) {
      const products = data.data.filter(product => product.is_data);
      setAirtimeProducts(products);
    }
  }, [data]);

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

    const categorizedProducts = daysRange => {
      return airtimeProducts.filter(product => {
        const validityPeriod = parseInt(product.validity_period, 10);
        return daysRange(validityPeriod);
      });
    };

    switch (activeTab) {
      case 'Daily':
        return (
          <PlansList
            plans={categorizedProducts(days => days > 0 && days <= 5)}
            onPlanSelect={handlePlanSelect}
          />
        );
      case 'Weekly':
        return (
          <PlansList
            plans={categorizedProducts(days => days > 6 && days <= 14)}
            onPlanSelect={handlePlanSelect}
          />
        );
      case 'Monthly':
        return (
          <PlansList
            plans={categorizedProducts(days => days > 25 && days <= 30)}
            onPlanSelect={handlePlanSelect}
          />
        );
      case '2-Months':
        return (
          <PlansList
            plans={categorizedProducts(days => days > 31 && days <= 60)}
            onPlanSelect={handlePlanSelect}
          />
        );
      case '3-Months':
        return (
          <PlansList
            plans={categorizedProducts(days => days > 61 && days <= 90)}
            onPlanSelect={handlePlanSelect}
          />
        );
      case 'Yearly':
        return (
          <PlansList
            plans={categorizedProducts(days => days >= 360)}
            onPlanSelect={handlePlanSelect}
          />
        );
      default:
        return (
          <PlansList plans={airtimeProducts} onPlanSelect={handlePlanSelect} />
        );
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <ScreenView style={tw`justify-center items-center`} light color={WHITE}>
        
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
          dataOptionSelect={setBillerId}
          phoneNumber={phoneNumber}
          onOptionSelect={setBillerId}
          setPhoneNumber={setPhoneNumber}
          
          
        />
        {error? <Text>Error fetching products</Text>:
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
              style={{width: '90%'}}
              resizeMode={'contain'}
            />
          </View>
        </ScrollView>}
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
          />
        </View>
      </Modal>
      <ContactListModal showModal={showModal} setShowModal={setShowModal} setselectedContact={setPhoneNumber} selectedIndex={contactIndex} setSelectedIndex={setContactIndex} />
      
    </ScreenView>
  );
};

export default Data;
