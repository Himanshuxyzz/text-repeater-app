import React from 'react';
import { Pressable, PressableProps, ViewStyle, TextStyle } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import SubText from './SubText';

interface AnimatedButtonProps extends PressableProps {
  text: string;
  textClassName?: string;
  textStyle?: TextStyle;
  containerClassName?: string;
  containerStyle?: ViewStyle;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  text,
  textClassName = 'text-center text-xl font-bold text-white',
  textStyle,
  containerClassName = 'rounded-full bg-red-500 py-5',
  containerStyle,
  ...pressableProps
}) => {
  // Create a shared value for the scale
  const scale = useSharedValue(1);

  // Define animated style for the scale transform
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.96, {
      damping: 10,
      stiffness: 200,
    });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, {
      damping: 10,
      stiffness: 200,
    });
  };

  return (
    <Animated.View style={[animatedStyle]}>
      <Pressable
        className={containerClassName}
        style={containerStyle}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        {...pressableProps}>
        <SubText className={textClassName} style={textStyle}>
          {text}
        </SubText>
      </Pressable>
    </Animated.View>
  );
};

export default AnimatedButton;
