import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import React from 'react';
import tw from 'twrnc';
import Toast from 'react-native-toast-message';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {CustomButton} from '../../global/components';
import {BLACK} from '../../global/theme';
import {PanGestureHandler} from 'react-native-gesture-handler';
import {useGetVitualAcc} from '../../hooks/virtual.hook';
import Clipboard from '@react-native-clipboard/clipboard';
import AppConstant from '../../constants/data/appConstant';

const TopupModal = ({closeModal}) => {
  const {data} = useGetVitualAcc();
  const userData = data?.data || {};

  const copyToClipboard = text => {
    Clipboard.setString(text);
    Toast.show({
      text1: 'Copied',
      text2: 'Text has been copied to clipboard',
    });
  };

  const copyAccountInfo = () => {
    const accountInfo = `
      Bank Name: ${userData?.bankName}
      Account Name: ${userData?.user?.lastName} ${userData?.user?.firstName}
      Account Number: ${userData?.accountNumber}
    `;
    Clipboard.setString(accountInfo);
    Toast.show({
      text1: 'Copied',
      text2: 'Account information has been copied to clipboard',
    });
  };
  const handleSwipeDown = ({nativeEvent}) => {
    if (nativeEvent.translationY > 50) {
      closeModal();
    }
  };

  return (
    <PanGestureHandler onGestureEvent={handleSwipeDown}>
      <View
        style={tw` bg-white p-5 rounded-t-[20px] w-19/20 self-center rounded-b-10 mb-5 gap-3 justify-between`}>
        <View>
          <View style={tw` flex flex-row items-center justify-between`}>
            <TouchableOpacity
              style={tw`p-1 bg-[#F3F4F6] items-center justify-center rounded-full w-[30px] h-[30px]`}
              activeOpacity={0.65}
              onPress={closeModal}>
              <Ionicons name="chevron-back" size={13} color={BLACK} />
            </TouchableOpacity>
            <View style={tw`w-20 h-2  rounded-full`} />
            <View />
          </View>

          <View style={tw`mt-4 gap-3`}>
            <View style={tw`flex items-center`}>
              <Text style={tw`text-[#101828] font-medium text-[19px]`}>
                My {Platform.OS == 'ios' || AppConstant.isAmazonStore ? "Blowpay" : "BillsByBlowmoney"} Account
              </Text>
            </View>

            <Text style={tw`text-[#667085] font-normal text-[14px]`}>
              Make a transfer to these accounts below and your wallet will be
              funded immediately.
            </Text>
          </View>

          <View style={tw`mt-8 gap-2`}>
            <Text style={tw`text-[#000000] font-medium text-[14px]`}>
              Account Details
            </Text>
            <View
              style={tw`border-[0.5px] border-[#D0D5DD] p-2 rounded-[8px] gap-3`}>
              {/* Bank Name Section */}
              <View
                style={tw`border-[0.5px] bg-[#F8F8FA] border-[#D0D5DD] p-3 py-6 rounded-[8px] gap-6`}>
                <View style={tw`flex flex-row items-center justify-between`}>
                  <View>
                    <Text style={tw`text-[#A5A5A5] font-normal text-[12px]`}>
                      Bank Name
                    </Text>
                    <Text style={tw`text-[#000000] font-medium text-[15px]`}>
                      {userData?.bankName}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => copyToClipboard(userData?.bankName)}>
                    <Image
                      source={require('../../../assets/icons/copy.png')}
                      style={{width: 20, height: 20}}
                    />
                  </TouchableOpacity>
                </View>

                {/* Account Name Section */}
                <View style={tw`flex flex-row items-center justify-between`}>
                  <View>
                    <Text style={tw`text-[#A5A5A5] font-normal text-[12px]`}>
                      Account Name:
                    </Text>
                    <Text style={tw`text-[#000000] font-medium text-[15px]`}>
                      {userData?.user?.lastName} {userData?.user?.firstName}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() =>
                      copyToClipboard(
                        `${userData?.user?.lastName} ${userData?.user?.firstName}`,
                      )
                    }>
                    <Image
                      source={require('../../../assets/icons/copy.png')}
                      style={{width: 20, height: 20}}
                    />
                  </TouchableOpacity>
                </View>

                {/* Account Number Section */}
                <View style={tw`flex flex-row items-center justify-between`}>
                  <View>
                    <Text style={tw`text-[#A5A5A5] font-normal text-[12px]`}>
                      Account Number
                    </Text>
                    <Text style={tw`text-[#000000] font-medium text-[15px]`}>
                      {userData?.accountNumber}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => copyToClipboard(userData?.accountNumber)}>
                    <Image
                      source={require('../../../assets/icons/copy.png')}
                      style={{width: 20, height: 20}}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* QR Code Section
              <View
                style={tw`border-[0.5px] bg-[#F8F8FA] border-[#D0D5DD] p-3 py-6 rounded-[8px] gap-6`}>
                <View style={tw`flex gap-3`}>
                  <View style={tw`gap-1`}>
                    <Text style={tw`text-[#000000] font-semibold text-[15px]`}>
                      Scan BarCode
                    </Text>
                    <Text style={tw`text-[#A5A5A5] font-medium text-[12px]`}>
                      This is a single-use code for your use only. Get a new
                      code each time you want to Top-up
                    </Text>
                  </View>
                  <View style={tw`flex items-center justify-center`}>
                    <Image
                      source={require('../../../assets/icons/qr-code.png')}
                      style={{width: 70, height: 70}}
                    />
                  </View>
                </View>
              </View> */}
            </View>
          </View>
        </View>

        {/* Copy Account Info Button */}
        <View style={tw`pb-5`}>
          <CustomButton
            onPress={copyAccountInfo}
            text={'Copy Account Info'}
            style={tw`bg-black`}
            icon={require('../../../assets/icons/copy.png')}
          />
        </View>
      </View>
    </PanGestureHandler>
  );
};

export default TopupModal;
