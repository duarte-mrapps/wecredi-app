import { requireNativeModule, EventEmitter, EventSubscription } from 'expo-modules-core';
import { useEffect, useState } from 'react';

// Import the native module. On web, it will be resolved to null.
const ExpoSystemFonts = requireNativeModule('ExpoSystemFonts');

const emitter = new EventEmitter(ExpoSystemFonts);

export type FontWeight =
  | 'ultraLight'
  | 'thin'
  | 'light'
  | 'regular'
  | 'medium'
  | 'semibold'
  | 'bold'
  | 'heavy'
  | 'black';

export type TextStyle =
  | 'largeTitle'
  | 'title1'
  | 'title2'
  | 'title3'
  | 'headline'
  | 'body'
  | 'callout'
  | 'subheadline'
  | 'footnote'
  | 'caption1'
  | 'caption2';

export type FontMetrics = {
  fontSize: number;
  fontWeight: FontWeight;
  textStyle: TextStyle;
};

export type DynamicTypeMetrics = Record<TextStyle, FontMetrics>;

/**
 * Hook to get the current system font metrics.
 * Updates automatically when the system font size changes.
 */
export function useSystemFonts(): DynamicTypeMetrics | null {
  const [fonts, setFonts] = useState<DynamicTypeMetrics | null>(null);

  useEffect(() => {
    // Initial fetch
    const initialFonts = ExpoSystemFonts.getFontMetrics();
    setFonts(initialFonts);

    // Subscribe to changes
    const subscription = emitter.addListener('onDynamicTypeChange', (newFonts: DynamicTypeMetrics) => {
      setFonts(newFonts);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return fonts;
}
