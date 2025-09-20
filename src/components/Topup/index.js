import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  Platform,
} from 'react-native';
import React, {useState} from 'react';
import tw from 'twrnc';
import Toast from 'react-native-toast-message';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {CustomButton} from '../../global/components';
import {BLACK} from '../../global/theme';
import {PanGestureHandler} from 'react-native-gesture-handler';
import {useGetUser} from '../../hooks/user.hook';
import Clipboard from '@react-native-clipboard/clipboard';
import {useFundWallet} from '../../hooks/billing.hook';
import AppConstant from '../../constants/data/appConstant';

const TopupModal = ({closeModal, accountData}) => {
  const {data: countryData} = useGetUser();
  const {mutate: fundWallet, data: fundData, isPending} = useFundWallet();
  const getCountry = countryData?.data?.country || {};
  const [amount, setAmount] = useState('');
  const [step, setStep] = useState('input');
  const userData = accountData || {};

  const handleTopup = () => {
    if (!amount || parseInt(amount, 10) < 10000) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Amount',
        text2: 'Please enter at least 10,000 SLL',
      });
      return;
    }

    fundWallet(
      {amount: String(amount)},
      {
        onSuccess: () => {
          setStep('details');
        },
      },
    );
  };
  const copyAccountInfo = () => {
    if (!userData) {
      return;
    }

    const accountInfo = `
Bank Name: ${userData?.bankName || 'N/A'}
Account Name: ${userData?.user?.lastName || ''} ${
      userData?.user?.firstName || ''
    }
Account Number: ${userData?.accountNumber || 'N/A'}
  `.trim();

    Clipboard.setString(accountInfo);

    Toast.show({
      text1: 'Copied',
      text2: 'Account information has been copied to clipboard',
    });
  };
  const copyToClipboard = text => {
    Clipboard.setString(text);
    Toast.show({
      text1: 'Copied',
      text2: 'Text copied to clipboard',
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

        {getCountry === 'Sierra Leone' ? (
          step === 'input' ? (
            <View style={tw`mt-6`}>
              <Text
                style={tw`text-[#101828] font-semibold text-[20px] text-center`}>
                Top-up Your Wallet
              </Text>
              <Text style={tw`text-[#667085] text-center mt-2 text-[14px]`}>
                Enter the amount you want to fund. You'll receive bank details
                to complete the transfer.
              </Text>

              <Text style={tw`text-[#344054] font-medium text-[14px] mt-6`}>
                Amount (SLL)
              </Text>
              <TextInput
                style={tw`border border-[#D0D5DD] rounded-lg mt-2 p-3 text-[16px]`}
                placeholder="e.g. 50000"
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
              />
              <Text style={tw`text-[#98A2B3] text-[12px] mt-2`}>
                Minimum top-up is 10,000 SLL
              </Text>

              <CustomButton
                onPress={handleTopup}
                text={isPending ? 'Processing...' : 'Proceed to Get Account'}
                style={tw`bg-black mt-6`}
                disabled={isPending}
              />
            </View>
          ) : (
            <View style={tw`mt-6`}>
              <Text
                style={tw`text-[#101828] font-semibold text-[20px] text-center`}>
                Complete Your Transfer
              </Text>

              <Text style={tw`text-[#667085] text-center mt-2 text-[14px]`}>
                Send exactly {fundData?.amount} {fundData?.currency} using the
                USSD code below to fund your wallet.
              </Text>

              <View
                style={tw`mt-6 border border-[#D0D5DD] rounded-lg p-4 gap-4`}>
                <DetailRow
                  label="Amount"
                  value={`${fundData?.data?.amount} ${fundData?.data?.currency}`}
                  onCopy={() =>
                    copyToClipboard(
                      `${fundData?.data?.amount} ${fundData?.data?.currency}`,
                    )
                  }
                />
                <DetailRow
                  label="Merchant Code"
                  value={fundData?.data?.merchant_code}
                  onCopy={() => copyToClipboard(fundData?.data?.merchant_code)}
                />
                <DetailRow
                  label="Service"
                  value={fundData?.data?.service_slug?.replace(/_/g, ' ')}
                  onCopy={() =>
                    copyToClipboard(
                      fundData?.data?.service_slug?.replace(/_/g, ' '),
                    )
                  }
                />
                <DetailRow
                  label="Status"
                  value={fundData?.data?.status}
                  onCopy={() => copyToClipboard(fundData?.data?.status)}
                />
                <DetailRow
                  label="USSD Code"
                  value={fundData?.data?.ussd_code}
                  onCopy={() => copyToClipboard(fundData?.data?.ussd_code)}
                />
                {/* <DetailRow
                  label="Inflow ID"
                  value={fundData?.data?.inflow_id}
                  onCopy={() => copyToClipboard(fundData?.data?.inflow_id)}
                /> */}
                <DetailRow
                  label="Expires At"
                  value={
                    fundData?.data?.expires_at
                      ? new Date(fundData.data.expires_at).toLocaleString(
                          'en-GB',
                          {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          },
                        )
                      : '--'
                  }
                  onCopy={() => copyToClipboard(fundData?.data?.expires_at)}
                />
              </View>
            </View>
          )
        ) : (
          <View>
            <View style={tw`mt-4 gap-3`}>
              <View style={tw`flex items-center`}>
                <Text style={tw`text-[#101828] font-medium text-[19px]`}>
                  My{' '}
                  {Platform.OS === 'ios' || AppConstant.isAmazonStore
                    ? 'Blowpay'
                    : 'BillsByBlowmoney'}{' '}
                  Account
                </Text>
              </View>
              <Text style={tw`text-[#667085] font-normal text-[14px]`}>
                Make a transfer to these accounts below and your wallet will be
                funded immediately.
              </Text>
            </View>

            {/* Account Details */}
            <View style={tw`mt-8 gap-2`}>
              <Text style={tw`text-[#000000] font-medium text-[14px]`}>
                Account Details
              </Text>

              <View
                style={tw`border-[0.5px] border-[#D0D5DD] p-2 rounded-[8px] gap-3`}>
                <View
                  style={tw`border-[0.5px] bg-[#F8F8FA] border-[#D0D5DD] p-3 py-6 rounded-[8px] gap-6`}>
                  {/* Bank Name */}
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

                  {/* Account Name */}
                  <View style={tw`flex flex-row items-center justify-between`}>
                    <View>
                      <Text style={tw`text-[#A5A5A5] font-normal text-[12px]`}>
                        Account Name
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

                  {/* Account Number */}
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
              </View>
            </View>

            {/* Copy Account Info Button */}
            <View style={tw`pb-5`}>
              <CustomButton
                onPress={copyAccountInfo}
                text="Copy Account Info"
                style={tw`bg-black`}
                icon={require('../../../assets/icons/copy.png')}
              />
            </View>
          </View>
        )}
      </View>
    </PanGestureHandler>
  );
};

const DetailRow = ({label, value, onCopy}) => (
  <View style={tw`flex-row items-center justify-between`}>
    <View>
      <Text style={tw`text-[#A5A5A5] text-[12px]`}>{label}</Text>
      <Text style={tw`text-[#000] font-medium text-[15px]`}>{value}</Text>
    </View>
    <TouchableOpacity onPress={onCopy}>
      <Image
        source={require('../../../assets/icons/copy.png')}
        style={{width: 20, height: 20}}
      />
    </TouchableOpacity>
  </View>
);

export default TopupModal;
