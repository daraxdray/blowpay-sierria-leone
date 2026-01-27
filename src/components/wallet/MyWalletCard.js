/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import tw from 'twrnc';
import {useGetVitualAcc, useGetVitualBalance} from '../../hooks/virtual.hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Dimensions} from 'react-native';
import WalletCardSVG from '../../../assets/svgs/WalletCard.svg';
import {getCurrencySymbol} from '../../utils/format';

const WalletCard = ({handleAdd, country}) => {
  const {width} = Dimensions.get('window');
  const {data: accountData} = useGetVitualAcc();
  const {data: balanceData} = useGetVitualBalance();
  const [cachedAccountNumber, setCachedAccountNumber] = useState(null);
  const [cachedBalance, setCachedBalance] = useState(null);

  const userData = accountData?.data || {};
  const userBalance = balanceData?.data || {};
  const formatBalance = balance => {
    if (balance === undefined || balance === null) {
      return 'NAN';
    }
    const parsedBalance = parseFloat(balance);
    return isNaN(parsedBalance)
      ? 'NAN'
      : (parsedBalance / 100).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  };

  const loadCachedData = async () => {
    try {
      const cachedAcc = await AsyncStorage.getItem('accountNumber');
      const cachedBal = await AsyncStorage.getItem('balance');
      if (cachedAcc) {
        setCachedAccountNumber(cachedAcc);
      }
      if (cachedBal) {
        setCachedBalance(cachedBal);
      }
    } catch (error) {}
  };
  const saveCachedData = async () => {
    try {
      const accountNumber = userData?.accountNumber || 'NAN';
      const balance = userBalance?.balance || 'NAN';
      await AsyncStorage.setItem(
        'accountNumber',
        JSON.stringify(accountNumber),
      );
      await AsyncStorage.setItem('balance', JSON.stringify(balance));
    } catch (error) {}
  };

  useEffect(() => {
    loadCachedData();
  }, []);

  useEffect(() => {
    if (userData?.accountNumber && userBalance?.balance) {
      saveCachedData();
    }
  }, [userData, userBalance]);

  return (
    <View style={tw`mt-5 flex items-center`}>
      <View style={tw`w-full relative items-center justify-center`}>
        <WalletCardSVG
          width={width}
          height={width * 0.35}
          style={tw`absolute`}
        />

        <View style={tw`flex-row py-6 px-6`}>
          <View style={tw`flex-1 justify-center items-center pb-3`}>
            <Text style={tw`text-white text-[22px] font-bold `}>
              {getCurrencySymbol(country)}
              {formatBalance(userBalance?.balance) === 'NAN'
                ? cachedBalance
                : formatBalance(userBalance?.balance)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default WalletCard;
