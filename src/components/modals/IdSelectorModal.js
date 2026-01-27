import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import tw from 'twrnc';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {PanGestureHandler} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';

const IdSelectorModal = ({closeModal}) => {
  const navigation = useNavigation();

  const handleSwipeDown = ({nativeEvent}) => {
    if (nativeEvent.translationY > 50) {
      closeModal();
    }
  };

  const handleNavigation = text => {
    navigation.navigate('setup-id-screen', {documentType: text});
    closeModal();
  };

  return (
    <PanGestureHandler onGestureEvent={handleSwipeDown}>
      <View style={tw`bg-white p-5 w-11/12 self-center rounded-2xl mb-5 gap-3`}>
        <View style={tw`gap-5 p-2 pt-4`}>
          {/* Header */}
          <View style={tw`flex flex-row items-center justify-between`}>
            <TouchableOpacity
              style={tw`p-1 bg-[#F3F4F6] items-center justify-center rounded-full w-[30px] h-[30px]`}
              activeOpacity={0.65}
              onPress={closeModal}>
              <Ionicons name="chevron-back" size={13} color="#000" />
            </TouchableOpacity>
            <Text style={tw`text-[#000000] font-medium text-[14px]`}>
              Method of Verification
            </Text>
            <View style={tw`w-10`} />
          </View>

          {/* Options */}
          <View
            style={tw`border border-gray-200 py-4 px-2 rounded-[8px] gap-6`}>
            <TouchableOpacity
              onPress={() => handleNavigation('international-passport')}
              style={tw`bg-[#F8F8FA] rounded-[10px] px-3 py-4 flex w-full items-center flex-row justify-between border border-[#D0D5DD]`}>
              <Text style={tw`text-[#000000] font-medium text-[15px]`}>
                International Passport
              </Text>
              <Ionicons name="chevron-forward" size={15} color="black" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleNavigation('drivers-license')}
              style={tw`bg-[#F8F8FA] rounded-[10px] px-3 py-4 flex w-full items-center flex-row justify-between border border-[#D0D5DD]`}>
              <Text style={tw`text-[#000000] font-medium text-[15px]`}>
                Driver’s License
              </Text>
              <Ionicons name="chevron-forward" size={15} color="black" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleNavigation('national-identity-number')}
              style={tw`bg-[#F8F8FA] rounded-[10px] px-3 py-4 flex w-full items-center flex-row justify-between border border-[#D0D5DD]`}>
              <Text style={tw`text-[#000000] font-medium text-[15px]`}>
                National Identity Number (NIN)
              </Text>
              <Ionicons name="chevron-forward" size={15} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </PanGestureHandler>
  );
};

export default IdSelectorModal;
