import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Image,
  TextInput,
  Platform,
  Linking,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';
import {styles} from './style';
import {ScreenView} from '../../../global/wrappers';
import {BLACK, GREY, SEMI_PRIMARY_COLOR, WHITE} from '../../../global/theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {CustomButton} from '../../../global/components';
import DateModal from '../../../components/bookFlight/DateModal';
import {Checkbox} from 'react-native-paper';
import tw from 'twrnc';
import {Formik} from 'formik';
import * as Yup from 'yup';
import AppConstant from '../../../constants/data/appConstant';

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required('Legal first name is required'),
  lastName: Yup.string().required('Legal last name is required'),
  emailAddress: Yup.string()
    .email('Invalid email')
    .required('Email is required'),
  // phoneNumber: Yup.string().required('Phone number is required'),
  username: Yup.string().required('Username is required'),
  dateOfBirth: Yup.string().required('Date of Birth is required'),
  terms: Yup.boolean().oneOf(
    [true],
    'You must accept the Terms of Service and Privacy Policy',
  ),
});

const RegisterInfo = props => {
  const navigation = props.navigation;

  const [departureModalOpen, setDepartureModalOpen] = useState(false);
  useEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(WHITE);
    }
  }, []);

  const handleContinue = values => {
    navigation.navigate('setup-password-screen', values);
  };

  // In your component
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      e => {
        setKeyboardHeight(e.endCoordinates.height);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
      },
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <ScreenView
      style={[styles.container, {marginBottom: keyboardHeight}]}
      light
      color={WHITE}>
      <KeyboardAvoidingView>
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
              <Text style={styles.text1}>Tell us more about you</Text>
            </View>
            <Formik
              initialValues={{
                firstName: '',
                lastName: '',
                emailAddress: '',
                phoneNumber: '',
                username: '',
                dateOfBirth: '',
              }}
              validationSchema={validationSchema}
              onSubmit={handleContinue}>
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
                setFieldValue,
              }) => (
                <View style={styles.v2}>
                  <View style={styles.inputContainer}>
                    <Text style={styles.text}>Legal first name</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Legal first name"
                      placeholderTextColor="#ccc"
                      onChangeText={handleChange('firstName')}
                      onBlur={handleBlur('firstName')}
                      value={values.firstName}
                    />
                    {errors.firstName && touched.firstName && (
                      <Text style={styles.errorText}>{errors.firstName}</Text>
                    )}
                  </View>
                  <View style={styles.inputContainer}>
                    <Text style={styles.text}>Legal last name</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Legal last name"
                      placeholderTextColor="#ccc"
                      onChangeText={handleChange('lastName')}
                      onBlur={handleBlur('lastName')}
                      value={values.lastName}
                    />
                    {errors.lastName && touched.lastName && (
                      <Text style={styles.errorText}>{errors.lastName}</Text>
                    )}
                  </View>
                  <View style={tw`mb-3`}>
                    <Text style={styles.dateOfBirthLabel}>Date of Birth</Text>
                    <TouchableOpacity
                      onPress={() => setDepartureModalOpen(true)}
                      style={[tw`flex justify-center`, styles.input]}>
                      <View>
                        <Text style={tw`text-[13px] text-gray-900`}>
                          {values.dateOfBirth
                            ? values.dateOfBirth
                            : 'Select Date'}
                        </Text>
                      </View>
                    </TouchableOpacity>
                    {errors.dateOfBirth && touched.dateOfBirth && (
                      <Text style={styles.errorText}>{errors.dateOfBirth}</Text>
                    )}
                  </View>
                  <View style={styles.inputContainer}>
                    <Text style={styles.text}>Email</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="you@email.com"
                      placeholderTextColor="#ccc"
                      onChangeText={handleChange('emailAddress')}
                      onBlur={handleBlur('emailAddress')}
                      value={values.emailAddress}
                      keyboardType="email-address"
                      autoComplete="email"
                      textContentType="emailAddress"
                    />
                    {errors.emailAddress && touched.emailAddress && (
                      <Text style={styles.errorText}>
                        {errors.emailAddress}
                      </Text>
                    )}
                  </View>
                  {/* <View style={styles.inputContainer}>
                    <Text style={styles.text}>Phone Number</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Phone Number"
                      placeholderTextColor="#ccc"
                      onChangeText={handleChange('phoneNumber')}
                      onBlur={handleBlur('phoneNumber')}
                      value={values.phoneNumber}
                      keyboardType="phone-pad"
                      maxLength={11}
                    />
                    {errors.phoneNumber && touched.phoneNumber && (
                      <Text style={styles.errorText}>{errors.phoneNumber}</Text>
                    )}
                  </View> */}
                  <View style={styles.inputContainer}>
                    <Text style={styles.text}>Username</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Username"
                      placeholderTextColor="#ccc"
                      onChangeText={text =>
                        handleChange('username')(text.toLowerCase())
                      }
                      onBlur={handleBlur('username')}
                      value={values.username}
                    />
                    {errors.username && touched.username && (
                      <Text style={styles.errorText}>{errors.username}</Text>
                    )}
                  </View>
                  <View style={styles.v21}>
                    <View style={styles.rowView}>
                      <Image
                        style={styles.icon}
                        source={require('../../../../assets/icons/shield2.png')}
                      />
                      <Text style={styles.text13}>
                        By signing up, you agree to the{' '}
                        <Text
                          style={[styles.underlineText]}
                          onPress={() =>
                            Linking.openURL(
                              `https://${
                                Platform.OS === 'ios' ||
                                AppConstant.isAmazonStore
                                  ? 'BlowPay.app/terms-and-conditions'
                                  : 'https://billsbyblowmoney.com/terms.html'
                              }`,
                            )
                          }>
                          Terms of Service
                        </Text>{' '}
                        and{' \n'}
                        <Text
                          style={styles.underlineText}
                          onPress={() =>
                            Linking.openURL(
                              `https://${
                                Platform.OS === 'ios' ||
                                AppConstant.isAmazonStore
                                  ? 'BlowPay.app/policy'
                                  : 'https://billsbyblowmoney.com/terms.html'
                              }`,
                            )
                          }>
                          {' '}
                          Privacy Policy
                        </Text>
                      </Text>
                    </View>

                    <View style={[styles.rowView]}>
                      <Checkbox
                        status={values.terms ? 'checked' : 'unchecked'}
                        onPress={() => setFieldValue('terms', !values.terms)}
                        color={SEMI_PRIMARY_COLOR}
                        uncheckedColor={GREY}
                      />
                      <Text style={styles.checkboxText}>
                        Send me updates and newsletter about{' '}
                        {Platform.OS === 'ios' || AppConstant.isAmazonStore
                          ? 'BlowPay'
                          : 'BillsByBlowmoney'}{' '}
                        products & services
                      </Text>
                    </View>
                    {errors.terms && touched.terms && (
                      <Text style={styles.errorText}>{errors.terms}</Text>
                    )}
                  </View>

                  {/* Date Modal */}
                  <DateModal
                    visible={departureModalOpen}
                    onClose={() => setDepartureModalOpen(false)}
                    onDateChange={date => setFieldValue('dateOfBirth', date)}
                    selectedDate={values.dateOfBirth}
                  />
                  <View style={styles.v3}>
                    <CustomButton
                      onPress={handleSubmit}
                      style={styles.btn1}
                      text={'Continue'}
                    />
                  </View>
                </View>
              )}
            </Formik>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenView>
  );
};

export default RegisterInfo;
