import React, {useState, useEffect, useCallback, useRef} from 'react';
import {
  View,
  Text,
  ImageBackground,
  Modal,
  RefreshControl,
  AppState,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {styles} from './style';
import {ScreenView} from '../../../global/wrappers';
import {Image} from 'react-native-animatable';
import WalletCard from '../../../components/wallet/WalletCard';
import Options from '../../../components/wallet/Options';
import tw from 'twrnc';
import Invite from '../../../components/wallet/Invite';
import Recent from '../../../components/wallet/Recent';
import TopupModal from '../../../components/Topup';
import SendBillsSVG from '../../../../assets/svgs/SendBills.svg';
import TopupSVG from '../../../../assets/svgs/Topup.svg';
import AirtimeSVG from '../../../../assets/svgs/Airtime.svg';
import DataSVG from '../../../../assets/svgs/Data.svg';
import ElectricitySVG from '../../../../assets/svgs/Electricity.svg';
import CableSVG from '../../../../assets/svgs/Cable.svg';
import {
  useGetVitualAcc,
  useGetVitualBalance,
} from '../../../hooks/virtual.hook';
import {useGetTransactions} from '../../../hooks/transactions.hook';
import Bmoney from '../../../components/modals/BMoneyModal';
import {CommonActions} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import AdvertModal from '../../../global/components/AdvertModal';

const HomeTab = props => {
  const navigation = props.navigation;
  const [modalVisible, setModalVisible] = useState(false);
  const [BmodalVisible, setBModalVisible] = useState(false);
  const [userData, setUserData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const appState = useRef(AppState.currentState);
  const {data, refetch: refetchAccount} = useGetVitualAcc();
  const {data: vtAcc, refetch: refetchBalance} = useGetVitualBalance();
  const {refetch: refetchTransactions} = useGetTransactions();
  const [advertModalVisible, setAdvertModalVisible] = useState(true);

  const dispatch = useDispatch();

  const loadUserData = async () => {
    try {
      const savedUserData = await AsyncStorage.getItem('userData');
      if (savedUserData) {
        setUserData(JSON.parse(savedUserData));
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

  const saveUserData = async () => {
    try {
      await AsyncStorage.setItem('userData', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save user data:', error);
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    if (data?.data) {
      console.log(data?.data);
      setUserData(data?.data);
      saveUserData(data?.data);
    }
  }, [data?.message, data?.data]);

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  const hanleBillsByBlowmoney = () => {
    navigation.navigate('SendBills');
  };

  const checkIfStilAuthorized = () => {
    if (data?.message === 'Unauthorized' || vtAcc?.message === 'Unauthorized') {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'TransactionPinScreen'}],
        }),
      );
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refetchAccount();
    refetchBalance();
    refetchTransactions();
    setRefreshing(false);
    checkIfStilAuthorized();
  }, []);

  const handleAppStateChange = useCallback(nextAppState => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      refetchAccount();
      refetchBalance();
      refetchTransactions();
    }
    appState.current = nextAppState;
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );
    return () => subscription.remove();
  }, [handleAppStateChange]);

  const vi = ['actions', 'invite', 'recent'];

  const renderSection = ({item}) => {
    switch (item) {
      case 'actions':
        return (
          <View style={tw`flex flex-row flex-wrap w-full`}>
            <TouchableOpacity
              style={tw`w-1/4 p-1 flex items-center justify-center`}
              onPress={hanleBillsByBlowmoney}>
              <Options SvgIcon={SendBillsSVG} text="Send Bills" />
            </TouchableOpacity>
            <TouchableOpacity style={tw`w-1/4 p-1`} onPress={openModal}>
              <Options SvgIcon={TopupSVG} text="Deposit" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setBModalVisible(true)}
              style={tw`w-1/4 p-1 flex justify-center items-center`}>
              <View style={tw`gap-2 flex items-center mt-5`}>
                <View style={tw`bg-[#ddd] p-[15px] rounded-[12px]`}>
                  <Image
                    source={require('../../../../assets/images/blowmoneypay_logo.png')}
                    style={{width: 30, height: 30}}
                  />
                </View>
                <Text style={tw`font-semibold text-[12px] text-[#374151]`}>
                  B.Money
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('Airtime')}
              style={tw`w-1/4 p-1`}>
              <Options SvgIcon={AirtimeSVG} text="Airtime" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('Data')}
              style={tw`w-1/4 p-1`}>
              <Options SvgIcon={DataSVG} text="Data" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('Electricity')}
              style={tw`w-1/4 p-1`}>
              <Options SvgIcon={ElectricitySVG} text="Electricity" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('Cable')}
              style={tw`w-1/4 p-1 flex justify-center items-center`}>
              <View style={tw`gap-2 flex items-center mt-5`}>
                <View style={tw`bg-[#DCF7F2] p-[15px] rounded-[12px]`}>
                  <CableSVG />
                </View>
                <Text style={tw`font-semibold text-[12px] text-[#374151]`}>
                  Cable TV
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('fundBetting')}
              style={tw`w-1/4 p-1 flex justify-center items-center`}>
              <View style={tw`gap-2 flex items-center mt-5`}>
                <View style={tw`bg-[#eee] p-[15px] rounded-[12px]`}>
                  <Image
                    source={require('../../../../assets/images/fund_betting.png')}
                    style={{width: 30, height: 30}}
                  />
                </View>
                <Text style={tw`font-semibold text-[12px] text-[#374151]`}>
                  Fund Betting
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        );
      case 'invite':
        return <Invite />;
      case 'recent':
        return <Recent />;
      default:
        return null;
    }
  };

  return (
    <ScreenView style={styles.container}>
      <ImageBackground
        source={require('../../../../assets/images/home_gradient.png')}
        style={{flex: 1}}
        resizeMode="cover">
        <FlatList
          data={vi}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderSection}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListHeaderComponent={() => (
            <View style={styles.view1}>
              <View style={styles.view2}>
                <View style={styles.view3}>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('ProfileTab')}
                    style={styles.profile}>
                    <Image
                      source={require('../../../../assets/icons/user.png')}
                      style={{width: 30, height: 30}}
                    />
                  </TouchableOpacity>
                  <View>
                    <Text style={styles.text1}>Welcome,</Text>
                    <Text style={styles.text2}>
                      {userData?.user?.firstName}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.notify}
                  onPress={() => navigation.navigate('Notification')}>
                  <Image
                    source={require('../../../../assets/icons/notification.png')}
                    style={{width: 30, height: 30}}
                  />
                  <View style={styles.number}>
                    <Text style={styles.text3}></Text>
                  </View>
                </TouchableOpacity>
              </View>
              <WalletCard handleAdd={openModal} />
            </View>
          )}
        />
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}>
          <View style={tw`flex-1 justify-end bg-black bg-opacity-50`}>
            <TopupModal accountData={data?.data}  closeModal={closeModal} />
          </View>
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={BmodalVisible}
          onRequestClose={() => setBModalVisible(false)}>
          <View style={tw`flex-1 justify-end bg-black bg-opacity-50`}>
            <Bmoney closeModal={() => setBModalVisible(false)} />
          </View>
        </Modal>
      </ImageBackground>
      <AdvertModal
        visible={advertModalVisible}
        onClose={() => setAdvertModalVisible(false)}
        imageSource={require('../../../../assets/images/ctc_advert.jpeg')}
        closePosition="topRight"
        borderRadius={25}
        backdropOpacity={0.8}
      />
    </ScreenView>
  );
};

export default HomeTab;
