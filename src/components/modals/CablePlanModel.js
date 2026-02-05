/* eslint-disable no-shadow */
import React, {useState, useMemo} from 'react';
import {View, Text, TouchableOpacity, TextInput, FlatList} from 'react-native';
import tw from 'twrnc';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {CustomButton} from '../../global/components';
import {PanGestureHandler} from 'react-native-gesture-handler';
import {useGetSLCablePlans, useBillerGetCable} from '../../hooks/billing.hook';
import Loader from './Loader';
import {getCurrencySymbol} from '../../utils/format';

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
  const isSierraLeone = country?.toLowerCase() === 'sierra leone';
  const {
    data: slData,
    status,
    error: slError,
  } = useGetSLCablePlans({
    enabled: isSierraLeone,
  });
  const {
    data: cableData,
    error: cableError,
    status: Bpstatus,
  } = useBillerGetCable(products?.ID);

  const plans = useMemo(() => {
    if (isSierraLeone) {
      return (
        slData?.data?.packages?.map((p, index) => ({
          PACKAGE_ID: p.service_slug || `sl_${index}`,
          PACKAGE_NAME: p.name,
          PACKAGE_AMOUNT: p.price,
        })) || []
      );
    }
    const dataList = cableData?.data?.data || [];
    if (!Array.isArray(dataList)) {
      return [];
    }
    return dataList.map((p, index) => ({
      PACKAGE_ID: p.code || p.product_id || `pkg_${index}`,
      PACKAGE_NAME: p.desc || p.product_name || 'Unknown Plan',
      PACKAGE_AMOUNT: p.price || p.amount || 0,
    }));
  }, [isSierraLeone, slData?.data, cableData?.data]);

  const filteredCompanies = plans.filter(plan =>
    plan.PACKAGE_NAME?.toLowerCase()?.includes(searchText?.toLowerCase()),
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
          <Text style={tw`text-gray-500 text-[13px]`}>
          {getCurrencySymbol(country)}{item?.PACKAGE_AMOUNT?.toLocaleString()}
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
  if (isSierraLeone && slError) {
    return <Text>Error loading Sierra Leone plans.</Text>;
  }
  if (!isSierraLeone && cableError) {
    return <Text Text> Error loading cable plans.</Text>;
  }
  if (country?.toLowerCase() === 'sierra leone' && status === 'pending') {
    <Loader />;
  }
  if (country?.toLowerCase() === !'sierra leone' && Bpstatus === 'pending') {
    <Loader />;
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
