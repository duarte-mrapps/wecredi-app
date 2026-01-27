# Display Components (Android)

## `Text`

Exibe texto.

**Props:**
- `children`: `string` ou `ReactNode` (apenas textos aninhados).
- `fontSize`: `number`
- `fontWeight`: `'normal' | 'bold' | '100...900'`
- `color`: `string`

```tsx
<Text
  fontSize={20}
  fontWeight="bold"
  color="#333"
>
  Título Grande
</Text>
```

---

## `Chip`

Elementos compactos que representam um atributo, texto, entidade ou ação.

**Props:**
- `label`: `string`
- `selected`: `boolean`
- `onClick`: `() => void`
- `leadingIcon`: `string` (Material Icon)

```tsx
<Chip
  label="Filtro Ativo"
  selected={true}
  onIcon="check"
/>
```

---

## `Progress`

Indicadores de progresso.

**Props:**
- `value`: `number` (0.0 a 1.0). Se indefinido, é indeterminado (loading spinner).
- `color`: `string`

```tsx
<Progress /> {/* Indeterminado (Spinner) */}
<Progress value={0.7} /> {/* Barra determinística */}
```
