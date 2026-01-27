import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import { PlatformColor, View } from 'react-native';
import { GlassView } from 'expo-glass-effect';
import { useSystemColors, useSystemFonts } from '@/modules/rn-ios-system-tokens';

import { HomeStack, AccountStack, SettingsStack, SearchStack } from './stacks';
import { SFSymbol } from 'expo-symbols';

import {
  Host,
  HStack,
  Image,
  Label,
  List,
  Section,
  Spacer,
  Text,
} from '@expo/ui/swift-ui';

import {
  foregroundStyle,
  listRowBackground,
  tag,
} from '@expo/ui/swift-ui/modifiers';
import { useState } from 'react';

const Drawer = createDrawerNavigator();

type ListItem = {
  id: string;
  title: string;
  icon: SFSymbol;
  screen: string;
};


const CustomDrawerContent = (props: any) => {
  const [selectedItems, setSelectedItems] = useState<(string | number)[]>(["3"]);
  const getActiveRouteName = () => {
    const route = props.state.routes[props.state.index];
    return route.name;
  };

  const activeRoute = getActiveRouteName();

  const items: ListItem[] = [
    { id: '1', title: 'house', icon: 'house.fill', screen: 'Home' },
    { id: '2', title: 'Operações', icon: 'doc.text.fill', screen: 'Search' },
    { id: '3', title: 'Minha Conta', icon: 'person.fill', screen: 'Account' },
    { id: '4', title: 'Configurações', icon: 'gear', screen: 'Settings' },
    { id: '5', title: 'Sair', icon: 'arrow.left', screen: 'Login' },
  ];

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
              <Label
                title={items[0].title}
                systemImage={items[0].icon}

              />
            </List>



          </Host>
        </View>

      </GlassView>
    </DrawerContentScrollView >
  );
}

const SettingsRow = ({ icon, title, iconColor }: { icon: SFSymbol, title: string, iconColor?: string }) => {
  return (
    <HStack spacing={12} >
      <Image systemName={icon} size={24} modifiers={[foregroundStyle({ type: 'color', color: iconColor })]} />
      <Text>{title}</Text>
      <Spacer />
    </HStack>
  )
}

export const DrawerRoutes = () => {
  const systemFonts = useSystemFonts()
  const systemColors = useSystemColors()

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: 'permanent',
        drawerStyle: {
          backgroundColor: systemColors?.secondarySystemBackground,
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
