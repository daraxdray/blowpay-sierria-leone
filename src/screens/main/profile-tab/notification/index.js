import React, {useState} from 'react';
import {View, ScrollView, Text} from 'react-native';
import {styles} from './style';
import {ScreenView} from '../../../../global/wrappers';
import {WHITE} from '../../../../global/theme';
import Header from '../../../../global/components/Header';
import tw from 'twrnc';
import NotificationSwitch from '../../../../components/profile/NotificationSwitch';

const NotificationSetting = props => {
  const navigation = props.navigation;

  const [isGeneralEnabled, setIsGeneralEnabled] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);
  const [isVibrateEnabled, setIsVibrateEnabled] = useState(false);
  const [isAppEnabled, setIsAppEnabled] = useState(false);
  const [isBillEnabled, setIsBillEnabled] = useState(false);
  const [isPromoEnabled, setIsPromoEnabled] = useState(false);
  const [isDiscountEnabled, setIsDiscountEnabled] = useState(false);
  const [isPaymentEnabled, setIsPaymentEnabled] = useState(false);
  const [isServiceEnabled, setIsServiceEnabled] = useState(false);
  const [isTipsEnabled, setIsTipsEnabled] = useState(false);

  return (
    <ScreenView style={styles.container} light color={WHITE}>
      <View style={tw`px-3 pt-2`}>
        <Header
          navigation={() => navigation.goBack()}
          ImageSource={require('../../../../../assets/icons/filter.png')}
          title="Notification"
          showIcon={false}
          iconName="add-circle"
          imagePress={() => console.log('Second Icon Pressed')}
        />
      </View>

      <ScrollView
        style={styles.viewContainer}
        showsVerticalScrollIndicator={false}>
        <View style={styles.view1}>
          <View style={tw`border-b border-b-gray-200 pb-2`}>
            <Text style={tw`text-[#000000] font-medium text-[16px]`}>
              Suggested
            </Text>
            <NotificationSwitch
              label="General Notification"
              value={isGeneralEnabled}
              onValueChange={setIsGeneralEnabled}
            />

            <NotificationSwitch
              label="Sound"
              value={isSoundEnabled}
              onValueChange={setIsSoundEnabled}
            />

            <NotificationSwitch
              label="Vibrate"
              value={isVibrateEnabled}
              onValueChange={setIsVibrateEnabled}
            />
          </View>
          <View style={tw`border-b border-b-gray-200 pb-2`}>
            <Text style={tw`text-[#000000] font-medium text-[16px]`}>
              System & services update
            </Text>
            <NotificationSwitch
              label="App updates"
              value={isAppEnabled}
              onValueChange={setIsAppEnabled}
            />

            <NotificationSwitch
              label="Bill Reminder"
              value={isBillEnabled}
              onValueChange={setIsBillEnabled}
            />

            <NotificationSwitch
              label="Promotion"
              value={isPromoEnabled}
              onValueChange={setIsPromoEnabled}
            />

            <NotificationSwitch
              label="Discount Avaiable"
              value={isDiscountEnabled}
              onValueChange={setIsDiscountEnabled}
            />

            <NotificationSwitch
              label="Payment Request"
              value={isPaymentEnabled}
              onValueChange={setIsPaymentEnabled}
            />
          </View>
          <View>
            <Text style={tw`text-[#000000] font-medium text-[16px]`}>
              Others
            </Text>
            <NotificationSwitch
              label="New Service Available"
              value={isServiceEnabled}
              onValueChange={setIsServiceEnabled}
            />

            <NotificationSwitch
              label="New Tips Available"
              value={isTipsEnabled}
              onValueChange={setIsTipsEnabled}
            />
          </View>
        </View>
      </ScrollView>
    </ScreenView>
  );
};

export default NotificationSetting;
