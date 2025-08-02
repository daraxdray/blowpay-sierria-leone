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

const Oneway = () => {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState('');

  const handlePress = () => {
    setOpen(!open);
  };

  const handleChange = propDate => {
    setDate(propDate);
  };

  const handleDone = () => {
    setOpen(false);
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
            style={tw`flex-1 py-2`}
            placeholderTextColor="gray"
          />
        </View>
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
            style={tw`flex-1 py-2`}
            placeholderTextColor="gray"
          />
        </View>
      </View>

      <View style={tw`mt-2 gap-2 w-[50%]`}>
        <Text style={tw`text-gray-900 font-medium text-[14px] `}>
          Departure Date
        </Text>
        <TouchableOpacity
          onPress={handlePress}
          style={tw`relative w-full border border-[#D0D5DD] rounded-[20px] items-center justify-between flex-row px-3 py-3`}>
          <View style={tw`gap-3 flex flex-row`}>
            <Image
              source={require('../../../assets/icons/calendar.png')}
              style={tw`w-[18px] h-[18px]`}
            />
            <Text style={tw`text-[#98A2B3]`}>
              {date ? date : 'Select Date'}
            </Text>
          </View>

          <Ionicons name="chevron-down" size={13} />
        </TouchableOpacity>
      </View>

      <Modal animationType="slide" transparent={true} visible={open}>
        <View style={tw`flex-1 justify-end mb-8 mx-3 `}>
          <View style={tw`bg-white p-0 rounded-t-[10px] shadow-md relative`}>
            <DatePicker
              mode="calendar"
              selected={date}
              onDateChange={handleChange}
            />
            <View
              style={tw`flex-row justify-end gap-4 absolute bottom-5 right-5`}>
              <TouchableOpacity
                style={tw`border border-[#DCE0E5] p-3 rounded-lg`}
                onPress={handlePress}>
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
      <View style={tw`flex flex-row justify-between`}>
        <View style={tw`mt-2 gap-2 w-[48%]`}>
          <TravellerSelect />
        </View>
        <View style={tw`mt-2 gap-2 w-[48%]`}>
          <ClassSelector />
        </View>
      </View>
    </View>
  );
};

export default Oneway;

const styles = StyleSheet.create({});
