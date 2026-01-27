---
name: expo-ui-native-layouts
description: Expert guide for building professional, truly native iOS (SwiftUI) and Android (Jetpack Compose) layouts using @expo/ui.
---

# Native Layouts Expert (@expo/ui)

This skill enables you to build high-quality, platform-native interfaces using the `@expo/ui` library.

## 🚨 Critical Rules

1.  **Platform Split**: ALWAYS create separate files for iOS and Android when the UI differs significantly (which is 99% of the time with native UI).
    - `Component.ios.tsx` (SwiftUI)
    - `Component.android.tsx` (Jetpack Compose)
    - `Component.tsx` (Export default logic or fallback)
2.  **No React Native Primitives**: Inside the `<Host>`, DO NOT use `<View>`, `<Text>`, or `<ScrollView>` from `react-native`. Use the native equivalents.
3.  **Host is God**: Everything MUST be wrapped in a `<Host style={{ flex: 1 }}>`.

---

##  iOS (SwiftUI) Strategy

**Imports**:
```tsx
import { Host, VStack, HStack, List, Text, Button } from '@expo/ui/swift-ui';
import { font, padding, foregroundStyle } from '@expo/ui/swift-ui/modifiers';
```

### Best Practices
- **Lists**: Use `<List modifiers={[listStyle('insetGrouped')]}>` for settings/menus. It handles scrolling natively.
- **Icons**: Use SF Symbols names in `systemImage` props (e.g., `chevron.right`, `person.fill`).
    - ⚠️ **CRITICAL**: Use `size={20}` and `color="red"` directly on the `<Image />` component. DO NOT use `font()` or `foregroundStyle()` modifiers for icons, they will have NO EFFECT.
- **Typography**: Use `useSystemFonts()` hook for dynamic type support (`largeTitle`, `body`, `caption`).
- **Colors**: Use `useSystemColors()` or `PlatformColor` for dark mode support.
- **Layout**: Use `VStack` and `HStack` with `spacing` prop instead of margins.

### Template
```tsx
export default function Screen() {
  return (
    <Host style={{ flex: 1 }}>
      <VStack spacing={16} modifiers={[padding({ all: 20 })]}>
        <Text modifiers={[font({ size: 34, weight: 'bold' })]}>Title</Text>
        <Button label="Action" modifiers={[buttonStyle('borderedProminent')]} />
      </VStack>
    </Host>
  );
}
```

---

## 🤖 Android (Jetpack Compose) Strategy

**Imports**:
```tsx
import { Host, Column, Row, Box, Text, Button } from '@expo/ui/jetpack-compose';
import { paddingAll, fillMaxSize, background } from '@expo/ui/jetpack-compose/modifiers';
```

### Best Practices
- **Layout**: Use `Column` (vertical), `Row` (horizontal), and `Box` (z-index/overlay).
- **Modifiers**: Use `fillMaxWidth()`, `paddingAll(dp)`, `size(w, h)`.
- **Icons**: Use Material Icon names (e.g., `menu`, `favorite`, `add`).
- **Interactivity**: Use `clickable(() => ...)` modifier for non-button touchables.

### Template
```tsx
export default function Screen() {
  return (
    <Host style={{ flex: 1 }}>
      <Column modifiers={[fillMaxSize(), paddingAll(16)]}>
        <Text fontSize={24} fontWeight="bold">Title</Text>
        <Button onPress={() => {}} variant="elevated">Action</Button>
      </Column>
    </Host>
  );
}
```

---

## 🎨 Common Pitfalls
- **Missing Host**: The native view won't render without a parenting `Host`.
- **Dimensionless Host**: `Host` needs `flex: 1` or explicit dimensions.
- **Wrong Modifiers**: Don't mix iOS modifiers (`padding({ all: 10 })`) with Android (`paddingAll(10)`).
