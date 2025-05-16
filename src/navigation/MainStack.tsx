import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TabNavigator from './tab-navigator';
import { Auth } from '~/screens';

export type MainStackParamList = {
  TabNavigator: undefined;
  Auth: undefined;
};

const Main = createNativeStackNavigator<MainStackParamList>();

export default function MainStack() {
  return (
    <NavigationContainer>
      <Main.Navigator initialRouteName="TabNavigator" screenOptions={{ headerShown: false }}>
        <Main.Screen name="Auth" component={Auth} />
        <Main.Screen name="TabNavigator" component={TabNavigator} />
      </Main.Navigator>
    </NavigationContainer>
  );
}
