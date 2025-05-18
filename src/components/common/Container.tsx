import { Platform, View, ViewProps } from 'react-native';
import React from 'react';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import cn from '~/utils/cn';
import { ClassValue } from 'clsx';

type ContainerProps = {
  children: React.ReactNode;
  fullScreen?: boolean;
  className?: ClassValue;
} & ViewProps;

const Container = ({ children, fullScreen = false, className, ...props }: ContainerProps) => {
  const inset = useSafeAreaInsets();
  return !fullScreen ? (
    <SafeAreaView
      style={{
        paddingTop: Platform.OS === 'android' ? inset.top : 0,
        flexGrow: 1,
      }}>
      <View
        className={cn('flex-1 py-2', Platform.OS === 'ios' ? 'px-4' : 'px-3', className)}
        {...props}>
        {children}
      </View>
    </SafeAreaView>
  ) : (
    <View
      className={cn('flex-1 py-2', Platform.OS === 'ios' ? 'px-4' : 'px-3', className)}
      {...props}>
      {children}
    </View>
  );
};

export default Container;
