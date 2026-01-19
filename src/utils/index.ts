import { Dimensions } from 'react-native'
import { isTablet } from 'react-native-device-info'

export const isDeviceTablet = isTablet() || Dimensions.get('window').width >= 768
