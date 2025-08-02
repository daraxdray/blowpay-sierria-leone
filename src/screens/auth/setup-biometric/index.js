import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import {styles} from './style';
import {ScreenView} from '../../../global/wrappers';
import {BLACK, WHITE} from '../../../global/theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {CustomButton} from '../../../global/components';
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {launchCamera} from 'react-native-image-picker';
import {Platform} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

const requestCameraPermission = async () => {
  if (Platform.OS === 'android') {
    const result = await request(PERMISSIONS.ANDROID.CAMERA);
    return result === RESULTS.GRANTED;
  } else {
    const result = await request(PERMISSIONS.IOS.CAMERA);
    return result === RESULTS.GRANTED;
  }
};

const SetupBiometric = props => {
  const navigation = props.navigation;
  const [selfieImage, setImageUri] = useState('');

  
  useEffect(() => {
    if (selfieImage) {
      handleNext();
    }
  }, [selfieImage]);

  const saveData = async () => {
    try {
      if (selfieImage) {
        await AsyncStorage.setItem('selfieImage', selfieImage);
        console.log('Saved selfieImage:', selfieImage);
      }
    } catch (e) {
      console.log('Error saving data:', e);
    }
  };

  const handleNext = async () => {
    try {
      await saveData(); 
   
      navigation.goBack();
      Toast.show({
        type: 'success',
        text1: 'Your face capture has been submitted successfully',
        text2: 'Please proceed to provide your ID Card details.',
      });
    } catch (e) {
      console.log('Error handling next step:', e);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'There was a problem submitting your face capture.',
      });
    }
  };

  const openCamera = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      Alert.alert(
        'Permission Denied',
        'Camera access is required to take pictures.',
      );
      return;
    }

    const options = {
      mediaType: 'photo',
      maxWidth: 800,
      maxHeight: 400,
      quality: 1,
    };

    launchCamera(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.assets && response.assets.length > 0) {
        setImageUri(response.assets[0].uri);
      }
    });
  };

  return (
    <ScreenView style={styles.container} light color={WHITE}>
      <ScrollView
        style={styles.viewContainer}
        showsVerticalScrollIndicator={false}>
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
            <Text style={styles.text1}>Let’s verify your identity</Text>
            <Text style={styles.text11}>
              We’re required by law to verify your identity before we can use
              your money
            </Text>
          </View>

          <TouchableOpacity style={styles.v2}>
            <Image
              source={require('../../../../assets/icons/face-scan2.png')}
              style={styles.image}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <CustomButton text={'Proceed'} onPress={openCamera} dark />
        </View>
      </ScrollView>
    </ScreenView>
  );
};

export default SetupBiometric;
