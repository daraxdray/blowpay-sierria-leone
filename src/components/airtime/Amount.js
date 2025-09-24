import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Platform,
} from 'react-native';
import React from 'react';
import tw from 'twrnc';

const Amount = ({amount = '', onAmountChange, editable = true, country}) => {
  return (
    <View style={tw`mx-2 pt-4 gap-2`}>
      <Text style={tw`text-gray-900 font-medium text-[14px]`}>
        Enter Amount
      </Text>
      <View style={tw`relative`}>
        <TextInput
          placeholder="000.00"
          placeholderTextColor="gray"
          style={tw`border border-[#D0D5DD] rounded-[10px] p-4 ${
            Platform.OS === 'android' ? 'py-3' : 'py-4'
          } text-black`}
          keyboardType="numeric"
          value={amount}
          editable={editable}
          onChangeText={onAmountChange}
        />
        <TouchableOpacity style={styles.imageContainer}>
          <Text style={tw`text-[#98A2B3] font-medium text-[14px]`}>
            {country?.toLowerCase() === 'sierra leone' ? 'SL' : 'NGN'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Amount;

const styles = StyleSheet.create({
  imageContainer: {
    position: 'absolute',
    right: 10,
    top: '40%',
    transform: [{translateY: -10}],
    zIndex: 1,
    padding: 5,
    borderRadius: 5,
  },
});
