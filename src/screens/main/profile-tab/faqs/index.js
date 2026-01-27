import React, {useState} from 'react';
import {
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Text,
} from 'react-native';
import {styles} from './style';
import {ScreenView} from '../../../../global/wrappers';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Header from '../../../../global/components/Header';
import Collapsible from 'react-native-collapsible';
import tw from 'twrnc';
import { Platform } from 'react-native';
import AppConstant from '../../../../constants/data/appConstant';

const Faqs = props => {
  const navigation = props.navigation;
  const [activeTab, setActiveTab] = useState('General');
  const [activeAccordion, setActiveAccordion] = useState(null);

  const tabs = ['General', 'Account', 'Service', 'Payments'];
  const platformName = Platform.OS === 'ios' || AppConstant.isAmazonStore ? 'BlowPay' : 'BillsByBlowmoney';

  const faqs = [
    {
      id: 1,
      question: `What is ${platformName} and how does it work`,
      answer: `${platformName} is a fintech app designed to help you manage your finances efficiently. With ${platformName}, you can transfer money, pay bills, top up your wallet, and manage your virtual account. It’s fast, secure, and easy to use.`,
    },
    {
      id: 2,
      question: `How do I add money to my ${platformName} wallet?`,
      answer: `Yes, your money is safe with ${platformName}. We use top-notch encryption and security protocols to protect your personal information and transactions. We are also compliant with industry regulations to ensure your funds are secure.`,
    },
    {
      id: 3,
      question: `What should I do if I forget my ${platformName} account password?`,
      answer: 'If you forget your password, go to the login screen and click on "Forgot Password." Follow the instructions to reset your password via email or SMS.',
    },
    {
      id: 4,
      question: `Is my money safe with ${platformName}?`,
      answer: `Yes, your money is safe with ${platformName}. We use top-notch encryption and security protocols to protect your personal information and transactions. We are also compliant with industry regulations to ensure your funds are secure.`,
    },
    {
      id: 5,
      question: 'How do I contact customer support if I face issues?',
      answer: 'You can reach our customer support team directly through the app. Navigate to the "Help" section, and you can either chat with us or send an email. We’re available 24/7 to assist you.',
    },
  ];

  const toggleAccordion = id => {
    setActiveAccordion(activeAccordion === id ? null : id);
  };

  return (
    <ScreenView style={tw`flex-1 bg-white flex gap-3 px-3`}>
      <View style={tw`pt-2 `}>
        <Header
          navigation={() => {
            navigation.goBack();
          }}
          ImageSource={require('../../../../../assets/icons/filter.png')}
          title="FAQ"
          showIcon={false}
          iconName="add-circle"
          imagePress={() => console.log('Second Icon Pressed')}
        />
      </View>

      <View style={tw`my-3`}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={tw`flex-row px-3`}>
          {tabs.map((tab, index) => (
            <TouchableOpacity
              key={index}
              style={[
                tw`py-2 px-4 rounded-full mr-2 flex-shrink-0`,
                activeTab === tab
                  ? tw`bg-[#FF114A] `
                  : tw`bg-white border-[0.5px] border-[#FF114A] `,
              ]}
              onPress={() => setActiveTab(tab)}>
              <Text
                style={tw`${
                  activeTab === tab
                    ? 'text-white text-[12px]'
                    : 'text-[#FF114A] text-[12px]'
                }`}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={tw`px-3 my-4`}>
        <View
          style={tw`bg-[#F8F8FA] rounded-full  pl-4 pr-5 flex flex-row items-center justify-between`}>
          <TextInput
            style={tw`w-[80%]`}
            placeholder="Search"
            placeholderTextColor="gray"
          />
          <Ionicons
            name="search-outline"
            size={16}
            color="black"
            style={tw``}
          />
        </View>
      </View>

      <ScrollView
        style={tw`flex-1`}
        contentContainerStyle={tw`px-3 py-2`}
        showsVerticalScrollIndicator={false}>
        {faqs.map(faq => (
          <View key={faq.id} style={tw`mb-4`}>
            <TouchableOpacity
              style={tw` bg-[#F8F8FA] rounded-full p-5 py-4 flex flex-row justify-between`}
              onPress={() => toggleAccordion(faq.id)}>
              <Text style={tw`font-medium text-[16px] text-[#101828]`}>
                {faq.question}
              </Text>
              <Ionicons name="caret-down-outline" size={16} color="#FF114A" />
            </TouchableOpacity>
            <Collapsible
              collapsed={activeAccordion !== faq.id}
              style={tw`bg-[#F8F8FA] rounded-[10px]`}>
              <Text
                style={tw`p-2 text-[#344054] leading-[20px] text-[13px] w-[95%]`}>
                {faq.answer}
              </Text>
            </Collapsible>
          </View>
        ))}
      </ScrollView>
    </ScreenView>
  );
};

export default Faqs;
