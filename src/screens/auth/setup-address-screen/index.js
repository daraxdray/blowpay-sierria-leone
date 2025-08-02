import React, {useRef, useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {styles} from './style';
import {ScreenView} from '../../../global/wrappers';
import {BLACK, WHITE} from '../../../global/theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {CustomButton} from '../../../global/components';
import {Formik} from 'formik';
import * as Yup from 'yup';
import tw from 'twrnc';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useKYC, useUpdateUser} from '../../../hooks/auth.hook';
import Toast from 'react-native-toast-message';
import Loader from '../../../components/modals/Loader';
import {CommonActions} from '@react-navigation/native';

const validationSchema = Yup.object().shape({
  state: Yup.string().required('State is required'),
  localGovernment: Yup.string().required('Local Government is required'),
  address: Yup.string().required('Address is required'),
  houseNumber: Yup.string().required('House Number is required'),
  landmark: Yup.string().optional(),
});

const SetupAddressScreen = props => {
  const navigation = props.navigation;
  const {mutate: KYC, status} = useKYC();
  const {mutate: updateUser} = useUpdateUser();
  const [idNumber, setIdNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [documentImage, setDocumentImage] = useState('');
  const [documentType, setDocumentType] = useState('');
  const [selfieImage, setSelfieImage] = useState('');
  const [country, setCountry] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedIdNumber = await AsyncStorage.getItem('@idNumber');
        const storedExpiryDate = await AsyncStorage.getItem('@expiryDate');
        const storedDocumentImage = await AsyncStorage.getItem(
          '@documentImage',
        );
        const storedDocumentType = await AsyncStorage.getItem('@documentType');
        const storedCountry = await AsyncStorage.getItem('@country');
        const storedSelfieImage = await AsyncStorage.getItem('selfieImage');

        if (storedIdNumber) setIdNumber(storedIdNumber);
        if (storedExpiryDate) setExpiryDate(storedExpiryDate);
        if (storedDocumentImage) setDocumentImage(storedDocumentImage);
        if (storedDocumentType) setDocumentType(storedDocumentType);
        if (storedSelfieImage) setSelfieImage(storedSelfieImage);
        if (storedCountry) setCountry(storedCountry);
      } catch (e) {
        console.error('Failed to load data.', e);
      }
    };

    fetchData();
  }, []);

  const handleRegister = values => {
    const formData = new FormData();
    formData.append('tier', 1);
    formData.append('documentType', documentType);
    formData.append('idNumber', idNumber);
    formData.append('expiryDate', expiryDate);
    formData.append('country', country);

    if (documentImage) {
      formData.append('documentImage', {
        uri: documentImage,
        name:
          documentImage.substring(documentImage.lastIndexOf('/') + 1) ||
          'document.jpg',
        type: 'image/jpeg',
      });
    }

    if (selfieImage) {
      formData.append('selfieImage', {
        uri: selfieImage,
        name:
          selfieImage.substring(selfieImage.lastIndexOf('/') + 1) ||
          'selfie.jpg',
        type: 'image/jpeg',
      });
    }

    KYC(formData, {
      onSuccess: data => {
        if (data) {
          const userData = {
            localGovernment: values.localGovernment,
            state: values.state,
            address: values.address,
            houseNumber: values.houseNumber,
          };

          updateUser(userData, {
            onSuccess: async data => {
              if (data) {
                navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{name: 'bottom-tab'}],
                  }),
                );
                Toast.show({
                  type: 'success',
                  text1: 'Success!',
                  text2:
                    'Your details have been successfully updated. Proceeding to OTP screen.',
                });
                try {
                  console.log('User logged in, setting AsyncStorage.');
                  await AsyncStorage.setItem('Login', JSON.stringify(true));
                  navigation.dispatch(
                    CommonActions.reset({
                      index: 0,
                      routes: [{name: 'bottom-tab'}],
                    }),
                  );
                } catch (error) {
                  console.error('Failed to save user data', error);
                }
              } else {
                Toast.show({
                  type: 'error',
                  text1: 'Update Failed',
                  text2:
                    'Failed to update your user information. Please try again.',
                });
              }
            },
            onError: error => {
              Toast.show({
                type: 'error',
                text1: 'Update Error',
                text2: error?.response?.data?.error ||
                  error?.message ||
                  'An error occurred while updating your information. Please try again.',
              });
            },
          });
        } else {
          Toast.show({
            type: 'error',
            text1: 'KYC Failed',
            text2:
              'KYC verification failed. Please check your documents and try again.',
          });
        }
      },
      onError: error => {
        console.log({ErrorMessage});
        Toast.show({
          type: 'error',
          text1: 'KYC Error',
          text2: error?.response?.data?.error ||
            error?.message ||
            'An error occurred during KYC verification. Please try again.',
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
            <Text style={styles.text1}>Residential Address</Text>
            <Text style={styles.text11}>
              Provide us with your permanent address and residential address
            </Text>
          </View>

          <Formik
            initialValues={{
              state: '',
              localGovernment: '',
              address: '',
              houseNumber: '',
              landmark: '',
            }}
            validationSchema={validationSchema}
            onSubmit={handleRegister}>
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
            }) => (
              <View style={styles.v2}>
                {/* State Input */}
                <View style={tw`w-full`}>
                  <Text style={styles.text}>State</Text>
                  <TextInput
                    value={values.state}
                    onChangeText={handleChange('state')}
                    onBlur={handleBlur('state')}
                    placeholder={'Select State'}
                    style={[styles.inputCont1, {borderRadius: 15}]}
                    placeholderTextColor="#A9A9A9"
                  />
                  {touched.state && errors.state && (
                    <Text style={styles.errorText}>{errors.state}</Text>
                  )}
                </View>

                {/* Local Government Input */}
                <View style={tw`w-full`}>
                  <Text style={styles.text}>Local Government</Text>
                  <TextInput
                    value={values.localGovernment}
                    onChangeText={handleChange('localGovernment')}
                    onBlur={handleBlur('localGovernment')}
                    placeholder={'Select Local Government'}
                    style={[styles.inputCont1, {borderRadius: 15}]}
                    placeholderTextColor="#A9A9A9"
                  />
                  {touched.localGovernment && errors.localGovernment && (
                    <Text style={styles.errorText}>
                      {errors.localGovernment}
                    </Text>
                  )}
                </View>

                {/* Address Input */}
                <View style={tw`w-full`}>
                  <Text style={styles.text}>Address</Text>
                  <TextInput
                    value={values.address}
                    onChangeText={handleChange('address')}
                    onBlur={handleBlur('address')}
                    placeholder={'Enter your detailed address'}
                    style={[styles.inputCont1, {borderRadius: 15}]}
                    placeholderTextColor="#A9A9A9"
                  />
                  {touched.address && errors.address && (
                    <Text style={styles.errorText}>{errors.address}</Text>
                  )}
                </View>

                {/* House Number Input */}
                <View style={tw`w-full`}>
                  <Text style={styles.text}>House Number</Text>
                  <TextInput
                    value={values.houseNumber}
                    onChangeText={handleChange('houseNumber')}
                    onBlur={handleBlur('houseNumber')}
                    placeholder={'House number'}
                    keyboardType="phone-pad"
                    style={[styles.inputCont1, {borderRadius: 15}]}
                    placeholderTextColor="#A9A9A9"
                  />
                  {touched.houseNumber && errors.houseNumber && (
                    <Text style={styles.errorText}>{errors.houseNumber}</Text>
                  )}
                </View>

                {/* Landmark Input */}
                <View style={tw`w-full`}>
                  <Text style={styles.text}>Landmark (Optional)</Text>
                  <TextInput
                    value={values.landmark}
                    onChangeText={handleChange('landmark')}
                    onBlur={handleBlur('landmark')}
                    placeholder={'Select Landmark close to your address'}
                    style={[styles.inputCont1, {borderRadius: 15}]}
                    placeholderTextColor="#A9A9A9"
                  />
                  {touched.landmark && errors.landmark && (
                    <Text style={styles.errorText}>{errors.landmark}</Text>
                  )}
                </View>

                <Text style={styles.text17}>
                  Landmarks could be schools, supermarkets, popular places
                  around your address.
                </Text>

                <CustomButton
                  text={'Proceed'}
                  onPress={handleSubmit}
                  style={{marginVertical: 15}}
                  dark
                />
              </View>
            )}
          </Formik>
        </View>
      </ScrollView>
      {status === 'pending' && <Loader />}
    </ScreenView>
  );
};

export default SetupAddressScreen;
