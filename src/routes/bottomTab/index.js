import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import CustomTab from '../../components/routes/CustomTab';
import {HomeTab, ProfileTab, WalletTab} from '../../screens/main';
import {screenOptions} from '../../global/routes';
import SendBills from '../../screens/main/home-tab/SendBills';

const Tab = createBottomTabNavigator();
const {Navigator, Screen} = Tab;

const home = require('../../../assets/svgs/home.svg');
const profile = require('../../../assets/svgs/profile.svg');
const wallet = require('../../../assets/svgs/wallet.svg');
const swap = require('../../../assets/svgs/swap.svg');

const home_live = require('../../../assets/svgs/home_live.svg');
const profile_live = require('../../../assets/svgs/profile_live.svg');
const wallet_live = require('../../../assets/svgs/wallet_live.svg');
const swap_live = require('../../../assets/svgs/swap_live.svg');
const BottomTab = props => {
  return (
    <Navigator
      screenOptions={screenOptions}
      tabBar={props => <CustomTab {...props} />}
      initialRouteName={'HomeTab'}
      sceneContainerStyle={{backgroundColor: 'grey'}}>
      <Screen
        name={'HomeTab'}
        component={HomeTab}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: home,
          onlineIcon: home_live,
        }}
      />

      <Screen
        name={'SendBills'}
        component={SendBills}
        options={{
          tabBarLabel: 'Transfer',
          tabBarIcon: swap,
          onlineIcon: swap_live,
        }}
      />

      <Screen
        name={'WalletTab'}
        component={WalletTab}
        options={{
          tabBarLabel: 'Wallet',
          tabBarIcon: wallet,
          onlineIcon: wallet_live,
        }}
      />

      {/* <Screen
        name={'TransactionTab'}
        component={TransactionTab}
        options={{
          tabBarLabel: 'Transaction',
          tabBarIcon: profile,
          onlineIcon: profile_live,
        }}
      /> */}

      <Screen
        name={'ProfileTab'}
        component={ProfileTab}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: profile,
          onlineIcon: profile_live,
        }}
      />
    </Navigator>
  );
};

export default BottomTab;
