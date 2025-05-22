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
  setBaseText: (text: string) => void;
  setRepetitions: (count: number) => void;
  setSettings: (settings: { addPeriod: boolean; addNewLine: boolean; addSpace: boolean }) => void;
  generateRepeatedText: () => string;
}

const useTextStore = create<TextState>((set, get) => ({
  repeatedText: '',
  baseText: '',
  repetitions: 0,
  settings: {
    addPeriod: false,
    addNewLine: false,
    addSpace: false,
  },

  setRepeatedText: (text: string) => set({ repeatedText: text }),

  setBaseText: (text: string) => set({ baseText: text }),

  setRepetitions: (count: number) => set({ repetitions: count }),

  setSettings: (settings) => set({ settings }),

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
}));

export default useTextStore;
