import React, { FC, useRef, useState, useEffect } from 'react';
import {
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
  ScrollView,
} from 'react-native';
import { useNavigation, StackActions } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Container from '@components/common/Container';
import SubText from '@components/common/SubText';
import PatternBackground from '~/components/Onboard/PatternBackground';
import { WindowHeight } from '~/utils/utils';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import WordCharCounter from '~/components/Home/WordCharCounter';
import FontStyleSelector from '~/components/Home/FontStyleSelector';
import cn from '~/utils/cn';
import AnimatedButton from '~/components/common/AnimatedButton';
import { MainStackParamList } from '~/navigation/MainStack';
import useTextStore from '~/store/textStore';
import { haptic } from '~/utils/haptics';

// Fix navigation type
type HomeNavigationProp = NativeStackNavigationProp<MainStackParamList>;

interface SettingMenuProps {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}

const SettingMenu = ({ label, value, onChange }: SettingMenuProps) => {
  return (
    <View className="flex-row items-center justify-between">
      <SubText className="text-lg font-semibold text-gray-700">{label}</SubText>
      <Switch
        value={value}
        onValueChange={async () => {
          await haptic.toggle();
          onChange(!value);
        }}
        trackColor={{ true: '#000', false: '#000' }}
        thumbColor={false ? '#000' : '#fff'}
      />
    </View>
  );
};

const Home: FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<HomeNavigationProp>();
  const textInputRef = useRef<TextInput>(null);

  const {
    setBaseText,
    baseText,
    setRepetitions,
    repetitions,
    settings,
    setSettings,
    generateRepeatedText,
  } = useTextStore();

  const [hasText, setHasText] = useState(baseText.length > 0);
  const [wordCount, setWordCount] = useState(baseText.split(/\s+/).filter(Boolean).length);
  const [charCount, setCharCount] = useState(baseText.length);
  const [inputFocused, setInputFocused] = useState(false);

  const handleTextChange = (text: string) => {
    setBaseText(text);
    setHasText(text.length > 0);
    setWordCount(text.split(/\s+/).filter(Boolean).length);
    setCharCount(text.length);
  };

  const handleClear = async () => {
    await haptic.clear();
    setBaseText('');
    setHasText(false);
    setWordCount(0);
    setCharCount(0);
    if (textInputRef.current) {
      textInputRef.current.clear();
    }
  };

  const handleSettingChange = (key: keyof typeof settings, value: boolean) => {
    // Handle mutual exclusivity between addNumbers and addPercentages
    if (key === 'addNumbers' && value === true) {
      setSettings({ ...settings, addNumbers: true, addPercentages: false });
    } else if (key === 'addPercentages' && value === true) {
      setSettings({ ...settings, addNumbers: false, addPercentages: true });
    } else {
      setSettings({ ...settings, [key]: value });
    }
  };

  const settingsList = [
    {
      label: 'Add period',
      value: settings.addPeriod,
      onChange: (value: boolean) => handleSettingChange('addPeriod', value),
    },
    {
      label: 'Add new line',
      value: settings.addNewLine,
      onChange: (value: boolean) => handleSettingChange('addNewLine', value),
    },
    {
      label: 'Add space',
      value: settings.addSpace,
      onChange: (value: boolean) => handleSettingChange('addSpace', value),
    },
    {
      label: 'Add numbers (1., 2., etc.)',
      value: settings.addNumbers,
      onChange: (value: boolean) => handleSettingChange('addNumbers', value),
    },
    {
      label: 'Add percentages (25%, 50%, etc.)',
      value: settings.addPercentages,
      onChange: (value: boolean) => handleSettingChange('addPercentages', value),
    },
  ];

  const handleRepeat = async () => {
    if (!hasText) {
      await haptic.warning();
      Alert.alert('Please enter some text to repeat');
      return;
    }

    if (repetitions && repetitions > 0) {
      await haptic.button('high'); // Important action

      // Start text generation - Zustand will handle the heavy lifting
      // Show loading or activity indicator for very large repetitions
      const isLargeRepetition = repetitions > 5000;

      if (isLargeRepetition) {
        await haptic.warning();
        // For very large repetitions, show an alert to warn the user
        Alert.alert(
          'Large Number of Repetitions',
          `You're generating ${repetitions} repetitions, which might take a moment. Continue?`,
          [
            {
              text: 'Cancel',
              style: 'cancel',
              onPress: async () => {
                await haptic.button('low');
              },
            },
            {
              text: 'Continue',
              onPress: async () => {
                await haptic.success();
                // Use requestAnimationFrame to avoid UI blocking
                requestAnimationFrame(() => {
                  generateRepeatedText();
                  navigation.navigate('OutputScreen');
                });
              },
            },
          ]
        );
      } else {
        // For smaller repetitions, generate immediately
        await haptic.success();
        generateRepeatedText();
        navigation.navigate('OutputScreen');
      }
    } else {
      await haptic.error();
      Alert.alert('Please enter a valid number of repetitions');
    }
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  // Initialize text in input field from store
  useEffect(() => {
    if (baseText && textInputRef.current) {
      textInputRef.current.setNativeProps({ text: baseText });
      // Also initialize word and char counts
      setWordCount(baseText.split(/\s+/).filter(Boolean).length);
      setCharCount(baseText.length);
      setHasText(baseText.length > 0);
    }
  }, []);

  return (
    <>
      <PatternBackground />
      <View style={{ paddingTop: insets.top }} />
      <Container
        fullScreen
        className={'gap-4'}
        onTouchStart={() => {
          if (inputFocused) {
            Keyboard.dismiss();
            setInputFocused(false);
          }
        }}>
        <SubText className="my-4 text-3xl font-extrabold text-black">
          Enter The Text You Want To Get Repeated
        </SubText>
        <View
          style={{
            height: WindowHeight * 0.26,
          }}
          className={cn(
            'flex-row items-start rounded-lg border-2 border-transparent bg-gray-200/90',
            inputFocused && 'border-2 border-black'
          )}>
          <TextInput
            ref={textInputRef}
            placeholder="Enter any text."
            className="flex-1 p-4 text-xl"
            autoCapitalize="none"
            autoComplete="off"
            autoCorrect={false}
            autoFocus={false}
            defaultValue={baseText}
            multiline={true}
            textAlignVertical="top"
            onChangeText={handleTextChange}
            onFocus={async () => {
              await haptic.input();
              setInputFocused(true);
            }}
            onBlur={() => setInputFocused(false)}
          />
          {hasText && (
            <TouchableOpacity className="m-2 rounded-full bg-gray-400/50 p-2" onPress={handleClear}>
              <SubText className="text-sm font-bold text-gray-700">✕</SubText>
            </TouchableOpacity>
          )}
        </View>
        <WordCharCounter words={wordCount} characters={charCount} />

        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 20 }}>
          <View className="gap-3">
            <SubText className="text-xl font-bold text-black">Settings </SubText>

            <View className="gap-2 ">
              {settingsList.map((setting) => (
                <SettingMenu
                  key={setting.label}
                  label={setting.label}
                  value={setting.value}
                  onChange={setting.onChange}
                />
              ))}

              <View className="gap-2">
                <SubText className="text-lg font-bold text-black">Number of Repetitions</SubText>
                <TextInput
                  style={{
                    height: 50,
                  }}
                  className="rounded-lg bg-gray-200/90 p-2 text-lg"
                  placeholder="Enter number of repetitions"
                  keyboardType="numeric"
                  value={repetitions ? String(repetitions) : ''}
                  onChangeText={(text) => setRepetitions(Number(text))}
                  returnKeyType="done"
                  onSubmitEditing={dismissKeyboard}
                  onFocus={async () => {
                    await haptic.input();
                  }}
                />
              </View>

              <FontStyleSelector previewText="Sample Text" />
            </View>
          </View>
        </ScrollView>

        <View className="mb-4">
          <AnimatedButton
            textClassName="text-2xl font-bold text-white text-center"
            text="Repeat"
            onPress={handleRepeat}
            hapticType="high"
          />
        </View>
      </Container>
    </>
  );
};

export default Home;

const styles = StyleSheet.create({});
