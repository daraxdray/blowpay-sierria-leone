import React, {useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import tw from 'twrnc';
import * as Clipboard from '@react-native-clipboard/clipboard';
import {CustomButton} from '../../global/components';
import NumberInput from '../airtime/NumberInput';
import {formatAmount, unformatAmount} from '../../utils/format';
import {useFundWallet} from '../../hooks/billing.hook';
import Toast from 'react-native-toast-message';
import Amount from '../../components/airtime/Amount';

const DetailRow = ({label, value, onCopy}) => (
  <View
    style={tw`flex-row justify-between items-center border-b border-gray-200 pb-2 mb-2`}>
    <View>
      <Text style={tw`text-gray-500 text-sm`}>{label}</Text>
      <Text style={tw`text-gray-900 font-semibold mt-1`}>{value || '--'}</Text>
    </View>
    {onCopy && (
      <TouchableOpacity
        style={tw`px-3 py-1 bg-gray-100 rounded`}
        onPress={onCopy}>
        <Text style={tw`text-blue-500 text-sm font-medium`}>Copy</Text>
      </TouchableOpacity>
    )}
  </View>
);

const SierraLeoneTopup = ({onSuccess}) => {
  const {mutate: fundWallet, isPending} = useFundWallet();

  const [selectedMode, setSelectedMode] = useState('');
  const [amount, setAmount] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [responseData, setResponseData] = useState(null);
  const rawValue = unformatAmount(amount);

  const handleAmountChange = val => {
    const raw = val.replace(/[^0-9]/g, '');
    setAmount(formatAmount(raw));
  };

  const copyToClipboard = async text => {
    if (!text) {
      return;
    }
    await Clipboard.setStringAsync(String(text));
    Toast.show({type: 'success', text1: 'Copied', text2: `${text}`});
  };

  const handleSubmit = () => {
    if (selectedMode === 'other' && !phoneNumber) {
      Toast.show({
        type: 'error',
        text1: 'Phone Number Required',
        text2: 'Enter recipient’s phone number',
      });
      return;
    }

    const payload = {
      amount: parseInt(rawValue, 10),
      currency: 'SLE',
      ...(selectedMode === 'other' && {phoneNumber}),
    };

    fundWallet(payload, {
      onSuccess: res => {
        setResponseData(res.data);
        onSuccess?.(res);
      },
      onError: err => {
        console.log('Top-up error:', err);
      },
    });
  };

  const resetForm = () => {
    setSelectedMode('');
    setAmount('');
    setPhoneNumber('');
    setResponseData(null);
  };

  if (responseData) {
    return (
      <View style={tw`mt-6`}>
        <Text style={tw`text-[#101828] font-semibold text-[20px] text-center`}>
          Complete Your Transfer
        </Text>
        <Text style={tw`text-[#667085] text-center mt-2 text-[14px]`}>
          Send exactly {responseData?.amount} {responseData?.currency} using the
          USSD code below to fund your wallet.
        </Text>

        <View style={tw`mt-6 border border-[#D0D5DD] rounded-lg p-4`}>
          <DetailRow
            label="Amount"
            value={`${responseData?.amount} ${responseData?.currency}`}
          />
          <DetailRow
            label="Merchant Code"
            value={responseData?.merchant_code}
          />
          <DetailRow
            label="Service"
            value={responseData?.service_slug?.replace(/_/g, ' ')}
          />
          <DetailRow label="Status" value={responseData?.status} />
          <DetailRow
            label="USSD Code"
            value={responseData?.ussd_code}
            onCopy={() => copyToClipboard(responseData?.ussd_code)}
          />
          <DetailRow
            label="Expires At"
            value={
              responseData?.expires_at
                ? new Date(responseData.expires_at).toLocaleString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : '--'
            }
          />
        </View>
      </View>
    );
  }
  return (
    <View style={tw`mt-4`}>
      <Text style={tw`text-xl font-bold text-center`}>Top-up Wallet</Text>
      <Text style={tw`text-gray-500 text-center mt-1`}>
        Choose how you’d like to fund
      </Text>

      {!selectedMode ? (
        <View style={tw`flex-row justify-center gap-3 mt-6`}>
          {[
            {
              key: 'self',
              icon: '👤',
              title: 'Top-up for Self',
              desc: 'Add money to your wallet',
              bg: 'bg-blue-100',
            },
            {
              key: 'other',
              icon: '👥',
              title: 'Receive from Other',
              desc: 'Let someone else top up',
              bg: 'bg-green-100',
            },
          ].map(opt => (
            <TouchableOpacity
              key={opt.key}
              style={tw`flex-1 bg-gray-100 border border-gray-200 rounded-lg p-4 items-center shadow-sm active:bg-gray-200`}
              onPress={() => setSelectedMode(opt.key)}>
              <View
                style={tw`w-10 h-10 ${opt.bg} rounded-full items-center justify-center mb-2`}>
                <Text style={tw`text-lg`}>{opt.icon}</Text>
              </View>
              <Text style={tw`font-semibold text-gray-800 text-sm`}>
                {opt.title}
              </Text>
              <Text style={tw`text-gray-500 text-xs mt-1 text-center`}>
                {opt.desc}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <View style={tw`mt-4`}>
          <TouchableOpacity onPress={resetForm} style={tw`self-end mb-2`}>
            <Text style={tw`text-red-500 text-sm`}>Change option</Text>
          </TouchableOpacity>

          <View
            style={tw`bg-white border border-gray-200 rounded-lg p-4 shadow-sm`}>
            {selectedMode === 'other' && (
              <View>
                <Text style={tw`text-gray-800 font-medium mb-1`}>
                  Recipient Phone Number
                </Text>
                <NumberInput
                  country="Sierra Leone"
                  phoneNumber={phoneNumber}
                  setPhoneNumber={val => setPhoneNumber(val)}
                />
              </View>
            )}
            <Amount
              amount={amount}
              onAmountChange={handleAmountChange}
              country="Sierra Leone"
            />
          </View>
          <CustomButton
            onPress={handleSubmit}
            text={isPending ? 'Processing...' : 'Confirm Top-up'}
            style={tw`bg-black mt-5`}
            disabled={isPending}
          />
        </View>
      )}
    </View>
  );
};

export default SierraLeoneTopup;
