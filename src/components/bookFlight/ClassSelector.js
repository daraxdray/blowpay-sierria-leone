import React, {useState} from 'react';
import {View, Text, TouchableOpacity, FlatList, StyleSheet} from 'react-native';
import tw from 'twrnc';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ClassSelector = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');

  const options = [
    {name: 'First Class'},
    {name: 'Business'},
    {name: 'Economy'},
  ];

  const toggleDropdown = () => setDropdownVisible(prev => !prev);

  const selectOption = name => {
    setSelectedOption(name);
    setDropdownVisible(false); // Close dropdown after selecting an option
  };

  const getSelectedText = () => {
    return selectedOption ? selectedOption : 'Select Class';
  };

  return (
    <View style={styles.container}>
      <Text style={tw`text-gray-900 font-medium text-[12px] mb-1`}>Class</Text>
      <TouchableOpacity
        onPress={toggleDropdown}
        style={tw`relative w-full border border-[#D0D5DD] rounded-[20px] items-center justify-between flex-row px-3 py-4`}>
        <Text style={tw`text-[#98A2B3] w-[70%] text-[12px]`}>{getSelectedText()}</Text>
        <Ionicons name="chevron-down" size={13} />
      </TouchableOpacity>
      {/* Overlay and Dropdown menu */}
      {dropdownVisible && (
        <View style={styles.overlay}>
          <View style={styles.dropdown}>
            <Text style={tw`text-[12px] font-normal text-[#848484]`}>
              Class
            </Text>
            <FlatList
              data={options}
              keyExtractor={item => item.name}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => selectOption(item.name)}>
                  <Text>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      )}
    </View>
  );
};

export default ClassSelector;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    gap: 2,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  dropdown: {
    position: 'absolute',
    top: 10,
    right: 0,
    width: 200,
    backgroundColor: 'white',
    borderRadius: 5,
    zIndex: 1000,
    elevation: 5,
    padding: 10,
    paddingVertical: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    gap: 12,
  },
  option: {
    padding: 10,
    marginBottom: 5,
    justifyContent: 'space-between',
  },
  overlay: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    zIndex: 10,
  },
});
