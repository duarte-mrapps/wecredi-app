import * as SplashScreen from 'expo-splash-screen'

export async function bootstrapApp() {
  await SplashScreen.preventAutoHideAsync()

  // aqui você pode futuramente:
  // - carregar token
  // - validar sessão
  // - buscar config remota

  await new Promise(resolve => setTimeout(resolve, 300))

  await SplashScreen.hideAsync()
}
