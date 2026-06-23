import React, {useState} from 'react';
import {View, Text, ScrollView, TouchableOpacity} from 'react-native';
import {styles} from './style';
import {ScreenView} from '../../../global/wrappers';
import {BLACK, WHITE} from '../../../global/theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomTextInput from '../../../global/components/CustomTextInput';
import {CustomButton} from '../../../global/components';
import {useForgotPassword} from '../../../hooks/auth.hook';

const ForgotPassword = props => {
  const navigation = props.navigation;

  const [email, setEmail] = useState('');
  const [validEmail, setValidEmail] = useState(false);
  const {mutate, status} = useForgotPassword();

  const handleSubmit = () => {
    if (!validEmail || !email) return;

    mutate(
      {emailAddress: email},
      {
        onSuccess: () => {
          navigation.navigate('otp-screen', {
            emailAddress: email,
            resetPassword: true,
          });
        },
      },
    );
  };

  return (
    <ScreenView style={styles.container} light color={WHITE}>
      <ScrollView style={styles.viewContainer}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.btn}
            activeOpacity={0.65}
            onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={13} color={BLACK} />
          </TouchableOpacity>
        </View>
        <View style={styles.view1}>
          <View style={styles.v1}>
            <Text style={styles.text1}>Reset your password</Text>
            <Text style={styles.text11}>
              Enter your email address, and we will send you a code to reset
              your password
            </Text>
          </View>

          <View style={styles.v2}>
            <CustomTextInput
              value={email}
              setValue={setEmail}
              placeholder={'you@email.com'}
              label={'Email'}
              title={'Email'}
              containerStyle={styles.inputCont1}
              inputStyle={styles.input1}
              email
              valid={validEmail}
              setCheck={setValidEmail}
            />
          </View>

          <View style={styles.v3}>
            <CustomButton
              onPress={handleSubmit}
              style={styles.btn1}
              text={'Submit Email'}
              loading={status === 'pending'}
            />
          </View>
        </View>
      </ScrollView>
    </ScreenView>
  );
};

export default ForgotPassword;
