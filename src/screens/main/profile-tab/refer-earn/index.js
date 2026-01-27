import React from 'react';
import {View, ScrollView, Text, TouchableOpacity} from 'react-native';
import {styles} from './style';
import {ScreenView} from '../../../../global/wrappers';
import {WHITE} from '../../../../global/theme';
import Header from '../../../../global/components/Header';
import tw from 'twrnc';
import {CustomButton} from '../../../../global/components';

const Refer = props => {
  const navigation = props.navigation;
  const handleNext = () => {
    navigation.navigate('bottom-tab');
  };
  return (
    <ScreenView style={styles.container} light color={WHITE}>
      <View style={tw`px-3 pt-2`}>
        <Header
          navigation={() => {
            navigation.goBack();
          }}
          ImageSource={require('../../../../../assets/icons/filter.png')}
          title="Referral"
          showIcon={true}
          iconName="add-circle"
          imagePress={() => console.log('Second Icon Pressed')}
        />
      </View>
      <ScrollView
        style={styles.viewContainer}
        showsVerticalScrollIndicator={false}>
        <View style={styles.view1}>
          <Text style={tw`text-[#000000] font-medium text-[20px] w-[50%]`}>
            Refer friends, earn rewards
          </Text>
          <Text style={tw`text-[#A5A5A5] font-normal text-[14px]`}>
            Blow Pay’s better with friends. The more people you refer using your
            link, the more you earn. You’ll both get money when they sign up and
            make a card payment. we can stop or change this at any time.
          </Text>
          <View style={tw` w-full self-center rounded-10 mb-5 gap-3`}>
            <View style={tw`gap-3 p-2 pt-4`}>
              <Text style={tw`text-[#000000] font-medium text-[14px]`}>
                Summary
              </Text>

              <View
                style={tw`border border-gray-200 py-4 px-2 rounded-[8px] gap-6`}>
                <TouchableOpacity
                  style={tw`bg-[#F8F8FA] rounded-[10px] px-3 py-4 flex w-full items-center flex-row justify-between border border-[#D0D5DD]`}>
                  <Text style={tw`text-[#000000] font-normal text-[14px]`}>
                    Referrals completed
                  </Text>
                  <Text style={tw`text-[#000000] font-medium text-[15px]`}>
                    0
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={tw`bg-[#F8F8FA] rounded-[10px] px-3 py-4 flex w-full items-center flex-row justify-between border border-[#D0D5DD]`}>
                  <Text style={tw`text-[#000000] font-normal text-[14px]`}>
                    Total earned
                  </Text>
                  <Text style={tw`text-[#000000] font-medium text-[15px]`}>
                    0.00
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={tw`pb-5 w-full px-3`}>
        <CustomButton
          onPress={handleNext}
          style={styles.btn1}
          text={'Share my Link'}
        />
      </View>
    </ScreenView>
  );
};

export default Refer;
