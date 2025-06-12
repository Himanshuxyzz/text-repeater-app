import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackParamList } from '.';
import { Home, Settings } from '../screens';
import { haptic } from '~/utils/haptics';

const Tab = createBottomTabNavigator();

type Props = NativeStackScreenProps<RootStackParamList>;

export default function TabLayout({ navigation }: Props) {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: 'black',
        headerShown: false,
      }}
      screenListeners={{
        tabPress: async () => {
          await haptic.navigation();
        },
      }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          title: 'Home',
        }}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          title: 'Settings',
        }}
      />
    </Tab.Navigator>
  );
}
