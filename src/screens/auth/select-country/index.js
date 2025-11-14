import React, {useState} from 'react';
import {View, Text, ScrollView, TouchableOpacity} from 'react-native';
import {styles} from './style';
import {ScreenView} from '../../../global/wrappers';
import {BLACK, WHITE} from '../../../global/theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {CustomButton} from '../../../global/components';
import Toast from 'react-native-toast-message';
import {useChooseCountry} from '../../../hooks/user.hook';
import Loader from '../../../components/modals/Loader';

const CountrySelection = props => {
  const navigation = props.navigation;
  const [selectedCountry, setSelectedCountry] = useState(null);
  const {mutate: chooseCountry, status} = useChooseCountry();

  const countries = [
    {
      id: 'nigeria',
      name: 'Nigeria',
      flag: '🇳🇬',
      code: '+234',
      currency: 'NGN',
    },
    {
      id: 'sierra-leone',
      name: 'Sierra Leone',
      flag: '🇸🇱',
      code: '+232',
      currency: 'SLE',
    },
  ];

  const handleCountrySelect = country => {
    setSelectedCountry(country);
  };

  const handleContinue = () => {
    if (!selectedCountry) {
      Toast.show({
        type: 'error',
        text1: 'Please select a country',
      });
      return;
    }
    chooseCountry(
      {country: selectedCountry.name},
      {
        onSuccess: data => {
          if (selectedCountry.id === 'nigeria') {
            navigation.reset({
              index: 0,
              routes: [{name: 'bottom-tab'}],
            });
          } else if (selectedCountry.id === 'sierra-leone') {
            navigation.navigate('residence-screen');
          }
        },
      },
    );
  };

  return (
    <ScreenView style={styles.container} light color={WHITE}>
      <ScrollView
        style={styles.viewContainer}
        contentContainerStyle={styles.scrollContent}>
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
            <Text style={styles.text1}>Select Your Country</Text>
            <Text style={styles.text11}>
              Choose your country to continue with your account setup.
            </Text>
          </View>

          <View style={styles.countriesContainer}>
            {countries.map(country => (
              <TouchableOpacity
                key={country.id}
                style={[
                  styles.countryCard,
                  selectedCountry?.id === country.id &&
                    styles.countryCardSelected,
                ]}
                activeOpacity={0.7}
                onPress={() => handleCountrySelect(country)}>
                <View style={styles.countryCardContent}>
                  <View style={styles.flagContainer}>
                    <Text style={styles.flagEmoji}>{country.flag}</Text>
                  </View>
                  <View style={styles.countryInfo}>
                    <Text style={styles.countryName}>{country.name}</Text>
                    <Text style={styles.countryDetails}>
                      {country.code} • {country.currency}
                    </Text>
                  </View>
                </View>
                {selectedCountry?.id === country.id && (
                  <View style={styles.checkmark}>
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      color="#4CAF50"
                    />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <CustomButton
          onPress={handleContinue}
          style={styles.continueBtn}
          text={status === 'pending' ? 'Please wait...' : 'Continue'}
          disabled={status === 'pending'}
        />
      </View>
      {status === 'pending' && <Loader />}
    </ScreenView>
  );
};

export default CountrySelection;
