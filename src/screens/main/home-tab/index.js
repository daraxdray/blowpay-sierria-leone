/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useContext,
} from 'react';
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
import Toast from 'react-native-toast-message';
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
import {useGetUserAcc, useCreateUserAcc} from '../../../hooks/user.hook';
import {useGetTransactions} from '../../../hooks/transactions.hook';
import Bmoney from '../../../components/modals/BMoneyModal';
import {CommonActions} from '@react-navigation/native';
import AdvertModal from '../../../global/components/AdvertModal';
import {AuthContext} from '../../../global/wrappers/AuthProvider';
import Loader from '../../../components/modals/Loader';

const HomeTab = props => {
  const navigation = props.navigation;
  const {country} = useContext(AuthContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [BmodalVisible, setBModalVisible] = useState(false);
  const [userData, setUserData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const appState = useRef(AppState.currentState);
  const {data, refetch: refetchAccount} = useGetVitualAcc();
  const {data: vtAcc, refetch: refetchBalance} = useGetVitualBalance();
  const {refetch: refetchTransactions} = useGetTransactions();
  const {data: userAcc, refetch: refetchUserAcc, status} = useGetUserAcc();
  const {mutate: createUserAcc, status: createStatus} = useCreateUserAcc();
  const [advertModalVisible, setAdvertModalVisible] = useState(true);

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
  useEffect(() => {
    const checkAndCreateAccount = async () => {
      if (country?.toLowerCase() === 'sierra leone') {
        console.log(
          '⏭️ Skipping account creation - country is not Sierra Leone',
        );
        return;
      }

      if (status !== 'success' || !userAcc) {
        console.log('⏳ Waiting for userAcc to finish loading...');
        return;
      }

      try {
        const accList = userAcc || [];
        const sources = accList.map(acc => acc?.source?.toLowerCase());
        console.log('🔍 Existing account sources:', sources);

        const hasCashOnRails = sources.includes('cashonrails');
        if (!hasCashOnRails) {
          const storedUser = await AsyncStorage.getItem('Login');
          const parsedUser = JSON.parse(storedUser);
          const userId = parsedUser?.id;

          if (!userId) {
            console.warn('⚠️ No user ID found — cannot create account');
            return;
          }

          console.log(
            '💳 Creating CashOnRails account for Sierra Leone user...',
          );
          createUserAcc(
            {userIds: [userId]},
            {
              onSuccess: () => {
                Toast.show({
                  type: 'success',
                  text1: 'Virtual Account Created 🎉',
                  text2: 'Your CashOnRails account is ready!',
                });
                setTimeout(() => refetchUserAcc(), 2000);
              },
              onError: err => {
                console.error('❌ Error creating account:', err.message);
                Toast.show({
                  type: 'error',
                  text1: 'Account Creation Failed',
                  text2: err.message || 'Please try again later.',
                });
              },
            },
          );
        } else {
          console.log('✅ CashOnRails account already exists');
        }
      } catch (error) {
        console.error('💥 Error checking or creating account:', error);
      }
    };

    checkAndCreateAccount();
  }, [status, country]);

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
  if (status === 'loading' || createStatus === 'pending') {
    return <Loader />;
  }

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
        return (
          <View style={tw`px-3`}>
            <Invite />
          </View>
        );
      case 'recent':
        return (
          <View style={tw`px-3`}>
            <Recent country={country} />
          </View>
        );
      default:
        return null;
    }
  };
  if (status === 'pending' || createStatus === 'pending') {
    <Loader />;
  }
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
                </TouchableOpacity>
              </View>
              <WalletCard
                handleAdd={openModal}
                country={country}
                accountData={userAcc}
                balanceData={vtAcc}
              />
            </View>
          )}
        />
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}>
          <View style={tw`flex-1 justify-end bg-black bg-opacity-50`}>
            <TopupModal
              accountData={userAcc}
              closeModal={closeModal}
              country={country}
            />
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
