import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import {styles} from './style';
import {ScreenView} from '../../../../global/wrappers';
import {BLACK, GREY, GREY_LIGHT, WHITE} from '../../../../global/theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomTextInput from '../../../../global/components/CustomTextInput';
import {CustomButton} from '../../../../global/components';
import {satoshi_black} from '../../../../constants/data/fonts';
import Header from '../../../../global/components/Header';
import tw from 'twrnc';

const constraints = [
  '6 Character',
  'Uppercase',
  'Lowercase',
  'Number',
  'Special Character',
];

const ChangePassword = props => {
  const navigation = props.navigation;

  //states
  const [email, setEmail] = useState('');
  const [validEmail, setValidEmail] = useState(false);

  const [password, setPass] = useState('');
  const [validPass, setValidPass] = useState(false);

  //functions
  const _constructor = () => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(WHITE);
    }
  };

  useEffect(() => {
    _constructor();
  }, []);

  return (
    <ScreenView style={styles.container} light color={WHITE}>
      <View style={tw`px-3 pt-2`}>
        <Header
          navigation={() => {
            navigation.goBack();
          }}
          ImageSource={require('../../../../../assets/icons/filter.png')}
          title="Change Password"
          showIcon={false}
          iconName="add-circle"
          imagePress={() => console.log('Second Icon Pressed')}
        />
      </View>
      <ScrollView style={styles.viewContainer}>
        <View style={styles.view1}>
          <Text style={tw`text-[#A5A5A5] font-normal text-[14px] items-start`}>
            Kindly provide the following information to change your password
          </Text>
          <View style={styles.v2}>
            <CustomTextInput
              value={password}
              setValue={setPass}
              placeholder={'Enter Old Password'}
              label={'Old Password'}
              title={'Old Password'}
              containerStyle={styles.inputCont1}
              inputStyle={styles.input1}
              pass={true}
              valid={validPass}
              setCheck={setValidPass}
            />

            <CustomTextInput
              value={password}
              setValue={setPass}
              placeholder={'@Recti123|'}
              label={'Password'}
              title={'Password'}
              containerStyle={styles.inputCont1}
              inputStyle={styles.input1}
              pass={true}
              valid={validPass}
              setCheck={setValidPass}
            />

            <View style={styles.v21}>
              <Text style={styles.text15}>At Least:</Text>

              <View style={styles.wrap}>
                {constraints.map(constraint => (
                  <TouchableOpacity style={styles.consPass}>
                    <Text style={styles.text14}>{constraint}</Text>
                    <Ionicons name="checkmark" size={15} color={GREY} />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <CustomTextInput
              value={password}
              setValue={setPass}
              placeholder={'Confirm Password'}
              label={'Confirm Password'}
              title={'Confirm Password'}
              containerStyle={styles.inputCont1}
              inputStyle={styles.input1}
              pass={true}
              valid={validPass}
              setCheck={setValidPass}
            />
          </View>

          <View style={styles.v3}>
            <CustomButton
              onPress={() =>
                navigation.navigate('PasswordSucess', {isVerified: true})
              }
              style={styles.btn1}
              text={'Save Changes'}
            />
          </View>
        </View>
      </ScrollView>
    </ScreenView>
  );
};

export default ChangePassword;
