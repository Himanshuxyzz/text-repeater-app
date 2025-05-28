import React, { FC } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import useTextStore from '~/store/textStore';

interface FontStyleSelectorProps {
  previewText?: string;
}

const FontStyleSelector: FC<FontStyleSelectorProps> = ({ previewText = 'Preview Text' }) => {
  const { fontStyle, availableFontStyles, setFontStyle } = useTextStore();

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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Font Styles</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {Object.keys(availableFontStyles).map((style) => (
          <TouchableOpacity
            key={style}
            style={[styles.styleOption, fontStyle === style && styles.selectedOption]}
            onPress={() => setFontStyle(style)}>
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: 'black',
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
