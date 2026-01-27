# View Modifiers

Os modificadores são o coração da estilização no `@expo/ui/swift-ui`. Eles configuram aparência, layout, e comportamento. Importe-os de `@expo/ui/swift-ui/modifiers`.

## Visão Geral

Todos os componentes aceitam a prop `modifiers={[ ... ]}`.

```tsx
import { font, padding } from '@expo/ui/swift-ui/modifiers';

<Text modifiers={[font({ size: 20 }), padding({ all: 10 })]}>
  Exemplo
</Text>
```

---

## Modificadores Visuais

### `foregroundStyle(style)`
Define a cor do texto, ícones e tinturas.
- `style`:
  - String de cor (`'red'`, `'#FF0000'`)
  - Objeto de cor: `{ type: 'color', color: '#hex' }`
  - Hierárquico: `{ type: 'hierarchical', style: 'primary' | 'secondary' | 'tertiary' }`
  - Gradiente: `{ type: 'linearGradient', colors: [], ... }`

### `background(color)`
Define a cor de fundo.
- `color`: Cor hex ou objeto de cor.

### `opacity(value)`
Define a opacidade (0.0 a 1.0).

### `cornerRadius(radius)`
Arredonda as bordas.

### `shadow({ radius, x, y, color })`
Aplica sombra.

### `glassEffect({ style, ... })`
Aplica efeito de vidro (blur).

---

## Layout

### `padding({ top, bottom, leading, trailing, vertical, horizontal, all })`
Adiciona espaçamento interno.
- Exemplo: `padding({ horizontal: 20, vertical: 10 })`

### `frame({ width, height, maxWidth, maxHeight, alignment })`
Define dimensões fixas ou flexíveis.
- `maxWidth: Infinity`: Faz o componente expandir horizontalmente.

### `fixedSize({ horizontal, vertical })`
Força o componente a ter seu tamanho ideal, ignorando as restrições do pai.

---

## Tipografia

### `font({ size, weight, design, family })`
Configura a fonte.
- `size`: Tamanho em points.
- `weight`: `'regular'`, `'bold'`, `'semibold'`, etc.
- `design`: `'default'`, `'rounded'`, `'serif'`, `'monospaced'`.

### `multilineTextAlignment(align)`
Alinhamento de texto multilinha: `'center'`, `'leading'`, `'trailing'`.

---

## Controles e Formulários

### `buttonStyle(style)`
- `'bordered'`, `'borderedProminent'`, `'plain'`.

### `pickerStyle(style)`
- `'menu'`, `'wheel'`, `'segmented'`, `'palette'`.

### `toggleStyle(style)`
- `'switch'`, `'button'`.

### `submitLabel(label)`
Altera o botão de "Enter" no teclado: `'done'`, `'go'`, `'search'`, `'next'`.

### `controlSize(size)`
Tamanho padrão dos controles: `'mini'`, `'small'`, `'regular'`, `'large'`.

---

## Listas

### `listStyle(style)`
- `'insetGrouped'` (Padrão iOS Settings), `'plain'`, `'sidebar'`.

### `listRowBackground(color)`
Define o fundo de uma linha específica na lista.

### `listRowInsets({ top, bottom, leading, trailing })`
Remove ou altera o padding padrão da linha.

---

## Gestos e Ações

### `onTapGesture(() => void)`
Detecta toque simples.

### `onLongPressGesture(() => void)`
Detecta toque longo.

### `onAppear(() => void)`
Chamado quando o componente aparece na tela.

### `onDisappear(() => void)`
Chamado quando o componente sai da tela.
