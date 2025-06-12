import React from 'react';
import { TouchableOpacity, Text, ViewStyle } from 'react-native';
import { haptic, HapticFeedbackType } from '~/utils/haptics';

interface HapticTestButtonProps {
  type: HapticFeedbackType;
  label: string;
  style?: ViewStyle;
  disabled?: boolean;
}

const HapticTestButton: React.FC<HapticTestButtonProps> = ({
  type,
  label,
  style,
  disabled = false,
}) => {
  const handlePress = async () => {
    if (!disabled) {
      await haptic.trigger(type);
    }
  };

  return (
    <TouchableOpacity
      style={[
        {
          backgroundColor: disabled ? '#ccc' : '#007AFF',
          paddingHorizontal: 16,
          paddingVertical: 8,
          borderRadius: 8,
          margin: 4,
        },
        style,
      ]}
      onPress={handlePress}
      disabled={disabled}>
      <Text
        style={{
          color: 'white',
          fontSize: 14,
          fontWeight: '600',
          textAlign: 'center',
        }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default HapticTestButton;
