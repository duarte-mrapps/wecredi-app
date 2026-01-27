# @expo/ui/jetpack-compose

Construa interfaces nativas Android usando a API declarativa do Jetpack Compose, diretamente do React Native.

## 🚀 Começando

A biblioteca expõe componentes como `Row`, `Column`, `Box` e um sistema de **Modificadores** que mapeia para o `Modifier` do Compose.

### Instalação

```bash
npm install @expo/ui
# Certifique-se de configurar o Android Build para suportar Kotlin/Compose se necessário.
```

### Exemplo Básico

```tsx
import { Host, Column, Text, Button } from '@expo/ui/jetpack-compose';
import { paddingAll, background } from '@expo/ui/jetpack-compose/modifiers';

export default function App() {
  return (
    // Host é obrigatório
    <Host style={{ flex: 1 }}>
      <Column modifiers={[paddingAll(16)]}>
        <Text modifiers={[paddingAll(8)]}>
          Olá, Jetpack Compose!
        </Text>

        <Button onPress={() => console.log('Click')}>
          Clique Aqui
        </Button>
      </Column>
    </Host>
  );
}
```

## 📚 Documentação

- **[Conceitos Core](concepts.md)**: Entenda `Host`, Composables e Modifiers no Android.
- **Componentes**:
  - **[Layout](components/layout.md)**: `Column`, `Row`, `Box` (substituem VStack, HStack, ZStack).
  - **[Formulários & Inputs](components/form.md)**: `TextInput`, `Button`, `Switch`, `Slider`.
  - **[Display](components/display.md)**: `Text`, `Chip`, `Progress`.
- **[Modificadores](modifiers.md)**: `padding`, `fillMaxSize`, `background`, `clickable`...
