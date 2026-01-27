# Form & Input Components (Android)

## `TextInput`

Campo de entrada de texto estilo Material.

**Props:**
- `defaultValue`: `string`
- `onChangeText`: `(text: string) => void`
- `placeholder`: `string`
- `keyboardType`: `'default' | 'numeric' | 'email-address' | 'phone-pad' ...`
- `autoCapitalize`: `'none' | 'sentences' | 'words' | 'characters'`
- `modifiers`: `ModifierConfig[]`

```tsx
<TextInput
  placeholder="Digite seu email"
  keyboardType="email-address"
  onChangeText={(text) => console.log(text)}
  modifiers={[fillMaxWidth(), paddingAll(8)]}
/>
```

---

## `Button`

Botão Material Design 3.

**Props:**
- `onPress`: `() => void`
- `variant`: `'default' | 'outlined' | 'elevated' | 'text'`
- `leadingIcon`: `string` (Nome do ícone Material)
- `trailingIcon`: `string`
- `disabled`: `boolean`
- `children`: `string` ou `ReactNode`

```tsx
<Button
  variant="elevated"
  onPress={handlePress}
  leadingIcon="send"
>
  Enviar
</Button>
```

---

## `Switch`

Toggle switch.

**Props:**
- `checked`: `boolean`
- `onCheckedChange`: `(checked: boolean) => void`
- `enabled`: `boolean`

```tsx
<Switch
  checked={isEnabled}
  onCheckedChange={setIsEnabled}
/>
```

## `Slider`

Barra deslizante.

**Props:**
- `value`: `number` (0.0 a 1.0)
- `onValueChange`: `(value: number) => void`
- `steps`: `number` (opcional, para discreto)

```tsx
<Slider value={progress} onValueChange={setProgress} />
```
