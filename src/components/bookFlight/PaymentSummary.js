import {View, Text} from 'react-native';
import React from 'react';
import tw from 'twrnc';

const PaymentSummary = () => {
  return (
    <View
      style={tw`px-5 border border-[#EDEDED] rounded-[16px] p-4 flex gap-4`}>
      <Text style={tw`text-[#101010] text-[16px] font-medium `}>
        Payment Summary
      </Text>
      <View style={tw`flex flex-row items-center justify-between ga`}>
        <Text style={tw`text-[#878787] text-[14px] font-normal `}>
          Total Items (3)
        </Text>
        <Text style={tw`text-[#101010] text-[14px] font-bold `}>NGN48,900</Text>
      </View>
      <View style={tw`flex flex-row items-center justify-between ga`}>
        <Text style={tw`text-[#878787] text-[14px] font-normal `}>
          Delivery Fee
        </Text>
        <Text style={tw`text-[#101010] text-[14px] font-bold `}>Free </Text>
      </View>
      <View style={tw`flex flex-row items-center justify-between ga`}>
        <Text style={tw`text-[#878787] text-[14px] font-normal `}>
          Discount
        </Text>
        <Text style={tw`text-[#FF114A] text-[14px] font-bold `}>
          -NGN10,900
        </Text>
      </View>
      <View style={tw`flex flex-row items-center justify-between ga`}>
        <Text style={tw`text-[#878787] text-[14px] font-normal `}>Total</Text>
        <Text style={tw`text-[#101010] text-[14px] font-bold `}>NGN38,000</Text>
      </View>
    </View>
  );
};

export default PaymentSummary;
