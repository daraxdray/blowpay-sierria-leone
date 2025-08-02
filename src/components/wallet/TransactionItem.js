import React, {useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import tw from 'twrnc';

const TransactionItem = ({
  Icon,
  time,
  description,
  amount,
  amountColor,
  details,
  txId,
  type,
  
}) => {

  return (
    <TouchableOpacity
      style={tw`flex flex-row justify-between items-center p-4 w-full`}
      onPress={details}>
      <View style={tw`flex flex-row gap-2 items-center`}>
        <Icon />
        <View>
          <Text style={tw`text-[#AEAEAE] font-medium text-[9px]`}>{time}</Text>
          <Text style={tw`text-[grey] font-medium text-[10px]`}>{txId}</Text>
          <Text style={tw`text-[#374151] font-medium text-[12px]`}>
            {description == 'Transfer' || description == 'Wallet Funding'?'Account -'+description:description}
          </Text>
        </View>
      </View>
      <View>
        <Text style={tw`text-[${amountColor}] font-bold text-[14px]`}>
          {type == 'debit'? '-':''}₦{amount}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default TransactionItem;
