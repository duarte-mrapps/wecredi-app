import { useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { isLiquidGlassAvailable } from 'expo-glass-effect';
import { View, PlatformColor, Alert, Text as RNText } from 'react-native';

import {
  Host,
  TextField,
  VStack,
  Text,
  SecureField,
  Form,
  Section,
  Button,
  Spacer,
  TextFieldRef,
  HStack,
  Image,
} from '@expo/ui/swift-ui';

import {
  buttonStyle,
  controlSize,
  font,
  foregroundStyle,
  frame,
  listRowBackground,
  listSectionSpacing,
  padding,
  scrollDismissesKeyboard,
  scrollDisabled,
  submitLabel,
  listRowInsets,
  background
} from '@expo/ui/swift-ui/modifiers';
import { DescriptionFontSize } from 'react-native-ui-devkit';
import { SafeAreaView } from 'react-native-safe-area-context';

export const Login = () => {
  const navigation = useNavigation<any>();

  const emailRef = useRef<TextFieldRef>(null)
  const passwordRef = useRef<TextFieldRef>(null)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // if (!email || !password) {
    //   Alert.alert('Voce precisa digitar sua conta WeCredi e a sua senha para continuar');
    //   return;
    // }
    navigation.replace('Main');
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>

      <Host style={{ flex: 1 }}>
        <Form modifiers={[scrollDisabled(true), scrollDismissesKeyboard('interactively')]}>
          <Section
            modifiers={[
              listRowBackground(PlatformColor('clear')),
              padding({ vertical: 10 }),
            ]}
          >
            <VStack spacing={10}>
              <Spacer minLength={40} />
              <Text
                modifiers={[
                  font({ size: 44, weight: 'bold' }),
                  frame({ maxWidth: Infinity, alignment: 'center' }),
                ]}
              >
                WeCredi®
              </Text>
              <Text
                modifiers={[
                  font({ size: 17 }),
                  foregroundStyle({ type: 'color', color: PlatformColor('secondaryLabel') }),
                  frame({ maxWidth: Infinity, alignment: 'center' }),
                ]}
              >
                We buy, you use, and then it's yours
              </Text>
            </VStack>
          </Section>

          <Section
            modifiers={[
              listSectionSpacing('compact'),
            ]}
          >
            <TextField
              defaultValue={email}
              placeholder='Email'
              keyboardType='email-address'
              onChangeText={setEmail}
              ref={emailRef}
              onSubmit={() => passwordRef.current?.focus()}
              modifiers={[
                submitLabel('next')
              ]}
            />
            <SecureField
              defaultValue={password}
              placeholder='Senha'
              onChangeText={setPassword}
              ref={passwordRef}
              onSubmit={handleLogin}
              modifiers={[
                submitLabel('go')
              ]}
            />
          </Section>

          <Section
            modifiers={[
              listSectionSpacing('compact'),
              listRowBackground(PlatformColor('clear')),
              listRowInsets({ leading: -1 }),
            ]}
          >
            <Button
              onPress={() => { }}
              modifiers={[
                padding({ horizontal: 0, leading: 0 }),
              ]}
            >
              <HStack spacing={10}>
                <Image systemName='info.circle.fill' />
                <Text
                  modifiers={[
                    font({ size: 17 }),
                  ]}
                >
                  Esqueci a senha
                </Text>
              </HStack>
            </Button>
          </Section>

          <Section
            modifiers={[
              listSectionSpacing('compact'),
            ]}
          >
            <Button
              onPress={handleLogin}
              modifiers={[
                buttonStyle(isLiquidGlassAvailable() ? 'glassProminent' : 'borderedProminent'),
                listRowBackground(PlatformColor('clear')),
                controlSize('large'),
              ]}
            >
              <Text
                modifiers={[
                  frame({ maxWidth: Infinity }),
                ]}
              >
                Entrar
              </Text>
            </Button>
          </Section>
        </Form>
      </Host>

      <View style={{ flexDirection: 'column', gap: 8, padding: 28, marginTop: 'auto' }}>
        <RNText style={[DescriptionFontSize(1.2), { color: PlatformColor('secondaryLabel'), textAlign: 'center' }]}>
          Ao acessar, você concorda com nossos <RNText suppressHighlighting onPress={() => { Alert.alert('Termos de Uso') }} style={{ color: PlatformColor('systemBlue') }}>Termos de Uso</RNText> e <RNText suppressHighlighting onPress={() => { Alert.alert('Política de Privacidade') }} style={{ color: PlatformColor('systemBlue') }}>Política de Privacidade</RNText>
        </RNText>
      </View>
    </SafeAreaView>

  );
};

