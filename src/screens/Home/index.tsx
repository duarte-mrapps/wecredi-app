import { useLayoutEffect } from "react";
import { ScrollView, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

const Home = () => {

  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  useLayoutEffect(() => {
    navigation.setOptions({
      unstable_headerRightItems: () => [
        {
          sharesBackground: false,
          type: 'button',
          label: 'Heart',
          icon: { type: 'sfSymbol', name: 'creditcard' },
          variant: 'plain',
          onPress: () => { },
        },
        {
          type: 'spacing',
          spacing: 1,
        },
        {
          sharesBackground: false,
          type: 'button',
          label: 'Heart',
          icon: { type: 'sfSymbol', name: 'plus' },
          variant: 'plain',

          onPress: () => { },
        },
      ],

    });
  }, [navigation])

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
    >
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
        <Text>Acompanhe seus financiamentos e pagamentos</Text>
      </View>

      <View
        style={{
          backgroundColor: '#FF383C',
          height: 200,
          margin: 20,
          borderRadius: 10,
        }}
      />

      <View
        style={{
          backgroundColor: '#FF8D28',
          height: 200,
          margin: 20,
          borderRadius: 10,
        }}
      />

      <View
        style={{
          backgroundColor: '#FFCC01',
          height: 200,
          margin: 20,
          borderRadius: 10,
        }}
      />

      <View
        style={{
          backgroundColor: '#34C759',
          height: 200,
          margin: 20,
          borderRadius: 10,
        }}
      />

    </ScrollView>
  )
}

export default Home

