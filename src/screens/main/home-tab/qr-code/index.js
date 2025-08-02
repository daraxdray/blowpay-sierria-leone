import {View, Text, ScrollView, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {styles} from './style';
import {ScreenView} from '../../../../global/wrappers';
import {BLACK, WHITE} from '../../../../global/theme';
import tw from 'twrnc';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {CustomButton} from '../../../../global/components';
import Scan from '../../../../components/payWithQr/Scan';
import QrCodeDetails from '../../../../components/payWithQr/QrCode';

const QrCode = ({navigation}) => {
  const [activeTab, setActiveTab] = useState('Scan');

  return (
    <ScreenView style={styles.container} light color={WHITE}>
      <View style={tw`flex-1`}>
        <ScrollView
          style={styles.viewContainer}
          contentContainerStyle={{paddingBottom: 100}}>
          <View>
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.btn}
                activeOpacity={0.65}
                onPress={() => navigation.goBack()}>
                <Ionicons name="chevron-back" size={13} color={BLACK} />
              </TouchableOpacity>
              <Text style={tw`text-gray-800 font-medium text-[18px]`}>
                Pay with QR Code
              </Text>
              <View style={tw`w-10 h-10 rounded-[10px]`} />
            </View>
          </View>

          {/* Content Based on Active Tab */}
          <View style={tw`mt-4`}>
            {activeTab === 'Scan' ? <Scan /> : <QrCodeDetails />}
          </View>
        </ScrollView>

        <View
          style={tw`flex-row justify-around items-center mx-5 mb-20 bg-[#F5F5F5] p-2 rounded-full`}>
          <TouchableOpacity
            style={[
              tw`flex-1  py-4 rounded-full items-center`,
              activeTab === 'Scan' ? tw`bg-[#FFFFFF]` : tw`bg-[#F5F5F5]`,
            ]}
            onPress={() => setActiveTab('Scan')}>
            <Text
              style={[
                tw`text-black`,
                activeTab === 'Scan' ? tw`text-[#1B1B1B]` : tw`text-[#9B9B9B]`,
                ,
              ]}>
              Scan
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              tw`flex-1  py-4 rounded-full items-center`,
              activeTab === 'QRCode' ? tw`bg-[#FFFFFF]` : tw`bg-[#F5F5F5]`,
            ]}
            onPress={() => setActiveTab('QRCode')}>
            <Text
              style={[
                tw`text-black`,
                activeTab === 'QRCode'
                  ? tw`text-[#1B1B1B]`
                  : tw`text-[#9B9B9B]`,
              ]}>
              My QR Code
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenView>
  );
};

export default QrCode;
