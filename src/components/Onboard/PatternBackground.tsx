import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

const PatternBackground = () => {
  const size = 16;
  const dotColor = '#e5e7eb';
  const dotRadius = 0.98; // Make it more visible

  const circles = [];
  for (let y = 0; y < height; y += size) {
    for (let x = 0; x < width; x += size) {
      circles.push(<Circle key={`${x}-${y}`} cx={x} cy={y} r={dotRadius} fill={dotColor} />);
    }
  }

  return (
    <View
      style={[StyleSheet.absoluteFill, { zIndex: -10, backgroundColor: 'white' }]}
      pointerEvents="none">
      <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
        {circles}
      </Svg>
    </View>
  );
};

export default PatternBackground;
