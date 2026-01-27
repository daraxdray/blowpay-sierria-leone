import React from 'react';
import {View, Text} from 'react-native';
import tw from 'twrnc';

const splitText = (text, wordsPerChunk) => {
  const words = text.split(' ');
  let chunks = [];

  for (let i = 0; i < words.length; i += wordsPerChunk) {
    const chunk = words.slice(i, i + wordsPerChunk).join(' ');
    chunks.push(chunk);
  }

  return chunks;
};

const LegalSection = ({title, content}) => {
  const textChunks = splitText(content, 35);

  return (
    <View style={tw`flex items-start gap-2 mb-4`}>
      <Text style={tw`text-[#000000] font-bold text-[18px]`}>{title}</Text>
      {textChunks.map((chunk, index) => (
        <Text
          key={index}
          style={tw`text-gray-600 font-normal text-[14px] w-[90%] mb-2`}>
          {chunk}
        </Text>
      ))}
    </View>
  );
};
export default LegalSection;
