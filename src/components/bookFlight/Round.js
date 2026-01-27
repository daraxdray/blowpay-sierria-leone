import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  Modal,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import tw from 'twrnc';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DatePicker from 'react-native-modern-datepicker';
import TravellerSelect from './TravellerSelect';
import ClassSelector from './ClassSelector';

const Round = () => {
  const [departureModalOpen, setDepartureModalOpen] = useState(false);
  const [returnModalOpen, setReturnModalOpen] = useState(false);
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');

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
    <View style={tw`px-2 gap-5`}>
      <View style={tw`gap-2 w-full`}>
        <Text style={tw`text-gray-900 font-medium text-[14px]`}>From</Text>
        <View
          style={tw`border border-[#D0D5DD] rounded-[20px] flex-row items-center px-4 gap-2 `}>
          <Image
            source={require('../../../assets/icons/AirplaneTakeoff.png')}
            style={tw`w-[20px] h-[20px]`}
          />
          <TextInput
            placeholder="Departure"
            placeholderTextColor="gray"
            style={tw`flex-1 py-2  text-black`}
          />
        </View>
      </View>

      <View style={tw`flex flex-row justify-end`}>
        <TouchableOpacity
          style={tw`bg-[#EDEDEF] h-[40px] w-[40px] rounded-full items-center justify-center flex flex-row`}>
          <Ionicons
            name="arrow-down"
            size={18}
            color="red"
            style={tw`-mr-[6px]`}
          />
          <Ionicons name="arrow-up" size={18} color="red" />
        </TouchableOpacity>
      </View>

      <View style={tw`gap-2 w-full`}>
        <Text style={tw`text-gray-900 font-medium text-[14px]`}>To</Text>
        <View
          style={tw`border border-[#D0D5DD] rounded-[20px] flex-row items-center px-4 gap-2 `}>
          <Image
            source={require('../../../assets/icons/AirplaneLanding.png')}
            style={tw`w-[20px] h-[20px]`}
          />
          <TextInput
            placeholder="Destination"
            placeholderTextColor="gray"
            style={tw`flex-1 py-2 text-black`}
          />
        </View>
      </View>

      <View style={tw`flex flex-row gap-4`}>
        {/* Departure Date */}
        <View style={tw`mt-2 gap-2 w-[50%]`}>
          <Text style={tw`text-gray-900 font-medium text-[14px]`}>
            Departure Date
          </Text>
          <TouchableOpacity
            onPress={handleOpenDepartureModal}
            style={tw`relative w-full border border-[#D0D5DD] rounded-[20px] items-center justify-between flex-row px-3 py-3`}>
            <View style={tw`gap-3 flex flex-row`}>
              <Image
                source={require('../../../assets/icons/calendar.png')}
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
        <View style={tw`mt-2 gap-2 w-[50%]`}>
          <Text style={tw`text-gray-900 font-medium text-[14px]`}>
            Return Date
          </Text>
          <TouchableOpacity
            onPress={handleOpenReturnModal}
            style={tw`relative w-full border border-[#D0D5DD] rounded-[20px] items-center justify-between flex-row px-3 py-3`}>
            <View style={tw`gap-3 flex flex-row`}>
              <Image
                source={require('../../../assets/icons/calendar.png')}
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
      <Modal
        animationType="slide"
        transparent={true}
        visible={departureModalOpen}>
        <View style={tw`flex-1 justify-end mb-8 mx-3 `}>
          <View style={tw`bg-white p-0 rounded-t-[10px] shadow-md relative`}>
            <DatePicker
              mode="calendar"
              selected={departureDate}
              onDateChange={handleDepartureDateChange}
            />
            <View
              style={tw`flex-row justify-end gap-4 absolute bottom-5 right-5`}>
              <TouchableOpacity
                style={tw`border border-[#DCE0E5] p-3 rounded-lg`}
                onPress={handleCloseModals}>
                <Text style={tw`text-gray-600`}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={tw`bg-[#FF114A] p-3 rounded-lg`}
                onPress={handleDone}>
                <Text style={tw`text-white`}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Return Date Modal */}
      <Modal animationType="slide" transparent={true} visible={returnModalOpen}>
        <View style={tw`flex-1 justify-end mb-8 mx-3 `}>
          <View style={tw`bg-white p-0 rounded-t-[10px] shadow-md relative`}>
            <DatePicker
              mode="calendar"
              selected={returnDate}
              onDateChange={handleReturnDateChange}
            />
            <View
              style={tw`flex-row justify-end gap-4 absolute bottom-5 right-5`}>
              <TouchableOpacity
                style={tw`border border-[#DCE0E5] p-3 rounded-lg`}
                onPress={handleCloseModals}>
                <Text style={tw`text-gray-600`}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={tw`bg-[#FF114A] p-3 rounded-lg`}
                onPress={handleDone}>
                <Text style={tw`text-white`}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View style={tw`flex flex-row justify-between gap-4`}>
        <View style={tw`mt-2 gap-2 w-[50%]`}>
          <TravellerSelect />
        </View>
        <View style={tw`mt-2 gap-2 w-[50%]`}>
          <ClassSelector />
        </View>
      </View>
    </View>
  );
};

export default Round;

const styles = StyleSheet.create({});
