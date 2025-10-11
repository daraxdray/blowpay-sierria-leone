import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  TouchableWithoutFeedback,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import tw from 'twrnc';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useBpBillerProvider} from '../../hooks/billing.hook';
import Loader from './Loader';

const ElectModal = ({
  closeModal,
  proceed,
  selectCompany,
  activeCompany,
  country,
}) => {
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [formattedCompanies, setformattedCompanies] = useState([]);
  const billerId = 'UTILITYBILLS';
  const {data, isLoading, error} = useBpBillerProvider(billerId);
  useEffect(() => {
    if (country === 'Sierra Leone') {
      console.log('⚡ Sierra Leone detected → forcing EDSA');
      setformattedCompanies([{ID: 'EDSA', NAME: 'EDSA'}]);
    }
    if (data?.data && country !== 'Sierra Leone') {
      const formatResponse = response => {
        return Object.keys(response)
          .filter(key => response[key] === true)
          .map(key => ({
            ID: key,
            NAME: key,
          }));
      };

      const formatted = formatResponse(data?.data);
      console.log('✅ formatted companies:', formatted);
      setformattedCompanies(formatted);
    }
  }, [data, data?.data, country]);

  const filteredCompanies =
    formattedCompanies?.length > 0
      ? formattedCompanies.filter(company =>
          company.NAME.toLowerCase().includes(searchText.toLowerCase()),
        )
      : [];

  const renderCompany = ({item}) => {
    const isSelected = activeCompany?.ID === item.ID;

    return (
      <TouchableOpacity
        style={tw`flex-row items-center p-3 py-7 mb-1 bg-white shadow-sm gap-2 rounded-lg`}
        onPress={() => {
          setSelectedCompany(item.ID);
          selectCompany(item);
          closeModal();
        }}>
        <View style={tw`flex-1`}>
          <Text style={tw`text-[#292929] font-medium text-[14px]`}>
            {item.NAME}
          </Text>
        </View>
        <View
          style={[
            tw`w-5 h-5 border rounded-full items-center justify-center`,
            selectedCompany === item.ID
              ? tw`border-green-500`
              : tw`border-gray-400`,
          ]}>
          {isSelected && <Ionicons name="checkmark" size={16} color="green" />}
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <View
        style={tw`h-[55%] bg-white p-5 rounded-t-[20px] w-19/20 self-center rounded-b-10 mb-5 items-center justify-center`}>
        <Text style={tw`text-red-500`}>Failed to load data</Text>
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={closeModal}>
      <View style={tw`flex-1 justify-end`}>
        <View
          style={tw`h-[95%] bg-white p-5 rounded-t-[10px] w-19/20 self-center  mb-1`}>
          <View style={tw`items-center justify-center`}>
            <View style={tw`w-20 h-2 bg-[#999999] rounded-full`} />
          </View>

          <View style={tw`flex-1 mt-4`}>
            <Text style={tw`text-[#292929] font-medium text-[18px]`}>
              Select a Company
            </Text>

            <TextInput
              placeholder="Search company"
              placeholderTextColor="gray"
              value={searchText}
              onChangeText={setSearchText}
              style={tw`rounded-lg p-3 text-black mt-2 shadow-sm bg-white`}
            />

            <FlatList
              data={filteredCompanies}
              renderItem={renderCompany}
              keyExtractor={item => item.ID.toString()}
              style={tw`mt-4`}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={tw`pb-10`}
            />
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ElectModal;
