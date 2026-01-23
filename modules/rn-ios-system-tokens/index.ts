import { requireNativeModule, EventEmitter } from 'expo-modules-core'
import { useEffect, useState } from 'react'
import { Appearance } from 'react-native'

import { SystemFonts } from './src/types/Font'
import { SystemColors } from './src/types/Color'

export * from './src/types/Font'
export * from './src/types/Color'

const RnIosSystemTokens = requireNativeModule('RnIosSystemTokens')
const emitter = new EventEmitter(RnIosSystemTokens)

// --- API ---

export function getSystemFonts(): SystemFonts {
  return RnIosSystemTokens.getSystemFonts()
}

export function getSystemColors(): SystemColors {
  return RnIosSystemTokens.getSystemColors()
}

// --- Hooks ---

/**
 * Hook to get the current system font metrics.
 * Updates automatically when the system font size changes.
 */
export function useSystemFonts(): SystemFonts | null {
  const [fonts, setFonts] = useState<SystemFonts | null>(null)

  useEffect(() => {
    // Initial fetch
    setFonts(getSystemFonts())

    // Subscribe to changes
    const subscription = emitter.addListener('onFontsChanged', (newFonts: SystemFonts) => {
      setFonts(newFonts)
    })

    return () => {
      subscription.remove()
    }
  }, [])

  return fonts
}

/**
 * Hook to get the current system semantic colors.
 * Updates automatically when the system appearance (Light/Dark) changes.
 */
export function useSystemColors(): SystemColors | null {
  const [colors, setColors] = useState<SystemColors | null>(null)

  useEffect(() => {
    // Initial fetch
    setColors(RnIosSystemTokens.getSystemColors())

    // Native module doesn't easily detect TraitCollection changes without a View,
    // so we rely on React Native's Appearance API to trigger re-fetch.
    const subscription = Appearance.addChangeListener(() => {
      // Re-fetch colors from native when appearance changes
      setColors(RnIosSystemTokens.getSystemColors())
    })

    // Also listen for potential native events if implemented
    const nativeSub = emitter.addListener('onColorsChanged', (newColors: SystemColors) => {
      setColors(newColors)
    })

    return () => {
      subscription.remove()
      nativeSub.remove()
    }
  }, [])

  return colors
}
