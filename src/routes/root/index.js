import {useState, useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import {screenOptions} from '../../global/routes';
import {SplashScreen, Walkthrough} from '../../screens/onboard';
import {
  Biometric,
  CreatePin,
  OtpScreen,
  RegisterInfo,
  ResetPassword,
  ForgotPassword,
  ResidenceScreen,
  SetupAddressScreen,
  SetupBiometric,
  SetupID,
  SetupPassword,
  Signin,
  Signup,
  StatusReminder,
} from '../../screens/auth';

import BottomTab from '../bottomTab';
import TransactionPinScreen from '../../screens/main/home-tab/transactionPin';
import Receipt from '../../screens/main/home-tab/transactionPin/receipt';
import QrCode from '../../screens/main/home-tab/qr-code';
import Data from '../../screens/main/home-tab/data';
import Airtime from '../../screens/main/home-tab/airtime';
import PaymentPin from '../../screens/main/home-tab/airtime/paymentPin';
import PaymentSucess from '../../screens/main/home-tab/airtime/paymentSucessful';
import Electricity from '../../screens/main/home-tab/electricity';
import Cable from '../../screens/main/home-tab/cable';
import BookFlight from '../../screens/main/home-tab/bookFlight';
import SearchResult from '../../screens/main/home-tab/bookFlight/searchResult';
import FlightDetails from '../../screens/main/home-tab/bookFlight/searchResult/FlightDetails';
import IndividualInfo from '../../screens/main/home-tab/bookFlight/individualInformation';
import PaymentCheckout from '../../screens/main/home-tab/bookFlight/paymentCheckout';
import BoardingPass from '../../screens/main/home-tab/bookFlight/boardingPass';
import EditProfile from '../../screens/main/profile-tab/editProfile';
import UpdateNumber from '../../screens/main/profile-tab/editProfile/updateNumber';
import Notification from '../../screens/main/home-tab/notification';
import ChangePassword from '../../screens/main/profile-tab/changePassword';
import PasswordSucess from '../../screens/main/profile-tab/changePassword/sucessful';
import Legal from '../../screens/main/profile-tab/Legal';
import Language from '../../screens/main/profile-tab/language';
import NotificationSetting from '../../screens/main/profile-tab/notification';
import Faqs from '../../screens/main/profile-tab/faqs';
import Refer from '../../screens/main/profile-tab/refer-earn';
import Contact from '../../screens/main/profile-tab/contact-us';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ConfirmPin from '../../screens/auth/confirm-pin';
import DataPaymentPin from '../../screens/main/home-tab/data/dataPinConfrim';
import AirtimePaymentPin from '../../screens/main/home-tab/airtime/airtimePayPin';
import ElectricPaymentPin from '../../screens/main/home-tab/electricity/electricPayPIn';
import CablePaymentPin from '../../screens/main/home-tab/cable/cablePaymentPin';
import {AuthProvider} from '../../global/wrappers/AuthProvider';
import PaymentError from '../../screens/main/home-tab/airtime/paymentError';
import {useDispatch, useSelector} from 'react-redux';
import {loginSuccess, logout} from '../../contexts/actions/user';
import MaintenanceScreen from '../../screens/maintenance';
import {useCheckServerStatus} from '../../hooks/auth.hook';
import {navigate, navigationRef} from './RootNavigation';
import PinOtpScreen from '../../screens/auth/pin-otp-screen';
import SendBills from '../../screens/main/home-tab/SendBills';
import BettingPaymentPin from '../../screens/main/home-tab/fundBetting/bettingPaymentPin';
import FundBetting from '../../screens/main/home-tab/fundBetting';

const RootNav = props => {
  // const navigation = useNavigation();
  // const route = props.route;
  // const navigation = props.navigation;
  // const {isBioAuthStatus} = route.params;

  const Stack = createStackNavigator();
  const {Navigator, Screen} = Stack;
  // const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [bmEnabled, setBmEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const {isAuthenticated, isSession} = useSelector(state => state.user);
  const {data, refetch} = useCheckServerStatus();

  useEffect(() => {
    const checkSiteStatus = () => {
      // console.error(data);
      // console.log(data.status)
      if (data && data.data && data.data.status !== 'operational') {
        navigate('maintenance-screen');
      }
    };
    checkSiteStatus();
  }, [data]);

  useEffect(() => {
    const loadInitialData = async () => {
      await retrieveLog();
      setIsLoading(false);
    };
    loadInitialData();
  }, []);

  const retrieveLog = async () => {
    try {
      const bioEnabled = await AsyncStorage.getItem('bmEnabled');
      const isLoggedIn = await AsyncStorage.getItem('Login');

      if (isLoggedIn) {
        dispatch(loginSuccess()); //store user state on redux
        setBmEnabled(bioEnabled != null);
      } else {
        dispatch(logout()); //disable redux effect
      }

      console.log('====================================');
      console.log(isAuthenticated);
      console.log('====================================');
    } catch (error) {
      console.error('Error retrieving login data:', error);
      dispatch(logout()); //disable redux effect
    }
  };

  const linking = {
    prefixes: ['blowpay://', 'https://blowpay.com', 'BillsByBlowmoney://'],
    config: {
      screens: {
        Home: 'bottom-tab',
        Pay: 'pay/:amount',
      },
    },
  };

  return (
    <NavigationContainer ref={navigationRef} linking={linking}>
      <AuthProvider>
        <Stack.Navigator
          initialRouteName={
            isAuthenticated ? 'bottom-tab' : 'walkthrough-screen'
          }>
          <Screen
            name={'TransactionPinScreen'}
            component={TransactionPinScreen}
            options={screenOptions}
          />
          <Screen
            name={'walkthrough-screen'}
            component={Walkthrough}
            options={screenOptions}
          />
          <Screen
            name={'bottom-tab'}
            component={BottomTab}
            options={screenOptions}
          />
          <Screen
            name={'maintenance-screen'}
            component={MaintenanceScreen}
            options={screenOptions}
          />

          <Screen
            name={'splash-screen'}
            component={SplashScreen}
            options={screenOptions}
          />
          <Screen
            name={'signin-screen'}
            component={Signin}
            options={screenOptions}
          />
          <Screen
            name={'signup-screen'}
            component={Signup}
            options={screenOptions}
          />
          <Screen
            name={'reset-password-screen'}
            component={ResetPassword}
            options={screenOptions}
          />
          <Screen
            name={'forgot-password-screen'}
            component={ForgotPassword}
            options={screenOptions}
          />
          <Screen
            name={'otp-screen'}
            component={OtpScreen}
            options={screenOptions}
          />
          <Screen
            name={'register-info-screen'}
            component={RegisterInfo}
            options={screenOptions}
          />
          <Screen
            name={'create-pin-screen'}
            component={CreatePin}
            options={screenOptions}
          />
          <Screen
            name={'setup-password-screen'}
            component={SetupPassword}
            options={screenOptions}
          />
          <Screen
            name={'status-reminder-screen'}
            component={StatusReminder}
            options={screenOptions}
          />
          <Screen
            name={'biometric-screen'}
            component={Biometric}
            options={screenOptions}
          />
          <Screen
            name={'residence-screen'}
            component={ResidenceScreen}
            options={screenOptions}
          />
          <Screen
            name={'setup-id-screen'}
            component={SetupID}
            options={screenOptions}
          />
          <Screen
            name={'setup-biometric-screen'}
            component={SetupBiometric}
            options={screenOptions}
          />
          <Screen
            name={'setup-address-screen'}
            component={SetupAddressScreen}
            options={screenOptions}
          />

          <Screen
            name={'SendBills'}
            component={SendBills}
            options={screenOptions}
          />
          <Screen
            name={'Receipt'}
            component={Receipt}
            options={screenOptions}
          />
          <Screen name={'QrCode'} component={QrCode} options={screenOptions} />
          <Screen name={'Data'} component={Data} options={screenOptions} />
          <Screen
            name={'Airtime'}
            component={Airtime}
            options={screenOptions}
          />
          <Screen
            name={'PaymentPin'}
            component={PaymentPin}
            options={screenOptions}
          />
          <Screen
            name={'PaymentSucess'}
            component={PaymentSucess}
            options={screenOptions}
          />
          <Screen
            name={'Electricity'}
            component={Electricity}
            options={screenOptions}
          />
          <Screen name={'Cable'} component={Cable} options={screenOptions} />
          <Screen
            name={'BookFlight'}
            component={BookFlight}
            options={screenOptions}
          />
          <Screen
            name={'SearchResult'}
            component={SearchResult}
            options={screenOptions}
          />
          <Screen
            name={'FlightDetails'}
            component={FlightDetails}
            options={screenOptions}
          />
          <Screen
            name={'IndividualInfo'}
            component={IndividualInfo}
            options={screenOptions}
          />
          <Screen
            name={'PaymentCheckout'}
            component={PaymentCheckout}
            options={screenOptions}
          />
          <Screen
            name={'BoardingPass'}
            component={BoardingPass}
            options={screenOptions}
          />
          <Screen
            name={'EditProfile'}
            component={EditProfile}
            options={screenOptions}
          />
          <Screen
            name={'UpdateNumber'}
            component={UpdateNumber}
            options={screenOptions}
          />
          <Screen
            name={'Notification'}
            component={Notification}
            options={screenOptions}
          />
          <Screen
            name={'ChangePassword'}
            component={ChangePassword}
            options={screenOptions}
          />
          <Screen
            name={'PasswordSucess'}
            component={PasswordSucess}
            options={screenOptions}
          />
          <Screen name={'Legal'} component={Legal} options={screenOptions} />
          <Screen
            name={'Language'}
            component={Language}
            options={screenOptions}
          />
          <Screen
            name={'NotificationSetting'}
            component={NotificationSetting}
            options={screenOptions}
          />
          <Screen
            name={'ConfirmPin'}
            component={ConfirmPin}
            options={screenOptions}
          />
          <Screen
            name={'DataPaymentPin'}
            component={DataPaymentPin}
            options={screenOptions}
          />
          <Screen
            name={'AirtimePaymentPin'}
            component={AirtimePaymentPin}
            options={screenOptions}
          />
          <Screen
            name={'ElectricPaymentPin'}
            component={ElectricPaymentPin}
            options={screenOptions}
          />
          <Screen
            name={'CablePaymentPin'}
            component={CablePaymentPin}
            options={screenOptions}
          />
          <Screen
            name={'BettingPaymentPin'}
            component={BettingPaymentPin}
            options={screenOptions}
          />
          <Screen
            name={'fundBetting'}
            component={FundBetting}
            options={screenOptions}
          />
          <Screen name={'Faqs'} component={Faqs} options={screenOptions} />
          <Screen name={'Refer'} component={Refer} options={screenOptions} />
          <Screen
            name={'Contact'}
            component={Contact}
            options={screenOptions}
          />
          <Screen
            name={'PaymentError'}
            component={PaymentError}
            options={screenOptions}
          />
          <Screen
            name={'PinOtpScreen'}
            component={PinOtpScreen}
            options={screenOptions}
          />
        </Stack.Navigator>
      </AuthProvider>
    </NavigationContainer>
  );
};

export default RootNav;
