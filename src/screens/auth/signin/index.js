import React, {useEffect, useState, useContext} from 'react';
import {View, Text, ScrollView, TouchableOpacity} from 'react-native';
import Toast from 'react-native-toast-message';
import {styles} from './style';
import {ScreenView} from '../../../global/wrappers';
import {BLACK, WHITE} from '../../../global/theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomTextInput from '../../../global/components/CustomTextInput';
import {CustomButton} from '../../../global/components';
import {useLogin} from '../../../hooks/auth.hook.js';
import Loader from '../../../components/modals/Loader.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CommonActions} from '@react-navigation/native';
import useBiometricAuth from '../../../hooks/biometric.hook.js';
import {loginSuccess} from '../../../contexts/actions/user/index.js';
import {useDispatch} from 'react-redux';
import {AuthContext} from '../../../global/wrappers/AuthProvider';
import {getUserPincode} from '../../../utils/storage.js';

const Signin = props => {
  const navigation = props.navigation;
  const [email, setEmail] = useState('');
  const [validEmail, setValidEmail] = useState(false);
  const [password, setPass] = useState('');
  const [validPass, setValidPass] = useState(false);
  const {reloadAuth} = useContext(AuthContext);
  const {mutate: loginUser, status} = useLogin();
  const {isBiometricExist, keyFound, handleBiometricAuth, deleteKey} =
    useBiometricAuth();
  const dispatch = useDispatch();

  const handleLogin = () => {
    if (!validEmail || !validPass) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please ensure both email and password are valid.',
      });

      return;
    }

    const userData = {
      emailAddress: email,
      password,
    };

    loginUser(userData, {
      onSuccess: async data => {
        if (data.data != null) {
          try {
            if (data?.data?.country) {
              await AsyncStorage.setItem('userCountry', data.data.country);
            }
            await AsyncStorage.setItem('userCountry', data.data.country);
            await AsyncStorage.setItem('Login', JSON.stringify(data.data));
            console.log('🌍 Country saved:', data.data.country);
            await reloadAuth();

            const det = await getUserPincode();
            if (data?.data?.status === 'inactive') {
              navigation.navigate('otp-screen', {
                emailAddress: email,
                triggerSend: true,
              });
              return;
            }
            if (!det) {
              navigation.navigate('ConfirmPin');
              return;
            }

            dispatch(loginSuccess()); ///stores login status
            if (!keyFound && isBiometricExist) {
              navigation.navigate('biometric-screen');
            } else {
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{name: 'bottom-tab'}],
                }),
              );
            }
            //check if biometric exist and create key and store if it does not else moves to home page
          } catch (error) {
            console.error('Failed to save user data', error);
            Toast.show({
              type: 'error',
              text1: 'Storage Error',
              text2: 'Unable to save your login status. Please try again.',
            });
          }
        } else {
          Toast.show({
            type: 'error',
            text1: 'An error occurred',
            text2:
              'Please ensure you have created an account before logging in.',
          });
        }
      },
      onError: error => {
        if (
          error.response.data.error ===
          'account not active. Please verify account'
        ) {
          navigation.navigate('otp-screen', {emailAddress: email});
          return;
        }
        Toast.show({
          type: 'error',
          text1: 'Login Error',
          text2:
            error?.response?.data?.error ||
            'An error occurred. Please try again.',
        });
      },
    });
  };
  // useEffect(() => {
  //   _constructor();
  // }, []);

  return (
    <ScreenView style={styles.container} light color={WHITE}>
      <ScrollView style={styles.viewContainer}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.btn}
            activeOpacity={0.65}
            onPress={() =>
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{name: 'walkthrough-screen'}],
                }),
              )
            }>
            <Ionicons name="chevron-back" size={13} color={BLACK} />
          </TouchableOpacity>
        </View>
        <View style={styles.view1}>
          <View style={styles.v1}>
            <Text style={styles.text1}>Welcome back</Text>
            <Text style={styles.text11}>
              Let’s get you logged in to get back to managing your daily
              expenses
            </Text>
          </View>

          <View style={styles.v2}>
            <CustomTextInput
              value={email}
              setValue={setEmail}
              placeholder={'you@email.com'}
              label={'Email'}
              title={'Email'}
              autoComplete="email"
              containerStyle={styles.inputCont1}
              inputStyle={styles.input1}
              email
              valid={validEmail}
              setCheck={setValidEmail}
            />

            <CustomTextInput
              value={password}
              setValue={setPass}
              placeholder={'*******'}
              label={'Password'}
              title={'Password'}
              containerStyle={styles.inputCont1}
              inputStyle={styles.input1}
              pass={true}
              valid={validPass}
              setCheck={setValidPass}
            />
          </View>

          <View style={styles.v3}>
            <CustomButton
              onPress={handleLogin}
              style={styles.btn1}
              text={'Sign In'}
            />

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate('forgot-password-screen')}>
              <Text style={styles.text12}>I forgot my password</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      {status === 'pending' && <Loader />}
    </ScreenView>
  );
};

export default Signin;
