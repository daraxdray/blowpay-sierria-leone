import {View, Text, TouchableOpacity, Switch} from 'react-native';
import React, {useState} from 'react';
import tw from 'twrnc';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {PanGestureHandler} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import FaqsSVG from '../../../assets/svgs/Faqs.svg';
import ContactSVG from '../../../assets/svgs/Contact.svg';

const HelpModal = ({closeModal}) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const navigation = useNavigation();

  const handleSwipeDown = ({nativeEvent}) => {
    if (nativeEvent.translationY > 50) {
      closeModal();
    }
  };

  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  return (
    <PanGestureHandler onGestureEvent={handleSwipeDown}>
      <View style={tw`bg-white p-5 w-19/20 self-center rounded-10 mb-5 gap-3`}>
        <View style={tw`gap-5 p-2 pt-4`}>
          <View style={tw`flex flex-row items-center justify-between`}>
            <TouchableOpacity
              style={tw`p-1 bg-[#F3F4F6] items-center justify-center rounded-full w-[30px] h-[30px]`}
              activeOpacity={0.65}
              onPress={closeModal}>
              <Ionicons name="chevron-back" size={13} color="#000" />
            </TouchableOpacity>
            <Text style={tw`text-[#000000] font-medium text-[14px]`}>Help</Text>
            <View style={tw`w-10`} />
          </View>

          <View
            style={tw`border border-gray-200 py-4 px-2 rounded-[8px] gap-6`}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Faqs');
                closeModal();
              }}
              style={tw`bg-[#F8F8FA] rounded-[10px] px-3 py-2 flex w-full items-center flex-row justify-between border border-[#D0D5DD]`}>
              <View style={tw`flex flex-row gap-2 items-center`}>
                <FaqsSVG />
                <Text style={tw`text-[#000000] font-medium text-[15px]`}>
                  Frequently Asked Questions
                </Text>
              </View>

              <Ionicons name="chevron-forward" size={15} color="black" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Contact');
                closeModal();
              }}
              style={tw`bg-[#F8F8FA] rounded-[10px] px-3 py-2 flex w-full items-center flex-row justify-between border border-[#D0D5DD]`}>
              <View style={tw`flex flex-row gap-2 items-center`}>
                <ContactSVG />
                <Text style={tw`text-[#000000] font-medium text-[15px]`}>
                  Contact Us
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={15} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </PanGestureHandler>
  );
};

export default HelpModal;
