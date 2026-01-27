# Layout Components (Android)

Componentes fundamentais para estruturar a tela.

## `Column` (Vertical)

Empilha elementos verticalmente.

**Props:**
- `horizontalAlignment`: `'start' | 'center' | 'end'`
- `verticalArrangement`: `'top' | 'bottom' | 'center' | 'spaceBetween' | 'spaceAround' | 'spaceEvenly'`
- `modifiers`: `ModifierConfig[]`
- `children`: `ReactNode`

```tsx
<Column
  horizontalAlignment="center"
  verticalArrangement="spaceAround"
  modifiers={[fillMaxSize()]}
>
  <Text>Topo</Text>
  <Text>Fundo</Text>
</Column>
```

---

## `Row` (Horizontal)

Alinha elementos horizontalmente.

**Props:**
- `verticalAlignment`: `'top' | 'bottom' | 'center'`
- `horizontalArrangement`: `'start' | 'center' | 'end' | 'spaceBetween' ...`
- `children`: `ReactNode`

```tsx
<Row verticalAlignment="center" modifiers={[fillMaxWidth()]}>
  <Icon name="menu" />
  <Text>Título</Text>
</Row>
```

---

## `Box` (Z-Stack / Empilhamento)

Permite sobrepor elementos. Útil para backgrounds, badges, ou posicionamento absoluto.

**Props:**
- `children`: `ReactNode`
- `modifiers`: `ModifierConfig[]`

**Exemplo:**
```tsx
<Box modifiers={[size(100, 100), background('blue')]}>
  <Text modifiers={[matchParentSize()]}>Texto Sobreposto</Text>
</Box>
```
