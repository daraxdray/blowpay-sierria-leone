import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  FlatList,
  StyleSheet,
} from 'react-native';
import tw from 'twrnc';
import Ionicons from 'react-native-vector-icons/Ionicons';

const networkPrefixes = {
  MTN: ['0703', '0706', '0803', '0806', '0903', '0906'],
  Glo: ['0705', '0805', '0807', '0905'],
  Airtel: ['0701', '0802', '0902', '0907'],
  '9MOBILE': ['0809', '0909'],
};

const options = [
  {
    name: 'Glo',
    image: require('../../../assets/icons/glo.png'),
    id: '49',
    airtimeId: 'BIL102',
    dataId: 'BIL109',
  },
  {
    name: 'Airtel',
    image: require('../../../assets/icons/airtel.png'),
    id: '50',
    airtimeId: 'BIL100',
    dataId: 'BIL110',
  },
  {
    name: '9MOBILE',
    image: require('../../../assets/icons/9mobile.jpeg'),
    id: '51',
    airtimeId: 'BIL103',
    dataId: 'BIL111',
  },
  {
    name: 'MTN',
    image: require('../../../assets/icons/mtn.png'),
    id: '48',
    airtimeId: 'BIL099',
    dataId: 'BIL108',
  },
];



function detectNetwork(number) {
  // Ensure the number is a string, starts with '0', and is at least 4 characters long
  if (typeof number !== 'string' || !number.startsWith('0') || number.length < 4) {
    return 'Invalid number';
  }

  // Define network prefixes
  const networks = {
    'MTN': new Set(['0803', '0806', '0703', '0903', '0906', '0706', '0813', '0810', '0814', '0816', '0913', '0916']),
    'Glo': new Set(['0805', '0705', '0905', '0807', '0815', '0811', '0915']),
    'Airtel': new Set(['0802', '0902', '0701', '0808', '0708', '0812', '0901', '0907']),
    '9mobile (Etisalat)': new Set(['0809', '0909', '0817', '0818', '0908']),
    'Visafone': new Set(['0704', '07025', '07026']),
    'Multilinks': new Set(['0709', '07029']),
    'Starcomms': new Set(['0819', '07028', '07029']),
    'Nitel': new Set(['0804']),
    'Zoom Mobile': new Set(['0707']),
  };

  // Check 5-digit prefixes first, then 4-digit prefixes if necessary
  const prefix5 = number.slice(0, 5);
  const prefix4 = number.slice(0, 4);

  // Determine network
  for (const [network, prefixes] of Object.entries(networks)) {
    if (prefixes.has(prefix5) || prefixes.has(prefix4)) {
      return network;
    }
  }

  return 'Unknown network';
}




const NumberInput = ({
  onOptionSelect,
  phoneNumber,
  setPhoneNumber,
  dataOptionSelect,
}) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState(options[3].name);

  const toggleDropdown = () => {
    setDropdownVisible(prev => !prev);
  };

  const handleOptionSelect = item => {
    setSelectedOption(item.name);
    setDropdownVisible(false);
    onOptionSelect(item.airtimeId);
    dataOptionSelect(item.dataId);
  };
  // const detectNetwork = number => {
  //   const prefix = number.substring(0, 4);
  //   let detectedNetwork = null;

  //   Object.keys(networkPrefixes).forEach(network => {
  //     if (networkPrefixes[network].includes(prefix)) {
  //       detectedNetwork = network;
  //     }
  //   });

  //   return detectedNetwork;
  // };
   

  useEffect(() => {
    if (phoneNumber.length >= 4) {
      const detectedNetwork = detectNetwork(phoneNumber);
      
      if (detectedNetwork) {
        const matchedOption = options.find(
          option => option.name === detectedNetwork,
        );
        if (matchedOption) {
          setSelectedOption(matchedOption.name);
          onOptionSelect(matchedOption.airtimeId);
          dataOptionSelect(matchedOption.dataId);
        }else{
          setSelectedOption(null);
          onOptionSelect(null);
          dataOptionSelect(null);
        }
      }
    }
  }, [phoneNumber]);

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={toggleDropdown}>
          {<Image
            source={
              options.find(option => option.name === selectedOption)?.image ?? require('../../../assets/images/monthly.png')
            }
            style={styles.icon}
          />}
          <Ionicons name="chevron-down" size={20} color="#9C9C9C" />
        </TouchableOpacity>
        <TextInput
          placeholder="Enter Phone number"
          style={styles.input}
          keyboardType="number-pad"
          placeholderTextColor="gray"
          value={phoneNumber}
          maxLength={11}
          onChangeText={setPhoneNumber}
        />
      </View>

      {dropdownVisible && (
        <View style={styles.overlay}>
          <View style={styles.dropdown}>
            <FlatList
              data={options}
              keyExtractor={item => item.name}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => handleOptionSelect(item)}>
                  <Image source={item.image} style={styles.icon} />
                  <Text style={tw`text-black`}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      )}
    </View>
  );
};

export default NumberInput;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 5,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 5,
    alignItems: 'center',
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  icon: {
    width: 32,
    height: 32,
    marginRight: 5,
  },
  input: {
    flex: 1,
    paddingHorizontal: 10,
    borderRadius: 20,
    color: 'black',
  },
  overlay: {
    position: 'absolute',
    top: 50, // Adjust if needed to position the dropdown correctly
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 999,
    width: 150,
  },
  dropdown: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 5,
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    padding: 10,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
});
