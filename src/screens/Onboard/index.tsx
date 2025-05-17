import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Container from '@components/common/Container';
import SubText from '~/components/common/SubText';
import PatternBackground from '~/components/Onboard/PatternBackground';
import { hp, WindowHeight, WindowWidth } from '~/utils/utils';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Onboard = () => {
  const insets = useSafeAreaInsets();
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
              width: WindowWidth * 0.6,
              height: WindowHeight * 0.3,
              marginHorizontal: 'auto',
            }}
            className="-rotate-12 rounded-3xl bg-red-500"
          />
        </View>

        <SubText
          style={{
            fontWeight: '900',
            fontSize: hp(3.8),
          }}
          className="text-center leading-relaxed">
          Explore Text Repetition Instantly.
        </SubText>
        <View
          style={{
            flex: 0.5,
            justifyContent: 'flex-end',
            padding: 10,
          }}>
          <Pressable className=" rounded-full border-2 py-4">
            <SubText className="text-center text-xl font-bold">Welcome</SubText>
          </Pressable>
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

//  <View
//           key={'rotated-element'}
//           style={{
//             width: WindowWidth * 0.52,
//             height: WindowHeight * 0.25,
//             marginHorizontal: 'auto',
//           }}
//           className="-rotate-6 rounded-3xl bg-red-500"
//         />
//         <SubText
//           style={{
//             fontWeight: '900',
//             fontSize: hp(3.8),
//           }}
//           className="text-center leading-relaxed">
//           Explore Text Repetition Instantly.
//         </SubText>
