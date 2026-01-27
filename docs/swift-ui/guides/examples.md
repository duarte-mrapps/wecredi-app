# Exemplos Práticos

## Tela de Configurações ("Settings")

Um exemplo clássico usando `List`, `Section` e navegação.

```tsx
import { Host, List, Section, Toggle, Label, Picker, Text } from '@expo/ui/swift-ui';
import { listStyle, pickerStyle } from '@expo/ui/swift-ui/modifiers';
import { useState } from 'react';

export default function SettingsScreen() {
  const [airplaneMode, setAirplaneMode] = useState(false);
  const [wifi, setWifi] = useState(true);
  const [theme, setTheme] = useState(0);

  return (
    <Host style={{ flex: 1 }}>
      <List modifiers={[listStyle('insetGrouped')]}>

        <Section>
          <Toggle
            isOn={airplaneMode}
            onIsOnChange={setAirplaneMode}
            label="Modo Avião"
            systemImage="airplane"
          />
          <Label
            title="Wi-Fi"
            subtitle={wifi ? "Conectado" : "Desligado"}
            systemImage="wifi"
          />
        </Section>

        <Section header="Aparência">
          <Picker
            label="Tema"
            selection={theme}
            onSelectionChange={setTheme}
            modifiers={[pickerStyle('menu')]}
          >
            <Text modifiers={[tag(0)]}>Claro</Text>
            <Text modifiers={[tag(1)]}>Escuro</Text>
            <Text modifiers={[tag(2)]}>Automático</Text>
          </Picker>
        </Section>

      </List>
    </Host>
  );
}
```

## Tela de Login

Exemplo usando `VStack`, `TextField` e `Button`.

```tsx
import { Host, VStack, TextField, SecureField, Button, Text } from '@expo/ui/swift-ui';
import {
  font,
  controlSize,
  buttonStyle,
  padding,
  frame
} from '@expo/ui/swift-ui/modifiers';
import { useState } from 'react';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <Host style={{ flex: 1, justifyContent: 'center' }}>
      <VStack spacing={20} modifiers={[padding({ horizontal: 20 })]}>

        <Text modifiers={[font({ size: 32, weight: 'bold' })]}>
          Bem-vindo
        </Text>

        <TextField
          placeholder="Email"
          defaultValue={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          modifiers={[padding({ all: 10 }), background('#f2f2f7'), cornerRadius(10)]}
        />

        <SecureField
          placeholder="Senha"
          defaultValue={password}
          onChangeText={setPassword}
          modifiers={[padding({ all: 10 }), background('#f2f2f7'), cornerRadius(10)]}
        />

        <Button
          label="Entrar"
          onPress={() => alert('Login!')}
          modifiers={[
            buttonStyle('borderedProminent'),
            controlSize('large'),
            frame({ maxWidth: Infinity }) // Botão largura total
          ]}
        />

      </VStack>
    </Host>
  );
}
```
