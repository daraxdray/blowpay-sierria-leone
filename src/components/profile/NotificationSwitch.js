import React from 'react';
import {View, Switch, Text} from 'react-native';
import tw from 'twrnc';
const NotificationSwitch = ({label, value, onValueChange}) => (
  <View
    style={tw`rounded-[10px] py-3 flex w-full items-center flex-row justify-between`}>
    <Text style={tw`text-[#000000] font-normal text-[14px]`}>{label}</Text>
    <Switch
      trackColor={{false: '#767577', true: 'red'}}
      thumbColor={value ? 'white' : 'white'}
      ios_backgroundColor="#3e3e3e"
      onValueChange={onValueChange}
      value={value}
    />
  </View>
);
export default NotificationSwitch;
