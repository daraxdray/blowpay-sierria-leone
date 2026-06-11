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
import {useGetUser, useGetUserAcc} from '../../hooks/user.hook';

export const AuthContext = createContext();

/**
 * Derive country from user accounts: if any account has SafulPay or currency SLE => Sierra Leone, else Nigeria.
 * @param {Array} accounts - User accounts from getUserAcc endpoint
 * @returns {'Sierra Leone'|'Nigeria'}
 */
const getCountryFromUserAccounts = accounts => {
  if (!Array.isArray(accounts) || accounts.length === 0) {
    return 'Nigeria';
  }
  const hasSafulPay = accounts.some(
    acc =>
      (acc?.bankName && String(acc.bankName).toLowerCase().includes('saful')) ||
      acc?.currency?.code === 'SLE',
  );
  return hasSafulPay ? 'Sierra Leone' : 'Nigeria';
};

export const AuthProvider = ({children}) => {
  const navigationRef = useNavigationContainerRef();
  const INACTIVITY_TIMEOUT = (1 * 60 * 1000) / 2;
  const lastActiveRef = useRef(Date.now());
  const {data: user, refetch: refetchUser} = useGetUser();
  const {data: userAccData, refetch: refetchUserAcc} = useGetUserAcc();
  const [country, setCountry] = useState('Nigeria');

  // Derive country from user accounts (SafulPay/SLE => Sierra Leone, else Nigeria)
  useEffect(() => {
    const accounts = Array.isArray(userAccData) ? userAccData : [];
    const derivedCountry = getCountryFromUserAccounts(accounts);
    setCountry(derivedCountry);
  }, [userAccData]);

  const reloadAuth = useCallback(async () => {
    try {
      await refetchUser();
      await refetchUserAcc();
    } catch (err) {
      console.error('⚠️ Error reloading auth data:', err);
    }
  }, [refetchUser, refetchUserAcc]);

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

    const authScreens = [
      'signin-screen',
      'signup-screen',
      'walkthrough-screen',
      'otp-screen',
      'forgot-password-screen',
      'reset-password-screen',
    ];
    if (authScreens.includes(currentRoute?.name)) return;

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
      }
    }
  };

  return (
    <AuthContext.Provider value={{country, user, reloadAuth}}>
      {children}
    </AuthContext.Provider>
  );
};
