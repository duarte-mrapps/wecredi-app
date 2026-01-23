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
  multilineTextAlignment
} from '@expo/ui/swift-ui/modifiers';
import { DescriptionFontSize } from 'react-native-ui-devkit';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSystemFonts, useSystemColors } from '@/modules/rn-ios-system-tokens';

export const Login = () => {
  const navigation = useNavigation<any>();
  const systemFonts = useSystemFonts();
  const systemColors = useSystemColors();

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
                  font({ size: systemFonts?.largeTitle.fontSize, weight: 'bold' }),
                  frame({ maxWidth: Infinity, alignment: 'center' }),
                  foregroundStyle({ type: 'color', color: systemColors?.label }),
                ]}
              >
                WeCredi®
              </Text>
              <Text
                modifiers={[
                  font({ size: systemFonts?.headline.fontSize, weight: systemFonts?.headline.fontWeight }),
                  foregroundStyle({ type: 'color', color: systemColors?.secondaryLabel }),
                  // foregroundStyle({ type: 'color', color: PlatformColor('secondaryLabel') }),
                  frame({ maxWidth: Infinity, alignment: 'center' }),
                  multilineTextAlignment('center')
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
                    font({ size: systemFonts?.body.fontSize, weight: systemFonts?.body.fontWeight }),
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
                  font({ size: systemFonts?.body.fontSize, weight: systemFonts?.body.fontWeight }),
                ]}
              >
                Entrar
              </Text>
            </Button>
          </Section>
        </Form>
      </Host>

      <View style={{ flexDirection: 'column', gap: 8, padding: 28, marginTop: 'auto' }}>
        <RNText
          style={[
            { fontSize: systemFonts?.callout.fontSize, color: systemColors?.secondaryLabel, textAlign: 'center' }
          ]}
        >
          Ao acessar, você concorda com nossos <RNText
            suppressHighlighting
            onPress={() => { Alert.alert('Termos de Uso') }}
            style={{ color: systemColors?.link }}>
            Termos de Uso
          </RNText> e <RNText
            suppressHighlighting
            onPress={() => { Alert.alert('Política de Privacidade') }}
            style={{ color: systemColors?.link }}>
            Política de Privacidade
          </RNText>
        </RNText>
      </View>
    </SafeAreaView>

  );
};

