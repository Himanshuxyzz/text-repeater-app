import React, { FC, useRef, useEffect, useMemo, useCallback, memo, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import useTextStore from '~/store/textStore';
import { haptic } from '~/utils/haptics';
import { MainStackParamList } from '~/navigation/MainStack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { deviceHeight } from '~/utils/utils';

type FontStyleScreenRouteProp = RouteProp<MainStackParamList, 'FontStyleScreen'>;
type FontStyleScreenNavigationProp = NativeStackNavigationProp<
  MainStackParamList,
  'FontStyleScreen'
>;

// Types for FlashList data
interface CategoryItem {
  type: 'category';
  id: string;
  title: string;
}

interface StyleRowItem {
  type: 'styleRow';
  id: string;
  styles: Array<{
    name: string;
    template: string;
  }>;
}

type ListItem = CategoryItem | StyleRowItem;

const ESTIMATED_ITEM_SIZE = 100;

// Optimized style option component
const StyleOption = memo<{
  styleName: string;
  isSelected: boolean;
  previewText: string;
  template: string;
  onSelect: (style: string) => void;
}>(({ styleName, isSelected, previewText, template, onSelect }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time for time-based templates
  useEffect(() => {
    if (styleName.includes('Time') || styleName.includes('Date')) {
      const timer = setInterval(() => {
        setCurrentTime(new Date());
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [styleName]);

  const handlePress = useCallback(() => {
    onSelect(styleName);
  }, [styleName, onSelect]);

  const previewResult = useMemo(() => {
    if (!template) return previewText;

    // Process time-based templates
    let processedTemplate = template;
    if (styleName.includes('Time') || styleName.includes('Date')) {
      processedTemplate = template
        .replace(/new Date\(\)\.toLocaleTimeString\(\)/g, `"${currentTime.toLocaleTimeString()}"`)
        .replace(/new Date\(\)\.toLocaleDateString\(\)/g, `"${currentTime.toLocaleDateString()}"`)
        .replace(
          /new Date\(\)\.toLocaleTimeString\('en-US', \{hour12: true\}\)/g,
          `"${currentTime.toLocaleTimeString('en-US', { hour12: true })}"`
        )
        .replace(
          /new Date\(\)\.toLocaleTimeString\('en-US', \{hour: '2-digit', minute: '2-digit', second: '2-digit'\}\)/g,
          `"${currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}"`
        )
        .replace(/"/g, ''); // Remove extra quotes from the replacements
    }

    return processedTemplate.replace('$TEXT$', previewText);
  }, [template, previewText, styleName, currentTime]);

  return (
    <TouchableOpacity
      style={[styles.styleOption, isSelected && styles.selectedOption]}
      onPress={handlePress}
      activeOpacity={0.8}>
      {isSelected && (
        <View style={styles.selectedIndicator}>
          <Text style={styles.checkmark}>✓</Text>
        </View>
      )}
      <Text style={[styles.stylePreview, isSelected && styles.selectedText]} numberOfLines={2}>
        {previewResult}
      </Text>
      <Text style={[styles.styleName, isSelected && styles.selectedStyleName]}>{styleName}</Text>
    </TouchableOpacity>
  );
});

// Category header component
const CategoryHeader = memo<{ title: string }>(({ title }) => (
  <Text style={styles.categoryTitle}>{title}</Text>
));

// Style row component (2 styles per row)
const StyleRow = memo<{
  styles: Array<{ name: string; template: string }>;
  fontStyle: string;
  previewText: string;
  onStyleSelect: (style: string) => void;
}>(({ styles: rowStyles, fontStyle, previewText, onStyleSelect }) => (
  <View style={styles.styleRow}>
    {rowStyles.map((style) => (
      <View key={style.name} style={styles.styleContainer}>
        <StyleOption
          styleName={style.name}
          isSelected={fontStyle === style.name}
          previewText={previewText}
          template={style.template}
          onSelect={onStyleSelect}
        />
      </View>
    ))}
    {rowStyles.length === 1 && <View style={styles.styleContainer} />}
  </View>
));

const FontStyleScreen: FC = () => {
  const navigation = useNavigation<FontStyleScreenNavigationProp>();
  const route = useRoute<FontStyleScreenRouteProp>();
  const { fontStyle, availableFontStyles, fontStyleCategories, setFontStyle } = useTextStore();
  const flashListRef = useRef<FlashList<ListItem>>(null);

  // Get preview text from navigation params or use default
  const previewText = route.params?.previewText || 'I Love You';

  // Pre-computed flat data structure
  const listData = useMemo(() => {
    const items: ListItem[] = [];
    const categories = Object.entries(fontStyleCategories);

    for (let i = 0; i < categories.length; i++) {
      const [category, styleNames] = categories[i];

      // Add category header
      items.push({
        type: 'category',
        id: `cat_${i}`,
        title: category,
      });

      // Group styles into rows (2 per row)
      for (let j = 0; j < styleNames.length; j += 2) {
        const rowStyles = [];
        const style1 = styleNames[j];
        const style2 = styleNames[j + 1];

        rowStyles.push({
          name: style1,
          template: availableFontStyles[style1] || '',
        });

        if (style2) {
          rowStyles.push({
            name: style2,
            template: availableFontStyles[style2] || '',
          });
        }

        items.push({
          type: 'styleRow',
          id: `row_${i}_${Math.floor(j / 2)}`,
          styles: rowStyles,
        });
      }
    }

    return items;
  }, [fontStyleCategories, availableFontStyles]);

  // Find selected item index for auto-scroll
  const selectedItemIndex = useMemo(() => {
    if (!fontStyle || !listData.length) return -1;

    for (let i = 0; i < listData.length; i++) {
      const item = listData[i];
      if (item.type === 'styleRow') {
        for (const style of item.styles) {
          if (style.name === fontStyle) {
            return Math.max(0, i - 1);
          }
        }
      }
    }
    return -1;
  }, [fontStyle, listData]);

  // Auto-scroll to selected style
  useEffect(() => {
    if (selectedItemIndex !== -1 && flashListRef.current) {
      const timer = setTimeout(() => {
        flashListRef.current?.scrollToIndex({
          index: selectedItemIndex,
          animated: true,
        });
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [selectedItemIndex]);

  // Handle style selection
  const handleStyleSelect = useCallback(
    async (style: string) => {
      await haptic.button('medium');
      setFontStyle(style);
      navigation.goBack();
    },
    [setFontStyle, navigation]
  );

  // Handle back navigation
  const handleBack = useCallback(async () => {
    await haptic.button('low');
    navigation.goBack();
  }, [navigation]);

  // Render functions
  const renderItem = useCallback(
    ({ item }: { item: ListItem }) => {
      if (item.type === 'category') {
        return <CategoryHeader title={item.title} />;
      }
      return (
        <StyleRow
          styles={item.styles}
          fontStyle={fontStyle}
          previewText={previewText}
          onStyleSelect={handleStyleSelect}
        />
      );
    },
    [fontStyle, previewText, handleStyleSelect]
  );

  const getItemType = useCallback((item: ListItem) => item.type, []);

  const inset = useSafeAreaInsets();

  return (
    <View
      className="flex-1 "
      style={{
        height: deviceHeight,
      }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Font Style</Text>
          <Text style={styles.currentStyle}>{fontStyle}</Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      <FlashList
        ref={flashListRef}
        data={listData}
        renderItem={renderItem}
        getItemType={getItemType}
        estimatedItemSize={ESTIMATED_ITEM_SIZE}
        showsVerticalScrollIndicator={true}
        contentContainerStyle={styles.listContent}
        keyExtractor={(item) => item.id}
      />

      {/* Content */}
      {/* <View
        style={{
          backgroundColor: 'white',
          marginBottom: inset.top,
          flex: 1,
        }}>
        <FlashList
          ref={flashListRef}
          data={listData}
          renderItem={renderItem}
          getItemType={getItemType}
          estimatedItemSize={ESTIMATED_ITEM_SIZE}
          showsVerticalScrollIndicator={true}
          contentContainerStyle={styles.listContent}
          keyExtractor={(item) => item.id}
        />
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  currentStyle: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
    marginTop: 2,
  },
  placeholder: {
    width: 32,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 200,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 16,
    paddingLeft: 4,
  },
  styleRow: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 12,
  },
  styleContainer: {
    flex: 1,
  },
  styleOption: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 14,
    minHeight: 75,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedOption: {
    borderColor: '#007AFF',
    backgroundColor: '#e3f2fd',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
  },
  stylePreview: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
    marginBottom: 4,
    lineHeight: 16,
  },
  selectedText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  styleName: {
    fontSize: 10,
    color: '#666',
    fontWeight: '500',
    textAlign: 'center',
  },
  selectedStyleName: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
});

export default FontStyleScreen;
