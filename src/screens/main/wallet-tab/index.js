import React, {useEffect, useState, useContext} from 'react';
import {View, Text, TouchableOpacity, Modal, ScrollView} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {styles} from './style';
import tw from 'twrnc';
import {ScreenView} from '../../../global/wrappers';
import {WHITE} from '../../../global/theme';
import MywalletCard from '../../../components/wallet/MyWalletCard';
import SendBillsSVG from '../../../../assets/svgs/SendBills.svg';
import TopupSVG from '../../../../assets/svgs/Topup.svg';
import {useGetTransactions} from '../../../hooks/transactions.hook';
import TopupModal from '../../../components/Topup';
import TransactionDetails from '../../../components/modals/TransactionDetails';
import Recent from '../../../components/wallet/Recent';
import Loader from '../../../components/modals/Loader';
import {AuthContext} from '../../../global/wrappers/AuthProvider';
import {useGetUserAcc} from '../../../hooks/user.hook';

const WalletTab = props => {
  const navigation = props.navigation;
  const [modalVisible, setModalVisible] = useState(false);
  const [deatailModalVisible, setDetailsModalVisible] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const {country} = useContext(AuthContext);
  const {data: userAcc, status: accstatus} = useGetUserAcc();
  const [selectedTransactionId, setSelectedTransactionId] = useState(null);

  const openModal = () => {
    setModalVisible(true);
  };
  const openDetailsModal = () => {
    setDetailsModalVisible(true);
  };

  const handleAdd = () => {
    openModal();
  };

  const closeModal = () => {
    setModalVisible(false);
  };
  const closeDetailsModal = () => {
    setDetailsModalVisible(false);
  };
  const handleDetails = item => {
    setSelectedTransactionId(item.id);
    openDetailsModal();
  };

  const {data, status} = useGetTransactions();
  useEffect(() => {
    const loadTransactions = async () => {
      const cachedTransactions = await AsyncStorage.getItem(
        'Wallettransactions',
      );
      if (cachedTransactions) {
        setTransactions(JSON.parse(cachedTransactions));
      }
    };
    loadTransactions();
  }, []);

  useEffect(() => {
    if (data?.data) {
      const fetchedTransactions = data.data;
      setTransactions(fetchedTransactions);
      AsyncStorage.setItem(
        'Wallettransactions',
        JSON.stringify(fetchedTransactions),
      );
    }
  }, [data]);

  if (status || accstatus === 'pending') {
    <Loader />;
  }
  return (
    <ScreenView style={styles.container} light color={WHITE}>
      <ScrollView
        style={tw`flex-1 w-full`}
        contentContainerStyle={styles.view1}
        showsVerticalScrollIndicator={false}>
        <View style={tw`mb-2`}>
          <Text style={tw`text-gray-800 font-medium text-[20px]`}>
            My Wallet
          </Text>
        </View>

        <MywalletCard country={country} />

        <View style={tw`flex flex-row gap-5 mt-5 items-center justify-between`}>
          <TouchableOpacity
            style={tw`flex-1 bg-gray-100 pt-3 items-center gap-3 rounded-[20px] h-21`}
            onPress={handleAdd}>
            <Text style={tw`text-gray-800 font-bold text-[14px]`}>Deposit</Text>
            <TopupSVG />
          </TouchableOpacity>
          <TouchableOpacity
            style={tw`flex-1 bg-gray-100 pt-3 items-center gap-3 rounded-[20px] h-21`}
            onPress={() => navigation.navigate('SendBills')}>
            <Text style={tw`text-gray-800 font-bold text-[14px]`}>
              Transfer Money
            </Text>
            <SendBillsSVG style={tw``} />
          </TouchableOpacity>
        </View>

        <Recent />
        {/* <View style={tw`flex-1 justify-center items-center  w-full`}>
          {transactions && transactions.length > 0 ? (
            <View>
              <FlatList
                data={transactions}
                showsVerticalScrollIndicator={false}
                keyExtractor={item => item.id}
                renderItem={({item}) => (
                  <TransactionItem
                    Icon={AddfundSVG}
                    time={formatTime(item.createdAt)}
                    description={item.description}
                    amount={parseFloat(item.amount / 100)
                      .toFixed(2)
                      .replace(/\d(?=(\d{3})+\.)/g, '$&,')}
                    amountColor={item.type === 'debit' ? '#F04343' : '#10B981'}
                    details={() => handleDetails(item)}
                  />
                )}
              />
            </View>
          ) : (
            <View style={tw`flex justify-center items-center gap-2`}>
              <View
                style={tw`p-2 rounded-lg flex-none items-center justify-center`}>
                <Image
                  source={require('../../../../assets/icons/smiley-down.png')}
                  style={{width: 60, height: 60}}
                />
              </View>
              <View style={tw`flex justify-center items-center`}>
                <Text style={tw`text-[18px] font-bold text-[#374151]`}>
                  No activity to show!
                </Text>
                <Text
                  style={tw`text-[12px] font-normal text-center text-[#4B5563]`}>
                  You don’t have any transactions done. Once you make any
                  transactions it will show here.
                </Text>
              </View>
            </View>
          )}
        </View> */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}>
          <View style={tw`flex-1 justify-end bg-black bg-opacity-50`}>
            <TopupModal
              accountData={userAcc}
              country={country}
              closeModal={closeModal}
            />
          </View>
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={deatailModalVisible}
          onRequestClose={closeDetailsModal}>
          <View style={tw`flex-1 justify-end bg-black bg-opacity-50`}>
            <TransactionDetails
              closeModal={closeDetailsModal}
              transactionId={selectedTransactionId}
            />
          </View>
        </Modal>
      </ScrollView>
    </ScreenView>
  );
};

export default WalletTab;
