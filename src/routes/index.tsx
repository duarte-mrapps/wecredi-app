import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { isDeviceTablet } from '../utils';
import { DrawerRoutes } from './drawer';
import { Tabs } from './tabs';

const Routes = () => {
  const Stack = createNativeStackNavigator();

  if (isDeviceTablet) {
    return (
      <DrawerRoutes />
    )
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        orientation: 'portrait',
        gestureEnabled: true
      }}
    >
      <Stack.Screen name="Init" component={Tabs} options={{ title: 'Wecredi' }} />
    </Stack.Navigator>
  )
}

const Navigation = () => {
  return (
    <Routes />
  );
}

export default Navigation;
