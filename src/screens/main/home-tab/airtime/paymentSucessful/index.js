import React, {useEffect} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import {styles} from './style';
import {ScreenView} from '../../../../../global/wrappers';
import {WHITE} from '../../../../../global/theme';
import tw from 'twrnc';
import {CustomButton} from '../../../../../global/components';
import {CommonActions} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
const getToken = params => {
  const d = params?.data;
  return d?.token ?? d?.metadata?.token ?? d?.data?.metadata?.token ?? null;
};

const PaymentSucess = props => {
  const navigation = props.navigation;
  const params = props.route?.params;
  const token = getToken(params);

  const handleNext = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'bottom-tab'}],
      }),
    );
  };

  useEffect(() => {
    console.log(params);
  }, []);
  return (
    <ScreenView style={styles.container} light color={WHITE}>
      <View style={styles.view1}>
        <View style={tw`flex-1 justify-center items-center px-6 bg-white`}>
          {/* ✅ Success Icon */}
          <View
            style={tw`w-24 h-24 rounded-full bg-[#E8F8EF] justify-center items-center mb-6`}>
            <Image
              source={require('../../../../../../assets/icons/success-icon.png')}
              style={tw`w-16 h-16`}
              resizeMode="contain"
            />
          </View>

          {/* ✅ Title */}
          <Text style={tw`text-[#01A33D] font-semibold text-[22px] mb-2`}>
            Payment Successful 🎉
          </Text>

          {/* ✅ Message */}
          <Text
            style={tw`text-[#7F7F7F] text-center text-[15px] leading-6 mb-4`}>
            {params?.message ??
              'Your transaction was successful. Kindly check your transaction history for more details.'}
          </Text>

          {/* ✅ Token Section */}
          {token && (
            <View
              style={tw`flex-row items-center justify-between bg-[#F8F8F8] rounded-xl px-4 py-3 w-[85%] shadow-sm border border-[#E5E5E5]`}>
              <Text style={tw`text-[#333] text-[15px] font-medium flex-1`}>
                Token: {token}
              </Text>

              <TouchableOpacity
                onPress={() => {
                  if (token) {
                    Clipboard.setString(String(token));
                    Toast.show({
                      type: 'success',
                      text1: 'Token copied!',
                      visibilityTime: 1000,
                    });
                  }
                }}
                style={tw`bg-[#01A33D] px-4 py-2 rounded-lg`}>
                <Text style={tw`text-white text-[14px] font-semibold`}>
                  Copy
                </Text>
              </TouchableOpacity>
            </View>
          )}
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
