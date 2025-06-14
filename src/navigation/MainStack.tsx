import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Platform } from 'react-native';

import TabNavigator from './tab-navigator';
import { Auth, OutputScreen, FontStyleScreen } from '~/screens';

export type MainStackParamList = {
  TabNavigator: undefined;
  Auth: undefined;
  OutputScreen: undefined;
  FontStyleScreen: {
    previewText?: string;
  };
};

const Main = createNativeStackNavigator<MainStackParamList>();

export default function MainStack() {
  return (
    <Main.Navigator initialRouteName="TabNavigator" screenOptions={{ headerShown: false }}>
      <Main.Screen name="Auth" component={Auth} />
      <Main.Screen name="TabNavigator" component={TabNavigator} />
      <Main.Screen name="OutputScreen" component={OutputScreen} />
      <Main.Screen
        name="FontStyleScreen"
        component={FontStyleScreen}
        options={{
          presentation: Platform.OS === 'ios' ? 'formSheet' : 'card',
          animation: Platform.OS === 'ios' ? 'slide_from_bottom' : 'slide_from_right',
        }}
      />
    </Main.Navigator>
  );
}
