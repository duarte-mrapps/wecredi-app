import { DefaultTheme, DarkTheme, NavigationContainer } from '@react-navigation/native';
import Navigation from '../routes';
import { RNUIDevKitProvider } from 'react-native-ui-devkit';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';

const App = () => {
  const scheme = useColorScheme();

  return (
    <RNUIDevKitProvider theme={scheme === 'dark' ? 'dark' : 'light'}>
      <SafeAreaProvider>
        <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Navigation />
        </NavigationContainer>
      </SafeAreaProvider>
    </RNUIDevKitProvider>
  )
}

export default App;
