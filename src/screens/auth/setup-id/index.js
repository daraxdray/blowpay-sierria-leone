import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {styles} from './style';
import {ScreenView} from '../../../global/wrappers';
import {BLACK, WHITE} from '../../../global/theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomTextInput from '../../../global/components/CustomTextInput';
import {CustomButton} from '../../../global/components';
import Toast from 'react-native-toast-message';
import {useVerifyNin} from '../../../hooks/kyc.hook';
import Loader from '../../../components/modals/Loader';
import {CommonActions} from '@react-navigation/native';

const NIN_MIN_LENGTH = 11;

const SetupID = props => {
  const navigation = props.navigation;
  const [nin, setNin] = useState('');
  const {mutate, status} = useVerifyNin();

  const isNinValid = nin.trim().length >= NIN_MIN_LENGTH;

  const handleConfirmId = () => {
    mutate(nin.trim(), {
      onSuccess: data => {
        Toast.show({text1: data?.message ?? 'NIN verified successfully.'});
        navigation.dispatch(
          CommonActions.reset({index: 0, routes: [{name: 'bottom-tab'}]}),
        );
      },
      onError: err => {
        Toast.show({
          type: 'error',
          text1:
            err?.response?.data?.message ??
            err?.response?.data?.error ??
            'Verification failed. Please try again.',
        });
      },
    });
  };

  return (
    <ScreenView style={styles.container} light color={WHITE}>
      <KeyboardAvoidingView
        style={{flex: 1, width: '100%'}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 20,
            paddingBottom: 30,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.btn}
              activeOpacity={0.65}
              onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back" size={13} color={BLACK} />
            </TouchableOpacity>
          </View>

          <View style={styles.v1}>
            <Text style={styles.text1}>
              Confirm Your National Identity Number
            </Text>
            <Text style={styles.text11}>
              Please provide your National Identity Number (NIN) for
              verification
            </Text>
          </View>

          <CustomTextInput
            value={nin}
            onChangeText={setNin}
            keyboardType="numeric"
            placeholder="Enter your National Identity Number"
            title="National Identity Number (NIN)"
            containerStyle={{marginTop: 20}}
            noError
            inputStyle={{borderRadius: 15}}
          />

          <View style={{flex: 1}} />

          <View style={{marginTop: 30}}>
            <CustomButton
              text="Confirm ID"
              onPress={handleConfirmId}
              checker={isNinValid}
              dark
            />

            <TouchableOpacity
              activeOpacity={0.65}
              onPress={() =>
                navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{name: 'bottom-tab'}],
                  }),
                )
              }
              style={{
                marginTop: 16,
                paddingVertical: 10,
                alignSelf: 'center',
              }}>
              <Text style={styles.text11}>Skip verification</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      {status === 'pending' && <Loader />}
    </ScreenView>
  );
};

export default SetupID;
