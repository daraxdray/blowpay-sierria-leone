/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {Image, Text, View, FlatList, Modal} from 'react-native';
import tw from 'twrnc';
import AddfundSVG from '../../../assets/svgs/Addfund.svg';
import TransactionItem from './TransactionItem';
import {formatTime} from '../../constants/data/Transaction';
import {useGetTransactions} from '../../hooks/transactions.hook';
import TransactionDetails from '../modals/TransactionDetails';
import {getCurrencySymbol} from '../../utils/format';

const Recent = ({description = '', country}) => {
  const {data: transactionsData, refetch} = useGetTransactions(description);
  const [transactions, setTransactions] = useState([]);
  const [cachedTransactions] = useState([]);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState(null);

  const openDetailModal = () => {
    setDetailModalVisible(true);
  };

  const closeDetailModal = () => {
    setDetailModalVisible(false);
  };

  const handleDetails = item => {
    setSelectedTransactionId(item.id);
    openDetailModal();
  };

  // const loadCachedTransactions = async () => {
  //   // try {
  //   //   const cached = await AsyncStorage.getItem('transactions');
  //   //   if (cached) {
  //   //     setCachedTransactions(JSON.parse(cached));
  //   //   }
  //   // } catch (error) {
  //   //   console.log('Error loading transactions from AsyncStorage:', error);
  //   // }
  // };

  // const saveCachedTransactions = async () => {
  //   try {
  //     if (transactions && transactions.length > 0) {
  //       await AsyncStorage.setItem(
  //         'transactions',
  //         JSON.stringify(transactions),
  //       );
  //     }
  //   } catch (error) {
  //     console.log('Error saving transactions to AsyncStorage:', error);
  //   }
  // };

  useEffect(() => {
    setTransactions(transactionsData?.data);
  }, [transactionsData]);
  useEffect(() => {
    refetch();
  }, [description]);

  useEffect(() => {
    if (transactions && transactions.length > 0) {
      // saveCachedTransactions();
      console.log(transactions);
    }
  }, [transactions]);

  return (
    <View style={tw`bg-[#FFFFFF] p-5 mt-5 pb-[100] rounded-[20px] gap-2 flex `}>
      <Text style={tw`text-[14px] font-bold text-[#374151]`}>
        Recent Activity
      </Text>

      {transactions && transactions.length > 0 ? (
        <FlatList
          data={transactions}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <TransactionItem
              Icon={AddfundSVG}
              time={formatTime(item.createdAt)}
              description={`${
                item.metadata
                  ? item.description + ' - ' + (item.metadata.network || '')
                  : item.description || ''
              }`}
              amount={`${getCurrencySymbol(country)}${parseFloat(
                item.amount / 100,
              )
                .toFixed(2)
                .replace(/\d(?=(\d{3})+\.)/g, '$&,')}`}
              amountColor={item.type === 'debit' ? '#F04343' : '#10B981'}
              details={() => handleDetails(item)}
              txId={item.id}
              type={item.type}
            />
          )}
          // contentContainerStyle={{paddingBottom: 230}}
        />
      ) : cachedTransactions && cachedTransactions.length > 0 ? (
        <FlatList
          data={cachedTransactions}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <TransactionItem
              Icon={AddfundSVG}
              time={formatTime(item.createdAt)}
              description={`${
                item.metadata
                  ? item.description + ' - ' + (item.metadata.network || '')
                  : item.description || ''
              }`}
              amount={`${getCurrencySymbol(country)}${parseFloat(
                item.amount / 100,
              )
                .toFixed(2)
                .replace(/\d(?=(\d{3})+\.)/g, '$&,')}`}
              amountColor={item.type === 'debit' ? '#F04343' : '#10B981'}
              details={() => handleDetails(item)}
              txId={item.id}
              type={item.type}
            />
          )}
          containerStyle={{paddingBottom: 20}}
        />
      ) : (
        <View style={tw`flex justify-center items-center gap-2 my-[8%] w-full`}>
          <Image
            source={require('../../../assets/icons/smiley-down.png')}
            style={{width: 60, height: 60}}
          />
          <Text style={tw`text-[16px] font-bold text-[#374151] mb-[10px]`}>
            No activity to show!
          </Text>
          <Text
            style={tw`text-[12px] font-normal text-center text-[#4B5563] w-[100%]`}>
            You don’t have any transactions done. Once you make any
            transactions, they will show here.
          </Text>
        </View>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={detailModalVisible}
        onRequestClose={closeDetailModal}>
        <View
          style={tw`flex-1 justify-end items-center bg-black bg-opacity-50`}>
          <TransactionDetails
            closeModal={closeDetailModal}
            transactionId={selectedTransactionId}
          />
        </View>
      </Modal>
    </View>
  );
};

export default Recent;
