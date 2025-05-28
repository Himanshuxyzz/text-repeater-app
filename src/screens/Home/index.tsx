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
        onValueChange={() => onChange(!value)}
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

  const [hasText, setHasText] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [inputFocused, setInputFocused] = useState(false);

  const {
    setBaseText,
    baseText,
    setRepetitions,
    repetitions,
    settings,
    setSettings,
    generateRepeatedText,
  } = useTextStore();

  const handleTextChange = (text: string) => {
    setBaseText(text);
    setHasText(text.length > 0);
    setWordCount(text.split(/\s+/).filter(Boolean).length);
    setCharCount(text.length);
  };

  const handleClear = () => {
    setBaseText('');
    setHasText(false);
    setWordCount(0);
    setCharCount(0);
    if (textInputRef.current) {
      textInputRef.current.clear();
    }
  };

  const handleSettingChange = (key: keyof typeof settings, value: boolean) => {
    setSettings({ ...settings, [key]: value });
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
  ];

  const handleRepeat = () => {
    if (!hasText) {
      Alert.alert('Please enter some text to repeat');
      return;
    }

    if (repetitions && repetitions > 0) {
      // Start text generation - Zustand will handle the heavy lifting
      // Show loading or activity indicator for very large repetitions
      const isLargeRepetition = repetitions > 5000;

      if (isLargeRepetition) {
        // For very large repetitions, show an alert to warn the user
        Alert.alert(
          'Large Number of Repetitions',
          `You're generating ${repetitions} repetitions, which might take a moment. Continue?`,
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Continue',
              onPress: () => {
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
        generateRepeatedText();
        navigation.navigate('OutputScreen');
      }
    } else {
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
    }
  }, []);

  return (
    <>
      <PatternBackground />
      <View style={{ paddingTop: insets.top }} />
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <Container fullScreen className={'gap-4'}>
          <SubText className="my-4 text-3xl font-extrabold text-black">
            Enter The Text You Want To Get Repeated
          </SubText>
          <View className="flex-row justify-end">
            {hasText && (
              <TouchableOpacity className="rounded-lg bg-gray-200/90 p-2" onPress={handleClear}>
                <SubText className="text-lg font-bold text-black">Clear Text</SubText>
              </TouchableOpacity>
            )}
          </View>
          <View
            style={{
              height: WindowHeight * 0.08,
            }}
            className={cn(
              'rounded-lg border-2 border-transparent bg-gray-200/90',
              inputFocused && 'border-2 border-black'
            )}>
            <TextInput
              ref={textInputRef}
              placeholder="Enter any text."
              className="flex-1 p-2 text-2xl"
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect={false}
              autoFocus={false}
              defaultValue={baseText}
              onChangeText={handleTextChange}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
            />
          </View>
          <WordCharCounter words={wordCount} characters={charCount} />
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
                />
              </View>

              <FontStyleSelector previewText={baseText || 'Sample Text'} />
            </View>
          </View>
          <View className="mb-4 flex-1 justify-end">
            <AnimatedButton
              textClassName="text-2xl font-bold text-white text-center"
              text="Repeat"
              onPress={handleRepeat}
            />
          </View>
        </Container>
      </TouchableWithoutFeedback>
    </>
  );
};

export default Home;

const styles = StyleSheet.create({});
