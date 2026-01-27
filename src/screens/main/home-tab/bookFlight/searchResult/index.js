import React from 'react';
import {View, FlatList} from 'react-native';
import {ScreenView} from '../../../../../global/wrappers';
import {WHITE} from '../../../../../global/theme';
import Header from '../../../../../global/components/Header';
import SearchCard from '../../../../../components/bookFlight/SearchCard';
import tw from 'twrnc';

// Mock data for 5 cards
const flightData = [
  {id: '1', departureTime: '5.50', arrivalTime: '7.30', price: 'NGN90,000.00'},
  {id: '2', departureTime: '6.15', arrivalTime: '8.00', price: 'NGN92,000.00'},
  {id: '3', departureTime: '6.45', arrivalTime: '8.30', price: 'NGN88,000.00'},
  {id: '4', departureTime: '7.00', arrivalTime: '9.00', price: 'NGN95,000.00'},
  {
    id: '5',
    departureTime: '8.00',
    arrivalTime: '10.00',
    price: 'NGN100,000.00',
  },
];

const SearchResult = props => {
  const {navigation} = props;

  const handleCheckIn = item => {
    navigation.navigate('FlightDetails', {
      departureTime: item.departureTime,
      arrivalTime: item.arrivalTime,
      price: item.price,
      imageSource: require('../../../../../../assets/icons/airpeace.png'),
    });
  };

  const renderItem = ({item}) => (
    <SearchCard
      departureTime={item.departureTime}
      arrivalTime={item.arrivalTime}
      price={item.price}
      imageSource={require('../../../../../../assets/icons/airpeace.png')}
      onCheckIn={() => handleCheckIn(item)}
    />
  );

  return (
    <ScreenView style={tw`flex-1`} light color={WHITE}>
      <Header
        navigation={() => navigation.goBack()}
        ImageSource={require('../../../../../../assets/icons/filter.png')}
        title="Search Result"
        showIcon={true}
        iconName="add-circle"
        imagePress={() => console.log('Filter Icon Pressed')}
      />
      <View style={tw`px-4 mb-10`}>
        <FlatList
          data={flightData}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={tw`gap-4 py-4`}
        />
      </View>
    </ScreenView>
  );
};

export default SearchResult;
