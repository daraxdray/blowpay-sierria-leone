import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import tw from 'twrnc';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {CustomButton} from '../../global/components';
import {PanGestureHandler, State} from 'react-native-gesture-handler';

const CableModal = ({closeModal, proceed, selectCompany, country}) => {
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [formattedCompanies, setFormattedCompanies] = useState([]);

  useEffect(() => {
    if (country?.toLowerCase() === 'sierra leone') {
      setFormattedCompanies([{ID: 'DSTV'}]);
    } else {
      setFormattedCompanies([{ID: 'DSTV'}, {ID: 'GOTV'}, {ID: 'STARTIMES'}]);
    }
  }, [country]);

  const handleSwipeDown = ({nativeEvent}) => {
    if (nativeEvent.translationY > 50) {
      closeModal();
    }
  };

  const handleGestureStateChange = ({nativeEvent}) => {
    if (nativeEvent.state === State.END) {
      handleSwipeDown({nativeEvent});
    }
  };

  const filteredCompanies =
    formattedCompanies?.length > 0
      ? formattedCompanies.filter(company =>
          company.ID.toLowerCase().includes(searchText.toLowerCase()),
        )
      : [];

  const renderCompany = ({item}) => {
    const isSelected = selectedCompany === item?.ID;
    return (
      <TouchableOpacity
        style={tw`flex-row items-center p-3 mb-1 bg-white shadow-sm rounded-lg`}
        onPress={() => {
          setSelectedCompany(item?.ID);
          selectCompany(item);
        }}>
        <View style={tw`flex-1`}>
          <Text style={tw`text-[#292929] font-medium text-[14px]`}>
            {item?.ID}
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

  return (
    <TouchableWithoutFeedback onPress={closeModal}>
      <View style={tw`flex-1 justify-end`}>
        <PanGestureHandler
          onGestureEvent={handleSwipeDown}
          onHandlerStateChange={handleGestureStateChange}>
          <View
            style={tw`h-[55%] bg-white p-5 rounded-t-[20px] w-19/20 self-center rounded-b-10 mb-5`}>
            <View style={tw`items-center justify-center`}>
              <View style={tw`w-20 h-2 bg-[#999999] rounded-full`} />
            </View>

            <View style={tw`flex-1 mt-4`}>
              <Text style={tw`text-[#292929] font-medium text-[18px]`}>
                Select TV
              </Text>

              <TextInput
                placeholder="Search TV"
                placeholderTextColor="gray"
                value={searchText}
                onChangeText={setSearchText}
                style={tw`rounded-lg text-black p-3 mt-2 shadow-sm bg-white`}
              />

              <FlatList
                data={filteredCompanies}
                renderItem={renderCompany}
                keyExtractor={item => item?.ID?.toString()}
                style={tw`mt-4`}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={tw`pb-10`}
              />
            </View>

            <View style={tw`py-3`}>
              <CustomButton onPress={proceed} text={'Proceed'} />
            </View>
          </View>
        </PanGestureHandler>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default CableModal;
