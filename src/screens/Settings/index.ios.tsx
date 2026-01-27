import React, { useLayoutEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { SFSymbol } from 'expo-symbols';
import { useSystemColors, useSystemFonts } from '@/modules/rn-ios-system-tokens';

import {
  Host,
  List,
  Section,
  Text,
  Toggle,
  Image,
  HStack,
  VStack,
  Spacer,
  Button
} from '@expo/ui/swift-ui';

import {
  listStyle,
  font,
  foregroundStyle,
  background,
  cornerRadius,
  frame,
  padding,
} from '@expo/ui/swift-ui/modifiers';

// --- Custom Components ---

type SettingsIconProps = {
  icon: SFSymbol;
  color: string;
  size?: number;
};

const SettingsIcon = ({ icon, color, size = 16 }: SettingsIconProps) => (
  <Image
    systemName={icon}
    color={'white'}
    size={size}
    modifiers={[
      frame({ width: 28, height: 28, alignment: 'center' }),
      background(color),
      cornerRadius(6)
    ]}
  />
);

// --- Main Screen ---

export default function Settings() {
  const navigation = useNavigation();
  const colors = useSystemColors();

  const [airplaneMode, setAirplaneMode] = useState(false);


  return (
    <Host style={{ flex: 1 }}>
      <List modifiers={[listStyle('insetGrouped')]}>

        {/* --- Profile Section --- */}
        <Section>
          <Button onPress={() => { }}>
            <HStack spacing={12} alignment="center" modifiers={[padding({ vertical: 4 })]}>
              <Image
                systemName="person.crop.circle" // Placeholder for actual avatar
                size={60}
                color="#8E8E93"
              />
              <VStack spacing={4} alignment="leading">
                <Text modifiers={[font({ size: 20, weight: 'regular' })]}>
                  Lucas Duarte
                </Text>
                <Text modifiers={[
                  font({ size: 13 }),
                  foregroundStyle(colors?.secondaryLabel || 'gray')
                ]}>
                  Conta Apple, iCloud e mais
                </Text>
              </VStack>
              <Spacer />
              <Image
                systemName="chevron.right"
                size={14}
                color={colors?.tertiaryLabel || '#C7C7CC'}
              />
            </HStack>
          </Button>

          <Button onPress={() => { }}>
            <HStack spacing={16} alignment="center">
              <HStack spacing={-12}>
                <Image
                  systemName="person.crop.circle.fill"
                  size={28}
                  color="#FF375F"
                />
                <Image
                  systemName="person.crop.circle.fill"
                  size={28}
                  color="#FF9500"
                />
              </HStack>
              <Text>Família</Text>
              <Spacer />
              <Image
                systemName="chevron.right"
                size={14}
                color={colors?.tertiaryLabel || '#C7C7CC'}
              />
            </HStack>
          </Button>
        </Section>

        {/* --- Connectivity Section --- */}
        <Section>
          <Toggle
            isOn={airplaneMode}
            onIsOnChange={setAirplaneMode}
          >
            <HStack spacing={12}>
              <SettingsIcon icon="airplane" color="#FF9500" />
              <Text>Modo Avião</Text>
            </HStack>
          </Toggle>

          <Button onPress={() => { }}>
            <HStack spacing={12}>
              <SettingsIcon icon="wifi" color="#007AFF" />
              <Text>Wi-Fi</Text>
              <Spacer />
              <Text modifiers={[foregroundStyle(colors?.secondaryLabel || 'gray')]}>
                ALEXANDRE
              </Text>
              <Image
                systemName="chevron.right"
                size={14}
                color={colors?.tertiaryLabel || '#C7C7CC'}
              />
            </HStack>
          </Button>

          <Button onPress={() => { }}>
            <HStack spacing={12}>
              <SettingsIcon icon="network" color="#007AFF" />
              <Text>Bluetooth</Text>
              <Spacer />
              <Text modifiers={[foregroundStyle(colors?.secondaryLabel || 'gray')]}>
                Ativado
              </Text>
              <Image
                systemName="chevron.right"
                size={14}
                color={colors?.tertiaryLabel || '#C7C7CC'}
              />
            </HStack>
          </Button>

          <Button onPress={() => { }}>
            <HStack spacing={12}>
              <SettingsIcon icon="antenna.radiowaves.left.and.right" color="#34C759" />
              <Text>Celular</Text>
              <Spacer />
              <Text modifiers={[foregroundStyle(colors?.secondaryLabel || 'gray')]}>
                Desativado
              </Text>
              <Image
                systemName="chevron.right"
                size={14}
                color={colors?.tertiaryLabel || '#C7C7CC'}
              />
            </HStack>
          </Button>

          <Button onPress={() => { }}>
            <HStack spacing={12}>
              <SettingsIcon icon="personalhotspot" color="#34C759" size={14} />
              <Text>Acesso Pessoal</Text>
              <Spacer />
              <Text modifiers={[foregroundStyle(colors?.secondaryLabel || 'gray')]}>
                Desativado
              </Text>
              <Image
                systemName="chevron.right"
                size={14}
                color={colors?.tertiaryLabel || '#C7C7CC'}
              />
            </HStack>
          </Button>

          <Button onPress={() => { }}>
            <HStack spacing={12}>
              <SettingsIcon icon="battery.100" color="#34C759" size={14} />
              <Text>Bateria</Text>
              <Spacer />
              <Image
                systemName="chevron.right"
                size={14}
                color={colors?.tertiaryLabel || '#C7C7CC'}
              />
            </HStack>
          </Button>
        </Section>

        {/* --- General Section --- */}
        <Section>
          <Button onPress={() => { }}>
            <HStack spacing={12}>
              <SettingsIcon icon="gear" color="#8E8E93" />
              <Text>Geral</Text>
              <Spacer />
              <Image
                systemName="chevron.right"
                size={14}
                color={colors?.tertiaryLabel || '#C7C7CC'}
              />
            </HStack>
          </Button>

          <Button onPress={() => { }}>
            <HStack spacing={12}>
              <SettingsIcon icon="accessibility" color="#007AFF" />
              <Text>Acessibilidade</Text>
              <Spacer />
              <Image
                systemName="chevron.right"
                size={14}
                color={colors?.tertiaryLabel || '#C7C7CC'}
              />
            </HStack>
          </Button>
        </Section>

      </List>
    </Host>
  );
}
