/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {
  ImageBackground,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import tw from 'twrnc';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WalletCardSVG from '../../../assets/svgs/WalletCard.svg';
import {getCurrencySymbol} from '../../utils/format';

const WalletCard = ({handleAdd, country, accountData, balanceData}) => {
  const [cachedAccountNumber, setCachedAccountNumber] = useState(null);
  const accList = accountData || [];

  let selectedAcc;
  if (country?.toLowerCase() !== 'sierra leone') {
    const cashonrailsAcc = accList.find(acc => acc.source === 'cashonrails');
    selectedAcc = cashonrailsAcc || accList[0] || {};
  } else {
    selectedAcc = accList[0] || {};
  }
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
      if (cachedAcc) {
        setCachedAccountNumber(JSON.parse(cachedAcc));
      }
    } catch (error) {
      console.error('Error loading cached data:', error);
    }
  };
  const saveCachedData = async () => {
    try {
      const accountNumber = selectedAcc?.accountNumber || 'NAN';
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
    if (selectedAcc?.accountNumber && userBalance?.balance) {
      saveCachedData();
    }
  }, [selectedAcc, userBalance]);

  const isIpad = () => {
    const {width, height} = Dimensions.get('window');
    return (width >= 768 && height >= 1024) || (width >= 1024 && height >= 768);
  };

  return (
    <View style={tw`mt-5 flex items-center p-2`}>
      <View style={tw`w-full relative items-center justify-center`}>
        <WalletCardSVG width={'115%'} height="115%" style={tw`absolute`} />

        <View
          style={tw`flex-row justify-between items-center py-6 px-5 ${
            isIpad() ? 'w-[35%]' : 'w-90%'
          }`}>
          <View style={tw`flex-1 pb-3`}>
            <ImageBackground
              source={require('../../../assets/images/Rectangle.png')}
              style={tw`w-[170px] h-[30px] rounded-full overflow-hidden`}>
              <TouchableOpacity
                style={tw`flex-row items-center justify-center gap-2 px-2`}
                onPress={handleAdd}>
                <Image
                  source={require('../../../assets/icons/wallet-white.png')}
                  style={{width: 25, height: 25}}
                />
                <Text style={tw`text-white text-[12px] font-medium`}>
                  Acc:{' '}
                  {selectedAcc?.accountNumber || cachedAccountNumber || 'N/A'}
                </Text>
                <Image
                  source={require('../../../assets/icons/arrowDown.png')}
                  style={{width: 12, height: 6}}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            </ImageBackground>

            <Text style={tw`text-white text-[20px] font-bold mt-3 pl-4`}>
              {getCurrencySymbol(country)}
              {formatBalance(userBalance?.balance) === 'NAN'
                ? '******'
                : formatBalance(userBalance?.balance)}
            </Text>
          </View>

          <View style={tw`items-center pb-3`}>
            <TouchableOpacity onPress={handleAdd}>
              <ImageBackground
                source={require('../../../assets/images/circle.png')}
                style={tw`w-[50px] h-[50px] items-center justify-center`}>
                <Image
                  source={require('../../../assets/images/plus.png')}
                  style={{width: 30, height: 30}}
                  resizeMode="cover"
                />
              </ImageBackground>
            </TouchableOpacity>
            <Text style={tw`text-white text-[12px] font-semibold mt-2`}>
              Add Money
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default WalletCard;
