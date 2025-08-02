import {View, Text, Image} from 'react-native';
import React from 'react';
import tw from 'twrnc';

const Scan = () => {
  return (
    <View style={tw`flex-1 h-100 justify-center items-center gap-8 mt-20`}>
      <Text style={tw`text-[#1B1B1B] font-normal text-[11px] `}>
        Scan the QR Code to process your payment
      </Text>
      <Image
        source={require('../../../assets/images/scan-cam.png')}
        style={{width: '88%', height: '85%'}}
      />
      <View style={tw`p-3 bg-[#FFF8FB] mx-5 rounded-lg`}>
        <Text style={tw`text-[#FF114A] font-normal text-[11px] text-center `}>
          The QR Code will be automaticly detected when you position it between
          the guide lines
        </Text>
      </View>
    </View>
  );
};

export default Scan;
