import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  FlatList,
} from 'react-native';
import {styles} from './style';
import {ScreenView} from '../../../global/wrappers';
import {BLACK, WHITE} from '../../../global/theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {countryList} from '../../../constants/data/auth';
import tw from 'twrnc';
import IdSelectorModal from '../../../components/modals/IdSelectorModal';
import {useKYC} from '../../../hooks/auth.hook';
import {CustomButton} from '../../../global/components';
import Toast from 'react-native-toast-message';
import {useDispatch, useSelector} from 'react-redux';
import {updateKyc} from '../../../contexts/actions/user';
import AsyncStorage from '@react-native-async-storage/async-storage';


const ResidenceScreen = ({navigation, route}) => {
  const {idNumber, expiryDate, documentImage, documentType, selfieImage} =
    route?.params || {};
  const dispatch = useDispatch();
  const {kyc} = useSelector(state => state.user);
  const [country, setCountry] = useState(kyc.country || '');
  const [phoneNumber, setPhoneNumber] = useState(kyc.phoneNumber || '');
  const [validCountry, setValidCountry] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalId, setModalId] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCountries, setFilteredCountries] = useState(countryList);
  const [validPhone, setValidPhone] = useState(false);

  const {mutate: submitKYC, status} = useKYC();

  useEffect(() => {
    dispatch(updateKyc({country, phoneNumber}));
  }, [country, phoneNumber, dispatch]);
  useEffect(() => {
    if (kyc.country) setValidCountry(true);
    if (kyc.phoneNumber && /^\d{7,15}$/.test(kyc.phoneNumber))
      setValidPhone(true);
  }, [kyc]);
  const handlePhoneChange = text => {
    setPhoneNumber(text);
    setValidPhone(/^\d{7,15}$/.test(text));
  };

  const handleSearch = query => {
    setSearchQuery(query);
    setFilteredCountries(
      countryList.filter(c =>
        c.name.toLowerCase().includes(query.toLowerCase()),
      ),
    );
  };

  const handleCountrySelect = c => {
    setCountry(c.name);
    setModalVisible(false);
    setValidCountry(true);
  };

  const handleSubmit = () => {
    if (
      !idNumber ||
      !expiryDate ||
      !documentImage ||
      !documentType ||
      !selfieImage
    ) {
      Toast.show({type: 'error', text1: 'Missing document details'});
      return;
    }

    if (!validCountry) {
      Toast.show({
        type: 'error',
        text1: 'Please select your country of residence',
      });
      return;
    }

    if (!validPhone) {
      Toast.show({type: 'error', text1: 'Please enter a valid phone number'});
      return;
    }

    const formData = new FormData();
    formData.append('idNumber', idNumber);
    formData.append('expiryDate', expiryDate);
    formData.append('documentType', documentType);
    formData.append('country', country);
    formData.append('phoneNumber', phoneNumber);
    formData.append('tier', 1);

    formData.append('documentImage', {
      uri: documentImage,
      type: 'image/jpeg',
      name: 'document.jpg',
    });

    formData.append('selfieImage', {
      uri: selfieImage,
      type: 'image/jpeg',
      name: 'selfie.jpg',
    });

    submitKYC(formData, {
      onSuccess: async () => {
        await AsyncStorage.setItem('userCountry', 'Sierra Leone');
      
        navigation.reset({
          index: 0,
          routes: [{ name: 'bottom-tab' }],
        });
      
        Toast.show({
          type: 'success',
          text1: 'KYC submitted successfully',
        });
      },
      onError: error => {
        Toast.show({
          type: 'error',
          text1:
            error?.response?.data?.message ??
            error?.response?.data?.error ??
            'Failed to submit KYC. Try again.',
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
            <Text style={styles.text1}>Country of Residence</Text>
            <Text style={styles.text11}>
              Please select your country of residence
            </Text>
          </View>

          <TouchableOpacity
            style={tw`w-full border flex flex-row justify-between p-3 bg-[#F8F8FA] rounded-[5px] border-[#D0D5DD]`}
            onPress={() => setModalVisible(true)}>
            <Text style={styles.placeholderText}>
              {country || 'Select your Country of Residence'}
            </Text>
            <Ionicons name="chevron-down" size={16} color={BLACK} />
          </TouchableOpacity>

          <View style={tw`w-full mt-4`}>
            <Text style={tw`text-gray-900 text-[15px]`}>Phone Number</Text>
            <Text style={styles.text11}>
              Enter your phone number associated with this country
            </Text>

            <View
              style={tw`w-full border flex flex-row items-center p-3 bg-[#F8F8FA] rounded-[5px] border-[#D0D5DD] mt-2`}>
              <Ionicons
                name="call-outline"
                size={18}
                color={BLACK}
                style={tw`mr-2`}
              />
              <TextInput
                style={styles.placeholderText}
                placeholder="Enter phone number"
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={handlePhoneChange}
                placeholderTextColor="gray"
              />
            </View>

            {!validPhone && phoneNumber.length > 0 && (
              <Text style={tw`text-red-500 text-[12px] mt-1`}>
                Please enter a valid phone number
              </Text>
            )}
          </View>

          <View style={styles.v21}>
            <Text style={styles.text14}>Tier 1 Requirement</Text>
            <View style={styles.v22}>
              <TouchableOpacity
                style={styles.v4}
                activeOpacity={0.65}
                onPress={() => setModalId(true)}>
                <View style={styles.rowViewN}>
                  <Image
                    source={require('../../../../assets/icons/shield-face.png')}
                    style={tw`w-[20px] h-[20px] mr-[10px]`}
                    resizeMode="contain"
                  />
                  <View>
                    <Text style={styles.text15}>Identity Verification</Text>
                    <Text style={styles.text16}>
                      Uploading of any valid Government Issued Means of
                      Verification
                    </Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" color={BLACK} size={16} />
              </TouchableOpacity>

              {idNumber ||
              expiryDate ||
              documentImage ||
              documentType ||
              selfieImage ? (
                <View style={tw`absolute right-2 top-2`}>
                  <Ionicons name="checkmark-circle" size={24} color="green" />
                </View>
              ) : null}
            </View>
          </View>

          <CustomButton onPress={handleSubmit} loading={status === 'pending'} />

          <Text style={styles.text17}>
            By clicking, you consent to provide us with the requested data.
          </Text>
        </View>

        {/* Country Selector Modal */}
        <Modal
          transparent
          animationType="slide"
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search for a country"
                placeholderTextColor="gray"
                value={searchQuery}
                onChangeText={handleSearch}
              />
              <FlatList
                data={filteredCountries}
                keyExtractor={item => item.code}
                renderItem={({item}) => (
                  <TouchableOpacity
                    style={styles.countryItem}
                    onPress={() => handleCountrySelect(item)}>
                    <Text style={styles.countryText}>{item.name}</Text>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* ID Selector Modal */}
        <Modal
          transparent
          animationType="slide"
          visible={modalId}
          onRequestClose={() => setModalId(false)}>
          <View style={tw`flex-1 justify-end bg-black bg-opacity-50`}>
            <IdSelectorModal closeModal={() => setModalId(false)} />
          </View>
        </Modal>
      </ScrollView>
    </ScreenView>
  );
};

export default ResidenceScreen;
