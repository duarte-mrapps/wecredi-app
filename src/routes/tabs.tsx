import { createNativeBottomTabNavigator } from '@bottom-tabs/react-navigation';
import { HomeStack, AccountStack, SettingsStack, SearchStack } from './stacks';

const Tab = createNativeBottomTabNavigator();

export const Tabs = () => {
  return (
    <Tab.Navigator screenOptions={{}}>
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
  );
}
