import React from 'react';
import {View, Text, TouchableOpacity, ScrollView, Linking} from 'react-native';
import {styles} from './style';
import {ScreenView} from '../../../../global/wrappers';
import {WHITE} from '../../../../global/theme';
import Header from '../../../../global/components/Header';
import tw from 'twrnc';
import FaqsSVG from '../../../../../assets/svgs/Faqs.svg';
import ContactSVG from '../../../../../assets/svgs/Contact.svg';
import { useGetConstant } from '../../../../hooks/constants.hook';
import AppConstant from '../../../../constants/data/appConstant';

const Contact = props => {
  const navigation = props.navigation;
  const {data, refetch: refetchAccount, loading} = useGetConstant();
  const handleChat = () => {
    Linking.openURL(`https://wa.me/${data?.data.phoneNumber?.replace(' ','')}`);
  };

  const handleEmail = () => {
    const email = Platform.OS === 'ios' || AppConstant.isAmazonStore ? 'support@blowpay.app' : 'support@billsbyblowmoney.com';
    Linking.openURL(`mailto:${email}`);
  };

  const handleFacebook = () => {
    const facebookUrl = Platform.OS === 'ios' || AppConstant.isAmazonStore
      ? 'https://www.facebook.com/profile.php?id=61554387265318&mibextid=kFxxJD'
      : 'https://www.facebook.com/BillsByBlowmoney';
    Linking.openURL(facebookUrl);
  };

  const handleInstagram = () => {
    const instagramUrl = Platform.OS === 'ios' || AppConstant.isAmazonStore
    ? 'https://instagram.com/blowpay?igshid=NGVhN2U2NjQ0Yg=='
      : 'https://www.instagram.com/billsbyblowmoney?igsh=MjRqdWkwMXd4bjht' 
    Linking.openURL(instagramUrl);
  };

  return (
    <ScreenView style={styles.container} light color={WHITE}>
      <View style={tw`px-3 pt-2`}>
        <Header
          navigation={() => {
            navigation.goBack();
          }}
          ImageSource={require('../../../../../assets/icons/filter.png')}
          title="Contact Us"
          showIcon={false}
          iconName="add-circle"
          imagePress={() => console.log('Second Icon Pressed')}
        />
      </View>
      <ScrollView
        style={styles.viewContainer}
        showsVerticalScrollIndicator={false}>
        <View style={styles.view1}>
          <View style={tw` full self-center rounded-10 mb-5 gap-3`}>
            <View style={tw`gap-5 p-2  pt-4`}>
              <Text style={tw`text-[#000000] font-medium text-[14px]`}>
                Help
              </Text>

              <View
                style={tw` w-full border border-gray-200 py-4 px-2 rounded-[8px] gap-6`}>
                <View
                  style={tw`bg-[#F8F8FA] rounded-[10px] px-3 py-2 flex w-full items-center flex-row justify-between border border-[#D0D5DD]`}>
                  <View style={tw`flex flex-row gap-2 items-center`}>
                    <FaqsSVG />
                    <Text style={tw`text-[#000000] font-medium text-[15px]`}>
                      Customer Service
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={data != null? handleChat : ()=>{}}
                    style={tw`bg-white p-2 rounded-[16px]`}>
                    <Text style={tw`text-[#FF114A] font-medium text-[12px]`}>
                      {loading?'...':'Chat'}
                    </Text>
                  </TouchableOpacity>
                </View>

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

                <View
                  style={tw`bg-[#F8F8FA] rounded-[10px] px-3 py-2 flex w-full items-center flex-row justify-between border border-[#D0D5DD]`}>
                  <View style={tw`flex flex-row gap-2 items-center`}>
                    <ContactSVG />
                    <Text style={tw`text-[#000000] font-medium text-[15px]`}>
                      Whatsapp
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={handleChat}
                    style={tw`bg-white p-2 rounded-[16px]`}>
                    <Text style={tw`text-[#FF114A] font-medium text-[12px]`}>
                      Chat
                    </Text>
                  </TouchableOpacity>
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
