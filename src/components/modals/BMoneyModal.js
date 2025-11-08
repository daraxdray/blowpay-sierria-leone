import {View, Text, TouchableOpacity, Linking, Platform} from 'react-native';
import React, {useEffect, useState} from 'react';
import tw from 'twrnc';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {PanGestureHandler} from 'react-native-gesture-handler';
import AppleSVG from '../../../assets/svgs/Apple.svg';
import PlaystoreSVG from '../../../assets/svgs/Playstore.svg';
const Bmoney = ({closeModal}) => {
  const [isInstalled, setIsInstalled] = useState(false);

  const handleSwipeDown = ({nativeEvent}) => {
    if (nativeEvent.translationY > 50) {
      closeModal();
    }
  };
  const openStore = () => {
    const appStoreUrl = 'https://apps.apple.com/app/id1234567890';
    const playStoreUrl =
      'https://play.google.com/store/apps/details?id=com.rdx.BillsByBlowmoney';

    const url = Platform.OS === 'ios' ? appStoreUrl : playStoreUrl;
    Linking.openURL(url).catch(err => console.error('An error occurred', err));
  };

  const [show, setShowMessage] = useState(false);

  const isAppInstalled = async () => {
    let url = '';
    if (Platform.OS === 'ios') {
      url = 'blowmoney://bottom-tab'; // Custom deep link
    } else {
      url = 'blowmoney://blowmoney'; // Custom deep link
    }
    try {
      // Try opening the app directly
      const can = await Linking.canOpenURL(url);
      console.log('CAN', can, url);

      setIsInstalled(can);
    } catch (error) {
      console.log('CAN', error);
      return false;
    }
  };

  const openApp = async () => {
    let url = '';
    if (Platform.OS === 'ios') {
      url = 'blowmoney://bottom-tab'; // Custom deep link
    } else {
      url = 'blowmoney://blowmoney'; // Custom deep link
    }
    if (!isInstalled) {
      setShowMessage(true);
      return;
    }

    Linking.openURL(url);
  };

  const openPlaystore = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('https://apps.apple.com/app/BillsByBlowmoney');
    } else {
      Linking.openURL(
        'https://play.google.com/store/apps/details?id=com.BillsByBlowmoney',
      ); // Replace with actual app URL on Playstore
    }
  };

  useEffect(() => {
    isAppInstalled();
  }, []);

  return (
    <PanGestureHandler onGestureEvent={handleSwipeDown}>
      <View style={tw`bg-white p-5 w-19/20 self-center rounded-10 mb-5 gap-3`}>
        <View style={tw`gap-5 p-2 pt-4`}>
          <View style={tw`flex flex-row items-center justify-between`}>
            <TouchableOpacity
              style={tw`p-1 bg-[#F3F4F6] items-center justify-center rounded-full w-[30px] h-[30px]`}
              activeOpacity={0.65}
              onPress={closeModal}>
              <Ionicons name="chevron-back" size={13} color="#000" />
            </TouchableOpacity>
            <Text style={tw`text-[#000000] font-medium text-[14px]`}>
              Blow Money
            </Text>

            <View style={tw`w-10`} />
          </View>

          <TouchableOpacity
            onPress={() => {
              openStore();
              closeModal();
            }}
            style={tw`bg-[#F8F8FA] rounded-[10px] px-3 py-4 flex w-full items-center gap-1  border border-[#D0D5DD]`}>
            <View style={tw`flex gap-1 w-full`}>
              <Text style={tw`text-[#000000] font-medium text-[14px]`}>
                Download the BlowMoney App Today!
              </Text>
              <Text style={tw`text-gray-700 font-normal text-[12px]`}>
                Get started with easy and convenient financial management by
                downloading the BlowMoney App from your preferred app store:
              </Text>
              <Text style={tw`text-gray-700 font-normal text-[12px]`}>
                - <Text style={tw`font-semibold`}>For Android users:</Text>
                Visit the Google Play Store.
              </Text>
              <Text style={tw`text-gray-700 font-normal text-[12px]`}>
                - <Text style={tw`font-semibold`}>For iOS users:</Text> Head to
                the Apple App Store.
              </Text>
              <Text style={tw`text-gray-700 font-normal text-[12px]`}>
                Experience seamless transactions, manage your finances on the
                go, and enjoy exclusive features designed just for you!
              </Text>
            </View>
          </TouchableOpacity>

          <View style={tw` pb-4 px-2 rounded-[8px] gap-4`}>
            {isInstalled && (
              <TouchableOpacity
                onPress={() => {
                  openApp();
                }}
                style={tw`bg-[#FF114A] rounded-[16px] px-3 py-3 flex w-full items-center flex-row justify-center `}>
                <Text style={tw`text-white font-medium text-[14px]`}>
                  Go to BlowMoney
                </Text>
              </TouchableOpacity>
            )}

            {show && (
              <View style={tw`bg-yellow-100 p-3 rounded`}>
                <Text style={tw`text-yellow-800 text-[13px]`}>
                  Please download the app by clicking the button below.
                </Text>
              </View>
            )}
            {!isInstalled && (
              <TouchableOpacity
                style={[
                  tw`p-2 my-2 rounded items-center flex-row gap-2 justify-center rounded-[15px] bg-[#EDEDEF]`,
                ]}
                onPress={openPlaystore}>
                <PlaystoreSVG />
                <AppleSVG />
                <Text style={tw`text-[#000000] text-[13px] font-medium`}>
                  Download App
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </PanGestureHandler>
  );
};

export default Bmoney;
