import { NavigationContainer } from '@react-navigation/native';
import Navigation from '../routes';
import { RNUIDevKitProvider } from 'react-native-ui-devkit';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const App = () => {
  return (
    <RNUIDevKitProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <Navigation />
        </NavigationContainer>
      </SafeAreaProvider>
    </RNUIDevKitProvider>
  )
}

export default App;
