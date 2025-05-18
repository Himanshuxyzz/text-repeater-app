import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Container from '@components/common/Container';
import SubText from '~/components/common/SubText';
import AnimatedButton from '~/components/common/AnimatedButton';
import PatternBackground from '~/components/Onboard/PatternBackground';
import { hp, WindowHeight, WindowWidth } from '~/utils/utils';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { navigate } from '~/navigation/NavigationUtils';

const Onboard = () => {
  const insets = useSafeAreaInsets();

  const handleWelcome = () => {
    navigate('MainStack');
  };
  return (
    <Container fullScreen>
      <PatternBackground />
      <View
        style={{
          paddingTop: insets.top,
        }}
      />
      <View className="flex-1 gap-3">
        <View
          style={{
            flex: 1,
          }}
          className="justify-center">
          <View
            key={'rotated-element'}
            style={{
              width: WindowWidth * 0.57,
              height: WindowHeight * 0.3,
              marginHorizontal: 'auto',
            }}
            className="-rotate-12 rounded-3xl bg-red-500"
          />
        </View>

        <SubText
          style={{
            fontWeight: '900',
            fontSize: hp(4),
          }}
          className="text-center leading-relaxed">
          Get Text Repetitions Instantly.
        </SubText>
        <View
          style={{
            flex: 0.5,
            justifyContent: 'flex-end',
            padding: 10,
          }}>
          <AnimatedButton text="Welcome" onPress={handleWelcome} />
        </View>
      </View>
      <View
        style={{
          paddingBottom: insets.bottom,
        }}
      />
    </Container>
  );
};

export default Onboard;
