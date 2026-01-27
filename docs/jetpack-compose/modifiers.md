# Modifiers (Android)

Referência da API de Modificadores para Jetpack Compose. Importe de `@expo/ui/jetpack-compose/modifiers`.

## Layout & Tamanho

### `size(width, height)`
Define largura e altura exatas.

### `fillMaxSize(fraction?)`
Ocupa todo o espaço disponível do pai (similar a `flex: 1` e `width: 100%; height: 100%`).

### `fillMaxWidth(fraction?)` / `fillMaxHeight(fraction?)`
Ocupa largura ou altura máxima.

### `paddingAll(value)`
Padding igual em todos os lados.

### `padding(start, top, end, bottom)`
Padding específico. Note que usamos `start/end` para suporte a RTL.

### `offset(x, y)`
Desloca o elemento sem afetar o layout dos irmãos.

---

## Aparência

### `background(color)`
Define a cor de fundo (`'#RRGGBB'`).

### `border(width, color)`
Adiciona borda.

### `shadow(elevation)`
Adiciona sombra/elevação estilo Material.

### `alpha(value)`
Define a opacidade (0.0 a 1.0).

### `clip(shape)`
Recorta o conteúdo em formas (ex: CircleShape).

---

## Interação

### `clickable(onClick)`
Torna qualquer elemento clicável (adiciona Ripple effect).

### `testID(id)`
Adiciona identificador para testes E2E.

## Exemplo Combinado

```tsx
import { Box } from '@expo/ui/jetpack-compose';
import {
  size,
  background,
  paddingAll,
  shadow,
  clickable
} from '@expo/ui/jetpack-compose/modifiers';

<Box modifiers={[
  size(100, 100),
  background('#FFFFFF'),
  paddingAll(16),
  shadow(4),
  clickable(() => alert('Box!'))
]}>
  ...
</Box>
```
