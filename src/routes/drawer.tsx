import React from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';

import { Platform, PlatformColor, useColorScheme, View } from 'react-native';
import { useColors, Icon } from 'react-native-ui-devkit';
import { GlassView } from 'expo-glass-effect';
import { HomeStack, AccountStack, SettingsStack, SearchStack } from './stacks';
import { Host, HStack, Image, List, Section, Text, VStack } from '@expo/ui/swift-ui';
import { font, foregroundStyle, frame, } from '@expo/ui/swift-ui/modifiers';
import { useSystemFonts } from '@/modules/rn-ios-system-tokens';

const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props: any) => {
  const colors = useColors();
  const isDark = useColorScheme() === 'dark';
  const fonts = useSystemFonts()
  const platform = Platform.OS == 'ios' ? 'ios' : 'android';

  const getActiveRouteName = () => {
    const route = props.state.routes[props.state.index];
    return route.name;
  };

  const activeRoute = getActiveRouteName();

  const isActive = (routeName: string) => activeRoute === routeName;

  const activeBackgroundColor = isDark ? '#2C2C2C' : '#E0E0E0';

  type IconProps = React.ComponentProps<typeof Icon>;

  type PlatformIcons = {
    ios: IconProps
    android: IconProps
  }

  const icons: Record<string, PlatformIcons> = {
    home: {
      ios: { type: 'sfsymbol', name: 'house', color: '#fff', size: 18, backgroundColor: colors.primary },
      android: { type: 'ionicons', name: 'home-outline', color: '#fff', size: 18, backgroundColor: colors.primary },
    },
    account: {
      ios: { type: 'sfsymbol', name: 'person', color: '#fff', size: 18, backgroundColor: colors.secondary },
      android: { type: 'material', name: 'account-circle', color: '#fff', size: 18, backgroundColor: colors.secondary },
    },
    settings: {
      ios: { type: 'sfsymbol', name: 'gear', color: '#fff', size: 18, backgroundColor: colors.notification },
      android: { type: 'material', name: 'settings', color: '#fff', size: 18, backgroundColor: colors.notification },
    },
    search: {
      ios: { type: 'sfsymbol', name: 'magnifyingglass', color: '#fff', size: 18, backgroundColor: colors.secondary },
      android: { type: 'material', name: 'search', color: '#fff', size: 18, backgroundColor: colors.secondary },
    },
  }

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{ flexGrow: 1, }}
      bounces={false}
    >
      <GlassView style={{ flex: 1, borderRadius: 20 }} glassEffectStyle='regular' >
        <View style={{ flexGrow: 1 }}>
          <Host style={{ flex: 1 }}>
            <List>
              <Section>
                <HStack spacing={12}>
                  <Image
                    systemName='person.crop.circle.fill'
                    size={60}
                    modifiers={[
                      frame({ width: 60, height: 60 }),
                      foregroundStyle({ type: 'color', color: PlatformColor('systemBlue') })
                    ]}
                  />
                  <VStack alignment='leading' spacing={4}>
                    <Text
                      modifiers={[font({ size: fonts?.largeTitle.fontSize, weight: fonts?.largeTitle.fontWeight })]}
                    >
                      Conta WeCredi
                    </Text>
                    <Text>Inicie à sessão para acessar seus dados do iCloud, a App Store, serviços da Apple e mais</Text>
                  </VStack>
                </HStack>
              </Section>
            </List>
          </Host>

        </View>

      </GlassView>
    </DrawerContentScrollView>
  );
}

export const DrawerRoutes = () => {
  const colors = useColors();

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: 'permanent',
        drawerStyle: {
          backgroundColor: colors.background,
          borderRightWidth: 0,
        }
      }}
    >
      <Drawer.Screen name="Home" component={HomeStack} />
      <Drawer.Screen name="Account" component={AccountStack} />
      <Drawer.Screen name="Settings" component={SettingsStack} />
      <Drawer.Screen name="Search" component={SearchStack} />
    </Drawer.Navigator>
  );
}
