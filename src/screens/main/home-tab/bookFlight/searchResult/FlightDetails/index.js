import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
} from 'react-native';
import {styles} from './style';
import {ScreenView} from '../../../../../../global/wrappers';
import {WHITE} from '../../../../../../global/theme';
import Header from '../../../../../../global/components/Header';
import tw from 'twrnc';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SearchCard from '../../../../../../components/bookFlight/SearchCard';
import {CustomButton} from '../../../../../../global/components';
import DateModal from '../../../../../../components/bookFlight/DateModal';

const FlightDetails = ({route, navigation}) => {
  const {departureTime, arrivalTime, price, imageSource} = route.params;
  const [departureModalOpen, setDepartureModalOpen] = useState(false);
  const [returnModalOpen, setReturnModalOpen] = useState(false);
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const handleNext = () => {
    navigation.navigate('IndividualInfo');
  };
  const handleOpenDepartureModal = () => {
    setDepartureModalOpen(true);
  };

  const handleOpenReturnModal = () => {
    setReturnModalOpen(true);
  };

  const handleCloseModals = () => {
    setDepartureModalOpen(false);
    setReturnModalOpen(false);
  };

  const handleDepartureDateChange = propDate => {
    setDepartureDate(propDate);
  };

  const handleReturnDateChange = propDate => {
    setReturnDate(propDate);
  };

  const handleDone = () => {
    handleCloseModals();
  };
  return (
    <ScreenView style={styles.container} light color={WHITE}>
      <ScrollView style={styles.viewContainer}>
        <Header
          navigation={() => navigation.goBack()}
          ImageSource={require('../../../../../../../assets/icons/filter.png')}
          title="Flight Details"
          showIcon={true}
          iconName="add-circle"
          imagePress={() => console.log('Filter Icon Pressed')}
        />

        <View style={styles.view1}>
          <SearchCard
            departureTime={departureTime}
            arrivalTime={arrivalTime}
            price={price}
            imageSource={require('../../../../../../../assets/icons/airpeace.png')}
            onCheckIn={() => handleCheckIn(item)}
            showButton={false}
          />
          <View>
            <View style={tw`flex flex-row gap-4 justify-center`}>
              {/* Departure Date */}
              <View style={tw`mt-2 gap-2 w-[48%]`}>
                <Text style={tw`text-gray-900 font-medium text-[14px]`}>
                  Departure Date
                </Text>
                <TouchableOpacity
                  onPress={handleOpenDepartureModal}
                  style={tw`relative w-full border border-[#D0D5DD] rounded-[20px] items-center justify-between flex-row px-3 py-3`}>
                  <View style={tw`gap-3 flex flex-row`}>
                    <Image
                      source={require('../../../../../../../assets/icons/calendar.png')}
                      style={tw`w-[18px] h-[18px]`}
                    />
                    <Text style={tw`text-[#98A2B3]`}>
                      {departureDate ? departureDate : 'Select Date'}
                    </Text>
                  </View>
                  <Ionicons name="chevron-down" size={13} />
                </TouchableOpacity>
              </View>

              {/* Return Date */}
              <View style={tw`mt-2 gap-2 w-[48%]`}>
                <Text style={tw`text-gray-900 font-medium text-[14px]`}>
                  Return Date
                </Text>
                <TouchableOpacity
                  onPress={handleOpenReturnModal}
                  style={tw`relative w-full border border-[#D0D5DD] rounded-[20px] items-center justify-between flex-row px-3 py-3`}>
                  <View style={tw`gap-3 flex flex-row`}>
                    <Image
                      source={require('../../../../../../../assets/icons/calendar.png')}
                      style={tw`w-[18px] h-[18px]`}
                    />
                    <Text style={tw`text-[#98A2B3]`}>
                      {returnDate ? returnDate : 'Select Date'}
                    </Text>
                  </View>
                  <Ionicons name="chevron-down" size={13} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Departure Date Modal */}
            <DateModal
              visible={departureModalOpen}
              onClose={handleCloseModals}
              onDateChange={handleDepartureDateChange}
              selectedDate={departureDate}
            />

            {/* Return Date Modal */}
            <DateModal
              visible={returnModalOpen}
              onClose={handleCloseModals}
              onDateChange={handleReturnDateChange}
              selectedDate={returnDate}
            />
          </View>
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

export default FlightDetails;
