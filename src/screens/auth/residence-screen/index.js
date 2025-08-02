import React, {useRef, useState} from 'react';
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
import {Tier1Req} from '../../../constants/data/auth';
import {countryList} from '../../../constants/data/auth';
import tw from 'twrnc';
import IdSelectorModal from '../../../components/modals/IdSelectorModal';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ResidenceScreen = props => {
  const {navigation, route} = props;
  const {idNumber, expiryDate, documentImage, documentType} =
    route?.params || {};

  const bottomSheetRef = useRef(null);
  const [country, setCountry] = useState('');
  const [validCountry, setValidCountry] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalId, setModalId] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCountries, setFilteredCountries] = useState(countryList);
  const [departureModalOpen, setDepartureModalOpen] = useState(false);

  const saveData = async () => {
    try {
      await AsyncStorage.setItem('@idNumber', idNumber);
      await AsyncStorage.setItem('@expiryDate', expiryDate);
      await AsyncStorage.setItem('@documentImage', documentImage);
      await AsyncStorage.setItem('@documentType', documentType);
      await AsyncStorage.setItem('@country', country);
    } catch (e) {
      console.log('Error saving data:', e);
    }
  };

  const handleSearch = query => {
    setSearchQuery(query);
    const filtered = countryList.filter(country =>
      country.name.toLowerCase().includes(query.toLowerCase()),
    );
    setFilteredCountries(filtered);
  };

  const handleCountrySelect = country => {
    setCountry(country.name);
    setModalVisible(false);
    setValidCountry(true);
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
                    style={{width: 18, height: 18, marginRight: 10}}
                    resizeMode={'contain'}
                  />
                  <View>
                    <Text style={styles.text15}>Identity Verification</Text>
                    <Text style={styles.text16}>
                      Uploading of any valid Government Issued Means of
                      Verification
                    </Text>
                  </View>
                </View>
                <Ionicons name={'chevron-forward'} color={BLACK} size={16} />
              </TouchableOpacity>
              {Tier1Req.map((item, index) => {
                const isDisabled = !validCountry;
                return (
                  <TouchableOpacity
                    style={styles.v4}
                    key={index}
                    activeOpacity={0.65}
                    disabled={isDisabled}
                    onPress={() => {
                      saveData().then(() => {
                        navigation.navigate(item.route);
                      });
                    }}>
                    <View style={styles.rowViewN}>
                      <Image
                        source={item.icon}
                        style={{width: 18, height: 18, marginRight: 10}}
                        resizeMode={'contain'}
                      />
                      <View>
                        <Text style={styles.text15}>{item.title}</Text>
                        <Text style={styles.text16}>{item.content}</Text>
                      </View>
                    </View>
                    <Ionicons
                      name={'chevron-forward'}
                      color={BLACK}
                      size={16}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <Text style={styles.text17}>
            By clicking, you consent to provide us with the requested data.
          </Text>
        </View>
        <Modal
          transparent={true}
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
        <Modal
          transparent={true}
          animationType="slide"
          visible={modalId}
          onRequestClose={() => setModalVisible(false)}>
          <View style={tw`flex-1 justify-end bg-black bg-opacity-50`}>
            <IdSelectorModal closeModal={() => setModalId(false)} />
          </View>
        </Modal>
      </ScrollView>
    </ScreenView>
  );
};

export default ResidenceScreen;
