# Conceitos Core (Android)

## 1. O Componente `Host`

Assim como no SwiftUI, o Jetpack Compose precisa de uma "raiz" para renderizar dentro do React Native. Use o componente `<Host />`.

```tsx
import { Host } from '@expo/ui/jetpack-compose';

<Host style={{ flex: 1 }}>
  {/* Seus Composables aqui */}
</Host>
```

## 2. Layout Declarativo

O Jetpack Compose não usa Flexbox da mesma maneira que a Web/React Native. Ele usa Layouts Primários:

- **`Column`** (Vertical) -> Similar ao `VStack` ou `flexDirection: column`.
- **`Row`** (Horizontal) -> Similar ao `HStack` ou `flexDirection: row`.
- **`Box`** (Empilhamento) -> Similar ao `ZStack` ou `position: absolute`.

## 3. Modificadores

Em vez de props de estilo (`style={...}`), usamos uma lista de **Modificadores**, similar ao padrão do SwiftUI, mas seguindo a API do Android.

Exemplo de diferenças:
- **iOS**: `padding({ all: 10 })`
- **Android**: `paddingAll(10)` ou `padding(start, top, end, bottom)`

```tsx
import { paddingAll, fillMaxWidth } from '@expo/ui/jetpack-compose/modifiers';

<Box modifiers={[paddingAll(16), fillMaxWidth()]}>
  ...
</Box>
```

## 4. Ícones Material

Enquanto o iOS usa SF Symbols, o Android usa **Material Icons**. Os componentes que aceitam ícones (como `Button` com `leadingIcon`) esperam nomes de ícones do Material Design.
