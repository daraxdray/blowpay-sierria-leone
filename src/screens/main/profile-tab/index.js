import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  Image,
  ImageBackground,
  Linking,
  Platform,
  Alert,
} from 'react-native';
import {styles} from './style';
import {ScreenView} from '../../../global/wrappers';
import {WHITE} from '../../../global/theme';
import Header from '../../../global/components/Header';
import tw from 'twrnc';
import Ionicons from 'react-native-vector-icons/Ionicons';
import OptionsSVG from '../../../../assets/svgs/Options.svg';
import Options from '../../../components/profile/Optons';
import SecurityModal from '../../../components/modals/SecurityModal';
import HelpModal from '../../../components/modals/HelpModal';
import LogoutModal from '../../../components/modals/LogoutModal';
import {useGetVitualAcc} from '../../../hooks/virtual.hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import VerifyPhoneComponent from './verifyPhone';
import AppConstant from '../../../constants/data/appConstant';
import {CommonActions} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {logout} from '../../../contexts/actions/user';
import {useQueryClient} from '@tanstack/react-query';
import {deleteUserCredentials} from '../../../utils/storage';
import Toast from 'react-native-toast-message';

const ProfileTab = props => {
  const navigation = props.navigation;
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [modalVisible, setModalVisible] = useState(false);
  const [phoneModalVisible, setPhoneModalVisible] = useState(false);
  const [helpModalVisible, setHelpModalVisible] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const {data} = useGetVitualAcc();
  const [user, setUser] = useState({});
  const socialImage =
    Platform.OS == 'ios' || AppConstant.isAmazonStore
      ? require('../../../../assets/images/social_blowpay.jpeg')
      : require('../../../../assets/images/social_blowmoney.png');
  const openModal = () => {
    setModalVisible(true);
  };
  const closeModal = () => {
    setModalVisible(false);
  };
  const closeDeleteModal = () => setDeleteModalVisible(false);

  const performLogout = async () => {
    try {
      const authEmail = await AsyncStorage.getItem('authEmail');
      await deleteUserCredentials(authEmail);
      await AsyncStorage.clear();
      queryClient.getQueryCache().clear();
      queryClient.getMutationCache().clear();
      queryClient.clear();
      dispatch(logout());
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'walkthrough-screen'}],
        }),
      );
      Toast.show({text1: 'You have been logged out.'});
    } catch (error) {
      console.error('Logout error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'An error occurred. Please try again.',
      });
    }
  };

  const confirmDeleteAccount = () => {
    // const url =
    //   Platform.OS === 'ios' || AppConstant.isAmazonStore
    //     ? 'https://BlowPay.app/request-account-deletion'
    //     : 'http://billsbyblowmoney.com/request-account-deletion';
    // Linking.openURL(url);
    closeDeleteModal();
    Alert.alert(
      'Account deletion requested',
      'We have requested to delete your account. It will take effect after 30 days.',
      [{text: 'OK', onPress: performLogout}],
    );
  };
  const openHelpModal = () => {
    setHelpModalVisible(true);
  };
  const closeHelpModal = () => {
    setHelpModalVisible(false);
  };
  const openLogoutModal = () => {
    setLogoutModalVisible(true);
  };
  const closeLogoutModal = () => {
    setLogoutModalVisible(false);
  };
  const closePhoneModal = () => {
    setPhoneModalVisible(false);
  };
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUserData = await AsyncStorage.getItem('userData');

        if (storedUserData) {
          setUser(JSON.parse(storedUserData));
        }
      } catch (error) {
        console.error('Failed to load user data from AsyncStorage:', error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const storeUserData = async () => {
      if (data) {
        try {
          const userData = data.data;
          await AsyncStorage.setItem('userData', JSON.stringify(userData));
          setUser(userData);
        } catch (error) {
          console.error('Failed to save user data to AsyncStorage:', error);
        }
      }
    };

    storeUserData();
  }, [data]);

  return (
    <ScreenView style={styles.container} light color={WHITE}>
      {/* <View style={[styles.backgroundContainer]}>
        <ProfileBGSVG style={styles.svgBackground} />
      </View> */}
      <ImageBackground
        source={require('../../../../assets/images/layout-profile.png')}
        style={tw`absolute inset-0 h-80`} // Use 'absolute' and 'inset-0' for full coverage
        resizeMode="cover" // Adjust how the image fits
      />

      <View style={tw`px-3 pt-2`}>
        <Header
          navigation={() => {
            navigation.goBack();
          }}
          ImageSource={require('../../../../assets/icons/filter.png')}
          title="Profile"
          showIcon={false}
          iconName="add-circle"
          imagePress={() => console.log('Second Icon Pressed')}
        />
      </View>

      <ScrollView
        style={styles.viewContainer}
        showsVerticalScrollIndicator={false}>
        <View style={tw`flex items-center w-full gap-5`}>
          <TouchableOpacity
            style={tw`flex items-center w-full  justify-center pl-4 `}>
            {/* <ProfilleSVG /> */}
            <Image
              source={socialImage}
              style={tw`w-[50px] h-[50px] rounded-full bg-black`}
            />
          </TouchableOpacity>
          <View style={tw`items-center pl-4`}>
            <Text style={tw`text-[#080B30] font-bold text-[18px]`}>
              {`${user?.user?.firstName} ${user?.user?.lastName}`}
            </Text>
            <Text style={tw`text-[#080B30] font-medium text-[14px]`}>
              @{user?.user?.username}
            </Text>
            <Text style={tw`text-[#606060] font-medium text-[12px]`}>
              Personal Account - Tier 1
            </Text>
          </View>
        </View>
        <View style={tw`flex items-center mt-12`}>
          {!user?.user?.phoneVerified ? (
            <View
              style={tw`bg-[#FFF8FB] p-5 w-[367.55px] gap-4 rounded-[16px] `}>
              <View style={tw`items-center`}>
                <View style={tw`flex-row items-center`}>
                  <Text
                    style={tw`text-[#000000] font-bold text-center text-[14px] leading-[24px]`}>
                    Verified
                  </Text>
                  <Ionicons
                    name="checkmark-done-circle"
                    size={12}
                    color="#008abf"
                    style={tw`mb-2`}
                  />
                </View>
              </View>
              {/* <TouchableOpacity
              onPress={() => setPhoneModalVisible(true)}
              disabled={true}
              style={tw` flex flex-row items-center bg-[#FFFFFF] p-2 gap-2 self-center rounded-md`}>
              <Ionicons
                name="arrow-forward-circle-outline"
                size={24}
                color="green"
              />
              <Text style={tw`text-[#000000] font-medium text-[14px]`}>
                Verified
              </Text>
            </TouchableOpacity> */}
            </View>
          ) : (
            <View
              style={tw`bg-[#FFF8FB] p-5 w-[367.55px] gap-4 rounded-[16px] `}>
              <Text
                style={tw`text-[#000000] font-bold text-[14px] pl-4 leading-[24px]`}>
                Your phone has been verified.
              </Text>
              <TouchableOpacity
                style={tw` flex flex-row items-center bg-[#FFFFFF] p-2 gap-2 self-start rounded-md`}>
                <Ionicons
                  name="arrow-forward-circle-outline"
                  size={24}
                  color="green"
                />
                <Text style={tw`text-[#000000] font-medium text-[14px]`}>
                  Verified
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.view1}>
          <View style={tw`w-full mt-10`}>
            <Options
              icon={<OptionsSVG />}
              title="Edit Profile"
              onPress={() => navigation.navigate('EditProfile')}
              showIonicon={false}
            />
            <Options
              icon={<OptionsSVG />}
              title="Update NIN"
              onPress={() => navigation.navigate('setup-id-screen')}
              showIonicon={false}
            />
            <Options
              icon={<OptionsSVG />}
              title="Security"
              onPress={openModal}
              showIonicon={true}
            />
            <Options
              icon={<OptionsSVG />}
              title="Legal"
              onPress={() => navigation.navigate('Legal')}
              showIonicon={false}
            />
            {/* <Options
              icon={<OptionsSVG />}
              title="Language"
              onPress={() => navigation.navigate('Language')}
              showIonicon={false}
            /> */}
            {/* <Options
              icon={<OptionsSVG />}
              title="Notification"
              onPress={() => navigation.navigate('NotificationSetting')}
              showIonicon={false}
            /> */}
            <Options
              icon={<OptionsSVG />}
              title="Help Center"
              onPress={openHelpModal}
              showIonicon={false}
            />
            <Options
              icon={<OptionsSVG />}
              title="Delete Account"
              onPress={() => {
                setDeleteModalVisible(true);
              }}
              showIonicon={true}
            />
            {/* <Options
              icon={<ReferSVG />}
              title="Refer & Earn"
              onPress={() => navigation.navigate('Refer')}
              showIonicon={false}
            /> */}
            <Options
              icon={<OptionsSVG />}
              title="Logout"
              onPress={openLogoutModal}
              showIonicon={false}
            />
          </View>
          <Modal
            animationType="slide"
            transparent={false}
            visible={modalVisible}
            onRequestClose={closeModal}>
            <View style={tw`flex-1 justify-end bg-black bg-opacity-50`}>
              <SecurityModal closeModal={closeModal} />
            </View>
          </Modal>
          <Modal
            animationType="slide"
            transparent={true}
            visible={helpModalVisible}
            onRequestClose={closeHelpModal}>
            <View style={tw`flex-1 justify-end bg-black bg-opacity-50`}>
              <HelpModal closeModal={closeHelpModal} />
            </View>
          </Modal>
          <Modal
            animationType="slide"
            transparent={true}
            visible={logoutModalVisible}
            onRequestClose={closeLogoutModal}>
            <View style={tw`flex-1 justify-end bg-black bg-opacity-50`}>
              <LogoutModal closeModal={closeLogoutModal} />
            </View>
          </Modal>

          <Modal
            animationType="slide"
            transparent={true}
            visible={phoneModalVisible}
            onRequestClose={() => setPhoneModalVisible(false)}>
            <View style={tw`flex-1 justify-end bg-black bg-opacity-50`}>
              <VerifyPhoneComponent
                phone={user.phone}
                closeModal={closePhoneModal}
              />
            </View>
          </Modal>

          <Modal
            animationType="fade"
            transparent={true}
            visible={deleteModalVisible}
            onRequestClose={closeDeleteModal}>
            <View style={tw`flex-1 justify-center items-center bg-black bg-opacity-50 px-4`}>
              <View style={tw`bg-white rounded-2xl p-5 w-full max-w-sm gap-4`}>
                <Text style={tw`text-[#080B30] font-bold text-[18px] text-center`}>
                  Delete account?
                </Text>
                <Text style={tw`text-[#606060] font-normal text-[14px] text-center`}>
                  Are you sure you want to delete your account?
                </Text>
                <View style={tw`flex-row gap-3 mt-2`}>
                  <TouchableOpacity
                    onPress={closeDeleteModal}
                    style={tw`flex-1 bg-[#EDEDEF] rounded-xl py-3 items-center`}>
                    <Text style={tw`text-black font-medium text-[14px]`}>No</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={confirmDeleteAccount}
                    style={tw`flex-1 bg-[#FF114A] rounded-xl py-3 items-center`}>
                    <Text style={tw`text-white font-medium text-[14px]`}>Yes</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </ScrollView>
    </ScreenView>
  );
};

export default ProfileTab;
