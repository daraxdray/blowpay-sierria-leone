import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Linking,
  Alert,
  Platform,
} from 'react-native';
import {styles} from './style';
import {ScreenView} from '../../../../global/wrappers';
import {WHITE} from '../../../../global/theme';
import Header from '../../../../global/components/Header';
import tw from 'twrnc';
import FaqsSVG from '../../../../../assets/svgs/Faqs.svg';
import ContactSVG from '../../../../../assets/svgs/Contact.svg';
import AppConstant from '../../../../constants/data/appConstant';
import {useGetConstant} from '../../../../hooks/constants.hook';

const Contact = props => {
  const navigation = props.navigation;
  const {data, refetch: refetchAccount, loading} = useGetConstant();

  // ✅ Updated phone numbers for WhatsApp & Customer Service
  const phoneNumbers = ['+2348077671056', '+2348039304425'];

  const handleChat = number => {
    const formatted = number.replace(/\s/g, '');
    Linking.openURL(`https://wa.me/${formatted}`);
  };

  const handleEmail = async () => {
    const email =
      Platform.OS === 'ios' || AppConstant.isAmazonStore
        ? 'support@blowpay.app'
        : 'support@billsbyblowmoney.com';
    const url = `mailto:${email}`;

    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
    } else {
      Alert.alert(
        'No Mail App Found',
        'Please install or set up an email app to send mail.',
      );
    }
  };

  const handleFacebook = () => {
    const facebookUrl =
      Platform.OS === 'ios' || AppConstant.isAmazonStore
        ? 'https://www.facebook.com/profile.php?id=61554387265318&mibextid=kFxxJD'
        : 'https://www.facebook.com/BillsByBlowmoney';
    Linking.openURL(facebookUrl);
  };

  // ✅ Updated Instagram link
  const handleInstagram = () => {
    const instagramUrl =
      'https://www.instagram.com/blowpay.app?igsh=cmppNjByeDdiaTRs';
    Linking.openURL(instagramUrl);
  };

  return (
    <ScreenView style={styles.container} light color={WHITE}>
      <View style={tw`px-3 pt-2`}>
        <Header
          navigation={() => navigation.goBack()}
          ImageSource={require('../../../../../assets/icons/filter.png')}
          title="Contact Us"
          showIcon={false}
        />
      </View>

      <ScrollView
        style={styles.viewContainer}
        showsVerticalScrollIndicator={false}>
        <View style={styles.view1}>
          <View style={tw`full self-center rounded-10 mb-5 gap-3`}>
            <View style={tw`gap-5 p-2 pt-4`}>
              <Text style={tw`text-[#000000] font-medium text-[14px]`}>
                Help
              </Text>

              <View
                style={tw`w-full border border-gray-200 py-4 px-2 rounded-[8px] gap-6`}>
                {/* ✅ Customer Service (two chat buttons) */}
                <View
                  style={tw`bg-[#F8F8FA] rounded-[10px] px-3 py-2 flex w-full items-center flex-row justify-between border border-[#D0D5DD]`}>
                  <View style={tw`flex flex-row gap-2 items-center`}>
                    <FaqsSVG />
                    <Text style={tw`text-[#000000] font-medium text-[15px]`}>
                      Customer Service
                    </Text>
                  </View>

                  <View style={tw`flex flex-row gap-2`}>
                    {phoneNumbers.map((num, idx) => (
                      <TouchableOpacity
                        key={idx}
                        onPress={() => handleChat(num)}
                        style={tw`bg-white p-2 rounded-[16px]`}>
                        <Text
                          style={tw`text-[#FF114A] font-medium text-[12px]`}>
                          Chat {idx + 1}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Email */}
                <View
                  style={tw`bg-[#F8F8FA] rounded-[10px] px-3 py-2 flex w-full items-center flex-row justify-between border border-[#D0D5DD]`}>
                  <View style={tw`flex flex-row gap-2 items-center`}>
                    <ContactSVG />
                    <Text style={tw`text-[#000000] font-medium text-[15px]`}>
                      Email Address
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={handleEmail}
                    style={tw`bg-white p-2 rounded-[16px]`}>
                    <Text style={tw`text-[#FF114A] font-medium text-[12px]`}>
                      Send Mail
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Facebook */}
                <View
                  style={tw`bg-[#F8F8FA] rounded-[10px] px-3 py-2 flex w-full items-center flex-row justify-between border border-[#D0D5DD]`}>
                  <View style={tw`flex flex-row gap-2 items-center`}>
                    <ContactSVG />
                    <Text style={tw`text-[#000000] font-medium text-[15px]`}>
                      Facebook
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={handleFacebook}
                    style={tw`bg-white p-2 rounded-[16px]`}>
                    <Text style={tw`text-[#FF114A] font-medium text-[12px]`}>
                      Follow us
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* ✅ Updated Instagram */}
                <View
                  style={tw`bg-[#F8F8FA] rounded-[10px] px-3 py-2 flex w-full items-center flex-row justify-between border border-[#D0D5DD]`}>
                  <View style={tw`flex flex-row gap-2 items-center`}>
                    <ContactSVG />
                    <Text style={tw`text-[#000000] font-medium text-[15px]`}>
                      Instagram
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={handleInstagram}
                    style={tw`bg-white p-2 rounded-[16px]`}>
                    <Text style={tw`text-[#FF114A] font-medium text-[12px]`}>
                      Follow us
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* ✅ WhatsApp section (same two numbers) */}
                <View
                  style={tw`bg-[#F8F8FA] rounded-[10px] px-3 py-2 flex w-full items-center flex-row justify-between border border-[#D0D5DD]`}>
                  <View style={tw`flex flex-row gap-2 items-center`}>
                    <ContactSVG />
                    <Text style={tw`text-[#000000] font-medium text-[15px]`}>
                      WhatsApp
                    </Text>
                  </View>
                  <View style={tw`flex flex-row gap-2`}>
                    {phoneNumbers.map((num, idx) => (
                      <TouchableOpacity
                        key={idx}
                        onPress={() => handleChat(num)}
                        style={tw`bg-white p-2 rounded-[16px]`}>
                        <Text
                          style={tw`text-[#FF114A] font-medium text-[12px]`}>
                          Chat {idx + 1}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenView>
  );
};

export default Contact;
