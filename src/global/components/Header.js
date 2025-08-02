import {
  View,
  Text,
  TouchableOpacity,
  Image,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import React, { useState } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import tw from 'twrnc';

const Header = ({
  navigation,
  title = '',
  showIcon = false,
  ImageSource = '',
  imagePress,
  showContact = false,
  setShowModal = (val)=>{} //enables modal to show onclick
}) => {


  return (
    <View style={tw`w-full flex-row items-center justify-between px-2`}>
      <TouchableOpacity
        style={tw`p-2 bg-[#F8F8FA] items-center justify-center rounded-full w-[45px] h-[45px]`}
        activeOpacity={0.65}
        onPress={navigation}>
        <Ionicons name="chevron-back" size={13} color="black" />
      </TouchableOpacity>

      <View style={tw`flex-1 items-center`}>
        <Text style={tw`text-gray-800 font-semibold text-[14px]`}>{title}</Text>
      </View>

      {showIcon ? (
        <TouchableOpacity
          style={tw`p-2 bg-[#F8F8FA] items-center justify-center rounded-md w-[45px] h-[45px]`}
          activeOpacity={0.65}
          onPress={imagePress}>
          <Image source={ImageSource} style={{ width: 20, height: 20 }} />
        </TouchableOpacity>
      ) : (
        <View style={tw`p-2`} />
      )}
      {showContact && (
        <TouchableOpacity
          style={tw`bg-[#F8F8FA] items-center justify-center rounded-md w-[45px] h-[45px]`}
          activeOpacity={0.65}
          onPress={()=>setShowModal(true)}
        >
          <Ionicons name="people-circle-outline" size={18} color="black" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Header;
