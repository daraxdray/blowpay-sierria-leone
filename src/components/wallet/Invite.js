import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Share,
  Platform, // Import Share API
} from 'react-native';
import tw from 'twrnc';
import AppConstant from '../../constants/data/appConstant';

const Invite = () => {
  const shareMessage = async () => {
    try {
      const result = await Share.share({
        message:
          `Enjoy a stress-free way to manage your mobile bills with ${Platform.OS == 'ios' || AppConstant.isAmazonStore ?'Blowpay':'BillsByBlowmoney'}. Visit ${Platform.OS == 'ios'  || AppConstant.isAmazonStore ?  'www.blowpay.app':'www.BillsByBlowmoney.com'} to get started!`,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log('Shared with activity type:', result.activityType);
        } else {
          console.log('Message shared successfully');
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('Share dialog dismissed');
      }
    } catch (error) {
      console.error('Error sharing message:', error.message);
    }
  };

  return (
    <View
      style={tw`p-6 w-full bg-[#FFFFFF] mt-5 rounded-[20px] flex-row items-center justify-center`}>
      <View style={tw`flex-1 gap-1`}>
        <Text style={tw`text-[14px] mb-[5px] text-[#000000] font-semibold`}>
          Invite friends and earn NGN
        </Text>
        <Text style={tw`w-[85%] text-[#4B5563] text-[12px]`}>
          "Enjoy a stress-free way to manage your mobile bills with {Platform.OS == 'ios' || AppConstant.isAmazonStore ?'Blowpay':'BillsByBlowmoney'}.
          Visit {Platform.OS == 'ios'  || AppConstant.isAmazonStore ?  'Blowpay.app':'www.BillsByBlowmoney.com'} to get started!"
        </Text>
      </View>
      <View
        style={tw`bg-[#FFF8FB] p-2 rounded-lg flex-none items-center justify-center`}>
        <TouchableOpacity onPress={shareMessage}>
          <Image
            source={require('../../../assets/icons/share.png')}
            style={{width: 20, height: 20}}
            resizeMode={'contain'}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Invite;

const styles = StyleSheet.create({});
