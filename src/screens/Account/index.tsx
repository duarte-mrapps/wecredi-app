import React, { useLayoutEffect } from "react";
import { Alert, Platform, Pressable, ScrollView, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Icon } from "react-native-ui-devkit";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

const Home = () => {

  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerSearchBarOptions: {
        placeholder: 'Search',
      },
      unstable_headerRightItems: ({ tintColor }) => [
        {
          type: 'button',
          label: 'Heart',
          icon: {
            type: 'sfSymbol',
            name: 'gear',
          },
          tintColor,
          variant: 'prominent',
          onPress: () => {
            // Do something
          },
        },
      ],

    });
  }, [navigation])

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
    >
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Settings</Text>
      </View>
    </ScrollView>
  )
}

export default Home

