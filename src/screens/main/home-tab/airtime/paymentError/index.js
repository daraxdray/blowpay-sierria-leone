import React from 'react';
import {View, Text} from 'react-native';
import {styles} from './style';
import {ScreenView} from '../../../../../global/wrappers';
import {WHITE, PRIMARY_COLOR} from '../../../../../global/theme';
import tw from 'twrnc';
import {CustomButton} from '../../../../../global/components';
import Ionicons from 'react-native-vector-icons/Ionicons';

const USER_FRIENDLY_MESSAGE =
  'Something went wrong. Please try again.';

const PaymentError = props => {
  const {navigation, route} = props;
  const {screenError} = route?.params || {};

  const handleNext = () => {
    navigation.goBack();
  };

  // Log raw error for debugging; never expose to user
  if (screenError && __DEV__) {
    console.warn('[PaymentError]', screenError);
  }

  return (
    <ScreenView style={styles.container} light color={WHITE}>
      <View style={styles.view1}>
        <View style={tw`flex h-[80%] justify-center items-center w-full gap-3`}>
          <Ionicons name="close-circle" size={80} color={PRIMARY_COLOR} />
          <Text style={tw`text-[#FF0000] font-medium text-[20px]`}>
            Payment Failed
          </Text>
          <View style={tw`flex items-center w-[60%]`}>
            <Text
              style={tw`text-[#7F7F7F] font-normal text-[14px] text-center`}>
              {USER_FRIENDLY_MESSAGE}
            </Text>
          </View>
        </View>
        <View style={tw`pb-10 w-full`}>
          <CustomButton
            onPress={handleNext}
            style={styles.btn1}
            text={'Try Again'}
          />
        </View>
      </View>
    </ScreenView>
  );
};

export default PaymentError;
