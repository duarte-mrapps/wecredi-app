import React, { useLayoutEffect } from "react";
import { Alert, Platform, Pressable, ScrollView, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Icon } from "react-native-ui-devkit";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

const Search = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerSearchBarOptions: {
        placeholder: 'Search',
      },
    });
  }, [navigation])

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
    >
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Search</Text>
      </View>
    </ScrollView>
  )
}

export default Search

