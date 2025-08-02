import {View, Text, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import tw from 'twrnc';
import Ionicons from 'react-native-vector-icons/Ionicons';

const QrCodeDetails = () => {
  return (
    <View style={tw`flex-1 h-100 justify-center items-center gap-8 mt-20`}>
      <Text style={tw`text-[#1B1B1B] font-normal text-[11px] `}>
        Scan this QR Code to process your payment
      </Text>
      <Image
        source={require('../../../assets/icons/qr-code.png')}
        style={{width: '88%', height: '85%'}}
      />
      <View style={tw`p-2 px-5 bg-[#FFF1C0] mx-5 rounded-full`}>
        <Text style={tw`text-[#D0A200] font-normal text-[11px] text-center `}>
          This QR Code will be expired in 04:59
        </Text>
      </View>
      <TouchableOpacity
        style={tw`p-2 px-5 mx-5 rounded-full flex flex-row gap-1 items-center`}>
        <Ionicons name="sync" size={14} color="#2B61E3" />
        <Text style={tw`text-[#2B61E3] font-normal text-[14px] text-center `}>
          Regenerate the QR Code
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default QrCodeDetails;
