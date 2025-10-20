import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import tw from 'twrnc';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {PanGestureHandler} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import {useLogout} from '../../hooks/auth.hook';
import Toast from 'react-native-toast-message';
import Loader from './Loader';
import {CommonActions} from '@react-navigation/native';
import {logout} from '../../contexts/actions/user';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LogoutModal = ({closeModal}) => {
  const {isAuthenticated} = useSelector(state => state.user);
  const handleSwipeDown = ({nativeEvent}) => {
    if (nativeEvent.translationY > 50) {
      closeModal();
    }
  };
  const navigation = useNavigation();
  const {mutate, status} = useLogout();
  const dispatch = useDispatch();

  const handleLogout = () => {
    try {
      AsyncStorage.removeItem('bPK');
      AsyncStorage.removeItem('bmEnabled');
      AsyncStorage.removeItem('Login');
      AsyncStorage.removeItem('balance');
      AsyncStorage.removeItem('userData');
      dispatch(logout());
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'walkthrough-screen'}],
        }),
      );
      Toast.show({text1: 'You have logged out successfully'});
      mutate({});
    } catch (error) {
      console.error('An unexpected error occurred:', error);
    }
  };
  return (
    <PanGestureHandler onGestureEvent={handleSwipeDown}>
      <View style={tw`bg-white p-5 w-19/20 self-center rounded-10 mb-5 gap-3`}>
        <View style={tw`gap-5 p-2 pt-4`}>
          <View style={tw`flex flex-row items-center justify-between`}>
            <TouchableOpacity
              style={tw`p-1 bg-[#F3F4F6] items-center justify-center rounded-full w-[30px] h-[30px]`}
              activeOpacity={0.65}
              onPress={closeModal}>
              <Ionicons name="chevron-back" size={13} color="#000" />
            </TouchableOpacity>
            <Text style={tw`text-[#000000] font-medium text-[14px]`}>
              Logout
            </Text>
            <View style={tw`w-10`} />
          </View>
          <Text style={tw`text-[#667085] font-normal text-[14px]`}>
            Are you sure you want to logout?
          </Text>

          <View style={tw` pb-4 px-2 rounded-[8px] gap-4`}>
            <TouchableOpacity
              onPress={() => {
                handleLogout();
                closeModal();
              }}
              style={tw`bg-[#FF114A] rounded-[16px] px-3 py-3 flex w-full items-center flex-row justify-center `}>
              <Text style={tw`text-white font-medium text-[14px]`}>
                Log out
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                closeModal();
              }}
              style={tw`bg-[#EDEDEF] rounded-[16px] px-3 py-3 flex w-full items-center flex-row justify-center `}>
              <Text style={tw`text-black font-medium text-[14px]`}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
        {status === 'pending' && <Loader />}
      </View>
    </PanGestureHandler>
  );
};

export default LogoutModal;
