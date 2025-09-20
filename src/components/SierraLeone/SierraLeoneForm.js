import React from 'react';
import {View, Text, TextInput, TouchableOpacity} from 'react-native';
import tw from 'twrnc';
import Ionicons from 'react-native-vector-icons/Ionicons';

const SierraLeoneForm = ({
  phoneNumber,
  setPhoneNumber,
  selectedMeter,
  setSelectedMeter,
  selectedProvider,
  setSelectedProvider,
  showProvider = false,
  showMeter = false,
  showPhone = false,
  selectedAmount,
  handleAmountChange,
  openProviderModal,
}) => {
  return (
    <View style={tw`gap-6`}>
      {showProvider && (
        <View>
          <Text style={tw`text-gray-700 font-semibold text-[16px]`}>
            Service Provider
          </Text>
          <TouchableOpacity
            onPress={openProviderModal}
            style={tw`border border-[#D0D5DD] rounded-lg mt-2 p-3 flex-row justify-between`}>
            <Text>
              {selectedProvider ? selectedProvider?.NAME : 'Select Provider'}
            </Text>
            <Ionicons name="chevron-down" size={14} />
          </TouchableOpacity>
        </View>
      )}

      {showMeter && (
        <View>
          <Text style={tw`text-gray-700 font-semibold text-[16px]`}>
            Meter Number
          </Text>
          <TextInput
            style={tw`border border-[#D0D5DD] rounded-lg mt-2 p-3 text-[14px]`}
            placeholder="Enter meter number"
            keyboardType="numeric"
            value={selectedMeter}
            onChangeText={setSelectedMeter}
          />
        </View>
      )}

      {showPhone && (
        <View>
          <Text style={tw`text-gray-700 font-semibold text-[16px]`}>
            Phone Number
          </Text>
          <TextInput
            style={tw`border border-[#D0D5DD] rounded-lg mt-2 p-3 text-[14px]`}
            placeholder="Enter phone number"
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
        </View>
      )}

      <View>
        <Text style={tw`text-gray-700 font-semibold text-[16px]`}>
          Amount (SLL)
        </Text>
        <TextInput
          style={tw`border border-[#D0D5DD] rounded-lg mt-2 p-3 text-[16px]`}
          placeholder="Enter amount"
          keyboardType="numeric"
          value={selectedAmount}
          onChangeText={handleAmountChange}
        />
        <Text style={tw`text-[#98A2B3] text-[12px] mt-2`}>
          Minimum top-up is 10,000 SLL
        </Text>
      </View>
    </View>
  );
};

export default SierraLeoneForm;
