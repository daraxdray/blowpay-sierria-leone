import React from 'react';
import {View, Text, ScrollView} from 'react-native';
import {styles} from './style';
import {ScreenView} from '../../../../../global/wrappers';
import {BLACK, PRIMARY_COLOR, WHITE} from '../../../../../global/theme';
import Header from '../../../../../global/components/Header';
import tw from 'twrnc';
import OTPTextView from 'react-native-otp-textinput';
import {CustomButton} from '../../../../../global/components';

const UpdateNumber = props => {
  const navigation = props.navigation;
  const handleNext = () => {
    navigation.goBack();
  };

  return (
    <ScreenView style={styles.container} light color={WHITE}>
      <View style={tw`px-2 pt-2`}>
        <Header
          navigation={() => {
            navigation.goBack();
          }}
          ImageSource={require('../../../../../../assets/icons/filter.png')}
          title=""
          showIcon={false}
          iconName="add-circle"
          imagePress={() => console.log('Second Icon Pressed')}
        />
      </View>
      <ScrollView style={styles.viewContainer}>
        <View style={styles.view1}>
          <View style={tw`gap-1`}>
            <Text style={tw`text-gray-800 font-medium text-[20px]`}>
              Update Your Phone Number
            </Text>
            <Text style={tw`text-[#344054] font-normal text-[14px]`}>
              Phone Number Verification
            </Text>
            <Text style={tw`text-[#A5A5A5] font-normal text-[13px] w-[90%]`}>
              A code has been sent to the new phone number ending in ***89.
              Please enter the code below to complete the phone number change.
            </Text>
          </View>
        </View>
        <View style={styles.v2}>
          <OTPTextView
            ref={e => (otpRef = e)}
            inputCellLength={1}
            containerStyle={styles.containerOtp}
            textInputStyle={styles.inputOtp}
            handleTextChange={val => setOtp(val)}
            tintColor={PRIMARY_COLOR}
            inputCount={6}
            secureTextEntry={true}
            keyboardType={'number-pad'}
          />
        </View>
        <View style={tw`flex items-end px-5`}>
          <View style={tw`flex flex-row items-center justify-end`}>
            <Text style={tw`text-[#A5A5A5] font-normal text-[14px]`}>
              Resend Code
            </Text>

            <Text style={tw`text-[#FF0000] font-normal text-[14px] ml-2`}>
              30:13
            </Text>
          </View>
        </View>
        <View style={tw`pt-10 w-full px-3`}>
          <CustomButton
            onPress={handleNext}
            style={styles.btn1}
            text={'Confirm'}
          />
        </View>
      </ScrollView>
    </ScreenView>
  );
};

export default UpdateNumber;
