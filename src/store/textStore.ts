import { create } from 'zustand';

interface TextState {
  repeatedText: string;
  setRepeatedText: (text: string) => void;
  baseText: string;
  repetitions: number;
  settings: {
    addPeriod: boolean;
    addNewLine: boolean;
    addSpace: boolean;
  };
  fontStyle: string;
  availableFontStyles: { [key: string]: string };
  setBaseText: (text: string) => void;
  setRepetitions: (count: number) => void;
  setSettings: (settings: { addPeriod: boolean; addNewLine: boolean; addSpace: boolean }) => void;
  setFontStyle: (style: string) => void;
  generateRepeatedText: () => string;
  getStyledText: () => string;
}

// Font styles similar to those on iloveyoucopyandpaste.com
const fontStyles = {
  Normal: '',
  Stars: '★·.·´¯`·.·★ $TEXT$ ★·.·´¯`·.·★',
  Hearts: '♥♥♥ $TEXT$ ♥♥♥',
  Love: '💖 $TEXT$ 💖',
  Forever: '$TEXT$ Forever ❤️',
  Sparkles: '✨💫 $TEXT$ 💫✨',
  Roses: '🌹 $TEXT$ 🌹',
  Waves: '≈≈≈≈ $TEXT$ ≈≈≈≈',
  Fancy: '•°¯`•• $TEXT$ ••´¯°•',
};

const useTextStore = create<TextState>((set, get) => ({
  repeatedText: '',
  baseText: '',
  repetitions: 0,
  fontStyle: 'Normal',
  availableFontStyles: fontStyles,
  settings: {
    addPeriod: false,
    addNewLine: false,
    addSpace: false,
  },

  setRepeatedText: (text: string) => set({ repeatedText: text }),

  setBaseText: (text: string) => set({ baseText: text }),

  setRepetitions: (count: number) => set({ repetitions: count }),

  setSettings: (settings) => set({ settings }),

  setFontStyle: (style: string) => set({ fontStyle: style }),

  generateRepeatedText: () => {
    const { baseText, repetitions, settings } = get();

    if (!baseText || repetitions <= 0) {
      return '';
    }

    // Apply period if setting is enabled
    let processedText = baseText;
    if (settings.addPeriod) {
      processedText = processedText.endsWith('.') ? processedText : processedText + '.';
    }

    let repeatedText;

    // Handle the case with no separators - use native repeat which is most optimized
    if (!settings.addNewLine && !settings.addSpace) {
      repeatedText = processedText.repeat(repetitions);
    } else {
      // For cases with separators, use join which is next best
      const separator = (settings.addNewLine ? '\n' : '') + (settings.addSpace ? ' ' : '');

      // For very large repetitions, generate in chunks
      if (repetitions > 1000) {
        const chunkSize = 1000;
        const chunks = Math.ceil(repetitions / chunkSize);
        let result = '';

        for (let i = 0; i < chunks; i++) {
          const remainingReps = Math.min(chunkSize, repetitions - i * chunkSize);
          const chunk = Array(remainingReps).fill(processedText).join(separator);
          result += chunk;

          // Add separator between chunks if needed
          if (i < chunks - 1 && separator) {
            result += separator;
          }
        }

        repeatedText = result;
      } else {
        const repeatedArray = Array(repetitions).fill(processedText);
        repeatedText = repeatedArray.join(separator);
      }
    }

    set({ repeatedText });
    return repeatedText;
  },

  getStyledText: () => {
    const { repeatedText, fontStyle, availableFontStyles, settings } = get();

    if (!repeatedText || fontStyle === 'Normal') {
      return repeatedText;
    }

    const styleTemplate = availableFontStyles[fontStyle] || '';
    if (!styleTemplate) {
      return repeatedText;
    }

    // Apply style to each word/occurrence instead of the entire text
    // First, split the text based on settings
    let separator = '';
    if (settings.addNewLine) {
      separator += '\n';
    }
    if (settings.addSpace) {
      separator += ' ';
    }

    // If there's no separator, we need to apply styling to the baseText before repetition
    if (!separator) {
      // For no separator case, we need to style each character or try to identify words
      // For simplicity, we'll apply the style to the entire text
      return styleTemplate.replace('$TEXT$', repeatedText);
    }

    // Split by separator and apply style to each part
    const parts = repeatedText.split(separator);
    const styledParts = parts.map((part) => {
      if (!part.trim()) return part; // Skip empty parts
      return styleTemplate.replace('$TEXT$', part);
    });

    // Join back with the same separator
    return styledParts.join(separator);
  },
}));

export default useTextStore;
