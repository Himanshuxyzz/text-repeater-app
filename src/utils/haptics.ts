import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

// Haptic feedback types with their corresponding implementations
export enum HapticFeedbackType {
  // Light feedback for subtle interactions
  LIGHT = 'light',
  // Medium feedback for standard interactions
  MEDIUM = 'medium',
  // Heavy feedback for important interactions
  HEAVY = 'heavy',
  // Selection feedback for toggles, pickers, etc.
  SELECTION = 'selection',
  // Success feedback for positive outcomes
  SUCCESS = 'success',
  // Warning feedback for cautionary actions
  WARNING = 'warning',
  // Error feedback for negative outcomes
  ERROR = 'error',
  // Rigid feedback for firm interactions
  RIGID = 'rigid',
  // Soft feedback for gentle interactions
  SOFT = 'soft',
}

// Context for when haptic feedback is triggered
export enum HapticContext {
  BUTTON_PRESS = 'button_press',
  TOGGLE_SWITCH = 'toggle_switch',
  TEXT_INPUT_FOCUS = 'text_input_focus',
  TEXT_INPUT_CLEAR = 'text_input_clear',
  NAVIGATION = 'navigation',
  SUCCESS_ACTION = 'success_action',
  ERROR_ACTION = 'error_action',
  WARNING_ACTION = 'warning_action',
  SETTINGS_CHANGE = 'settings_change',
  COPY_ACTION = 'copy_action',
  SHARE_ACTION = 'share_action',
  DELETE_ACTION = 'delete_action',
  MODAL_OPEN = 'modal_open',
  MODAL_CLOSE = 'modal_close',
}

class HapticManager {
  private isEnabled: boolean = true;

  constructor() {
    // Check if haptics are supported on the current platform
    this.isEnabled = Platform.OS === 'ios' || Platform.OS === 'android';
  }

  /**
   * Enable or disable haptic feedback globally
   */
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }

  /**
   * Check if haptic feedback is currently enabled
   */
  getEnabled(): boolean {
    return this.isEnabled;
  }

  /**
   * Trigger haptic feedback with context awareness
   */
  async trigger(
    type: HapticFeedbackType,
    context?: HapticContext,
    force: boolean = false
  ): Promise<void> {
    // Don't trigger if disabled (unless forced)
    if (!this.isEnabled && !force) {
      return;
    }

    // Don't trigger on web platform
    if (Platform.OS === 'web') {
      return;
    }

    try {
      switch (type) {
        case HapticFeedbackType.LIGHT:
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          break;

        case HapticFeedbackType.MEDIUM:
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          break;

        case HapticFeedbackType.HEAVY:
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          break;

        case HapticFeedbackType.RIGID:
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
          break;

        case HapticFeedbackType.SOFT:
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
          break;

        case HapticFeedbackType.SELECTION:
          await Haptics.selectionAsync();
          break;

        case HapticFeedbackType.SUCCESS:
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          break;

        case HapticFeedbackType.WARNING:
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          break;

        case HapticFeedbackType.ERROR:
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          break;

        default:
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          break;
      }

      // Log haptic feedback for debugging (in development)
      if (__DEV__ && context) {
        // console.log(`🔗 Haptic feedback triggered: ${type} (${context})`);
      }
    } catch (error) {
      if (__DEV__) {
        console.warn('Haptic feedback failed:', error);
      }
    }
  }

  /**
   * Convenience methods for common interactions
   */
  async button(importance: 'low' | 'medium' | 'high' = 'medium'): Promise<void> {
    const feedbackMap = {
      low: HapticFeedbackType.LIGHT,
      medium: HapticFeedbackType.MEDIUM,
      high: HapticFeedbackType.HEAVY,
    };
    await this.trigger(feedbackMap[importance], HapticContext.BUTTON_PRESS);
  }

  async toggle(): Promise<void> {
    await this.trigger(HapticFeedbackType.SELECTION, HapticContext.TOGGLE_SWITCH);
  }

  async input(): Promise<void> {
    await this.trigger(HapticFeedbackType.LIGHT, HapticContext.TEXT_INPUT_FOCUS);
  }

  async clear(): Promise<void> {
    await this.trigger(HapticFeedbackType.SOFT, HapticContext.TEXT_INPUT_CLEAR);
  }

  async navigation(): Promise<void> {
    await this.trigger(HapticFeedbackType.LIGHT, HapticContext.NAVIGATION);
  }

  async success(): Promise<void> {
    await this.trigger(HapticFeedbackType.SUCCESS, HapticContext.SUCCESS_ACTION);
  }

  async warning(): Promise<void> {
    await this.trigger(HapticFeedbackType.WARNING, HapticContext.WARNING_ACTION);
  }

  async error(): Promise<void> {
    await this.trigger(HapticFeedbackType.ERROR, HapticContext.ERROR_ACTION);
  }

  async copy(): Promise<void> {
    await this.trigger(HapticFeedbackType.RIGID, HapticContext.COPY_ACTION);
  }

  async share(): Promise<void> {
    await this.trigger(HapticFeedbackType.MEDIUM, HapticContext.SHARE_ACTION);
  }

  async delete(): Promise<void> {
    await this.trigger(HapticFeedbackType.HEAVY, HapticContext.DELETE_ACTION);
  }

  async modalOpen(): Promise<void> {
    await this.trigger(HapticFeedbackType.LIGHT, HapticContext.MODAL_OPEN);
  }

  async modalClose(): Promise<void> {
    await this.trigger(HapticFeedbackType.SOFT, HapticContext.MODAL_CLOSE);
  }

  /**
   * Android-specific haptic feedback (when available)
   */
  async performAndroidHaptic(type: keyof typeof Haptics.AndroidHaptics): Promise<void> {
    if (Platform.OS === 'android' && this.isEnabled) {
      try {
        await Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics[type]);
      } catch (error) {
        if (__DEV__) {
          console.warn('Android haptic feedback failed:', error);
        }
      }
    }
  }
}

// Create a singleton instance
export const hapticManager = new HapticManager();

// Export convenience functions for easy usage
export const haptic = {
  button: (importance?: 'low' | 'medium' | 'high') => hapticManager.button(importance),
  toggle: () => hapticManager.toggle(),
  input: () => hapticManager.input(),
  clear: () => hapticManager.clear(),
  navigation: () => hapticManager.navigation(),
  success: () => hapticManager.success(),
  warning: () => hapticManager.warning(),
  error: () => hapticManager.error(),
  copy: () => hapticManager.copy(),
  share: () => hapticManager.share(),
  delete: () => hapticManager.delete(),
  modalOpen: () => hapticManager.modalOpen(),
  modalClose: () => hapticManager.modalClose(),
  trigger: (type: HapticFeedbackType, context?: HapticContext) =>
    hapticManager.trigger(type, context),
  setEnabled: (enabled: boolean) => hapticManager.setEnabled(enabled),
  getEnabled: () => hapticManager.getEnabled(),
};

export default hapticManager;
