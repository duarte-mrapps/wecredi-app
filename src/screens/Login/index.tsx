import { Platform } from "react-native";
import { LoginIos } from "./index.ios";
import { LoginAndroid } from "./index.android";

const Login = () => {
  if (Platform.OS === 'ios') {
    return <LoginIos />;
  }
  return <LoginAndroid />;
};

export default Login;
