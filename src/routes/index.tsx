import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { isDeviceTablet } from '../utils';
import { DrawerRoutes } from './drawer';
import { Tabs } from './tabs';
import { Login } from '../screens/Login';

const MainRoutes = () => {
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

const Routes = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} options={{ presentation: 'formSheet' }} />
      <Stack.Screen name="Main" component={MainRoutes} />
    </Stack.Navigator>
  );
}

const Navigation = () => {
  return (
    <Routes />
  );
}

export default Navigation;
