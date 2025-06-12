import React, { FC, useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Switch,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Container from '@components/common/Container';
import SubText from '@components/common/SubText';
import PatternBackground from '~/components/Onboard/PatternBackground';
import { Ionicons } from '@expo/vector-icons';
import { haptic, hapticManager } from '~/utils/haptics';

// Types for configuration
export interface UserProfile {
  name: string;
  email: string;
  profileImage: string;
  memberSince: string;
}

export interface SettingItemConfig {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  type: 'toggle' | 'navigation' | 'action';
  defaultValue?: boolean;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
  showArrow?: boolean;
  destructive?: boolean;
}

export interface SettingsSection {
  id: string;
  title: string;
  items: SettingItemConfig[];
}

export interface SettingsConfig {
  userProfile?: UserProfile;
  sections: SettingsSection[];
  showProfile?: boolean;
  headerTitle?: string;
  onProfilePress?: () => void;
}

interface SettingItemProps extends SettingItemConfig {
  value?: boolean;
  onValueChange?: (value: boolean) => void;
}

const SettingItem: FC<SettingItemProps> = ({
  icon,
  title,
  subtitle,
  type,
  value,
  onPress,
  onValueChange,
  showArrow = true,
  destructive = false,
}) => {
  const handlePress = async () => {
    // Add haptic feedback for all setting interactions
    if (type === 'toggle') {
      await haptic.toggle();
      if (onValueChange) {
        onValueChange(!value);
      }
    } else {
      if (destructive) {
        await haptic.warning();
      } else {
        await haptic.button('low');
      }
      if (onPress) {
        onPress();
      }
    }
  };

  const itemStyle = destructive
    ? 'bg-red-50 border border-red-200 rounded-lg mb-2'
    : 'bg-white rounded-lg mb-2';

  const iconColor = destructive ? '#dc2626' : '#374151';
  const titleColor = destructive ? 'text-red-600' : 'text-gray-900';

  return (
    <TouchableOpacity
      className={`flex-row items-center px-4 py-4 ${itemStyle}`}
      onPress={handlePress}
      activeOpacity={0.7}>
      <View className="mr-4 h-10 w-10 items-center justify-center rounded-full bg-gray-100">
        <Ionicons name={icon} size={20} color={iconColor} />
      </View>

      <View className="flex-1">
        <SubText className={`text-lg font-semibold ${titleColor}`}>{title}</SubText>
        {subtitle && <SubText className="mt-1 text-sm text-gray-500">{subtitle}</SubText>}
      </View>

      {type === 'toggle' ? (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ true: '#000', false: '#e5e7eb' }}
          thumbColor={value ? '#fff' : '#9ca3af'}
        />
      ) : (
        showArrow && <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
      )}
    </TouchableOpacity>
  );
};

interface SettingsProps {
  config?: SettingsConfig;
}

// Default configuration
const defaultUserProfile: UserProfile = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  profileImage:
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  memberSince: 'January 2024',
};

const defaultConfig: SettingsConfig = {
  userProfile: defaultUserProfile,
  showProfile: true,
  headerTitle: 'Settings',
  onProfilePress: () => Alert.alert('Profile', 'Profile editing coming soon!'),
  sections: [
    {
      id: 'app-settings',
      title: 'App Settings',
      items: [
        // {
        //   id: 'notifications',
        //   icon: 'notifications-outline',
        //   title: 'Notifications',
        //   subtitle: 'Get notified about app updates',
        //   type: 'toggle',
        //   defaultValue: true,
        // },
        // {
        //   id: 'auto-save',
        //   icon: 'save-outline',
        //   title: 'Auto Save',
        //   subtitle: 'Automatically save your repeated text',
        //   type: 'toggle',
        //   defaultValue: false,
        // },
        {
          id: 'haptic-feedback',
          icon: 'phone-portrait-outline',
          title: 'Haptic Feedback',
          subtitle: 'Feel vibrations when tapping buttons',
          type: 'toggle',
          defaultValue: true,
          onToggle: (value: boolean) => {
            hapticManager.setEnabled(value);
            if (value) {
              // Trigger a test haptic when enabling
              haptic.success();
            }
          },
        },
        // {
        //   id: 'dark-mode',
        //   icon: 'moon-outline',
        //   title: 'Dark Mode',
        //   subtitle: 'Switch to dark theme',
        //   type: 'toggle',
        //   defaultValue: false,
        // },
      ],
    },
    {
      id: 'account-privacy',
      title: 'Account & Privacy',
      items: [
        // {
        //   id: 'account',
        //   icon: 'person-outline',
        //   title: 'Account',
        //   subtitle: 'Manage your account settings',
        //   type: 'navigation',
        //   onPress: () => Alert.alert('Account', 'Account settings coming soon!'),
        // },
        {
          id: 'privacy',
          icon: 'shield-outline',
          title: 'Privacy',
          subtitle: 'Control your privacy settings',
          type: 'navigation',
          onPress: () => Alert.alert('Privacy', 'Privacy settings coming soon!'),
        },
      ],
    },
    {
      id: 'support-about',
      title: 'Support & About',
      items: [
        {
          id: 'help',
          icon: 'help-circle-outline',
          title: 'Help & Support',
          subtitle: 'Get help and contact support',
          type: 'navigation',
          onPress: () => Alert.alert('Help', 'Help & Support coming soon!'),
        },
        {
          id: 'about',
          icon: 'information-circle-outline',
          title: 'About',
          subtitle: 'App version and information',
          type: 'navigation',
          onPress: () =>
            Alert.alert('About', 'Text Repeater App v1.0.0\nBuilt with React Native & Expo'),
        },
      ],
    },
    {
      id: 'actions',
      title: '',
      items: [
        {
          id: 'sign-out',
          icon: 'log-out-outline',
          title: 'Sign Out',
          type: 'action',
          destructive: true,
          showArrow: false,
          onPress: () => {
            Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Sign Out',
                style: 'destructive',
                onPress: () => {
                  Alert.alert('Signed Out', 'You have been signed out successfully!');
                },
              },
            ]);
          },
        },
      ],
    },
  ],
};

const Settings: FC<SettingsProps> = ({ config = defaultConfig }) => {
  const insets = useSafeAreaInsets();

  // Initialize state for all toggle items
  const [settingsState, setSettingsState] = useState<Record<string, boolean>>(() => {
    const initialState: Record<string, boolean> = {};
    config.sections.forEach((section) => {
      section.items.forEach((item) => {
        if (item.type === 'toggle' && item.defaultValue !== undefined) {
          initialState[item.id] = item.defaultValue;
        }
      });
    });
    return initialState;
  });

  // Initialize haptic manager with current setting
  useEffect(() => {
    const hapticEnabled = settingsState['haptic-feedback'];
    if (hapticEnabled !== undefined) {
      hapticManager.setEnabled(hapticEnabled);
    }
  }, [settingsState]);

  const handleToggleChange = (itemId: string, value: boolean) => {
    setSettingsState((prev) => ({ ...prev, [itemId]: value }));
  };

  const renderSettingItem = (item: SettingItemConfig) => {
    const itemProps = {
      ...item,
      value: settingsState[item.id],
      onValueChange: (value: boolean) => {
        handleToggleChange(item.id, value);
        if (item.onToggle) {
          item.onToggle(value);
        }
      },
    };

    return <SettingItem key={item.id} {...itemProps} />;
  };

  return (
    <>
      <PatternBackground />
      <View style={{ paddingTop: insets.top }} />
      <Container fullScreen className="gap-4">
        <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
          {/* Header */}
          <SubText className="mb-6 text-3xl font-extrabold text-black">
            {config.headerTitle || 'Settings'}
          </SubText>

          {/* Profile Section */}
          {config.showProfile && config.userProfile && (
            <View className="mb-6 rounded-xl bg-white p-6">
              <TouchableOpacity
                className="flex-row items-center"
                onPress={async () => {
                  await haptic.button('low');
                  config.onProfilePress?.();
                }}
                activeOpacity={0.7}>
                <Image
                  source={{ uri: config.userProfile.profileImage }}
                  className="mr-4 h-16 w-16 rounded-full"
                  style={{ resizeMode: 'cover' }}
                />
                <View className="flex-1">
                  <SubText className="text-xl font-bold text-gray-900">
                    {config.userProfile.name}
                  </SubText>
                  <SubText className="mt-1 text-sm text-gray-500">
                    {config.userProfile.email}
                  </SubText>
                  <SubText className="mt-1 text-xs text-gray-400">
                    Member since {config.userProfile.memberSince}
                  </SubText>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
              </TouchableOpacity>
            </View>
          )}

          {/* Dynamic Sections */}
          {config.sections.map((section) => (
            <View key={section.id} className="mb-6">
              {section.title && (
                <SubText className="mb-3 px-2 text-lg font-bold text-gray-900">
                  {section.title}
                </SubText>
              )}
              {section.items.map(renderSettingItem)}
            </View>
          ))}
        </ScrollView>
      </Container>
    </>
  );
};

export default Settings;

const styles = StyleSheet.create({});
