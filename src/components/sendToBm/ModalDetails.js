import {View, Text, TouchableOpacity, Image, TextInput} from 'react-native';
import React, {useState, useContext} from 'react';
import tw from 'twrnc';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {CustomButton} from '../../global/components';
import {BLACK} from '../../global/theme';
import {PanGestureHandler} from 'react-native-gesture-handler';
import {useGetVitualBalance} from '../../hooks/virtual.hook';
import {AuthContext} from '../../global/wrappers/AuthProvider';
import {getCurrencySymbol} from '../../utils/format';

const ModalDetails = ({closeModal, proceed, data}) => {
  const [amount, setAmount] = useState('');
  const {data: balance} = useGetVitualBalance();
  const userBalance = balance?.data || [];
  const reciever = data?.user;
  const {country} = useContext(AuthContext);
  const accNum = data?.accountNumber;

  const handleSwipeDown = ({nativeEvent}) => {
    if (nativeEvent.translationY > 50) {
      closeModal();
    }
  };
  const formatAmount = value => {
    let cleanedValue = value.replace(/[^0-9.]/g, '');
    let [integer, decimal] = cleanedValue.split('.');
    if (integer) {
      integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    return decimal ? `${integer}.${decimal}` : integer;
  };
  const handleInputChange = value => {
    const formattedValue = formatAmount(value);
    setAmount(formattedValue);
  };

  const handleProceed = () => {
    if (amount && accNum) {
      proceed(amount, accNum);
    } else {
      console.log('Amount or account number is missing');
    }
  };

  return (
    <PanGestureHandler onGestureEvent={handleSwipeDown}>
      <View
        style={tw`bg-white p-5 rounded-t-[20px] w-19/20 self-center rounded-b-10 mb-5 gap-3 justify-between`}>
        <View>
          <View style={tw`items-center justify-center`}>
            <View style={tw`w-20 h-2 bg-[#999999] rounded-full`} />
          </View>
          <View style={tw`flex flex-row justify-between mt-4 items-center`}>
            <TouchableOpacity
              style={tw`p-2 bg-[#F3F4F6] items-center justify-center rounded-full w-[45px] h-[45px]`}
              activeOpacity={0.65}
              onPress={closeModal}>
              <Ionicons name="chevron-back" size={13} color={BLACK} />
            </TouchableOpacity>
            <Text style={tw`text-gray-800 font-medium text-[18px]`}>
              Transfer Money
            </Text>
            <View style={tw`w-10 h-10 rounded-[10px] bg-[#F3F4F6]`} />
          </View>
          <View style={tw`mt-4 gap-2`}>
            <Text style={tw`text-[#9B9B9B] font-medium text-[11px]`}>
              Available Balance
            </Text>
            <Text style={tw`text-gray-800 font-bold text-[24px]`}>
              {getCurrencySymbol(country)}
              {parseFloat(userBalance?.balance / 100)
                .toFixed(2)
                .replace(/\d(?=(\d{3})+\.)/g, '$&,') || 'NAN'}
            </Text>
          </View>
          <View style={tw`mt-8 px-4 gap-2`}>
            <Text style={tw`text-[#9B9B9B] font-medium text-[11px]`}>
              You’re sending
            </Text>
            <View style={tw`flex flex-row justify-between`}>
              <View style={tw`flex flex-row items-end gap-1`}>
                <Text style={tw`text-gray-500 font-medium text-[16px] mb-3`}>
                  {getCurrencySymbol(country)}
                </Text>
                <TextInput
                  placeholder="00"
                  style={tw`w-40 text-[28px] font-bold text-red-500`}
                  keyboardType="numeric"
                  placeholderTextColor="gray"
                  value={amount}
                  onChangeText={handleInputChange}
                />
              </View>
              <View
                style={tw`p-2 bg-[#F3F4F6] flex flex-row items-center gap-1`}>
                <Text style={tw`text-gray-900 font-medium text-[12px] mb-1`}>
                  {getCurrencySymbol(country)}
                </Text>
              </View>
            </View>
          </View>
          <View style={tw`mt-8 px-4 gap-2`}>
            <Text style={tw`text-[#9B9B9B] font-medium text-[11px]`}>
              Receiver
            </Text>
            <View
              style={tw`border border-[#EFEFEF] rounded-[20px] p-3 flex-row items-center gap-3`}>
              <Image
                source={require('../../../assets/icons/Avatar.png')}
                // eslint-disable-next-line react-native/no-inline-styles
                style={{width: 40, height: 40}}
              />
              <View style={tw`gap-1`}>
                <Text style={tw`text-gray-900 font-semibold text-[14px]`}>
                  {reciever?.firstName} {reciever?.lastName}
                </Text>
                <Text style={tw`text-gray-500 text-[11px]`}>{accNum}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={tw`pb-5`}>
          <CustomButton onPress={handleProceed} text={'Proceed'} style={{}} />
        </View>
      </View>
    </PanGestureHandler>
  );
};

export default ModalDetails;
