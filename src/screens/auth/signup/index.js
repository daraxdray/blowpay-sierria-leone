import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  Platform,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { styles } from './style';
import { ScreenView } from '../../../global/wrappers';
import { BLACK, WHITE } from '../../../global/theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { CustomButton } from '../../../global/components';
import CountryPicker from 'react-native-country-picker-modal';

const Signup = props => {
  const navigation = props.navigation;

  const [countryCode, setCountryCode] = useState('NG'); // default to Nigeria
  const [callingCode, setCallingCode] = useState('234');
  const [withCallingCode, setWithCallingCode] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showCountryModal, setShowCountryModal] = useState(false);

  const _constructor = () => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(WHITE);
    }
  };

  useEffect(() => {
    _constructor();
  }, []);

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
            <Text style={styles.text1}>Mobile Identification</Text>
            <Text style={styles.text11}>
              We verify your phone number in order to tailor your experience to
              the right country or region
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.text}>Phone Number</Text>
            <View style={styles.phoneInputWrapper}>
              <TouchableOpacity
                onPress={() => setShowCountryModal(true)}
                style={styles.countryPickerButton}>
                <CountryPicker
                  {...{
                    countryCode,
                    withFilter: true,
                    withFlag: true,
                    withCallingCode: true,
                    withEmoji: true,
                    withAlphaFilter: true,
                    withCallingCodeButton: true,
                    onSelect: country => {
                      setCountryCode(country.cca2);
                      setCallingCode(country.callingCode[0]);
                    },
                  }}
                  visible={showCountryModal}
                  onClose={() => setShowCountryModal(false)}
                />
                <Text style={styles.callingCode}>+{callingCode}</Text>
              </TouchableOpacity>

              <TextInput
                style={styles.phoneInput}
                placeholder="Phone Number"
                placeholderTextColor="#ccc"
                onChangeText={text => setPhoneNumber(text)}
                value={phoneNumber}
                keyboardType="phone-pad"
                maxLength={15}
              />
            </View>
          </View>

          <View style={styles.v3}>
            <CustomButton
              onPress={() => navigation.navigate('register-info-screen')}
              style={styles.btn1}
              text={'Continue'}
            />
          </View>
        </View>
      </ScrollView>
    </ScreenView>
  );
};

export default Signup;