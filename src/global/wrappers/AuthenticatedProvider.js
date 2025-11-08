/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useRef, useState, useCallback} from 'react';
import {AppState} from 'react-native';
import {useNavigation, CommonActions} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useQueryClient} from '@tanstack/react-query';
import {useGetUser} from '../../hooks/user.hook';
import {AuthContext} from './AuthProvider';

// ✅ This component ONLY renders when user is logged in
// So useGetUser is always called consistently
export const AuthenticatedProvider = ({children}) => {
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const lastActiveRef = useRef(Date.now());

  const [country, setCountry] = useState('Nigeria');
  const INACTIVITY_TIMEOUT = (1 * 60 * 1000) / 2;

  // ✅ Safe to call useGetUser here - component only renders when logged in
  const {data: user, refetch: refetchUser} = useGetUser();

  // 🧠 Refetch user data
  const reloadAuth = useCallback(async () => {
    try {
      await refetchUser();
      const storedCountry = await AsyncStorage.getItem('userCountry');
      if (storedCountry) setCountry(storedCountry);
    } catch (err) {
      console.error('⚠️ Error reloading auth data:', err);
    }
  }, [refetchUser]);

  // ✅ Update country when user data is available
  useEffect(() => {
    if (user?.data?.country) {
      setCountry(user.data.country);
    }
  }, [user]);

  // ✅ Clear user data when component unmounts (user logs out)
  useEffect(() => {
    return () => {
      queryClient.removeQueries(['user']);
    };
  }, [queryClient]);

  // ⏱️ Inactivity Logic
  useEffect(() => {
    const handleAppStateChange = async nextAppState => {
      if (nextAppState === 'background') {
        const currentTime = Date.now();
        await AsyncStorage.setItem('backgroundTime', currentTime.toString());
        lastActiveRef.current = currentTime;
      } else if (nextAppState === 'active') {
        const currentTime = Date.now();
        const storedTime = await AsyncStorage.getItem('backgroundTime');
        if (storedTime) {
          const backgroundTime = parseInt(storedTime, 10);
          const timeDifference = currentTime - backgroundTime;
          if (timeDifference >= INACTIVITY_TIMEOUT) {
            await handleInactivity();
          }
        }
      }
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    const checkInactivityOnStart = async () => {
      try {
        const storedTime = await AsyncStorage.getItem('backgroundTime');
        if (storedTime) {
          const currentTime = Date.now();
          const backgroundTime = parseInt(storedTime, 10);
          const timeDifference = currentTime - backgroundTime;
          if (timeDifference >= INACTIVITY_TIMEOUT) {
            await handleInactivity();
          }
        }
      } catch (error) {
        console.error('Error checking inactivity on start:', error);
      }
    };

    checkInactivityOnStart();

    return () => subscription.remove();
  }, []);

  const handleInactivity = async () => {
    try {
      await AsyncStorage.removeItem('backgroundTime');
      const loginDataString = await AsyncStorage.getItem('Login');
      if (!loginDataString) return;

      const loginData = JSON.parse(loginDataString);
      const currentRoute =
        navigation.getState().routes[navigation.getState().index];

      if (loginData?.status === 'inactive') {
        navigation.navigate('otp-screen', {
          emailAddress: loginData?.emailAddress,
        });
      } else if (loginData?.isPasscodeSet) {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              {
                name: 'TransactionPinScreen',
                params: {currentRoute: currentRoute.name},
              },
            ],
          }),
        );
      } else {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              {
                name: 'create-pin-screen',
                params: {currentRoute: currentRoute.name},
              },
            ],
          }),
        );
      }
    } catch (error) {
      console.error('Error handling inactivity:', error);
    }
  };

  return (
    <AuthContext.Provider value={{country, user, reloadAuth}}>
      {children}
    </AuthContext.Provider>
  );
};
