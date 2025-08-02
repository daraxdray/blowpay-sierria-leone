import React from 'react';
import {View, TouchableOpacity, Text, ScrollView} from 'react-native';
import tw from 'twrnc';

const Tabs = ({tabs, activeTab, setActiveTab}) => {
  return (
    <View style={[
      tw`flex-row items-center bg-white h-13 px-4 rounded-full`,
      {
        shadowColor: 'rgba(0, 0, 0, 0.4)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 90,  // Adjust as needed for softer or harder shadows
        elevation: 2.9,      // For Android shadow
      },
    ]}>
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[tw`flex-row items-center bg-white px-3 `,]}
      style={{paddingRight: 40}}>
      {tabs.map((tab, index) => (
        <TouchableOpacity
          key={index}
          style={[
            tw`py-4 px-5 items-center`,
            activeTab === tab ? tw`bg-[#FFFFFF]` : tw``,
            index === tabs.length - 1 && {marginRight: 40},
          ]}
          onPress={() => setActiveTab(tab)}>
          <Text
            style={[
              tw`text-black`,
              activeTab === tab ? tw`text-[#FF114A]` : tw`text-[#9B9B9B]`,
            ]}>
            {tab}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
    </View>
  );
};

export default Tabs;
