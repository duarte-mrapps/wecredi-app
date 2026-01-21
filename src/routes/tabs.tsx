import React, { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { createNativeBottomTabNavigator } from '@bottom-tabs/react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { HomeStack, AccountStack, SettingsStack, SearchStack } from './stacks';

const Tab = createNativeBottomTabNavigator();

export const Tabs = () => {
  const [icons, setIcons] = useState<any>(null);

  useEffect(() => {
    if (Platform.OS !== 'android') return;

    Promise.all([
      Ionicons.getImageSource('book-outline', 24),
      Ionicons.getImageSource('person-outline', 24),
      Ionicons.getImageSource('settings-outline', 24),
      Ionicons.getImageSource('search-outline', 24),
    ]).then(([book, person, settings, search]) => {
      setIcons({ book, person, settings, search });
    });
  }, []);

  if (Platform.OS === 'android' && !icons) {
    return null;
  }

  return (
    <Tab.Navigator screenOptions={{}}>
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          title: 'Visão Geral',
          tabBarIcon: () => Platform.OS === 'ios' ? { sfSymbol: 'house' } : icons?.book,
        }}
      />
      <Tab.Screen
        name="Account"
        component={AccountStack}
        options={{
          title: 'Operações',
          tabBarIcon: () => Platform.OS === 'ios' ? { sfSymbol: 'text.document' } : icons?.person,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsStack}
        options={{
          title: 'Minha Área',
          tabBarIcon: () => Platform.OS === 'ios' ? { sfSymbol: 'person' } : icons?.settings,
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchStack}
        options={{
          tabBarIcon: () => Platform.OS === 'ios' ? { sfSymbol: 'magnifyingglass' } : icons?.search,
          role: 'search'
        }}
      />
    </Tab.Navigator>
  );
}
