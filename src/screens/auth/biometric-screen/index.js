import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
  Image,
} from 'react-native';
import {styles} from './style';
import {ScreenView} from '../../../global/wrappers';
import {BLACK, WHITE} from '../../../global/theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {CustomButton} from '../../../global/components';
import useBiometricAuth from '../../../hooks/biometric.hook';
import {CommonActions} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Biometric = props => {
  const navigation = props.navigation;
  const {navigateHome, createKey} = useBiometricAuth();
  const activate = async () => {
    await createKey();
    try {
      const storedKyc = await AsyncStorage.getItem('userKyc');
      const kyc = storedKyc ? JSON.parse(storedKyc) : null;
      const storedLogin = await AsyncStorage.getItem('Login');
      const userDataFromStorage = storedLogin ? JSON.parse(storedLogin) : null;
      if (userDataFromStorage?.country === 'Nigeria' || 'Sierra Leone') {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'bottom-tab'}],
          }),
        );
        return;
      }
      if (kyc) {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'bottom-tab'}],
          }),
        );
      } else {
        navigateHome('selectCountry-screen');
      }
    } catch (error) {
      console.error('Error reading KYC data:', error);
    }
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
            <Text style={styles.text1}>Enable Biometrics Access</Text>
            <Text style={styles.text11}>
              Login quickly and securely with the fingerprint or face ID stored
              on this device.
            </Text>
          </View>

          <View style={styles.v2}>
            {Platform.OS === 'ios' ? (
              <Image
                source={require('../../../../assets/icons/face-scan.png')}
                style={styles.image}
                resizeMode="contain"
              />
            ) : (
              <Image
                source={require('../../../../assets/icons/finger-print.png')}
                style={styles.image}
                resizeMode="contain"
              />
            )}
          </View>

          <CustomButton
            onPress={activate}
            style={styles.btn1}
            text={'Confirm Biometric'}
          />
          <CustomButton
            onPress={navigateHome}
            style={styles.btn3}
            // eslint-disable-next-line react-native/no-inline-styles
            textStyle={{color: 'black'}}
            text={'Cancel'}
          />
        </View>
      </ScrollView>
    </ScreenView>
  );
};

export default Biometric;
