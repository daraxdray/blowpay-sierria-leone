/* eslint-disable no-shadow */
import React, {useState, useMemo} from 'react';
import {View, Text, TouchableOpacity, TextInput, FlatList} from 'react-native';
import tw from 'twrnc';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {CustomButton} from '../../global/components';
import {PanGestureHandler} from 'react-native-gesture-handler';
import {useGetSLCablePlans} from '../../hooks/billing.hook';
import Loader from './Loader';

const CablePlanModal = ({
  closeModal,
  proceed,
  item,
  selectOption,
  products = [],
  country,
}) => {
  const [searchText, setSearchText] = useState('');
  const [selectedCompany, setSelectedCompany] = useState(null);

  const {data: slData, status, error: slError} = useGetSLCablePlans();

  const plans = useMemo(() => {
    if (country?.toLowerCase() === 'sierra leone') {
      return (
        slData?.data?.packages?.map((p, index) => ({
          PACKAGE_ID: p.service_slug || `sl_${index}`,
          PACKAGE_NAME: p.name,
          PACKAGE_AMOUNT: p.price,
        })) || []
      );
    }
    return products || [];
  }, [country, slData?.data, products]);

  const filteredCompanies = plans.filter(plan =>
    plan.PACKAGE_NAME.toLowerCase().includes(searchText?.toLowerCase()),
  );

  const renderCompany = ({item}) => {
    const isSelected = selectedCompany === item.PACKAGE_ID;

    return (
      <TouchableOpacity
        style={tw`flex-row items-center p-3 mb-1 bg-white shadow-sm rounded-lg`}
        onPress={() => {
          setSelectedCompany(item.PACKAGE_ID);
          selectOption(item);
          closeModal();
        }}>
        <View style={tw`flex-1`}>
          <Text style={tw`text-[#292929] font-medium text-[14px]`}>
            {item?.PACKAGE_NAME}
          </Text>
        </View>
        <View
          style={[
            tw`w-5 h-5 border rounded-full items-center justify-center`,
            isSelected ? tw`border-green-500` : tw`border-gray-400`,
          ]}>
          {isSelected && <Ionicons name="checkmark" size={16} color="green" />}
        </View>
      </TouchableOpacity>
    );
  };
  if (country?.toLowerCase() === 'sierra leone') {
    if (status === 'pending') {
      return <Loader />;
    }
    if (slError) {
      return <Text>Error loading Sierra Leone plans.</Text>;
    }
  }

  return (
    <PanGestureHandler>
      <View
        style={tw`h-[95%] bg-white p-5 rounded-t-[20px] w-19/20 self-center rounded-b-10 mb-5`}>
        <View style={tw`items-center justify-center`}>
          <View style={tw`w-20 h-2 bg-[#999999] rounded-full`} />
        </View>

        <View style={tw`flex-1 mt-4`}>
          <Text style={tw`text-[#292929] font-medium text-[18px]`}>
            Select a Plan
          </Text>

          <TextInput
            placeholder="Search plan"
            value={searchText}
            onChangeText={setSearchText}
            style={tw`rounded-lg text-black p-3 mt-2 border-[0.1] bg-white`}
          />

          <FlatList
            data={filteredCompanies}
            renderItem={renderCompany}
            keyExtractor={item => item.PACKAGE_ID.toString()}
            style={tw`mt-4`}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={tw`pb-10`}
          />
        </View>

        <View style={tw`py-3`}>
          <CustomButton onPress={closeModal} text={'Close'} />
        </View>
      </View>
    </PanGestureHandler>
  );
};

export default CablePlanModal;
