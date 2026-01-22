import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Platform, KeyboardAvoidingView, TextInput, Text, Pressable, Alert } from 'react-native';
import { TitleFontSize, useColors, DescriptionFontSize, List, Button, Item, Icon } from 'react-native-ui-devkit';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const LoginAndroid = () => {
  const colors = useColors();
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Navigate to Main application flow
    navigation.replace('Main');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={{ flexGrow: 1, marginTop: 80 }}>
          <View style={{ alignItems: 'center' }}>
            <Text style={[TitleFontSize(2.5), { color: colors.text, fontWeight: 'bold', marginBottom: 4 }]}>
              WeCredi®
            </Text>
            <Text style={[DescriptionFontSize(1.1), { color: colors.secondary || '#888', textAlign: 'center' }]}>
              We buy, you use, and then it's yours.
            </Text>
          </View>

          <List
            data={[
              {
                component: (
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Email"
                    placeholderTextColor={colors.secondary || '#999'}
                    style={[styles.input, { color: colors.text }]}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                )
              },
              {
                component: (
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Senha"
                    placeholderTextColor={colors.secondary || '#999'}
                    style={[styles.input, { color: colors.text }]}
                    secureTextEntry
                  />
                )
              }
            ]}
          />

          <TouchableOpacity activeOpacity={0.6} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, padding: 16 }}>
            <Icon
              type="ionicons"
              name="information-circle"
              color={colors.primary}
              backgroundColor="transparent"
              size={24}
            />
            <Text style={[DescriptionFontSize(1.1), { color: colors.primary || '#888', textAlign: 'center' }]}>
              Esqueceu a senha?
            </Text>
          </TouchableOpacity>

          <Button
            blue
            data={{
              title: 'Entrar',
              onPress: handleLogin,
              style: { marginHorizontal: 8, paddingHorizontal: 0 }
            }}
          />

          <View style={{ flexDirection: 'column', gap: 8, padding: 28, marginTop: 'auto' }}>
            <Text style={[DescriptionFontSize(1.2), { color: colors.text, textAlign: 'center' }]}>
              Ao acessar, você concorda com nossos <Text suppressHighlighting onPress={() => { Alert.alert('Termos de Uso') }} style={{ color: colors.primary }}>Termos de Uso</Text> e <Text suppressHighlighting onPress={() => { Alert.alert('Política de Privacidade') }} style={{ color: colors.primary }}>Política de Privacidade</Text>
            </Text>
          </View>


        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
    justifyContent: 'center',
  },
  input: {
    fontSize: 16,

  },
  button: {
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  }
});
