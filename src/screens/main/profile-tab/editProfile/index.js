import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Modal,
  TouchableOpacity,
} from 'react-native';
import {styles} from './style';
import {ScreenView} from '../../../../global/wrappers';
import {WHITE, PRIMARY_COLOR} from '../../../../global/theme';
import Header from '../../../../global/components/Header';
import tw from 'twrnc';
import {CustomButton} from '../../../../global/components';
import {useGetUser, useEditUser} from '../../../../hooks/user.hook';
import Loader from '../../../../components/modals/Loader';

const EditProfile = props => {
  const {data} = useGetUser();
  const {mutate, status} = useEditUser();
  const navigation = props.navigation;

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    address: '',
    email: '',
    phoneNumber: '',
    houseNumber: '',
  });
  const [isChanged, setIsChanged] = useState(false);
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    if (data?.data) {
      setForm({
        firstName: data.data.firstName || '',
        lastName: data.data.lastName || '',
        emailAddress: data.data.emailAddress || '',
        address: data.data.address || '',
        houseNumber: data.data.houseNumber || '',
        phoneNumber: data.data.phoneNumber || '',
      });
    }
  }, [data]);

  const handleChange = (name, value) => {
    setForm(prevForm => ({...prevForm, [name]: value}));
    setIsChanged(true);
  };

  const handleSaveChanges = () => {
    mutate(form, {
      onSuccess: () => {
        setShowModal(true);
        setIsChanged(false);
      },
    });
  };

  return (
    <ScreenView style={styles.container} light color={WHITE}>
      <View style={tw`px-2 pt-2`}>
        <Header
          navigation={() => navigation.goBack()}
          ImageSource={require('../../../../../assets/icons/filter.png')}
          title="Edit My Profile"
          showIcon={false}
          iconName="add-circle"
          imagePress={() => console.log('Second Icon Pressed')}
        />
      </View>

      <ScrollView style={styles.viewContainer}>
        <View style={styles.view1}>
          <View style={tw`px-5 gap-4`}>
            <View style={tw`gap-2 w-full`}>
              <Text style={tw`text-gray-900 font-medium text-[14px]`}>
                First Name
              </Text>
              <TextInput
                value={form.firstName}
                onChangeText={value => handleChange('firstName', value)}
                placeholder="First Name"
                placeholderTextColor="gray"
                style={tw`py-3 border border-[#D0D5DD] rounded-[20px] px-4 text-black`}
              />
            </View>
            <View style={tw`gap-2 w-full`}>
              <Text style={tw`text-gray-900 font-medium text-[14px]`}>
                Last Name
              </Text>
              <TextInput
                value={form.lastName}
                onChangeText={value => handleChange('lastName', value)}
                placeholder="Last Name"
                placeholderTextColor="gray"
                style={tw`py-3 border border-[#D0D5DD] rounded-[20px] px-4 text-black`}
              />
            </View>
            <View style={tw`gap-2 w-full`}>
              <Text style={tw`text-gray-900 font-medium text-[14px]`}>
                Address
              </Text>
              <TextInput
                value={form.address}
                onChangeText={value => handleChange('address', value)}
                placeholder="Address"
                placeholderTextColor="gray"
                style={tw`py-3 border border-[#D0D5DD] rounded-[20px] px-4 text-black`}
              />
            </View>
            <View style={tw`gap-2 w-full`}>
              <Text style={tw`text-gray-900 font-medium text-[14px]`}>
                Email
              </Text>
              <TextInput
                value={form.emailAddress}
                onChangeText={value => handleChange('emailAddress', value)}
                placeholder="email"
                disabled
                editable={false}
                placeholderTextColor="gray"
                style={tw`py-3 border border-[#D0D5DD] rounded-[20px] px-4 text-black`}
              />
            </View>
            <View style={tw`gap-2 w-full`}>
              <Text style={tw`text-gray-900 font-medium text-[14px]`}>
                Phone Number
              </Text>
              <TextInput
                value={form.phoneNumber}
                onChangeText={value => handleChange('phoneNumber', value)}
                placeholder="Phone Number"
                placeholderTextColor="gray"
                keyboardType="phone-pad"
                style={tw`py-3 border border-[#D0D5DD] rounded-[20px] px-4 text-black`}
              />
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={tw`pb-8 w-full px-3`}>
        <CustomButton
          onPress={handleSaveChanges}
          style={styles.btn1}
          text={'Save Changes'}
          disabled={!isChanged}
        />
      </View>

      {/* Success Modal */}
      <Modal
        visible={showModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowModal(false)}>
        <View
          style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}>
          <View style={tw`bg-white rounded-lg p-5 w-80`}>
            <Text style={tw`text-lg font-bold mb-4 text-center`}>
              Profile Updated
            </Text>
            <Text style={tw`text-center text-gray-700 mb-5`}>
              Your profile has been updated successfully.
            </Text>
            <TouchableOpacity
              onPress={() => setShowModal(false)}
              style={[
                tw`rounded-lg py-2 px-4`,
                {backgroundColor: PRIMARY_COLOR},
              ]}>
              <Text style={tw`text-white text-center`}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {status === 'pending' && <Loader />}
    </ScreenView>
  );
};

export default EditProfile;
