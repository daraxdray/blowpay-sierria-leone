import {Text, View} from 'react-native';
import React from 'react';
import tw from 'twrnc';

const Options = ({SvgIcon, text}) => {
  return (
    <View style={tw`gap-2 flex items-center mt-5`}>
      <SvgIcon />
      <Text style={tw`font-semibold text-[12px] text-[#374151]`}>{text}</Text>
    </View>
  );
};

export default Options;
