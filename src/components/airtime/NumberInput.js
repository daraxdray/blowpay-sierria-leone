/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
  Text,
  Modal,
  Pressable,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  telcos,
  detectNetwork,
  formatSierraLeoneNumber,
} from '../../utils/format';

const defaultNetworks = {
  Nigeria: 'MTN',
  'Sierra Leone': 'Africell',
};

const NumberInput = ({
  country = 'Nigeria',
  phoneNumber = '',
  setPhoneNumber = () => {},
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [manualSelection, setManualSelection] = useState(false);
  const [anchor, setAnchor] = useState(null);
  const inputRef = useRef(null);

  const options = telcos[country] || [];
  const WINDOW = Dimensions.get('window');
  useEffect(() => {
    const defaultNetwork = defaultNetworks[country];
    if (defaultNetwork) {
      const match = options.find(opt => opt.name === defaultNetwork);
      if (match) {
        setSelectedOption(match);
      }
    }
  }, [country]);
  useEffect(() => {
    if (country === 'Sierra Leone' && !phoneNumber) {
      setPhoneNumber('+232 ');
    }
  }, [country]);

  const measureAnchor = () => {
    try {
      if (inputRef.current && inputRef.current.measureInWindow) {
        inputRef.current.measureInWindow((x, y, width, height) => {
          setAnchor({x, y, width, height});
        });
      } else if (inputRef.current && inputRef.current.measure) {
        inputRef.current.measure((ix, iy, width, height, px, py) => {
          setAnchor({x: px, y: py, width, height});
        });
      }
    } catch (err) {
      setAnchor(null);
    }
  };
  const handleChangePhone = text => {
    if (country === 'Sierra Leone') {
      setPhoneNumber(formatSierraLeoneNumber(text));
    } else {
      setPhoneNumber(text);
    }
    setManualSelection(false);
  };

  const openDropdown = () => {
    setModalVisible(true);
    requestAnimationFrame(() => {
      measureAnchor();
    });
  };

  const closeDropdown = () => {
    setModalVisible(false);
  };

  const handleOptionSelect = item => {
    setSelectedOption(item);
    setManualSelection(true);
    closeDropdown();
  };

  useEffect(() => {
    if (manualSelection) {
      return;
    }
    const cleaned = (phoneNumber || '').replace(/\D/g, '');
    if (cleaned.length >= 2) {
      const detected = detectNetwork(cleaned, country);
      if (detected) {
        const match = options.find(opt => opt.name === detected);
        if (match && match.name !== selectedOption?.name) {
          setSelectedOption(match);
        }
      }
    }
  }, [phoneNumber]);

  const dropdownStyleFromAnchor = () => {
    if (!anchor) {
      return {
        position: 'absolute',
        top: WINDOW.height * 0.2,
        left: 20,
        right: 20,
        maxHeight: WINDOW.height * 0.5,
      };
    }
    const left = Math.max(8, anchor.x - 8);
    const width = Math.min(
      WINDOW.width - left - 8,
      anchor.width || WINDOW.width * 0.6,
    );
    const top = Math.min(
      WINDOW.height - 48,
      anchor.y + (anchor.height || 40) + 6,
    );
    const maxHeight = WINDOW.height - top - 20;
    return {
      position: 'absolute',
      top,
      left,
      width,
      maxHeight,
    };
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer} ref={inputRef}>
        <TouchableOpacity style={styles.dropdownButton} onPress={openDropdown}>
          {selectedOption ? (
            <Image source={selectedOption.image} style={styles.icon} />
          ) : (
            <Ionicons name="cellular" size={24} color="#9C9C9C" />
          )}
          <Ionicons name="chevron-down" size={20} color="#9C9C9C" />
        </TouchableOpacity>

        <TextInput
          placeholder="Enter phone number"
          style={styles.input}
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={handleChangePhone}
        />
      </View>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeDropdown}>
        <Pressable
          style={styles.modalBackdrop}
          onPress={closeDropdown}
          android_ripple={{color: 'rgba(0,0,0,0.1)'}}>
          <Pressable
            style={[styles.dropdown, dropdownStyleFromAnchor()]}
            onPress={() => {}}>
            <FlatList
              data={options}
              keyExtractor={item => item.name}
              keyboardShouldPersistTaps="handled"
              renderItem={({item}) => (
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => handleOptionSelect(item)}>
                  <Image source={item.image} style={styles.icon} />
                  <Text style={styles.optionText}>{item?.name}</Text>
                </TouchableOpacity>
              )}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

export default NumberInput;

const styles = StyleSheet.create({
  container: {position: 'relative', zIndex: 1},
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    paddingRight: 6,
  },
  icon: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingHorizontal: 8,
    borderRadius: 5,
    color: 'black',
    height: 40,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  dropdown: {
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    paddingVertical: 6,
    paddingHorizontal: 6,
    maxWidth: 200,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  optionText: {
    fontSize: 14,
    color: '#111',
  },
});
