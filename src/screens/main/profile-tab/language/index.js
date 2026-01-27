import React, {useState} from 'react';
import {View, Text, ScrollView, TouchableOpacity} from 'react-native';
import {styles} from './style';
import {ScreenView} from '../../../../global/wrappers';
import {WHITE} from '../../../../global/theme';
import Header from '../../../../global/components/Header';
import tw from 'twrnc';
import RadioButton from '../../../../components/profile/RadioButton';

const Language = props => {
  const navigation = props.navigation;

  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [selectedOthers, setSelectedOthers] = useState(null);

  const languages = [
    {label: 'English (US)', value: 'us'},
    {label: 'English (UK)', value: 'uk'},
  ];
  const others = [
    {label: 'Mandarin', value: 'ma'},
    {label: 'Hindi', value: 'hi'},
    {label: 'Spanish', value: 'sp'},
    {label: 'French', value: 'fr'},
    {label: 'Arabic', value: 'ar'},
    {label: 'Russian', value: 'ru'},
    {label: 'Indonesia', value: 'in'},
    {label: 'Vietnamese', value: 'vi'},
  ];

  return (
    <ScreenView style={styles.container} light color={WHITE}>
      <View style={tw`px-3 pt-2`}>
        <Header
          navigation={() => {
            navigation.goBack();
          }}
          ImageSource={require('../../../../../assets/icons/filter.png')}
          title="Language"
          showIcon={false}
          iconName="add-circle"
          imagePress={() => console.log('Second Icon Pressed')}
        />
      </View>

      <ScrollView
        style={styles.viewContainer}
        showsVerticalScrollIndicator={false}>
        <View style={styles.view1}>
          <View style={tw`gap-2`}>
            <Text style={tw`text-[16px] text-[#000000] font-medium mb-1`}>
              Suggested
            </Text>
            {languages.map(language => (
              <RadioButton
                key={language.value}
                label={language.label}
                value={language.value}
                selected={selectedLanguage === language.value}
                onSelect={setSelectedLanguage}
              />
            ))}
          </View>
          <View style={tw`gap-2`}>
            <Text style={tw`text-[16px] text-[#000000] font-medium mb-1`}>
              Others
            </Text>
            {others.map(others => (
              <RadioButton
                key={others.value}
                label={others.label}
                value={others.value}
                selected={selectedOthers === others.value}
                onSelect={setSelectedOthers}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </ScreenView>
  );
};

export default Language;
