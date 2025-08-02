import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Modal,
} from 'react-native';
import {ScreenView} from '../../../../../global/wrappers';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {WHITE} from '../../../../../global/theme';
import {styles} from './style';
import tw from 'twrnc';
import Header from '../../../../../global/components/Header';
import DatePicker from 'react-native-modern-datepicker';
import {CustomButton} from '../../../../../global/components';
import DateModal from '../../../../../components/bookFlight/DateModal';
import SearchCard from '../../../../../components/bookFlight/SearchCard';
import PaymentSummary from '../../../../../components/bookFlight/PaymentSummary';
const PaymentCheckout = props => {
  const navigation = props.navigation;
  const handleNext = () => {
    navigation.navigate('BoardingPass');
  };

  return (
    <ScreenView style={styles.container} light color={WHITE}>
      <ScrollView style={styles.viewContainer}>
        <View style={styles.view1}>
          <Header
            navigation={() => navigation.goBack()}
            ImageSource={require('../../../../../../assets/icons/filter.png')}
            title="Payment Checkout"
            showIcon={true}
            iconName="add-circle"
            imagePress={() => console.log('Second Icon Pressed')}
          />
          <SearchCard
            departureTime="5.50"
            arrivalTime="7.30"
            price="NGN90,000.00"
            imageSource={require('../../../../../../assets/icons/airpeace.png')}
            onCheckIn={() => handleCheckIn(item)}
            showButton={false}
          />

          <View style={tw`flex flex-row gap-4 justify-center px-2`}>
            <View style={tw`mt-2 gap-2 w-[48%]`}>
              <Text style={tw`text-gray-900 font-medium text-[14px]`}>
                Departure Date
              </Text>
              <TouchableOpacity
                style={tw`relative w-full border border-[#D0D5DD] rounded-[20px] items-center justify-between flex-row px-3 py-3`}>
                <View style={tw`gap-3 flex flex-row`}>
                  <Image
                    source={require('../../../../../../assets/icons/calendar.png')}
                    style={tw`w-[18px] h-[18px]`}
                  />
                  <Text style={tw`text-[#98A2B3]`}>15/07.2024</Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={tw`mt-2 gap-2 w-[48%]`}>
              <Text style={tw`text-gray-900 font-medium text-[14px]`}>
                Return Date
              </Text>
              <TouchableOpacity
                style={tw`relative w-full border border-[#D0D5DD] rounded-[20px] items-center justify-between flex-row px-3 py-3`}>
                <View style={tw`gap-3 flex flex-row`}>
                  <Image
                    source={require('../../../../../../assets/icons/calendar.png')}
                    style={tw`w-[18px] h-[18px]`}
                  />
                  <Text style={tw`text-[#98A2B3]`}>15/07.2024</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <PaymentSummary />
        </View>
      </ScrollView>
      <View style={tw`pb-8 w-full px-3`}>
        <CustomButton
          onPress={handleNext}
          style={styles.btn1}
          text={'Continue'}
        />
      </View>
    </ScreenView>
  );
};

export default PaymentCheckout;
