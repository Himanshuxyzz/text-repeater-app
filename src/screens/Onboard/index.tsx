import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Container from '@components/common/Container';
import SubText from '~/components/common/SubText';
import Svg, { Circle } from 'react-native-svg';
import { Dimensions } from 'react-native';
import PatternBackground from '~/components/Onboard/PatternBackground';

const { width, height } = Dimensions.get('window');

const Onboard = () => {
  return (
    <Container fullScreen>
      <PatternBackground />
      <View className="flex-1 items-center justify-center">
        <SubText className="text-center">Onboard</SubText>
      </View>
    </Container>
  );
};

export default Onboard;
