/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  ScrollView,
} from 'react-native';
import React, {useState, useMemo} from 'react';
import tw from 'twrnc';
import Toast from 'react-native-toast-message';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {BLACK} from '../../global/theme';
import {PanGestureHandler} from 'react-native-gesture-handler';
import Clipboard from '@react-native-clipboard/clipboard';
import AppConstant from '../../constants/data/appConstant';
import SierraLeoneTopup from '../SierraLeone/SierraLeoneTopup';

const TopupModal = ({closeModal, accountData, country}) => {
  const [setStep] = useState('input');

  const sortedAccounts = useMemo(() => {
    if (!Array.isArray(accountData)) {
      return [];
    }
    return [...accountData].sort((a, b) =>
      a.source === 'cashonrails' ? -1 : b.source === 'cashonrails' ? 1 : 0,
    );
  }, [accountData]);

  const copyToClipboard = text => {
    Clipboard.setString(text);
    Toast.show({
      text1: 'Copied',
      text2: 'Account number copied to clipboard',
    });
  };

  const handleSwipeDown = ({nativeEvent}) => {
    if (nativeEvent.translationY > 50) {
      closeModal();
    }
  };

  return (
    <PanGestureHandler onGestureEvent={handleSwipeDown}>
      <View style={tw`bg-white p-5 rounded-t-[20px] w-19/20 self-center mb-5`}>
        {/* Header */}
        <View style={tw`flex flex-row items-center justify-between`}>
          <TouchableOpacity
            style={tw`p-1 bg-[#F3F4F6] items-center justify-center rounded-full w-[30px] h-[30px]`}
            onPress={closeModal}>
            <Ionicons name="chevron-back" size={13} color={BLACK} />
          </TouchableOpacity>
          <View style={tw`w-20 h-2 rounded-full`} />
          <View />
        </View>

        {country === 'Sierra Leone' ? (
          <SierraLeoneTopup onSuccess={data => setStep('details')} />
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={tw`mt-4 gap-3`}>
              <Text
                style={tw`text-center text-[#101828] font-semibold text-[19px]`}>
                My{' '}
                {Platform.OS === 'ios' || AppConstant.isAmazonStore
                  ? 'Blowpay'
                  : 'BillsByBlowmoney'}{' '}
                Accounts
              </Text>
              <Text
                style={tw`text-[#667085] font-normal text-center text-[13px]`}>
                Transfer to any of the accounts below — your wallet will
                auto-update 💸
              </Text>
            </View>

            {sortedAccounts.length > 0 ? (
              sortedAccounts.map((account, index) => (
                <View
                  key={account._id || index}
                  style={tw`mt-6 p-4 rounded-2xl bg-[#F9FAFB] border border-[#E5E7EB] shadow-sm`}>
                  <Text style={tw`text-[#000] font-semibold text-[15px] mb-3`}>
                    {account.source === 'cashonrails'
                      ? '💠 CashOnRails Account'
                      : `🏦 ${account.source} Account`}
                  </Text>
                  <View style={tw`mb-3`}>
                    <Text style={tw`text-[#A5A5A5] text-[12px]`}>
                      Bank Name
                    </Text>
                    <Text style={tw`text-[#000] font-medium text-[15px]`}>
                      {account?.bankName}
                    </Text>
                  </View>
                  <View style={tw`mb-3`}>
                    <Text style={tw`text-[#A5A5A5] text-[12px]`}>
                      Account Name
                    </Text>
                    <Text style={tw`text-[#000] font-medium text-[15px]`}>
                      {account?.user?.lastName} {account?.user?.firstName}
                    </Text>
                  </View>
                  <View style={tw`flex-row items-center justify-between mb-3`}>
                    <View>
                      <Text style={tw`text-[#A5A5A5] text-[12px]`}>
                        Account Number
                      </Text>
                      <Text style={tw`text-[#000] font-medium text-[15px]`}>
                        {account?.accountNumber}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={tw`bg-[#EFEFEF] p-2 rounded-full`}
                      onPress={() => copyToClipboard(account?.accountNumber)}>
                      <Image
                        source={require('../../../assets/icons/copy.png')}
                        style={{width: 18, height: 18, tintColor: '#6B7280'}}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            ) : (
              <Text style={tw`text-[#A5A5A5] text-center mt-8`}>
                No account found 😕
              </Text>
            )}
          </ScrollView>
        )}
      </View>
    </PanGestureHandler>
  );
};

export default TopupModal;
