import React, {useState} from 'react';
import {View, Text, ScrollView, TouchableOpacity} from 'react-native';
import {styles} from './style';
import {ScreenView} from '../../../global/wrappers';
import {BLACK, PRIMARY_COLOR, WHITE} from '../../../global/theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import OTPTextView from 'react-native-otp-textinput';
import {useConfirmPasscode} from '../../../hooks/auth.hook';
import Toast from 'react-native-toast-message';
import Loader from '../../../components/modals/Loader';
import {CommonActions} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch} from 'react-redux';
import {loginSuccess} from '../../../contexts/actions/user';
import {saveUserCredentials} from '../../../utils/storage';
import {useGetUser} from '../../../hooks/user.hook';
import {CustomButton} from '../../../global/components';
import useBiometricAuth from '../../../hooks/biometric.hook';

const ConfirmPin = props => {
  const navigation = props.navigation;
  const {mutate: confirmPasscode, status} = useConfirmPasscode();
  const {data: user, status: fetchingUser} = useGetUser();
  const [otp, setOtp] = useState();
  const {isBiometricExist, keyFound} = useBiometricAuth();
  const dispatch = useDispatch();
  const _setOtp = value => {
    setOtp(value);

    if (value.length === 6) {
      handleVerify(value);
    }
  };

  const handleVerify = value => {
    const userData = {
      passcode: value,
    };

    confirmPasscode(userData, {
      onSuccess: async data => {
        if (data) {
          try {
            dispatch(loginSuccess());
            const kyc = JSON.parse(await AsyncStorage.getItem('userKyc'));
            const storedLogin = await AsyncStorage.getItem('Login');
            const userDataFromStorage = storedLogin
              ? JSON.parse(storedLogin)
              : null;
            if (userDataFromStorage?.emailAddress && userData.passcode) {
              saveUserCredentials(
                userDataFromStorage.emailAddress,
                userData.passcode,
              );
            }

            if (!keyFound && isBiometricExist) {
              navigation.navigate('biometric-screen');
            } else if (kyc) {
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{name: 'bottom-tab'}],
                }),
              );
            } else {
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{name: 'residence-screen'}],
                }),
              );
            }
          } catch (error) {
            console.error('Failed to save user data', error);
          }
        } else {
          Toast.show({
            type: 'error',
            text1: 'Passcode confirm  failed',
          });
        }
      },
      onError: error => {
        Toast.show({
          type: 'error',
          text1: 'Passcode confirm ',
          text2:
            error?.response.data.error ||
            error?.message ||
            'An error occurred. Please try again.',
        });
      },
    });
  };
  return (
    <ScreenView style={styles.container} light color={WHITE}>
      <ScrollView style={styles.viewContainer}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.btn}
            activeOpacity={0.65}
            onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={13} color={BLACK} />
          </TouchableOpacity>
        </View>
        <View style={styles.view1}>
          <View style={styles.v1}>
            <Text style={styles.text1}>Confirm 6-digit PIN</Text>
            <Text style={styles.text11}>
              You’ll use this PIN to sign in and confirm transactions.
            </Text>
          </View>

          <View style={styles.v2}>
            <OTPTextView
              inputCellLength={1}
              containerStyle={styles.containerOtp}
              textInputStyle={styles.inputOtp}
              handleTextChange={val => _setOtp(val)}
              tintColor={PRIMARY_COLOR}
              inputCount={6}
              secureTextEntry={true}
              keyboardType={'number-pad'}
            />
          </View>

          {!user?.data?.isPasscodeSet && (
            <View style={styles.v3}>
              <Text style={[styles.text13]}>You will need to set pin </Text>
              <CustomButton
                onPress={() => navigation.navigate('create-pin-screen')}
                style={styles.btn1}
                text={'Set New Pin'}
              />
            </View>
          )}
        </View>
      </ScrollView>
      {(status === 'pending' || fetchingUser === 'pending') && <Loader />}
    </ScreenView>
  );
};

export default ConfirmPin;
