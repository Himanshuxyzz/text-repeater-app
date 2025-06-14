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
  fontStyleCategories: { [category: string]: string[] };
  setBaseText: (text: string) => void;
  setRepetitions: (count: number) => void;
  setSettings: (settings: { addPeriod: boolean; addNewLine: boolean; addSpace: boolean }) => void;
  setFontStyle: (style: string) => void;
  generateRepeatedText: () => string;
  getStyledText: () => string;
}

// Expanded font styles with Unicode characters
const fontStyles = {
  // Basic Styles
  Normal: '$TEXT$',

  // Hearts & Love
  Hearts: '♥♥♥ $TEXT$ ♥♥♥',
  Love: '💖 $TEXT$ 💖',
  Forever: '$TEXT$ Forever ❤️',
  'Heart Arrow': '💘 $TEXT$ 💘',
  'Double Hearts': '💕 $TEXT$ 💕',
  'Sparkling Heart': '💖✨ $TEXT$ ✨💖',
  'Heart Eyes': '😍 $TEXT$ 😍',
  'Kiss Heart': '😘 $TEXT$ 😘',
  'Cupid Love': '💘💕 $TEXT$ 💕💘',
  Romantic: '💝 $TEXT$ 💝',

  // Stars & Sparkles
  Stars: '★·.·´¯`·.·★ $TEXT$ ★·.·´¯`·.·★',
  Sparkles: '✨💫 $TEXT$ 💫✨',
  'Star Eyes': '🤩 $TEXT$ 🤩',
  'Shooting Star': '🌟 $TEXT$ 🌟',
  Twinkling: '✨⭐ $TEXT$ ⭐✨',
  Glitter: '✨🌟✨ $TEXT$ ✨🌟✨',
  'Starry Night': '🌙⭐ $TEXT$ ⭐🌙',
  Magical: '🪄✨ $TEXT$ ✨🪄',

  // Flowers & Nature
  Roses: '🌹 $TEXT$ 🌹',
  'Cherry Blossom': '🌸 $TEXT$ 🌸',
  Sunflower: '🌻 $TEXT$ 🌻',
  Tulip: '🌷 $TEXT$ 🌷',
  Hibiscus: '🌺 $TEXT$ 🌺',
  Bouquet: '💐 $TEXT$ 💐',
  Garden: '🌸🌺 $TEXT$ 🌺🌸',
  Spring: '🌷🌸 $TEXT$ 🌸🌷',

  // Decorative Borders
  Fancy: '•°¯`•• $TEXT$ ••´¯°•',
  Waves: '≈≈≈≈ $TEXT$ ≈≈≈≈',
  Ornate: '◆◇◆ $TEXT$ ◆◇◆',
  Elegant: '═══ $TEXT$ ═══',
  Royal: '♔ $TEXT$ ♔',
  Crown: '👑 $TEXT$ 👑',
  Diamond: '💎 $TEXT$ 💎',
  Gem: '💎✨ $TEXT$ ✨💎',

  // Arrows & Symbols
  'Arrow Left': '← $TEXT$ →',
  'Arrow Right': '→ $TEXT$ ←',
  'Double Arrow': '⇆ $TEXT$ ⇆',
  Pointing: '👉 $TEXT$ 👈',
  'Up Arrow': '↑ $TEXT$ ↑',
  'Circle Arrow': '↻ $TEXT$ ↺',

  // Brackets & Frames
  'Square Brackets': '[ $TEXT$ ]',
  'Curly Brackets': '{ $TEXT$ }',
  'Angle Brackets': '⟨ $TEXT$ ⟩',
  'Double Brackets': '⟦ $TEXT$ ⟧',
  'Corner Brackets': '「 $TEXT$ 」',
  Rounded: '( $TEXT$ )',
  'Heavy Brackets': '【 $TEXT$ 】',

  // Fire & Energy
  Fire: '🔥 $TEXT$ 🔥',
  Lightning: '⚡ $TEXT$ ⚡',
  Energy: '⚡🔥 $TEXT$ 🔥⚡',
  Explosion: '💥 $TEXT$ 💥',
  Spark: '✨⚡ $TEXT$ ⚡✨',

  // Music & Party
  Music: '🎵 $TEXT$ 🎵',
  Party: '🎉 $TEXT$ 🎉',
  Celebration: '🎊 $TEXT$ 🎊',
  Dance: '💃 $TEXT$ 🕺',
  Disco: '🪩 $TEXT$ 🪩',

  // Animals & Cute
  Cat: '🐱 $TEXT$ 🐱',
  Dog: '🐶 $TEXT$ 🐶',
  Bear: '🐻 $TEXT$ 🐻',
  Panda: '🐼 $TEXT$ 🐼',
  Unicorn: '🦄 $TEXT$ 🦄',
  Butterfly: '🦋 $TEXT$ 🦋',

  // Food & Treats
  Cake: '🎂 $TEXT$ 🎂',
  'Ice Cream': '🍦 $TEXT$ 🍦',
  Candy: '🍭 $TEXT$ 🍭',
  Cookie: '🍪 $TEXT$ 🍪',
  Donut: '🍩 $TEXT$ 🍩',

  // Celestial
  Moon: '🌙 $TEXT$ 🌙',
  Sun: '☀️ $TEXT$ ☀️',
  Rainbow: '🌈 $TEXT$ 🌈',
  Cloud: '☁️ $TEXT$ ☁️',
  Thunder: '⛈️ $TEXT$ ⛈️',

  // Emojis & Faces
  Happy: '😊 $TEXT$ 😊',
  Excited: '🤗 $TEXT$ 🤗',
  Cool: '😎 $TEXT$ 😎',
  Wink: '😉 $TEXT$ 😉',
  Tongue: '😝 $TEXT$ 😝',

  // Special Characters
  Infinity: '∞ $TEXT$ ∞',
  Peace: '☮️ $TEXT$ ☮️',
  'Yin Yang': '☯️ $TEXT$ ☯️',
  Anchor: '⚓ $TEXT$ ⚓',
  Key: '🗝️ $TEXT$ 🗝️',

  // Geometric
  Triangle: '▲ $TEXT$ ▲',
  Circle: '● $TEXT$ ●',
  Square: '■ $TEXT$ ■',
  Hexagon: '⬡ $TEXT$ ⬡',
  'Star Shape': '⭐ $TEXT$ ⭐',
};

// Categories for organized display in modal
const fontStyleCategories = {
  'Hearts & Love': [
    'Hearts',
    'Love',
    'Forever',
    'Heart Arrow',
    'Double Hearts',
    'Sparkling Heart',
    'Heart Eyes',
    'Kiss Heart',
    'Cupid Love',
    'Romantic',
  ],
  'Stars & Sparkles': [
    'Stars',
    'Sparkles',
    'Star Eyes',
    'Shooting Star',
    'Twinkling',
    'Glitter',
    'Starry Night',
    'Magical',
  ],
  'Flowers & Nature': [
    'Roses',
    'Cherry Blossom',
    'Sunflower',
    'Tulip',
    'Hibiscus',
    'Bouquet',
    'Garden',
    'Spring',
  ],
  Decorative: ['Fancy', 'Waves', 'Ornate', 'Elegant', 'Royal', 'Crown', 'Diamond', 'Gem'],
  'Arrows & Symbols': [
    'Arrow Left',
    'Arrow Right',
    'Double Arrow',
    'Pointing',
    'Up Arrow',
    'Circle Arrow',
  ],
  'Brackets & Frames': [
    'Square Brackets',
    'Curly Brackets',
    'Angle Brackets',
    'Double Brackets',
    'Corner Brackets',
    'Rounded',
    'Heavy Brackets',
  ],
  'Fire & Energy': ['Fire', 'Lightning', 'Energy', 'Explosion', 'Spark'],
  'Music & Party': ['Music', 'Party', 'Celebration', 'Dance', 'Disco'],
  'Animals & Cute': ['Cat', 'Dog', 'Bear', 'Panda', 'Unicorn', 'Butterfly'],
  'Food & Treats': ['Cake', 'Ice Cream', 'Candy', 'Cookie', 'Donut'],
  Celestial: ['Moon', 'Sun', 'Rainbow', 'Cloud', 'Thunder'],
  'Emojis & Faces': ['Happy', 'Excited', 'Cool', 'Wink', 'Tongue'],
  Special: ['Infinity', 'Peace', 'Yin Yang', 'Anchor', 'Key'],
  Geometric: ['Triangle', 'Circle', 'Square', 'Hexagon', 'Star Shape'],
  Basic: ['Normal'],
};

const useTextStore = create<TextState>((set, get) => ({
  repeatedText: '',
  baseText: '',
  repetitions: 0,
  fontStyle: 'Normal',
  availableFontStyles: fontStyles,
  fontStyleCategories: fontStyleCategories,
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
