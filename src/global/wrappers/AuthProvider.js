import React, {createContext, useEffect, useRef, useState} from 'react';
import {AppState} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CommonActions} from '@react-navigation/native';
import {useGetUser} from '../../hooks/user.hook';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const navigation = useNavigation();
  const INACTIVITY_TIMEOUT = (1 * 60 * 1000) / 2;
  const lastActiveRef = useRef(Date.now());
  const {data: user} = useGetUser();

  const [country, setCountry] = useState(null);

  const isUserAuthenticated = currentRoute => {
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
  };

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

          if (timeDifference >= INACTIVITY_TIMEOUT) {
            handleInactivity();
          }
        }
      } catch (error) {
        console.error('Error checking inactivity on start:', error);
      }
    };

    checkInactivityOnStart();

    return () => {
      subscription.remove();
    };
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

        if (timeDifference >= INACTIVITY_TIMEOUT) {
          handleInactivity();
        }
      }
    }
  };

  const handleInactivity = async () => {
    await AsyncStorage.removeItem('backgroundTime');
    const isLoggedIn = JSON.parse(await AsyncStorage.getItem('Login'));
    const currentRoute =
      navigation.getState().routes[navigation.getState().index];

    if (isLoggedIn) {
      if (isLoggedIn?.status === 'inactive') {
        navigation.navigate('otp-screen', {
          emailAddress: isLoggedIn?.emailAddress,
        });
        return;
      } else if (isLoggedIn?.isPasscodeSet) {
        isUserAuthenticated(currentRoute);
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
    }
  };

  return (
    <AuthContext.Provider value={{country, user}}>
      {children}
    </AuthContext.Provider>
  );
};
