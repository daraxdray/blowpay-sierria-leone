import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  TextInput,
} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {styles} from './style';
import {ScreenView} from '../../../global/wrappers';
import {BLACK, WHITE} from '../../../global/theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {CustomButton} from '../../../global/components';
import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  openSettings,
} from 'react-native-permissions';
import tw from 'twrnc';
import {Platform} from 'react-native';
import DateModal from '../../../components/bookFlight/DateModal';
const requestCameraPermission = async () => {
  if (Platform.OS === 'android') {
    const result = await request(PERMISSIONS.ANDROID.CAMERA);
    return result === RESULTS.GRANTED;
  } else {
    const result = await request(PERMISSIONS.IOS.CAMERA);
    return result === RESULTS.GRANTED;
  }
};

const requestGalleryPermission = async () => {
  if (Platform.OS === 'android') {
    const result = await request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
    return result === RESULTS.GRANTED;
  } else {
    const result = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
    return result === RESULTS.GRANTED;
  }
};

const SetupID = ({navigation, route}) => {
  const documentType = route?.params?.documentType || 'Default Method';

  const [idNumber, setidNumber] = useState('');
  const [expiryDate, setExpiredDate] = useState('');
  const [documentImage, setImageUri] = useState(null);
  const [departureModalOpen, setDepartureModalOpen] = useState(false);

  const handleImagePicker = () => {
    Alert.alert('Upload Image', 'Choose an option', [
      {
        text: 'Camera',
        onPress: () => openCamera(),
      },
      {
        text: 'Gallery',
        onPress: () => openGallery(),
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ]);
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
      } else {
        setImageUri(response.assets[0].uri);
        console.log(documentImage, 'hhh');
      }
    });
  };

  const openGallery = async () => {
    const hasPermission = await requestGalleryPermission();
    if (!hasPermission) {
      Alert.alert(
        'Permission Denied',
        'Gallery access is required to upload pictures.',
      );
      return;
    }

    const options = {
      mediaType: 'photo',
      maxWidth: 800,
      maxHeight: 400,
      quality: 1,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        setImageUri(response.assets[0].uri);
      }
    });
  };

  const handleProceed = () => {
    if (!idNumber || !expiryDate || !documentImage) {
      Alert.alert(
        'Incomplete Data',
        'Please fill all fields and upload an image.',
      );
      return;
    }
    navigation.navigate('residence-screen', {
      idNumber,
      expiryDate,
      documentImage,
      documentType,
    });
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
            <Text style={styles.text1}>Country of Residence</Text>
            <Text style={styles.text11}>
              Please select your country of residence
            </Text>
          </View>

          <View style={styles.v2}>
            <View style={tw`w-full `}>
              <Text style={styles.text}>I.D. Number</Text>
              <TextInput
                value={idNumber}
                onChangeText={setidNumber}
                placeholder={'0000 0000 0000'}
                style={[styles.inputCont1, {borderRadius: 15}]}
                placeholderTextColor="#A9A9A9"
                keyboardType="phone-pad"
              />
            </View>

            <TouchableOpacity
              style={tw`w-full`}
              onPress={() => setDepartureModalOpen(true)}>
              <Text style={styles.text}>Expiry Date</Text>
              <Text
                style={[
                  styles.inputCont1,
                  {borderRadius: 15, paddingVertical: 15},
                ]}>
                {expiryDate ? expiryDate : 'select expiry date'}
              </Text>
            </TouchableOpacity>

            <View style={styles.v3}>
              <Text style={styles.text13}>Upload a valid ID Card</Text>

              <TouchableOpacity
                style={styles.uploadCont}
                onPress={handleImagePicker}>
                {documentImage ? (
                  <Image
                    source={{uri: documentImage}}
                    style={styles.imagePreview}
                    resizeMode="contain"
                  />
                ) : (
                  <>
                    <Image
                      source={require('../../../../assets/icons/cloud-upload.png')}
                      style={styles.icon}
                      resizeMode={'contain'}
                    />
                    <Text style={styles.text12}>Click to upload</Text>
                    <Text style={styles.text13}>
                      SVG, PNG, JPG or GIF (max. 800x400px)
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
          <CustomButton text={'Proceed'} onPress={handleProceed} dark />
        </View>
        <DateModal
          visible={departureModalOpen}
          onClose={() => setDepartureModalOpen(false)}
          onDateChange={date => setExpiredDate(date)}
          selectedDate={expiryDate}
        />
      </ScrollView>
    </ScreenView>
  );
};

export default SetupID;
