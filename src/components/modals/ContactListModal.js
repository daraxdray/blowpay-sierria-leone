import React, { useState , useEffect} from 'react';
import { View, Text, TouchableOpacity, TextInput, FlatList, Modal,PermissionsAndroid,
  Alert, } from 'react-native';
import tw from 'twrnc';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { CustomButton } from '../../global/components';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { useBillerProducts } from '../../hooks/billing.hook';
import Loader from './Loader';


import Contacts from 'react-native-contacts';
import Toast from 'react-native-toast-message';

const ContactListModal = ({ showModal, setShowModal, setselectedContact,setSelectedIndex,selectedIndex }) => {

  const [searchText, setSearchText] = useState(null);
  const [contactList, setContactList] = useState([])
  // const [selectedContact,setSelectedContact] = useState(false);
  const [isLoading,setLoading] = useState(false);
  const [filteredContacts,setfilteredContacts] = useState([]);
  useEffect(()=>{
    if(showModal){
      if(contactList.length == 0)
      requestContactPermission()
    }
  },[showModal])


  const requestContactPermission = async () => {
    const permissionStatus = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
    );

    if (permissionStatus) {
      pickContact();
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
          {
            title: 'Contacts Permission',
            message: 'This app would like to access your contacts.',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          pickContact();
        } else {
          Alert.alert(
            'Permission Required',
            'Contacts access is required to select contacts. Please enable it in settings.',
            [{ text: 'OK' }],
          ); 
        }
      } catch (err) {
        console.warn('Permission request error:', err);
      }
    }
  };
  
  
  

  const pickContact = async () => {
    setLoading(true);
    try {
      const contacts = await Contacts.getAll();
      if (contacts && contacts.length > 0) {
        // console.log('Contacts:', contacts);
        setContactList(contacts);
        Toast.show('error','SHOWING LIST OF')
        
      } else {
        Toast.show('error','No contacts found');
      }
      setLoading(false);
    } catch (error) {
      Toast.show('error','Error Fetching Contacts');
      setLoading(false);
      setLoading(false);
      
    }
  };

  useEffect(()=>{
    const filter =
    contactList && contactList.length > 0
     && searchText != null ? contactList.filter(contact =>
        contact.displayName?.toLowerCase().includes(searchText?.toLowerCase()),
      )
      : contactList;
      
      setfilteredContacts(filter);
  },[contactList, searchText])

  
  const handleSwipeDown = ({ nativeEvent }) => {
    if (nativeEvent.translationY > 50) {
      setShowModal(false)
    }
  };

  const renderContact = ({ item, index }) => {
    const isSelected = selectedIndex === index;
    const phoneNumber = item?.phoneNumbers.length > 0? item?.phoneNumbers[0].number : ''
    return (
      <TouchableOpacity
        style={tw`flex-row items-center p-3 mb-1 bg-white shadow-sm rounded-lg`}
        onPress={() => {
          setSelectedIndex(index);
          setselectedContact(phoneNumber.replace(/^(\+234|234)/, '0')
          .replace(/\D/g, ''));
          setShowModal(false)
        }}>
        <View style={tw`flex-1`}>
          <Text style={tw`text-[#292929] font-medium text-[14px]`}>
            {item?.displayName} - {phoneNumber}
          </Text>
        </View>
        <View
          style={[
            tw`w-5 h-5 border rounded-full items-center justify-center`,
            isSelected ? tw`border-green-500` : tw`border-gray-400`,
          ]}>
          {isSelected && <Ionicons name="checkmark" size={16} color="green" />}
        </View>
      </TouchableOpacity>
    );
  };

  if(isLoading){
    return <Loader />
  }

  return (<>
    <Modal
      animationType="slide"
      transparent={true}
      visible={showModal}
      onRequestClose={() => setShowModal(false)}>
      <View style={tw`flex-1 justify-end bg-black bg-opacity-50`}>
        <PanGestureHandler onGestureEvent={handleSwipeDown}>
          <View
            style={tw`h-[95%] bg-white p-5 rounded-t-[20px] w-19/20 self-center rounded-b-10 mb-5`}>
            <View style={tw`items-center justify-center`}>
              <View style={tw`w-20 h-2 bg-[#999999] rounded-full`} />
            </View>

            <View style={tw`flex-1 mt-4`}>
              <Text style={tw`text-[#292929] font-medium text-[18px]`}>
                Select a Contact 
              </Text>

              <TextInput
                placeholder="Search contact"
                value={searchText}
                placeholderTextColor="gray"
                onChangeText={setSearchText}
                style={tw`rounded-lg text-black p-3 mt-2  bg-white`}
              />

              <FlatList
                data={filteredContacts}
                renderItem={renderContact}
                keyExtractor={item => item.rawContactId.toString()}
                style={tw`mt-4`}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={tw`pb-10`}
              />
            </View>

            <View style={tw`py-3`}>
              <CustomButton onPress={()=>setShowModal(false)} text={'Close'} />
            </View>
          </View>
        </PanGestureHandler>



      </View>
    </Modal>
  </>
  );
};

export default ContactListModal;
