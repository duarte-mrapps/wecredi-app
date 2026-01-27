import React, { useLayoutEffect } from "react";
import { ScrollView, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

const Settings = () => {

  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Ajustes'
    });
  }, [navigation])

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
    >
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text>Settings</Text>
        <Text>Please use an iOS device to see the native SwiftUI version.</Text>
      </View>
    </ScrollView>
  )
}

export default Settings;
