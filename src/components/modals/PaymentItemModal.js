import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TouchableWithoutFeedback,
} from 'react-native';
import React, {useState} from 'react';
import tw from 'twrnc';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {CustomButton} from '../../global/components';
import {PanGestureHandler} from 'react-native-gesture-handler';
import {companies} from '../../constants/data/airtime';

const PaymentItemModal = ({closeModal, proceed, selectPaymentItem, companies}) => {
  const [selectedCompany, setSelectedCompany] = useState('');

  const handleSwipeDown = ({nativeEvent}) => {
    if (nativeEvent.translationY > 50) {
      closeModal();
    }
  };

  const renderCompany = ({item}) => {
    console.log(item);
    const isSelected = selectedCompany === item.PRODUCT_ID;

    return (
      <TouchableOpacity
        style={tw`flex-row items-center p-3 py-4 mb-1 bg-white shadow-sm gap-2 rounded-lg`}
        onPress={() => {
          setSelectedCompany(item.PRODUCT_ID);
          selectPaymentItem(item);
          closeModal();
        }}>
        <View style={tw`flex-1`}>
          <Text style={tw`text-[#292929] font-medium text-[14px]`}>
            {item.PRODUCT_TYPE}
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
      <PanGestureHandler onGestureEvent={handleSwipeDown}>
        <View
          style={tw`h-[55%] bg-white p-5 rounded-t-[20px] w-19/20 self-center rounded-b-10 mb-5`}>
          <View style={tw`items-center justify-center`}>
            <View style={tw`w-20 h-2 bg-[#999999] rounded-full`} />
          </View>

          <View style={tw`flex-1 mt-4`}>
            <Text style={tw`text-[#292929] font-medium text-[18px]`}>
              Payment Item
            </Text>

            <FlatList
              data={companies}
              renderItem={renderCompany}
              keyExtractor={item => item.PRODUCT_ID}
              style={tw`mt-4`}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={tw`pb-10`}
            />
          </View>

          <View style={tw`py-3`}>
            <CustomButton onPress={closeModal} text={'close'} />
          </View>
        </View>
      </PanGestureHandler>
    </TouchableWithoutFeedback>
  );
};

export default PaymentItemModal;
