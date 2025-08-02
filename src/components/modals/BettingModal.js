import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import tw from 'twrnc';

import Ionicons from 'react-native-vector-icons/Ionicons';
import { useBillerGetBetting } from '../../hooks/billing.hook';
import { PRIMARY_COLOR } from '../../global/theme';

const BettingModal = ({ closeModal, selectProvider }) => {
  const [providers, setProviders] = useState([]);
  const { data, isLoading, error } = useBillerGetBetting();

  useEffect(() => {
    if (data?.data) {
      setProviders(data.data);
    }
  }, [data?.data]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={tw`p-4 border-b border-gray-200 flex-row justify-between items-center`}
      onPress={() => {
        selectProvider(item);
        closeModal();
      }}>
      <Text style={tw`text-black text-[16px] capitalize`}>
        {item.PRODUCT_CODE}
      </Text>
      <Ionicons name="chevron-forward" size={16} color="#98A2B3" />
    </TouchableOpacity>
  );

  return (
    <View style={tw`bg-white rounded-t-2xl p-4 h-2/3`}>
      <View style={tw`flex-row justify-between items-center mb-4`}>
        <Text style={tw`text-lg font-bold text-gray-900`}>Select Provider</Text>
        <TouchableOpacity onPress={closeModal}>
          <Ionicons name="close" size={24} color="#98A2B3" />
        </TouchableOpacity>
      </View>
      
      {isLoading ? (
        <View style={tw`flex-1 justify-center items-center`}>
          <ActivityIndicator size="large" color={PRIMARY_COLOR} />
        </View>
      ) : error ? (
        <View style={tw`flex-1 justify-center items-center`}>
          <Text style={tw`text-red-500 text-center`}>
            Error loading providers. Please try again.
          </Text>
        </View>
      ) : (
        <FlatList
          data={providers}
          renderItem={renderItem}
          keyExtractor={(item) => item.PRODUCT_CODE}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={tw`text-center text-gray-500 mt-4`}>
              No betting providers available
            </Text>
          }
        />
      )}
    </View>
  );
};

export default BettingModal;