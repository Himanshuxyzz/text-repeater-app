import React, { FC } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import useTextStore from '~/store/textStore';
import { haptic } from '~/utils/haptics';
import { MainStackParamList } from '~/navigation/MainStack';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

interface FontStyleSelectorProps {
  previewText?: string;
}

const FontStyleSelector: FC<FontStyleSelectorProps> = ({ previewText = 'Preview Text' }) => {
  const navigation = useNavigation<NavigationProp>();
  const { fontStyle, availableFontStyles, setFontStyle } = useTextStore();

  // Show only popular styles in horizontal scroll
  const popularStyles = ['Normal', 'Hearts', 'Love', 'Stars', 'Sparkles', 'Roses', 'Fire', 'Crown'];

  const renderStylePreview = (style: string) => {
    const template = availableFontStyles[style];
    if (!template) return previewText;

    // Show how the style will be applied to individual words
    const words = previewText.split(' ');
    if (words.length > 1) {
      // If there are multiple words, show the style applied to each word
      return words.map((word) => template.replace('$TEXT$', word)).join(' ');
    } else {
      // If it's a single word, just apply the style
      return template.replace('$TEXT$', previewText);
    }
  };

  const handleStyleSelect = async (style: string) => {
    await haptic.button('medium');
    setFontStyle(style);
  };

  const handleViewAll = async () => {
    await haptic.button('medium');
    navigation.navigate('FontStyleScreen', { previewText });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Font Styles</Text>
        <TouchableOpacity style={styles.viewAllButton} onPress={handleViewAll}>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {popularStyles.map((style) => (
          <TouchableOpacity
            key={style}
            style={[styles.styleOption, fontStyle === style && styles.selectedOption]}
            onPress={() => handleStyleSelect(style)}>
            <Text
              style={[styles.styleText, fontStyle === style && styles.selectedText]}
              numberOfLines={1}>
              {renderStylePreview(style)}
            </Text>
            <Text style={[styles.styleName, fontStyle === style && styles.selectedText]}>
              {style}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  viewAllButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  viewAllText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  scrollContent: {
    paddingBottom: 8,
  },
  styleOption: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 12,
    marginRight: 10,
    minWidth: 120,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedOption: {
    borderColor: '#000',
    backgroundColor: '#e0e0e0',
  },
  styleText: {
    fontSize: 14,
    marginBottom: 5,
    color: '#333',
  },
  styleName: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  selectedText: {
    color: '#000',
    fontWeight: 'bold',
  },
});

export default FontStyleSelector;
