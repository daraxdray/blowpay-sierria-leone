import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Modal} from 'react-native';
import tw from 'twrnc';
import DatePicker from 'react-native-modern-datepicker';
import {SECONDARY_COLOR} from '../../global/theme';
const DateModal = ({visible, onClose, onDateChange, selectedDate}) => {
  const [currentMode, setCurrentMode] = useState('calendar');
  const [selectedFullDate, setSelectedFullDate] = useState(selectedDate || '');
  const [tempDate, setTempDate] = useState(selectedDate || '');

  const handleDateSelect = date => {
    setSelectedFullDate(date);
    setTempDate(date);
  };

  const handleConfirm = () => {
    onDateChange(selectedFullDate);
    onClose();
  };

  const renderHeader = () => {
    const parseDate = dateString => {
      const [year, month, day] = dateString.split('/');
      return {year, month, day};
    };

    const {} = parseDate(
      tempDate || new Date().toISOString().split('T')[0].replace(/-/g, '/'),
    );

    return (
      <View style={tw`bg-[${SECONDARY_COLOR}] p-4 rounded-t-[10px]`}>
        <Text style={tw`text-white text-1xl text[#333333] font-bold`}>
          Select Date
        </Text>
        <View style={tw`flex-row items-center justify-between mt-2`}>
          {/* <Text style={tw`text-white text-2xl font-bold`}>{year}</Text> */}

          {/* <TouchableOpacity onPress={() => setCurrentMode('month')}>
            <Text style={tw`text-white text-lg`}>
              {new Date(Date.parse(`${year}/${month}/01`)).toLocaleString('default', { month: 'long' })}
            </Text>
          </TouchableOpacity> */}
        </View>
        {/* <Text style={tw`text-white text-3xl font-bold mt-2`}>
          {new Date(Date.parse(`${year}/${month}/${day}`)).toLocaleDateString('en-US', {
            weekday: 'long',
            day: 'numeric',
          })}
        </Text> */}
      </View>
    );
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={tw`flex-1 justify-end bg-black bg-opacity-50`}>
        <View style={tw`bg-white rounded-t-[20px] overflow-hidden`}>
          {renderHeader()}

          <DatePicker
            mode={currentMode}
            selected={tempDate}
            onDateChange={handleDateSelect}
            onSelectedChange={handleDateSelect}
            onMonthYearChange={() => {}}
            isGregorian={true}
            options={{
              backgroundColor: '#FFFFFF',
              textHeaderColor: '#333333',
              textDefaultColor: '#212529',
              selectedTextColor: '#FFFFFF',
              mainColor: '#FF114A',
              textSecondaryColor: '#6C757D',
              selectedBackgroundColor: '#FF114A',
            }}
            style={tw`p-4`}
          />

          <View
            style={tw`flex-row justify-end gap-4 p-4 border-t border-gray-200`}>
            <TouchableOpacity
              style={tw`border border-[#DCE0E5] px-4 py-3 rounded-lg`}
              onPress={onClose}>
              <Text style={tw`text-gray-600`}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={tw`bg-[#FF114A] px-4 py-3 rounded-lg`}
              onPress={handleConfirm}>
              <Text style={tw`text-white`}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DateModal;
