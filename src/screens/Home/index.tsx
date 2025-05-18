import React, { FC, useRef, useState, useEffect } from 'react';
import { StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Container from '@components/common/Container';
import SubText from '@components/common/SubText';
import PatternBackground from '~/components/Onboard/PatternBackground';
import { WindowHeight } from '~/utils/utils';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import WordCharCounter from '~/components/Home/WordCharCounter';
import cn from '~/utils/cn';
import AnimatedButton from '~/components/common/AnimatedButton';

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
  const textInputRef = useRef<TextInput>(null);
  const textRef = useRef('');
  const [hasText, setHasText] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  const [settings, setSettings] = useState({
    addPeriod: false,
    addNewLine: false,
    addSpace: false,
  });
  const [inputFocused, setInputFocused] = useState(false);

  const [repetitions, setRepetitions] = useState<number | null>(null);

  const handleTextChange = (text: string) => {
    textRef.current = text;
    setHasText(text.length > 0);
    setWordCount(text.split(/\s+/).filter(Boolean).length);
    setCharCount(text.length);
    // console.log(text);
  };

  const handleClear = () => {
    textRef.current = '';
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
    if (repetitions && repetitions > 0) {
      let baseText = textRef.current;

      // Apply period if setting is enabled
      if (settings.addPeriod) {
        baseText = baseText.endsWith('.') ? baseText : baseText + '.';
      }

      let repeatedText;

      // Handle the case with no separators - use native repeat which is most optimized
      if (!settings.addNewLine && !settings.addSpace) {
        repeatedText = baseText.repeat(repetitions);
      } else {
        // For cases with separators, use join which is next best
        const separator = (settings.addNewLine ? '\n' : '') + (settings.addSpace ? ' ' : '');

        const repeatedArray = Array(repetitions).fill(baseText);
        repeatedText = repeatedArray.join(separator);
      }

      console.log(repeatedText);
    }
  };

  return (
    <>
      <PatternBackground />
      <View style={{ paddingTop: insets.top }} />
      <Container fullScreen className={'gap-4 '}>
        <SubText className="mb-2 text-2xl font-bold text-black">
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
                value={repetitions?.toString()}
                onChangeText={(text) => setRepetitions(Number(text))}
              />
            </View>
          </View>
        </View>
        <View className="flex-1 justify-center">
          <AnimatedButton text="Repeat" onPress={handleRepeat} />
        </View>
      </Container>
    </>
  );
};

export default Home;

const styles = StyleSheet.create({});
