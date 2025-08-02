import React, { createContext, useEffect, useRef } from 'react';
import { AppState, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';
import { useGetUser } from '../../hooks/user.hook';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigation = useNavigation();
  const INACTIVITY_TIMEOUT = (1 * 60 * 1000) / 2;
  const lastActiveRef = useRef(Date.now());
  // const routeState = useRoute();
  const { data: user } = useGetUser();

  const isUserAuthenticated = (currentRoute) => {
    console.log("AUTHENTICATED")
    // if (Platform.OS == 'android' && (user?.message == "Unauthorized" || user?.data == undefined)) {
    //   navigation.dispatch(
    //     CommonActions.reset({
    //       index: 0,
    //       routes: [{name: 'signin-screen',params:{"currentRoute":currentRoute.name}}],
    //     }),
    //   );
    // }
    // else {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'TransactionPinScreen', params: { "currentRoute": currentRoute.name } }],
      }),
    );
    // }
  }


  useEffect(() => {

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    const checkInactivityOnStart = async () => {
      try {
        const storedTime = await AsyncStorage.getItem('backgroundTime');
        console.log('Starting check on app open - storedTime:', storedTime);

        if (storedTime) {
          const currentTime = Date.now();
          const backgroundTime = parseInt(storedTime, 10);
          const timeDifference = currentTime - backgroundTime;

          console.log('Time difference on app open:', timeDifference);

          if (timeDifference >= INACTIVITY_TIMEOUT) {
            console.log(
              'Navigating to TransactionPinScreen due to inactivity on app start',
            );
            handleInactivity();
          }
        } else {

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
      console.log('App moved to background at:', currentTime);
    } else if (nextAppState === 'active') {
      const currentTime = Date.now();
      const storedTime = await AsyncStorage.getItem('backgroundTime');
      // console.log('App moved to active, backgroundTime was:', storedTime);

      if (storedTime) {
        const backgroundTime = parseInt(storedTime, 10);
        const timeDifference = currentTime - backgroundTime;

        // console.log('Time difference on app active:', timeDifference);

        if (timeDifference >= INACTIVITY_TIMEOUT) {
          // console.log(
          //   'Navigating to TransactionPinScreen due to inactivity on app active',
          // );
          handleInactivity();
        }
      }
    }
  };

  const handleInactivity = async () => {
    // console.log('Navigating to TransactionPinScreen due to inactivity', user);
    await AsyncStorage.removeItem('backgroundTime');
    const isLoggedIn = JSON.parse( await AsyncStorage.getItem('Login'));
    const currentRoute = navigation.getState().routes[navigation.getState().index];
    if (isLoggedIn) {
      console.log("going irto",isLoggedIn)
      if (isLoggedIn?.status == "inactive") {
        navigation.navigate('otp-screen', { emailAddress: isLoggedIn?.emailAddress, });
        return
      }
      
      else if ((isLoggedIn && isLoggedIn?.isPasscodeSet)) {
        isUserAuthenticated(currentRoute)
      }
      else {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'create-pin-screen', params: { "currentRoute": currentRoute.name } }],
          }),);

      }
    } else {



    }
  };

  return <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>;
};
