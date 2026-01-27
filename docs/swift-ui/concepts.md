# Conceitos Core

Para utilizar efetivamente o `@expo/ui/swift-ui`, é importante entender alguns conceitos fundamentais que diferem do desenvolvimento React Native tradicional.

## 1. O Componente `Host`

Todos os componentes SwiftUI devem estar contidos dentro de um componente raiz chamado `<Host />`. O `Host` é a ponte entre o layout Flexbox do React Native e o sistema de layout do SwiftUI.

- O `Host` é um `View` nativo do React Native.
- Você deve dar a ele um tamanho (ex: `flex: 1` ou `height: 300`) para que o conteúdo SwiftUI seja visível.

```tsx
import { Host, Text } from '@expo/ui/swift-ui';

<Host style={{ flex: 1 }}>
  <Text>Conteúdo SwiftUI aqui</Text>
</Host>
```

## 2. Componentes vs. Modificadores

No React Native, costumamos passar estilos via prop `style`. No SwiftUI, usamos **Modificadores**.

- **Componentes**: Definem *o que* é exibido (`Text`, `Button`, `List`).
- **Modificadores**: Definem *como* é exibido ou se comporta (`font`, `padding`, `background`).

A biblioteca expõe uma prop `modifiers` em quase todos os componentes, que aceita um array de configurações de modificadores.

```tsx
import { Text } from '@expo/ui/swift-ui';
import { font, foregroundStyle, padding } from '@expo/ui/swift-ui/modifiers';

<Text
  modifiers={[
    font({ size: 18, weight: 'bold' }), // Define a fonte
    foregroundStyle('blue'),            // Define a cor
    padding({ all: 10 })                // Define o espaçamento
  ]}
>
  Texto Estilizado
</Text>
```

> **A ordem importa!** Assim como no SwiftUI nativo, a ordem dos modificadores pode alterar o resultado visual (ex: aplicar `background` antes ou depois de `padding`).

## 3. Cores e Tipografia do Sistema

Para criar interfaces que pareçam verdadeiramente nativas ("Native Feel"), use os tokens de sistema do iOS.

### `PlatformColor` e Tokens

Você pode usar cores semânticas do iOS (que mudam automaticamente com Dark Mode):

```tsx
import { PlatformColor } from 'react-native';
import { foregroundStyle } from '@expo/ui/swift-ui/modifiers';

// Usando modifiers
foregroundStyle({ type: 'color', color: PlatformColor('systemBlue') })
```

### Hooks Auxiliares

O projeto utiliza hooks (ex: `@/modules/rn-ios-system-tokens`) para acessar fontes e cores de sistema de forma tipada:

- `useSystemColors()`: Retorna cores como `systemBackground`, `label`, `secondaryLabel`.
- `useSystemFonts()`: Retorna tipografias como `largeTitle`, `headline`, `body`.

```tsx
const fonts = useSystemFonts();
const colors = useSystemColors();

<Text
  modifiers={[
    font({ size: fonts?.largeTitle.fontSize, weight: 'bold' }),
    foregroundStyle({ type: 'color', color: colors?.label })
  ]}
>
  Título Nativo
</Text>
```

## 4. SF Symbols

A biblioteca tem integração profunda com SF Symbols (os ícones do sistema Apple). Muitos componentes aceitam props como `systemImage` ou `systemName`.

- Você pode consultar os nomes no app "SF Symbols" da Apple.
- Exemplo: `gear`, `person.fill`, `chevron.right`.

```tsx
import { Image } from '@expo/ui/swift-ui';

<Image systemName="star.fill" symbolVariant="fill" />
```
