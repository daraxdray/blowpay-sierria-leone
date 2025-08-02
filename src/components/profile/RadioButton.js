import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import tw from 'twrnc';
const RadioButton = ({label, value, selected, onSelect}) => {
  return (
    <TouchableOpacity
      style={tw`flex-row items-center my-2 justify-between`}
      onPress={() => onSelect(value)}>
      <Text style={tw`ml-2 text-black font-normal text-[14px]`}>{label}</Text>
      <View
        style={tw`h-5 w-5 rounded-full border-2 ${
          selected ? 'border-[#FF114A] bg-[#FF114A]' : 'border-gray-400'
        } justify-center items-center`}>
        {selected && <View style={tw`h-2.5 w-2.5 rounded-full bg-white`} />}
      </View>
    </TouchableOpacity>
  );
};
export default RadioButton;
