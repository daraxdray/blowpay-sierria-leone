import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Linking,
} from 'react-native';
import {styles} from './style';
import {ScreenView} from '../../../global/wrappers';
import {BLACK, WHITE, GREY, DARK_GREY} from '../../../global/theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Formik} from 'formik';
import * as Yup from 'yup';
import Toast from 'react-native-toast-message';
import {useRegisterUser} from '../../../hooks/auth.hook';
import {CustomButton} from '../../../global/components';
import Loader from '../../../components/modals/Loader';
import AppConstant from '../../../constants/data/appConstant';

// Validation schema
const validationSchema = Yup.object().shape({
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .matches(/[A-Z]/, 'Password must have at least one uppercase letter')
    .matches(/[a-z]/, 'Password must have at least one lowercase letter')
    .matches(/[0-9]/, 'Password must have at least one number')
    .matches(/[!@#$%^&*]/, 'Password must have at least one special character')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
});

const PasswordConstraint = ({label, condition}) => (
  <TouchableOpacity style={styles.consPass}>
    <Text style={[styles.text14, {color: condition ? 'red' : GREY}]}>
      {label}
    </Text>
    <Ionicons name="checkmark" size={15} color={condition ? 'red' : GREY} />
  </TouchableOpacity>
);

const SetupPassword = ({navigation, route}) => {
  if (!route?.params) return null;
  const [isVisible, setIsVisible] = useState(true);
  const {firstName, lastName, emailAddress, dateOfBirth, username} =
    route.params;
  const {mutate: registerUser, status, isLoading} = useRegisterUser();

  const handleRegister = values => {
    const userData = {
      firstName,
      lastName,
      emailAddress,
      username,
      dateOfBirth,
      password: values.password,
    };
    console.log(userData);

    registerUser(userData, {
      onSuccess: data => {
        if (data) {
          navigation.navigate('otp-screen', {emailAddress});
        } else {
          Toast.show({
            type: 'error',
            text1: 'Registration failed',
            text2:
              'Something went wrong in your registration, please try again.',
          });
        }
      },
      onError: error => {
        Toast.show({
          type: 'error',
          text1: 'Registration Error',
          text2:
            error?.response?.data?.error ||
            error?.message ||
            'An error occurred. Please try again.',
        });
      },
    });
  };

  const validateConstraints = password => ({
    isMinLength: password.length >= 6,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[!@#$%^&*]/.test(password),
  });

  return (
    <View style={{flex: 1}}>
      <ScreenView style={styles.container} light color={WHITE}>
        <ScrollView style={styles.viewContainer}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.btn}
              onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back" size={13} color={BLACK} />
            </TouchableOpacity>
          </View>
          <View style={styles.view1}>
            <View style={styles.v1}>
              <Text style={styles.text1}>Setup your password</Text>
            </View>

            <Formik
              initialValues={{password: '', confirmPassword: ''}}
              validationSchema={validationSchema}
              onSubmit={handleRegister}>
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
              }) => {
                const {
                  isMinLength,
                  hasUppercase,
                  hasLowercase,
                  hasNumber,
                  hasSpecialChar,
                } = validateConstraints(values.password);

                return (
                  <View>
                    {['Password', 'Confirm Password'].map((field, idx) => (
                      <View key={idx} style={styles.inputContainer}>
                        <Text style={styles.text}>{field}</Text>
                        <View
                          style={[
                            {
                              width: '100%',
                              flexDirection: 'row',
                              alignItems: 'center',
                            },

                            touched[
                              idx === 0 ? 'password' : 'confirmPassword'
                            ] &&
                            errors[idx === 0 ? 'password' : 'confirmPassword']
                              ? {borderColor: 'red'}
                              : {},
                          ]}>
                          <TextInput
                            value={
                              values[idx === 0 ? 'password' : 'confirmPassword']
                            }
                            onChangeText={handleChange(
                              idx === 0 ? 'password' : 'confirmPassword',
                            )}
                            placeholder="*******"
                            secureTextEntry={isVisible}
                            placeholderTextColor="#ccc"
                            onBlur={handleBlur(
                              idx === 0 ? 'password' : 'confirmPassword',
                            )}
                            style={[{width: '100%'}, styles.input]}
                          />
                          <TouchableOpacity
                            onPress={() => setIsVisible(prev => (prev = !prev))}
                            style={{
                              position: 'absolute',
                              right: 20,
                              padding: 10,
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <View
                              style={{
                                width: 1,
                                backgroundColor: BLACK,
                                height: '160%',
                                marginRight: 15,
                              }}
                            />
                            <>
                              <Ionicons
                                name={isVisible ? 'eye' : 'eye-off'}
                                color={DARK_GREY}
                                size={15}
                                style={{alignSelf: 'center'}}
                              />
                            </>
                          </TouchableOpacity>
                        </View>
                        {touched[idx === 0 ? 'password' : 'confirmPassword'] &&
                          errors[
                            idx === 0 ? 'password' : 'confirmPassword'
                          ] && (
                            <Text style={{color: 'red'}}>
                              {
                                errors[
                                  idx === 0 ? 'password' : 'confirmPassword'
                                ]
                              }
                            </Text>
                          )}
                      </View>
                    ))}

                    <View style={styles.v21}>
                      <Text style={styles.text15}>At Least:</Text>
                      <View style={styles.wrap}>
                        {[
                          '6 Characters',
                          'Uppercase',
                          'Lowercase',
                          'Number',
                          'Special Character',
                        ].map((label, idx) => (
                          <PasswordConstraint
                            key={label}
                            label={label}
                            condition={
                              [
                                isMinLength,
                                hasUppercase,
                                hasLowercase,
                                hasNumber,
                                hasSpecialChar,
                              ][idx]
                            }
                          />
                        ))}
                      </View>

                      <View style={styles.rowView}>
                        <Image
                          style={styles.icon}
                          source={require('../../../../assets/icons/shield2.png')}
                        />
                        <Text style={styles.text13}>
                          By Signing up, you agree to the
                          <Text
                            style={{textDecorationLine: 'underline'}}
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
                            {' '}
                            Terms of Service
                          </Text>{' '}
                          and
                          <Text
                            style={{textDecorationLine: 'underline'}}
                            onPress={() =>
                              Linking.openURL(
                                `https://${
                                  Platform.OS === 'ios' ||
                                  AppConstant.isAmazonStore
                                    ? 'BlowPay.app/terms-and-conditions/policy'
                                    : 'https://billsbyblowmoney.com/terms.html'
                                }`,
                              )
                            }>
                            {' '}
                            Privacy Policy
                          </Text>
                        </Text>
                      </View>
                    </View>

                    <View>
                      <CustomButton
                        disabled={isLoading}
                        onPress={handleSubmit}
                        style={styles.btn1}
                        text={'Continue'}
                      />
                    </View>
                  </View>
                );
              }}
            </Formik>
          </View>
        </ScrollView>
      </ScreenView>

      {status === 'pending' && <Loader />}
    </View>
  );
};

export default SetupPassword;
