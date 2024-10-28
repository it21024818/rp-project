import React from "react";
import BerlinTabBarNavigator from "../components/navBottom/Tabs";
import { Ionicons as Icon } from "@expo/vector-icons";
import Home from "../screens/HomeScreen";
import HistoryScreen from "../screens/HistoryScreen";
import Colors from "../constants/Colors";

const Tabs = BerlinTabBarNavigator();

const TabBarIcon = (props: any) => {
  return (
    <Icon
      name={props.name}
      size={props.size ? props.size : 24}
      color={props.tintColor}
    />
  );
};

export default () => (
  <Tabs.Navigator
    backBehavior="history"
    screenOptions={{
      animation: "slide_from_right",
    }}
    initialRouteName="PREDICT"
    tabBarOptions={{
      labelStyle: {
        marginTop: 5,
        fontWeight: "bold",
      },
      activeTintColor: Colors.primary,
      inactiveTintColor: "#9e9e9e",
      activeBackgroundColor: "#e5cfff",
      activeTabColor: Colors.primary,
    }}
    appearance={{
      topPadding: 10,
      bottomPadding: 10,
      horizontalPadding: 10,
      tabBarBackground: "#ffffff",
    }}
  >
    <Tabs.Screen
      name="PREDICT"
      component={Home}
      options={{
        tabBarIcon: ({ focused, color }: any) => (
          <TabBarIcon focused={focused} tintColor={color} name="newspaper" />
        ),
      }}
    />
    <Tabs.Screen
      name="HISTORY"
      component={HistoryScreen}
      options={{
        tabBarIcon: ({ focused, color }: any) => (
          <TabBarIcon focused={focused} tintColor={color} name="time" />
        ),
      }}
    />
  </Tabs.Navigator>
);
