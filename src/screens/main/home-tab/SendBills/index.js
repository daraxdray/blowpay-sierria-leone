import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Modal,
  ActivityIndicator,
  FlatList,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { styles } from './style';
import { ScreenView } from '../../../../global/wrappers';
import { BLACK, WHITE } from '../../../../global/theme';
import tw from 'twrnc';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { CustomButton } from '../../../../global/components';
import ModalDetails from '../../../../components/sendToBm/ModalDetails';
import Recent from '../../../../components/wallet/Recent';
import { useGetReceiver } from '../../../../hooks/virtual.hook';
import Toast from 'react-native-toast-message';
import Loader from '../../../../components/modals/Loader';
import imageConstant from '../../../../constants/data/imageConstant';

const SendBills = props => {
  const { navigation } = props;
  const [modalVisible, setModalVisible] = useState(false);
  const [selected, setSelected] = useState(false);
  const [recipient, setRecipient] = useState('');
  const [userList, setUsers] = useState([]);
  const { data, status, refetch, isFetching, isRefetching } = useGetReceiver(recipient,false); //disabled loading on first instance, fetch only when 

  
  useEffect(()=>{
    setUsers(data?.data ?? []);

  },[data?.data])

  const clearField = () => {
    setRecipient('')
  };

  const handleInputChange = value => {
    setRecipient((v)=>value);
  };


  useEffect(()=>{
    if (recipient.length > 2 && !selected) {
      refetch()
    }
  },[recipient])
  
  const openModal = () => {
    if (!data?.data || !data?.data?.length) {
      Toast.show({
        type: 'error',
        text1: 'User Not Found',
        text2: 'No recipient was found for the given account.',
      });
      refetch();
    } else {
      setModalVisible(true);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const proceed = (amount, accNum) => {
    navigation.navigate('PaymentPin', { amount, accNum });
    closeModal();
  };
  const handleSelectedUser = (val)=>{
    setSelected(val);
    // setRecipient(()=>val?.user)
    setUsers([]);
    setModalVisible(true);

  }
  const renderUserItem = ({ item }) => (
    <TouchableOpacity onPress={()=>handleSelectedUser(item)} style={tw`flex-row items-center bg-white border-b border-gray-200 px-4 py-3`}>
      <Image
        source={imageConstant.smileyUp} // Replace with actual avatar field
        style={tw`w-10 h-10 rounded-full mr-4`}
      />
      <View>
        <Text style={tw`text-black font-semibold`}>{item.user.firstName} - {item.accountNumber}</Text>
        <Text style={tw`text-gray-500 text-xs`}>@{item.user.username}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScreenView style={styles.container} light color={WHITE}>
      <View style={tw`flex-1`}>
        <ScrollView
          style={styles.viewContainer}
          contentContainerStyle={{ paddingBottom: 100 }}>
          <View style={tw`flex justify-between`}>
            <View>
              <View style={styles.header}>
                <TouchableOpacity
                  style={styles.btn}
                  activeOpacity={0.65}
                  onPress={() => navigation.goBack()}>
                  <Ionicons name="chevron-back" size={14} color={BLACK} />
                </TouchableOpacity>
                <Text style={tw`text-gray-800 font-medium text-[13px]`}>
                  Transfer Money
                </Text>
                <View style={tw`w-10 h-10 rounded-[10px] `} />
              </View>

              <View style={tw`mx-5 gap-2 mt-[20px]`}>
                <Text style={tw`text-gray-900 font-medium text-[12px]`}>
                  Recipient Account
                </Text>
                <View style={tw`relative`}>
                  <TextInput
                    placeholder="Account No./Username"
                    placeholderTextColor={'grey'}
                    style={tw`border border-[#D0D5DD] rounded-[8px] px-5 ${Platform.OS == 'android'?'py-2':' py-4'} text-[12px] text-black`}
                    value={recipient}
                    onChangeText={handleInputChange}
                  />
                  <TouchableOpacity
                    onPress={clearField}
                    style={styles.imageContainer}>
                    <Ionicons name='close' color={'red'}/>
                  </TouchableOpacity>
                </View>

                {isRefetching && (
                    <View style={tw`mt-4`}>
                      <ActivityIndicator size="small" color="#000" />
                    </View>
                  )}

                  {status === 'error' && (
                    <Text style={tw`mt-4 text-red-500`}>Failed to load users</Text>
                  )}

                  {status === 'success' && userList != undefined && userList && userList.length > 0 && (
                    <View style={tw`mt-12 border z-[50] w-[100%] border-gray-300 rounded-lg`}>
                      {userList.map((item) => (
                        <TouchableOpacity
                          key={item.id?.toString()}
                          onPress={() => handleSelectedUser(item)}
                          style={tw`flex-row items-center bg-white border-b border-gray-200 px-4 py-3`}>
                          <Image
                            source={imageConstant.smileyUp} // Replace with actual avatar field
                            style={tw`w-10 h-10 rounded-full mr-4`}
                          />
                          <View>
                            <Text style={tw`text-black font-semibold`}>
                              {item.user.firstName} - {item.accountNumber}
                            </Text>
                            <Text style={tw`text-gray-500 text-xs`}>
                              @{item.user.username}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}

                  {status === 'success' && data?.length === 0 && (
                    <Text style={tw`mt-4 text-gray-500`}>No users found</Text>
                  )}
              </View>
              <View style={tw`relative`}>
                <Recent description='Transfer' />
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={tw`pb-5`}>
          <CustomButton
            onPress={openModal}
            style={{ width: '90%' }}
            text={'New Transfer'}
          />
        </View>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}>
        <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={tw`flex-1 justify-end bg-black bg-opacity-50`}>
          <ModalDetails proceed={proceed} closeModal={closeModal} data={selected} />
        </KeyboardAvoidingView>
      </Modal>
      {status === 'pending ' && <Loader />}
    </ScreenView>
  );
};

export default SendBills;
