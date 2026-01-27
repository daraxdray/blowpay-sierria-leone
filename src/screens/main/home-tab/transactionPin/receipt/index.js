import {View, Text, ScrollView, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import {styles} from './style';
import {ScreenView} from '../../../../../global/wrappers';
import {BLACK, WHITE} from '../../../../../global/theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {CustomButton} from '../../../../../global/components';
import tw from 'twrnc';

const Receipt = props => {
  const navigation = props.navigation;
  const handleDownload = () => {
    navigation.navigate('bottom-tab');
  };
  return (
    <ScreenView style={styles.container} light color={WHITE}>
      <View style={tw`flex-1 justify-between`}>
        <ScrollView
          style={styles.viewContainer}
          contentContainerStyle={{paddingBottom: 100}}>
          <View style={tw`flex gap-10 mt-2`}>
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.btn}
                activeOpacity={0.65}
                onPress={() => navigation.goBack()}>
                <Ionicons name="chevron-back" size={13} color={BLACK} />
              </TouchableOpacity>
              <Text style={tw`text-gray-800 font-medium text-[20px]`}>
                Receipt
              </Text>

              <View style={tw`w-10 h-10 rounded-[10px]`} />
            </View>

            <View style={tw`flex-1 items-center justify-center`}>
              <View
                style={tw`bg-[#F5F5F5] w-[320px]  rounded-[24px] p-5 flex gap-8`}>
                <View style={tw`flex gap-2 items-center`}>
                  <Image
                    source={require('../../../../../../assets/icons/Avatar.png')}
                    style={{width: 80, height: 80}}
                  />
                  <Text style={tw`text-[#1B1B1B] font-bold text-[14px]`}>
                    Kevin Troot
                  </Text>
                  <Text style={tw`text-[#9B9B9B] font-normal text-[11px]`}>
                    854821402749
                  </Text>
                  <View
                    style={tw`bg-[#D6FFE1] p-2 rounded-md px-3  items-center justify-center `}>
                    <Text style={tw`text-[#2DA64F] font-bold text-[11px]`}>
                      Transfer Success
                    </Text>
                  </View>
                </View>
                <View style={tw`flex gap-6`}>
                  <View style={tw`flex flex-row justify-between`}>
                    <Text style={tw`text-[#9B9B9B] font-normal text-[14px]`}>
                      Transaction Number
                    </Text>
                    <Text style={tw`text-[#1B1B1B] font-bold text-[14px]`}>
                      #7634JSNF12
                    </Text>
                  </View>
                  <View style={tw`flex flex-row justify-between`}>
                    <Text style={tw`text-[#9B9B9B] font-normal text-[14px]`}>
                      Time
                    </Text>
                    <Text style={tw`text-[#1B1B1B] font-bold text-[14px]`}>
                      9:41 AM
                    </Text>
                  </View>
                  <View style={tw`flex flex-row justify-between`}>
                    <Text style={tw`text-[#9B9B9B] font-normal text-[14px]`}>
                      Money Sent
                    </Text>
                    <Text style={tw`text-[#1B1B1B] font-bold text-[14px]`}>
                      NGN522
                    </Text>
                  </View>
                  <View style={tw`flex flex-row justify-between`}>
                    <Text style={tw`text-[#9B9B9B] font-normal text-[14px]`}>
                      Transaction Fee
                    </Text>
                    <Text style={tw`text-[#1B1B1B] font-bold text-[14px]`}>
                      NGN2
                    </Text>
                  </View>
                  <View style={tw`flex flex-row justify-between`}>
                    <Text style={tw`text-[#9B9B9B] font-normal text-[14px]`}>
                      They Receive
                    </Text>
                    <Text style={tw`text-[#1B1B1B] font-bold text-[14px]`}>
                      NGN520
                    </Text>
                  </View>
                  <View style={tw`flex flex-row justify-between`}>
                    <Text style={tw`text-[#9B9B9B] font-normal text-[14px]`}>
                      Estimated Arrival
                    </Text>
                    <Text style={tw`text-[#1B1B1B] font-bold text-[14px]`}>
                      Sep 15, 2023
                    </Text>
                  </View>
                </View>
                <View style={tw`flex justify-center items-center gap-2`}>
                  <Text style={tw`text-[#9B9B9B] font-normal text-[14px]`}>
                    Have a problem with your transaction?
                  </Text>
                  <Text style={tw`text-[#FF114A] font-normal text-[14px]`}>
                    Tell us now
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
        <View style={tw`pb-5 px-3`}>
          <CustomButton
            onPress={handleDownload}
            style={styles.btn1}
            text={'Download Receipt'}
          />
        </View>
      </View>
    </ScreenView>
  );
};

export default Receipt;
