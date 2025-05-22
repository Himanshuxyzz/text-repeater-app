import React, { FC, useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Share,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';

import Container from '@components/common/Container';
import SubText from '@components/common/SubText';
import AnimatedButton from '~/components/common/AnimatedButton';
import useTextStore from '~/store/textStore';

const OutputScreen: FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { repeatedText } = useTextStore();

  const [isCopied, setIsCopied] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Copy text to clipboard
  const handleCopy = useCallback(async () => {
    try {
      if (!repeatedText) {
        Alert.alert('Error', 'No text to copy');
        return;
      }

      setIsLoading(true);
      await Clipboard.setStringAsync(repeatedText);
      setIsLoading(false);

      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset copied state after 2 seconds
      Alert.alert('Success', 'Text copied to clipboard');
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Error', 'Failed to copy text to clipboard');
    }
  }, [repeatedText]);

  // Share text
  const handleShare = useCallback(async () => {
    try {
      if (!repeatedText) {
        Alert.alert('Error', 'No text to share');
        return;
      }

      setIsSharing(true);
      await Share.share({
        message: repeatedText,
      });
      setIsSharing(false);
    } catch (error) {
      setIsSharing(false);
      Alert.alert('Error', 'Failed to share text');
    }
  }, [repeatedText]);

  const handleBack = () => {
    navigation.goBack();
  };

  const textLength = repeatedText.length;
  const isLargeText = textLength > 100000; // Consider text over 100K characters as large

  if (!repeatedText) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }, styles.centered]}>
        <SubText className="text-xl font-bold text-black">No text to display</SubText>
        <TouchableOpacity style={styles.backButtonCentered} onPress={handleBack}>
          <SubText className="text-lg font-bold text-black">Go Back</SubText>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <SubText className="text-2xl font-bold text-black">Repeated Text</SubText>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{textLength.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Characters</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {repeatedText.split(/\s+/).filter(Boolean).length.toLocaleString()}
          </Text>
          <Text style={styles.statLabel}>Words</Text>
        </View>
      </View>

      <View style={styles.contentContainer}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#000" />
            <Text style={styles.loadingText}>Processing large text...</Text>
          </View>
        ) : (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={true}>
            {isLargeText ? (
              <View>
                <Text style={styles.warningText}>
                  This text is very large ({(textLength / 1000).toFixed(1)}K characters).
                </Text>
                <Text selectable style={styles.outputText}>
                  {repeatedText.substring(0, 5000)}
                  {'\n\n... (text truncated for display) ...\n\n'}
                  {repeatedText.substring(repeatedText.length - 5000)}
                </Text>
                <Text style={styles.warningText}>
                  Note: Only showing first and last 5000 characters for performance reasons. Use
                  copy/share to get the full text.
                </Text>
              </View>
            ) : (
              <Text selectable style={styles.outputText}>
                {repeatedText}
              </Text>
            )}
          </ScrollView>
        )}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.actionButton,
            isCopied && styles.successButton,
            isLoading && styles.disabledButton,
          ]}
          onPress={handleCopy}
          disabled={isLoading}>
          <Ionicons
            name={isCopied ? 'checkmark-circle' : 'copy-outline'}
            size={24}
            color="white"
            style={styles.buttonIcon}
          />
          <Text style={styles.buttonText}>{isCopied ? 'Copied!' : 'Copy All Text'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.actionButton,
            styles.shareButton,
            (isSharing || isLoading) && styles.disabledButton,
          ]}
          onPress={handleShare}
          disabled={isSharing || isLoading}>
          <Ionicons
            name={isSharing ? 'hourglass-outline' : 'share-social-outline'}
            size={24}
            color="white"
            style={styles.buttonIcon}
          />
          <Text style={styles.buttonText}>{isSharing ? 'Sharing...' : 'Share Text'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonCentered: {
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#e5e5e5',
    borderRadius: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  backButton: {
    padding: 8,
  },
  placeholder: {
    width: 40, // Match the back button width for balanced layout
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  contentContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#333',
  },
  scrollView: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  outputText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  warningText: {
    fontSize: 14,
    color: '#ff6b00',
    marginVertical: 10,
    textAlign: 'center',
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
    backgroundColor: 'white',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    marginHorizontal: 6,
  },
  shareButton: {
    backgroundColor: '#0891B2',
  },
  successButton: {
    backgroundColor: '#16A34A',
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  spacer: {
    width: 16,
  },
});

export default OutputScreen;
