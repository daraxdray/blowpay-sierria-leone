import React from 'react';
import {View, Text, Image} from 'react-native';
import tw from 'twrnc';
import {CustomButton} from '../../global/components';

const SearchCard = ({
  departureTime,
  arrivalTime,
  price,
  imageSource,
  onCheckIn,
  showButton = true,
}) => {
  return (
    <View style={tw`bg-[#FFF8FB] gap-3 rounded-3`}>
      <View
        style={tw`flex flex-row justify-between items-center pt-5 pb-3 px-5`}>
        <View style={tw`gap-[5px]`}>
          <Text style={tw`text-[#191919] font-semibold text-[20px]`}>
            {departureTime}
          </Text>
          <Text style={tw`text-[#191919] font-normal text-[14px]`}>DEL</Text>
        </View>
        <View style={tw`flex flex-row justify-between items-center relative`}>
          <View style={tw`h-2 w-2 rounded-full bg-[#D0D0D0]`} />
          <View style={tw`h-[2px] w-[150px] rounded-full bg-[#D0D0D0]`} />
          <View style={tw`h-2 w-2 rounded-full bg-[#D0D0D0]`} />
          <View
            style={tw`p-2 rounded-full bg-[#FF114A] items-center justify-center absolute left-[40%]`}>
            <Image
              source={require('../../../assets/icons/AirplaneInFlight.png')}
            />
          </View>
        </View>
        <View style={tw`gap-[5px]`}>
          <Text style={tw`text-[#191919] font-semibold text-[20px]`}>
            {arrivalTime}
          </Text>
          <Text style={tw`text-[#191919] font-normal text-[14px]`}>CCU</Text>
        </View>
      </View>
      <View style={tw`px-6 flex flex-row justify-between items-center pb-3`}>
        <View>
          <Image source={imageSource} />
        </View>
        <View style={tw`flex flex-row items-center gap-2`}>
          <Text style={tw`text-gray-900 font-thin text-[12px]`}>From:</Text>
          <Text style={tw`text-[#191919] font-bold text-[16px]`}>{price}</Text>
        </View>
      </View>
      {showButton && (
        <View style={tw`pb-4 px-2 w-full`}>
          <CustomButton onPress={onCheckIn} text={'Check In'} />
        </View>
      )}
    </View>
  );
};

export default SearchCard;
