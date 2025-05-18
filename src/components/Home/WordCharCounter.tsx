import { View } from 'react-native';
import React from 'react';
import SubText from '@components/common/SubText';

interface WordCharCounterProps {
  words: number;
  characters: number;
}

const WordCharCounter = ({ words, characters }: WordCharCounterProps) => {
  return (
    <View className=" flex-row justify-between gap-4">
      <View className="flex-1 flex-row items-center justify-start gap-2 ">
        <SubText className="text-lg font-bold">Words :</SubText>
        <SubText className="text-lg font-semibold">{words}</SubText>
      </View>
      <View className="flex-1 flex-row items-center justify-end gap-2">
        <SubText className="text-lg font-bold">Characters :</SubText>
        <SubText className="text-lg font-semibold">{characters}</SubText>
      </View>
    </View>
  );
};

export default WordCharCounter;
