import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import tw from 'twrnc';
import Ionicons from 'react-native-vector-icons/Ionicons';

const TravellerSelect = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [travellerQuantities, setTravellerQuantities] = useState({
    'Infant (<2 yrs)': 0,
    'Child (2-11 yrs)': 0,
    Adult: 0,
  });

  const options = [
    {name: 'Infant (<2 yrs)'},
    {name: 'Child (2-11 yrs)'},
    {name: 'Adult'},
  ];

  const toggleDropdown = () => setDropdownVisible(prev => !prev);

  const increaseQuantity = name => {
    setTravellerQuantities(prev => ({
      ...prev,
      [name]: prev[name] + 1,
    }));
    setSelectedOption(name);
  };

  const getSelectedText = () => {
    let selectedText = '';
    Object.keys(travellerQuantities).forEach(key => {
      const quantity = travellerQuantities[key];
      if (quantity > 0) {
        selectedText += `${quantity}x ${key}, `;
      }
    });
    return selectedText.length > 0 ? selectedText.slice(0, -2) : 'Select';
  };

  return (
    <View style={styles.container}>
      <Text style={tw`text-gray-900 font-medium text-[14px] mb-1 text-[12px]`}>
        Traveller
      </Text>
      <TouchableOpacity
        onPress={toggleDropdown}
        style={tw`relative w-full border border-[#D0D5DD] rounded-[20px] items-center justify-between flex-row px-3 py-4`}>
        <View style={tw`gap-3 flex flex-row`}>
          <Image
            source={require('../../../assets/icons/calendar.png')}
            style={tw`w-[18px] h-[18px]`}
          />
          <Text style={tw`text-[#98A2B3] w-[70%] text-[12px]`}>{getSelectedText()}</Text>
        </View>

        <Ionicons name="chevron-down" size={13} />
      </TouchableOpacity>
      {/* Overlay and Dropdown menu */}
      {dropdownVisible && (
        <View style={styles.overlay}>
          <View style={styles.dropdown}>
            <Text style={tw`text-[12px] font-normal text-[#848484]`}>
              Traveller
            </Text>
            <FlatList
              data={options}
              keyExtractor={item => item.name}
              renderItem={({item}) => (
                <View style={styles.option}>
                  <Text>{item.name}</Text>
                  <TouchableOpacity
                    style={tw`flex flex-row gap-3 items-center`}
                    onPress={() => increaseQuantity(item.name)}>
                    {travellerQuantities[item.name] > 0 && (
                      <View
                        style={tw`bg-[#FFF8FB] h-5 w-5 items-center justify-center rounded-full`}>
                        <Text style={tw`text-[12px] text-[#2F394B]`}>
                          {travellerQuantities[item.name]}
                        </Text>
                      </View>
                    )}
                    <Ionicons name="add" size={20} />
                  </TouchableOpacity>
                </View>
              )}
            />
            <TouchableOpacity
              style={tw`mt-4 bg-[#FF114A] rounded-full py-2 px-4 items-center`}
              onPress={() => setDropdownVisible(false)}>
              <Text style={tw`text-white text-center font-semibold`}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

export default TravellerSelect;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    gap: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 7,
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
  },

  dropdown: {
    position: 'absolute',
    top: 10,
    left: 0,
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    justifyContent: 'space-between',
  },
  optionIcon: {
    width: 32,
    height: 32,
    marginRight: 10,
  },
  overlay: {
    position: 'absolute',
    top: 60, // Adjust the top value according to your layout
    left: 0,
    right: 0,
    zIndex: 10,
  },
});
