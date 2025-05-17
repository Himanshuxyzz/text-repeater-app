import { View, Text, StyleProp, TextStyle, TextProps } from 'react-native';
import React, { FC } from 'react';
import cn from '~/utils/cn';

type SubTextProps = {
  className?: string;
  fontFamily?:
    | 'Figtree-Medium'
    | 'Figtree-Regular'
    | 'Figtree-SemiBold'
    | 'Figtree-Bold'
    | 'Figtree-ExtraBold'
    | 'Figtree-Light';
  style?: StyleProp<TextStyle>;
  children: React.ReactNode;
} & TextProps;

const SubText: FC<SubTextProps> = ({
  className,
  fontFamily = 'Figtree-Medium',
  style,
  children,
  ...props
}) => {
  return (
    <Text
      style={[
        {
          fontFamily: fontFamily,
        },
        style,
      ]}
      className={cn('text-sm text-black', className)}
      {...props}>
      {children}
    </Text>
  );
};

export default SubText;
