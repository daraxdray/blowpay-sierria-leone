import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  ImageBackground,
} from 'react-native';
import {ScreenView} from '../../../../../global/wrappers';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {WHITE} from '../../../../../global/theme';
import {styles} from './style';
import tw from 'twrnc';
import Header from '../../../../../global/components/Header';
import {CustomButton} from '../../../../../global/components';

const BoardingPass = props => {
  const navigation = props.navigation;
  const handleNext = () => {
    navigation.navigate('bottom-tab');
  };
  return (
    <ScreenView style={styles.container} light color={WHITE}>
      <Header
        navigation={() => navigation.goBack()}
        ImageSource={require('../../../../../../assets/icons/filter.png')}
        title="Boarding Pass"
        showIcon={true}
        iconName="add-circle"
        imagePress={() => console.log('Second Icon Pressed')}
      />
      <ScrollView style={styles.viewContainer}>
        <View style={styles.view1}>
          <View
            style={tw`h-[566px] w-[295px] bg-white rounded-lg shadow-md p-4 gap-6 mt-10`}>
            <View style={tw` flex flex-row justify-between items-end`}>
              <View style={tw`flex items-center gap-1`}>
                <Image
                  source={require('../../../../../../assets/icons/canada.png')}
                  style={tw`w-[18px] h-[18px]`}
                />
                <Text style={tw`text-gray-900 font-bold text-[11px]`}>
                  Air Canada
                </Text>
              </View>
              <Text style={tw`text-gray-900 font-normal text-[13px]`}>
                December 16h, 2022
              </Text>
            </View>
            <View
              style={tw` flex flex-row justify-between items-end border-b border-b-gray-300 pb-5`}>
              <View style={tw`flex items-start gap-1`}>
                <Text style={tw`text-gray-900 font-bold text-[15px]`}>
                  07h05
                </Text>
                <Text style={tw`text-gray-600 font-medium text-[13px]`}>
                  YUL
                </Text>
              </View>
              <View style={tw`flex items-center gap-1`}>
                <Ionicons name="airplane" size={18} />
                <Text style={tw`text-gray-600 font-normal text-[11px]`}>
                  13h00
                </Text>
              </View>
              <View style={tw`flex items-end gap-1`}>
                <Text style={tw`text-gray-900 font-bold text-[15px]`}>
                  20h05
                </Text>
                <Text style={tw`text-gray-600 font-medium text-[13px]`}>
                  NRT
                </Text>
              </View>
            </View>
            <View
              style={tw` flex flex-row justify-between items-end border-b border-b-gray-300 pb-5`}>
              <View style={tw`flex items-start gap-1`}>
                <Text style={tw`text-gray-600 font-medium text-[13px]`}>
                  Economy
                </Text>
                <Text style={tw`text-gray-900 font-medium text-[11px]`}>
                  Class
                </Text>
              </View>
              <View style={tw`flex items-center gap-1`}>
                <Text style={tw`text-gray-600 font-medium text-[13px]`}>8</Text>
                <Text style={tw`text-gray-900 font-medium text-[11px]`}>
                  Gate
                </Text>
              </View>
              <View style={tw`flex items-center gap-1`}>
                <Text style={tw`text-gray-600 font-medium text-[13px]`}>3</Text>
                <Text style={tw`text-gray-900 font-medium text-[11px]`}>
                  Terminal
                </Text>
              </View>
              <View style={tw`flex items-end gap-1`}>
                <Text style={tw`text-gray-600 font-medium text-[13px]`}>
                  AC006
                </Text>
                <Text style={tw`text-black font-medium text-[11px]`}>
                  Flight
                </Text>
              </View>
            </View>
            <View
              style={[
                tw` flex flex-row justify-between items-start border-b pb-5 border-b-gray-300`,
              ]}>
              <View style={tw`flex flex-row items-center gap-2`}>
                <Image
                  source={require('../../../../../../assets/images/img2.png')}
                  style={tw`w-12 h-12`}
                />
                <View style={tw`flex items-start gap-1`}>
                  <Text style={tw`text-gray-900 font-medium text-[15px]`}>
                    Catherine Dion
                  </Text>
                  <Text style={tw`text-gray-600 font-medium text-[13px]`}>
                    24 years, Female
                  </Text>
                </View>
              </View>

              <View style={tw`flex  flex-row items-center gap-1`}>
                <Image
                  source={require('../../../../../../assets/icons/Sofa.png')}
                  style={tw`w-[30px] h-[30px]`}
                />
                <Text style={tw`text-gray-600 font-normal text-[15px]`}>
                  29A
                </Text>
              </View>
            </View>
            <View style={tw`flex items-center justify-center`}>
              <Image
                source={require('../../../../../../assets/icons/qr-code.png')}
                style={tw`w-[200px] h-[200px]`}
              />
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={tw`pb-8 w-full`}>
        <CustomButton
          onPress={handleNext}
          style={styles.btn1}
          text={'Download'}
        />
      </View>
    </ScreenView>
  );
};

export default BoardingPass;
