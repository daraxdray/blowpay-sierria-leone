import React, { useEffect } from 'react';
import {View, Text, Image} from 'react-native';
import {styles} from './style';
import {ScreenView} from '../../../../../global/wrappers';
import {WHITE} from '../../../../../global/theme';
import tw from 'twrnc';
import {CustomButton} from '../../../../../global/components';
import {CommonActions} from '@react-navigation/native';
const PaymentSucess = props => {
  const navigation = props.navigation;
  const params = props.route?.params;
  
  const handleNext = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'bottom-tab'}],
      }),
    );
  };

  useEffect(()=>{
    console.log(params);
  },[])
  return (
    <ScreenView style={styles.container} light color={WHITE}>
      <View style={styles.view1}>
        <View
          style={tw`flex  h-[80%]  justify-center items-center w-full gap-3`}>
          <Image
            source={require('../../../../../../assets/icons/success-icon.png')}
            style={tw`w-30 h-30`}
          />
          <Text style={tw`text-[#01A33D] font-medium text-[20px]`}>
            Payment Succesful
          </Text>
          <View style={tw`flex items-center w-[60%]`}>
            <Text
              style={tw`text-[#7F7F7F] font-normal text-[14px]  text-center`}>
              {params?.message ?? "Your transaction was successful, Kindly check you transaction history for more details"}
              {/* <Text style={tw`font-bold text-black`}>you </Text> has been */}
              {/* credited */}
            {params?.data?.token && (
              <View style={tw`flex flex-row items-center w-full mt-2`}>
                <Text
                  style={tw`text-[#7F7F7F] font-normal text-[14px]  text-center flex-1`}
                >
                  Token: {params?.data?.token}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    Clipboard.setString(params?.data?.token);
                    Toast.show({
                      type: 'success',
                      text1: 'Token copied',
                      visibilityTime: 1000,
                    });
                  }}
                  style={tw`px-3 py-2 rounded-lg bg-[#F5F5F5]`}
                >
                  <Text style={tw`text-[#01A33D] font-medium text-[14px]`}>
                    Copy
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            </Text>
          </View>
        </View>
        <View style={tw`pb-10 w-full `}>
          <CustomButton
            onPress={handleNext}
            style={styles.btn1}
            text={'Okay'}
          />
        </View>
      </View>
    </ScreenView>
  );
};

export default PaymentSucess;
