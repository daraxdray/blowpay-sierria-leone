import {View, Text, TouchableOpacity} from 'react-native';
import React, {useContext} from 'react';
import tw from 'twrnc';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {PanGestureHandler} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import {AuthContext} from '../../global/wrappers/AuthProvider';
import {getCurrencySymbol} from '../../utils/format';

const ConfirmDataModal = ({closeModal, data, phoneNumber, providerStatus}) => {
  const handleSwipeDown = ({nativeEvent}) => {
    if (nativeEvent.translationY > 50) {
      closeModal();
    }
  };
  const {country} = useContext(AuthContext);
  const navigation = useNavigation();
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
            <Text style={tw`text-[#000000] font-medium text-[14px]`}>
              Payment
            </Text>

            <View style={tw`w-10`} />
          </View>
          <View style={tw`flex items-center`}>
            <Text style={tw`text-[#1C5BFF] font-bold text-[16px]`}>
              {getCurrencySymbol(country)}
              {parseFloat(data?.price)
                .toFixed(2)
                .replace(/\d(?=(\d{3})+\.)/g, '$&,')}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => {
              navigation.navigate('ChangePassword');
              closeModal();
            }}
            style={tw`bg-[#F8F8FA] rounded-[10px] px-3 py-4 flex w-full items-center gap-1  border border-[#D0D5DD]`}>
            <View style={tw`flex flex-row justify-between w-full`}>
              <Text style={tw`text-[#000000] font-medium text-[12px]`}>
                Amount
              </Text>
              <Text style={tw`text-[#000000] font-medium text-[11px]`}>
                {getCurrencySymbol(country)}
                {parseFloat(data?.price)
                  .toFixed(2)
                  .replace(/\d(?=(\d{3})+\.)/g, '$&,')}
              </Text>
            </View>
            <View style={tw`flex flex-row justify-between w-full`}>
              <Text style={tw`text-[#000000] font-medium text-[12px]`}>
                Recipient Number
              </Text>
              <Text style={tw`text-[#000000] font-medium text-[11px]`}>
                {phoneNumber}
              </Text>
            </View>
          </TouchableOpacity>

          <View style={tw` pb-4 px-2 rounded-[8px] gap-4`}>
            <TouchableOpacity
              onPress={() => {
                closeModal();
                navigation.navigate('DataPaymentPin', {
                  data,
                  phoneNumber,
                  providerStatus,
                });
              }}
              style={tw`bg-[#FF114A] rounded-[16px] px-3 py-3 flex w-full items-center flex-row justify-center `}>
              <Text style={tw`text-white font-medium text-[14px]`}>
                Confirm to pay
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </PanGestureHandler>
  );
};

export default ConfirmDataModal;
