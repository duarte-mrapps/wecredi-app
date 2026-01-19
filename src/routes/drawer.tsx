import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { DescriptionFontSize, Item, List, MediumFontSize, TitleFontSize, useColors } from 'react-native-ui-devkit';
import { GlassView } from 'expo-glass-effect';
import { HomeStack, AccountStack, SettingsStack, SearchStack } from './stacks';
import { Alert, Image, Text, View } from 'react-native';

import userPlaceHolder from '../assets/user-placeholder.png';

const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props: any) => {
  const colors = useColors();

  const getActiveRouteName = () => {
    const route = props.state.routes[props.state.index];
    return route.name;
  };

  const activeRoute = getActiveRouteName();

  const isActive = (routeName: string) => activeRoute === routeName;

  const activeBackgroundColor = '#E0E0E0';

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{ flexGrow: 1, }}
      bounces={false}
    >
      <GlassView style={{ flex: 1, borderRadius: 20 }} >
        <View style={{ flexGrow: 1 }}>

          <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16, gap: 16 }}>
            <Image
              source={require('../assets/user-placeholder.png')}
              style={{ width: 70, height: 70, borderRadius: 70 }}
            />
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={[TitleFontSize(1.2), { color: colors.text, fontWeight: 'bold' }]}>
                Conta Wecredi
              </Text>
              <Text style={[DescriptionFontSize(1), { color: colors.text }]}>
                Inicie à sessão para acessar seus dados do iCloud, a App Store, serviços da Apple e mais
              </Text>
            </View>
          </View>

          <Item
            data={{
              title: 'Início',
              icon: { type: 'sfsymbol', name: 'gear', color: '#fff', size: 18 },
              color: isActive('Home') ? { title: colors.primary } : undefined,
              onPress: () => props.navigation.navigate('Home'),
            }}
            style={isActive('Home') ? { backgroundColor: activeBackgroundColor } : undefined}
          />

          <List
            data={[
              {
                title: 'Conta',
                icon: { type: 'sfsymbol', name: 'person', color: '#fff', size: 18, backgroundColor: '#FF383C' },
                onPress: () => props.navigation.navigate('Account'),
                color: isActive('Account') ? { title: colors.primary } : undefined,
                style: isActive('Account') ? { backgroundColor: activeBackgroundColor } : undefined
              },
              {
                title: 'Configurações',
                icon: { type: 'sfsymbol', name: 'gear', color: '#fff', size: 18, backgroundColor: colors.primary },
                onPress: () => props.navigation.navigate('Settings'),
                color: isActive('Settings') ? { title: colors.primary } : undefined,
                style: isActive('Settings') ? { backgroundColor: activeBackgroundColor } : undefined
              },
              {
                title: 'Busca',
                icon: { type: 'sfsymbol', name: 'magnifyingglass', color: '#fff', size: 18, backgroundColor: '#6155F5' },
                onPress: () => props.navigation.navigate('Search'),
                color: isActive('Search') ? { title: colors.primary } : undefined,
                style: isActive('Search') ? { backgroundColor: activeBackgroundColor } : undefined
              }
            ]}
          />
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
