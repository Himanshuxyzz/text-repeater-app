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
    addNumbers: boolean;
    addPercentages: boolean;
  };
  fontStyle: string;
  availableFontStyles: { [key: string]: string };
  fontStyleCategories: { [category: string]: string[] };
  setBaseText: (text: string) => void;
  setRepetitions: (count: number) => void;
  setSettings: (settings: {
    addPeriod: boolean;
    addNewLine: boolean;
    addSpace: boolean;
    addNumbers: boolean;
    addPercentages: boolean;
  }) => void;
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

  // Time & Date Formatting
  'With Time': '🕒 $TEXT$ [' + new Date().toLocaleTimeString() + ']',
  'Time Prefix': new Date().toLocaleTimeString() + ' | $TEXT$',
  'Time Suffix': '$TEXT$ | ' + new Date().toLocaleTimeString(),
  'Digital Time': '⏰ $TEXT$ (' + new Date().toLocaleTimeString() + ')',
  'Date & Time':
    '📅 $TEXT$ - ' + new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString(),
  'Timed Message': '[$TEXT$ @ ' + new Date().toLocaleTimeString('en-US', { hour12: true }) + ']',
  'Seconds Counter':
    '$TEXT$ ⏱️ ' +
    new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }),
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
  'Time & Date': [
    'With Time',
    'Time Prefix',
    'Time Suffix',
    'Digital Time',
    'Date & Time',
    'Timed Message',
    'Seconds Counter',
  ],
  Celestial: ['Moon', 'Sun', 'Rainbow', 'Cloud', 'Thunder'],
  'Emojis & Faces': ['Happy', 'Excited', 'Cool', 'Wink', 'Tongue'],
  Special: ['Infinity', 'Peace', 'Yin Yang', 'Anchor', 'Key'],
  Geometric: ['Triangle', 'Circle', 'Square', 'Hexagon', 'Star Shape'],
  Basic: ['Normal'],
};

const useTextStore = create<TextState>((set, get) => ({
  repeatedText: '',
  baseText: Array(20).fill('❤️ I Love You ❤️').join(' '),
  repetitions: 10000,
  fontStyle: 'Normal',
  availableFontStyles: fontStyles,
  fontStyleCategories: fontStyleCategories,
  settings: {
    addPeriod: false,
    addNewLine: false,
    addSpace: false,
    addNumbers: false,
    addPercentages: false,
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
    if (
      !settings.addNewLine &&
      !settings.addSpace &&
      !settings.addNumbers &&
      !settings.addPercentages
    ) {
      repeatedText = processedText.repeat(repetitions);
    } else {
      // For cases with separators, use join which is next best
      let separator = '';
      if (settings.addNewLine) separator += '\n';
      if (settings.addSpace) separator += ' ';

      // For very large repetitions, generate in chunks
      if (repetitions > 1000) {
        const chunkSize = 1000;
        const chunks = Math.ceil(repetitions / chunkSize);
        let result = '';

        for (let i = 0; i < chunks; i++) {
          const remainingReps = Math.min(chunkSize, repetitions - i * chunkSize);
          let chunk = '';

          if (settings.addNumbers) {
            chunk = Array(remainingReps)
              .fill(0)
              .map((_, index) => `${i * chunkSize + index + 1}. ${processedText}`)
              .join(separator);
          } else if (settings.addPercentages) {
            chunk = Array(remainingReps)
              .fill(0)
              .map((_, index) => {
                const percent = Math.round(((i * chunkSize + index + 1) / repetitions) * 100);
                return `${percent}% ${processedText}`;
              })
              .join(separator);
          } else {
            chunk = Array(remainingReps).fill(processedText).join(separator);
          }

          result += chunk;

          // Add separator between chunks if needed
          if (i < chunks - 1 && separator) {
            result += separator;
          }
        }

        repeatedText = result;
      } else {
        if (settings.addNumbers) {
          repeatedText = Array(repetitions)
            .fill(0)
            .map((_, index) => `${index + 1}. ${processedText}`)
            .join(separator);
        } else if (settings.addPercentages) {
          repeatedText = Array(repetitions)
            .fill(0)
            .map((_, index) => {
              const percent = Math.round(((index + 1) / repetitions) * 100);
              return `${percent}% ${processedText}`;
            })
            .join(separator);
        } else {
          repeatedText = Array(repetitions).fill(processedText).join(separator);
        }
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

    let styleTemplate = availableFontStyles[fontStyle] || '';
    if (!styleTemplate) {
      return repeatedText;
    }

    // Update time values in real-time if this is a time-based style
    if (fontStyle.includes('Time') || fontStyle.includes('Date')) {
      const now = new Date();
      styleTemplate = styleTemplate
        .replace(/new Date\(\)\.toLocaleTimeString\(\)/g, `"${now.toLocaleTimeString()}"`)
        .replace(/new Date\(\)\.toLocaleDateString\(\)/g, `"${now.toLocaleDateString()}"`)
        .replace(
          /new Date\(\)\.toLocaleTimeString\('en-US', \{hour12: true\}\)/g,
          `"${now.toLocaleTimeString('en-US', { hour12: true })}"`
        )
        .replace(
          /new Date\(\)\.toLocaleTimeString\('en-US', \{hour: '2-digit', minute: '2-digit', second: '2-digit'\}\)/g,
          `"${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}"`
        );
    }

    // Apply period if setting is enabled
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
