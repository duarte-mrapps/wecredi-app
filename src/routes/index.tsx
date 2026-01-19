import { useEffect } from 'react';
import { DeviceEventEmitter, View, useColorScheme } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeBottomTabNavigator } from '@bottom-tabs/react-navigation';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

import Home from '../screens/Home';
import Account from '../screens/Account';
import { isDeviceTablet } from '../utils';
import Settings from '../screens/Settings';
import Search from '../screens/Search';

const Stack = createNativeStackNavigator();
const Tab = createNativeBottomTabNavigator();
const Drawer = createDrawerNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={Home}
        options={{
          title: 'Home',
          headerLargeTitle: true,
        }}
      />
    </Stack.Navigator>
  );
}

const AccountStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Account"
        component={Account}
        options={{
          title: 'Conta',
          headerLargeTitle: true,
        }}
      />
    </Stack.Navigator>
  );
}

const SettingsStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Settings"
        component={Settings}
        options={{
          title: 'Configurações',
          headerLargeTitle: true,
        }}
      />
    </Stack.Navigator>
  );
}

const SearchStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Search"
        component={Search}
        options={{
          title: 'Busca',
          headerLargeTitle: true,
        }}
      />
    </Stack.Navigator>
  );
}

const Tabs = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const navigateListener = DeviceEventEmitter.addListener('navigate', navigateHandleEvent);

    return () => navigateListener.remove();
  }, []);

  useEffect(() => {
    const navigateListener = DeviceEventEmitter.addListener('navigationGoBack', (e) => {
      navigation.goBack()
    });

    return () => navigateListener.remove();
  }, []);

  const canGoBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      canGoBack();
    }
  }

  const navigateHandleEvent = (e: any) => {
    if (isDeviceTablet) { navigation?.canGoBack() && navigation?.goBack(); }

    if (isDeviceTablet &&
      (e.screen == 'MainTab'
        || e.screen == 'SearchTab'
        || e.screen == 'Favorites'
        || e.screen == 'AboutUs'
        || e.screen == 'AboutUsStores'
        || e.screen == 'AccountSettings')
    ) {
      canGoBack();
      navigation.setParams({ screen: e.screen, params: e.params } as any);
    } else {
      navigation.navigate(e.screen as never, e.params as never);
    }
  }

  return (
    <Tab.Navigator
      screenOptions={{

      }}

    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarIcon: () => ({ sfSymbol: 'book' }),
        }}
      />
      <Tab.Screen
        name="Account"
        component={AccountStack}
        options={{
          tabBarIcon: () => ({ sfSymbol: 'person' }),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsStack}
        options={{
          tabBarIcon: () => ({ sfSymbol: 'gear' }),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchStack}
        options={{
          tabBarIcon: () => ({ sfSymbol: 'magnifyingglass' }),
          role: 'search'
        }}
      />
    </Tab.Navigator>
  )
}

const DrawerRoutes = () => {
  return (
    <Drawer.Navigator screenOptions={{ headerShown: false, drawerType: 'permanent' }}>
      <Drawer.Screen name="Home" component={HomeStack} />
      <Drawer.Screen name="Account" component={AccountStack} />
      <Drawer.Screen name="Settings" component={SettingsStack} />
      <Drawer.Screen name="Search" component={SearchStack} />
    </Drawer.Navigator>
  );
}

const RenderRoutes = () => {
  useColorScheme();

  const Stack = createNativeStackNavigator();

  if (isDeviceTablet) {
    return (
      <NavigationContainer>
        <DrawerRoutes />
      </NavigationContainer>
    )
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          orientation: 'portrait',
          gestureEnabled: true
        }}
      >
        <Stack.Screen name="Init" component={Tabs} options={{ title: 'Wecredi' }} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default function ClientRoutes() {
  return (
    <View style={{ flex: 1, flexDirection: 'row' }}>
      <RenderRoutes />
    </View>
  );
}
