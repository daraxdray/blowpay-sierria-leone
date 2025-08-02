import React, {useState} from 'react';
import {View, Text, ScrollView, Image, TouchableOpacity} from 'react-native';
import {styles} from './style';
import {ScreenView} from '../../../../global/wrappers';
import {WHITE} from '../../../../global/theme';
import Header from '../../../../global/components/Header';
import tw from 'twrnc';
import Round from '../../../../components/bookFlight/Round';
import Oneway from '../../../../components/bookFlight/Oneway';
import {CustomButton} from '../../../../global/components';

const BookFlight = props => {
  const navigation = props.navigation;
  const [activeTab, setActiveTab] = useState('Scan');
  const handleNext = () => {
    navigation.navigate('SearchResult');
  };

  return (
    <ScreenView style={styles.container} light color={WHITE}>
      <View style={tw`px-3 pt-2`}>
        <Header
          navigation={() => {
            navigation.goBack();
          }}
          ImageSource={require('../../../../../assets/icons/filter.png')}
          title="Book Flight"
          showIcon={true}
          iconName="add-circle"
          imagePress={() => console.log('Second Icon Pressed')}
        />
      </View>
      <ScrollView style={styles.viewContainer}>
        <View style={styles.view1}>
          <View style={tw`px-3`}>
            <View
              style={tw`flex-row justify-around items-center mx-5 mb-5 bg-[#F5F5F5] rounded-full`}>
              <TouchableOpacity
                style={[
                  tw`flex-1  py-4 rounded-full items-center`,
                  activeTab === 'Scan' ? tw`bg-[#FF114A]` : tw`bg-[#F5F5F5]`,
                ]}
                onPress={() => setActiveTab('Scan')}>
                <Text
                  style={[
                    tw`text-black`,
                    activeTab === 'Scan'
                      ? tw`text-[#ffff]`
                      : tw`text-[#9B9B9B]`,
                    ,
                  ]}>
                  One way
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  tw`flex-1  py-4 rounded-full items-center`,
                  activeTab === 'QRCode' ? tw`bg-[#FF114A]` : tw`bg-[#F5F5F5]`,
                ]}
                onPress={() => setActiveTab('QRCode')}>
                <Text
                  style={[
                    tw`text-black`,
                    activeTab === 'QRCode'
                      ? tw`text-[#ffff]`
                      : tw`text-[#9B9B9B]`,
                  ]}>
                  Round
                </Text>
              </TouchableOpacity>
            </View>

            <View style={tw`flex-1`}>
              {activeTab === 'Scan' ? <Oneway /> : <Round />}
            </View>
            <View style={tw`pt-8 w-full`}>
              <CustomButton
                onPress={handleNext}
                style={styles.btn1}
                text={'Search'}
              />
            </View>
            <View style={tw`mt-5 mb-5 px-3 items-center  w-full`}>
              <Image
                source={require('../../../../../assets/images/airtimeBanner.png')}
                // style={}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenView>
  );
};

export default BookFlight;
