# Display Components

Componentes para exibição de conteúdo estático.

## `Text`

Exibe texto formatado.

**Props:**
- `children`: `ReactNode` (strings ou Textos aninhados).

**Modificadores Principais:**
- `font({ size, weight, design, family })`
- `foregroundStyle(color)`
- `multilineTextAlignment('center' | 'leading' | 'trailing')`
- `lineLimit(number)`

```tsx
<Text
  modifiers={[
    font({ size: 20, weight: 'bold', design: 'rounded' }),
    foregroundStyle('systemBlue')
  ]}
>
  Título Arredondado
</Text>
```

---

## `Label`

Combina um título e um ícone em um layout padrão do sistema. Muito comum em Listas e Menus.

**Props:**
- `title`: `string` - Texto principal.
- `subtitle`: `string` - Texto secundário (depende do estilo).
- `systemImage`: `SFSymbol` - Ícone SF Symbol.

**Modificadores:**
- `labelStyle('titleAndIcon' | 'iconOnly' | 'titleOnly')`

```tsx
<Label
  title="Modo Avião"
  systemImage="airplane"
/>
```

---

## `Image`

Exibe imagens do sistema (SF Symbols).

**Props (Diretas - NÃO use modifiers para isso):**
- `systemName`: `SFSymbol` - Nome do símbolo.
- `size`: `number` - Tamanho do ícone. **Use esta prop, não `font`**.
- `color`: `ColorValue` - Cor do ícone. **Use esta prop, não `foregroundStyle`**.
- `variableValue`: `number` - Para símbolos que suportam valor variável.

**Modificadores:**
- `symbolVariant('fill')` - Preenchido, contorno, etc.

```tsx
<Image
  systemName="wifi"
  size={30}         // CORRETO
  color="blue"      // CORRETO
  modifiers={[
    // font({ size: 30 }),         <- NÃO FUNCIONA
    // foregroundStyle('blue')     <- NÃO FUNCIONA
    background('yellow')        // Funciona (background da view)
  ]}
/>
```
