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

const IndividualInfo = props => {
  const navigation = props.navigation;
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState('');
  const handleNext = () => {
    navigation.navigate('PaymentCheckout');
  };
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
    <ScreenView style={styles.container} light color={WHITE}>
      <ScrollView style={styles.viewContainer}>
        <View style={styles.view1}>
          <Header
            navigation={() => navigation.goBack()}
            ImageSource={require('../../../../../../assets/icons/filter.png')}
            title="Individual Information"
            showIcon={true}
            iconName="add-circle"
            imagePress={() => console.log('Second Icon Pressed')}
          />
          <View style={tw`px-5 gap-4`}>
            <View style={tw`gap-2 w-full`}>
              <Text style={tw`text-gray-900 font-medium text-[14px]`}>
                Legal first name
              </Text>

              <TextInput
                placeholder=" Legal first name"
                placeholderTextColor="gray"
                style={tw` py-3 border border-[#D0D5DD] rounded-[20px]  px-4  text-black`}
              />
            </View>
            <View style={tw`gap-2 w-full `}>
              <Text style={tw`text-gray-900 font-medium text-[14px]`}>
                Legal last name
              </Text>

              <TextInput
                placeholder="Legal last name"
                placeholderTextColor="gray"
                style={tw` py-3 border border-[#D0D5DD] rounded-[20px]  px-4 text-black  `}
              />
            </View>
            <View style={tw`gap-2 `}>
              <Text style={tw`text-gray-900 font-medium text-[14px] `}>
                Departure Date
              </Text>
              <TouchableOpacity
                onPress={handlePress}
                style={tw`relative w-full border border-[#D0D5DD] rounded-[20px] items-center justify-between flex-row px-3 py-4`}>
                <View style={tw`gap-3 flex flex-row`}>
                  <Text style={tw`text-[#98A2B3]`}>
                    {date ? date : 'dd - mm - yyyy'}
                  </Text>
                </View>
                <Image
                  source={require('../../../../../../assets/icons/calendar.png')}
                  style={tw`w-[18px] h-[18px]`}
                />
              </TouchableOpacity>
            </View>
            <View style={tw`gap-2 w-full`}>
              <Text style={tw`text-gray-900 font-medium text-[14px]`}>
                Email
              </Text>
              <TextInput
                placeholder="you@email.com"
                keyboardType="email-address"
                placeholderTextColor="gray"
                style={tw`py-3 border border-[#D0D5DD] rounded-[20px] px-4 text-black`}
              />
            </View>

            <View style={tw`gap-2 w-full`}>
              <Text style={tw`text-gray-900 font-medium text-[14px]`}>
                Phone Number
              </Text>
              <TextInput
                placeholder="Phone Number"
                placeholderTextColor="gray"
                keyboardType="phone-pad"
                style={tw`py-3 border border-[#D0D5DD] rounded-[20px] px-4 text-black`}
              />
            </View>
            <View style={tw`gap-2 w-full flex flex-row items-center`}>
              <TouchableOpacity
                style={tw`h-10 w-10 bg-[#FFF8FB] rounded-full items-center justify-center`}>
                <Ionicons name="add" size={24} />
              </TouchableOpacity>
              <Text style={tw`text-[#000000] font-normal text-[16px]`}>
                Add Another Traveller
              </Text>
            </View>
          </View>

          <Modal animationType="slide" transparent={true} visible={open}>
            <View style={tw`flex-1 justify-end mb-8 mx-3 `}>
              <View
                style={tw`bg-white p-0 rounded-t-[10px] shadow-md relative`}>
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

export default IndividualInfo;
