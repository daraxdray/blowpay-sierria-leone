/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  createContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react';
import {AppState} from 'react-native';
import {
  CommonActions,
  useNavigationContainerRef,
} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useGetUser} from '../../hooks/user.hook';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const navigationRef = useNavigationContainerRef();
  const INACTIVITY_TIMEOUT = (1 * 60 * 1000) / 2;
  const lastActiveRef = useRef(Date.now());
  const {data: user, refetch: refetchUser} = useGetUser();
  const [country, setCountry] = useState('Nigeria');

  // 🧠 Refetch user or AsyncStorage after Signin
  const reloadAuth = useCallback(async () => {
    try {
      await refetchUser();

      const storedCountry = await AsyncStorage.getItem('userCountry');
      if (storedCountry) setCountry(storedCountry);
    } catch (err) {
      console.error('⚠️ Error reloading auth data:', err);
    }
  }, [refetchUser]);

  useEffect(() => {
    if (user?.data?.country) {
      setCountry(user.data.country);
    }
  }, [user]);

  useEffect(() => {
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
          if (timeDifference >= INACTIVITY_TIMEOUT) handleInactivity();
        }
      } catch (error) {
        console.error('Error checking inactivity on start:', error);
      }
    };

    checkInactivityOnStart();

    return () => subscription.remove();
  }, []);

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
        if (timeDifference >= INACTIVITY_TIMEOUT) handleInactivity();
      }
    }
  };

  const handleInactivity = async () => {
    const navigation = navigationRef.current;
    if (!navigation) return;

    await AsyncStorage.removeItem('backgroundTime');
    const isLoggedIn = JSON.parse(await AsyncStorage.getItem('Login'));
    const currentRoute = navigation.getCurrentRoute();

    if (isLoggedIn) {
      if (isLoggedIn?.status === 'inactive') {
        navigation.navigate('otp-screen', {
          emailAddress: isLoggedIn?.emailAddress,
        });
      } else if (isLoggedIn?.isPasscodeSet) {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              {
                name: 'TransactionPinScreen',
                params: {currentRoute: currentRoute?.name},
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
                params: {currentRoute: currentRoute?.name},
              },
            ],
          }),
        );
      }
    }
  };

  return (
    <AuthContext.Provider value={{country, user, reloadAuth}}>
      {children}
    </AuthContext.Provider>
  );
};
