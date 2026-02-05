import React from 'react';
import { View, Text, Image, FlatList } from 'react-native';
import { styles } from './style';
import { ScreenView } from '../../../../global/wrappers';
import { WHITE } from '../../../../global/theme';
import Header from '../../../../global/components/Header';
import tw from 'twrnc';
import AddfundSVG from '../../../../../assets/svgs/Addfund.svg';
import Loader from '../../../../components/modals/Loader';
import { useGetTransactions } from '../../../../hooks/transactions.hook';
import { useGetNotifications } from '../../../../hooks/notification.hook';
import { getUserFriendlyErrorMessage } from '../../../../utils';

const Notification = props => {
  const navigation = props.navigation;
  const { data, isLoading, error } = useGetNotifications();
  const notifications = data?.data || [];
  console.log(notifications, 'jjffhdf');
  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <Text>Error: {getUserFriendlyErrorMessage(error)}</Text>;
  }

  const groupedNotifications = notifications.reduce((acc, curr) => {
    const date = curr.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(curr);
    return acc;
  }, {});

  const sections = Object.keys(groupedNotifications).map(date => ({
    title: date,
    data: groupedNotifications[date],
  }));

  return (
    <ScreenView style={styles.container} light color={WHITE}>
      <Header
        navigation={() => {
          navigation.goBack();
        }}
        ImageSource={require('../../../../../assets/icons/filter.png')}
        title="Notification"
        showIcon={false}
        iconName="add-circle"
        imagePress={() => console.log('Second Icon Pressed')}
      />
      <View style={tw`flex-1 px-3`}>
        <FlatList
          data={sections}
          keyExtractor={item => item.title}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View>
              {/* <View style={tw`pb-1 pt-1`}>
                <Text style={tw`text-[#23303B] font-medium text-[16px]`}>
                  Today
                </Text>
              </View> */}
              {item.data.map(notification => (
                <View
                  key={notification.id}
                  style={tw`flex flex-row gap-3 items-center px-3 py-5 border-b border-gray-200`}>
                  {/* <Image
                    source={notification.image}
                    style={tw`w-[60.28px] h-[60.28px]`}
                  /> */}
                  <AddfundSVG />
                  <Text
                    style={tw`text-[#565866] font-normal text-[15px] w-[80%]`}>
                    {notification.message}
                  </Text>
                </View>
              ))}
            </View>
          )}

          ListEmptyComponent={() => (
            <View style={tw`flex-1 justify-center items-center mt-20`}>
              <AddfundSVG width={60} height={60} />
              <Text style={tw`text-[#565866] font-medium text-[16px] mt-4`}>
                No notifications yet
              </Text>
            </View>
          )}
        />
      </View>
    </ScreenView>
  );
};

export default Notification;
