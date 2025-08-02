import React, {useRef, useState} from 'react';
import {View, Text, ScrollView, Image} from 'react-native';
import {styles} from './style';
import {ScreenView} from '../../../../../global/wrappers';
import {BLACK, PRIMARY_COLOR, WHITE} from '../../../../../global/theme';
import Header from '../../../../../global/components/Header';
import tw from 'twrnc';
import {CustomButton} from '../../../../../global/components';
const PasswordSucess = props => {
  const navigation = props.navigation;
  const handleNext = () => {
    navigation.navigate('bottom-tab');
  };
  return (
    <ScreenView style={styles.container} light color={WHITE}>
      <View style={styles.view1}>
        <View
          style={tw`flex  h-[80%]  justify-center items-center w-full gap-3`}>
          <Image
            source={require('../../../../../../assets/icons/success-icon.png')}
            style={tw`w-30 h-30`}
          />
          <Text style={tw`text-[#000000] font-medium text-[20px]`}>
            Password Changed
          </Text>
          <View style={tw`flex items-center w-[60%]`}>
            <Text
              style={tw`text-[#7F7F7F] font-normal text-[14px]  text-center`}>
              Your password has successfully been changed
            </Text>
          </View>
        </View>
        <View style={tw`pb-10 w-full `}>
          <CustomButton
            onPress={handleNext}
            style={styles.btn1}
            text={'okay'}
          />
        </View>
      </View>
    </ScreenView>
  );
};

export default PasswordSucess;
