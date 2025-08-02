import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import tw from 'twrnc';

const Plan = ({amount, dataSize, duration, onPress}) => {
  const formattedAmount = amount ? amount.toLocaleString() : null; // Format amount if it's provided

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[tw`p-1 border w-[100%] py-1 gap-2 border-[#D9D9D9] flex items-center justify-center self-start rounded-[10px]`,{minWidth:70,minHeight:80}]}>
      <Text style={tw`text-gray-700 font-bold text-[15px]`}>
        {dataSize}
      </Text>

      {formattedAmount && (
        <Text style={tw`text-[#242424] font-normal text-[11px] text-center`}>
          {formattedAmount} days
        </Text>
      )}

      <Text style={tw`text-[#1C5BFF] font-normal text-[10px] text-center`}>
        {duration}
      </Text>
    </TouchableOpacity>
  );
};

export default Plan;

const styles = StyleSheet.create({});
