import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from '../screens/Home';
import Account from '../screens/Account';
import Settings from '../screens/Settings';
import Search from '../screens/Search';

const Stack = createNativeStackNavigator();

export const HomeStack = () => {
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

export const AccountStack = () => {
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

export const SettingsStack = () => {
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

export const SearchStack = () => {
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
