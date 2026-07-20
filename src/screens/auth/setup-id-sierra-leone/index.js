import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {styles} from './style';
import {ScreenView} from '../../../global/wrappers';
import {BLACK, WHITE} from '../../../global/theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {CustomButton} from '../../../global/components';
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import tw from 'twrnc';
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
    if (Platform.Version >= 33) {
      const result = await request(PERMISSIONS.ANDROID.READ_MEDIA_IMAGES);
      return result === RESULTS.GRANTED;
    } else {
      const result = await request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
      return result === RESULTS.GRANTED;
    }
  } else {
    return true;
  }
};

const SetupIDSierraLeone = ({navigation, route}) => {
  const documentType = route?.params?.documentType || 'Default Method';

  const [idNumber, setidNumber] = useState('');
  const [expiryDate, setExpiredDate] = useState('');
  const [documentImage, setDocumentImage] = useState(null);
  const [selfieImage, setSelfieImage] = useState(null);
  const [departureModalOpen, setDepartureModalOpen] = useState(false);

  const handleImagePicker = setImage => {
    Alert.alert('Upload Image', 'Choose an option', [
      {text: 'Camera', onPress: () => openCamera(setImage)},
      {text: 'Gallery', onPress: () => openGallery(setImage)},
      {text: 'Cancel', style: 'cancel'},
    ]);
  };

  const openCamera = async setImage => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Camera access is required.');
      return;
    }
    const options = {
      mediaType: 'photo',
      maxWidth: 800,
      maxHeight: 400,
      quality: 1,
    };
    launchCamera(options, response => {
      if (response.assets && response.assets[0]?.uri) {
        setImage(response.assets[0].uri);
      }
    });
  };

  const openGallery = async setImage => {
    const hasPermission = await requestGalleryPermission();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Gallery access is required.');
      return;
    }
    const options = {
      mediaType: 'photo',
      maxWidth: 800,
      maxHeight: 400,
      quality: 1,
    };
    launchImageLibrary(options, response => {
      if (response.assets && response.assets[0]?.uri) {
        setImage(response.assets[0].uri);
      }
    });
  };

  const handleProceed = () => {
    if (!idNumber || !expiryDate || !documentImage || !selfieImage) {
      Alert.alert(
        'Incomplete Data',
        'Please fill all fields and upload both images.',
      );
      return;
    }

    navigation.navigate('residence-screen', {
      idNumber,
      expiryDate,
      documentImage,
      selfieImage,
      documentType,
    });
  };

  return (
    <ScreenView style={styles.container} light color={WHITE}>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={80}>
        <ScrollView
          style={styles.viewContainer}
          contentContainerStyle={{paddingBottom: 120}}
          keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.btn}
              activeOpacity={0.65}
              onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back" size={13} color={BLACK} />
            </TouchableOpacity>
          </View>

          <View style={styles.view1}>
            {/* ID Number + Expiry */}
            <View style={styles.v2}>
              <Text style={styles.text}>I.D. Number</Text>
              <TextInput
                value={idNumber}
                onChangeText={setidNumber}
                placeholder="0000 0000 0000"
                style={styles.inputCont1}
                placeholderTextColor="#A9A9A9"
                keyboardType="phone-pad"
              />

              <TouchableOpacity
                style={tw`w-full`}
                onPress={() => setDepartureModalOpen(true)}>
                <Text style={styles.text}>Expiry Date</Text>
                <Text style={styles.inputCont1}>
                  {expiryDate ? expiryDate : 'select expiry date'}
                </Text>
              </TouchableOpacity>

              {/* Document Image Upload */}
              <View style={styles.v3}>
                <Text style={styles.text13}>Upload a valid ID Card</Text>
                <TouchableOpacity
                  style={styles.uploadCont}
                  onPress={() => handleImagePicker(setDocumentImage)}>
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
                        resizeMode="contain"
                      />
                      <Text style={styles.text12}>Click to upload</Text>
                      <Text style={styles.text13}>
                        PNG, JPG, GIF (max. 800x400px)
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>

              {/* Selfie Upload */}
              <View style={styles.v3}>
                <Text style={styles.text13}>
                  Upload a Selfie (holding your ID)
                </Text>
                <TouchableOpacity
                  style={styles.uploadCont}
                  onPress={() => handleImagePicker(setSelfieImage)}>
                  {selfieImage ? (
                    <Image
                      source={{uri: selfieImage}}
                      style={styles.imagePreview}
                      resizeMode="contain"
                    />
                  ) : (
                    <>
                      <Image
                        source={require('../../../../assets/icons/cloud-upload.png')}
                        style={styles.icon}
                        resizeMode="contain"
                      />
                      <Text style={styles.text12}>Click to upload</Text>
                      <Text style={styles.text13}>
                        PNG, JPG, GIF (max. 800x400px)
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={{padding: 16, backgroundColor: WHITE}}>
          <CustomButton text="Proceed" onPress={handleProceed} dark />
        </View>

        <DateModal
          visible={departureModalOpen}
          onClose={() => setDepartureModalOpen(false)}
          onDateChange={setExpiredDate}
          selectedDate={expiryDate}
        />
      </KeyboardAvoidingView>
    </ScreenView>
  );
};

export default SetupIDSierraLeone;
