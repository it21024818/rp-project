import React from "react";
import BerlinTabBarNavigator from "../components/navBottom/Tabs";
import { Ionicons as Icon } from "@expo/vector-icons";
import Home from "../screens/HomeScreen";
import Profile from "../screens/Profile";

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
    initialRouteName="Home"
    tabBarOptions={{
      labelStyle: { fontSize: 12, marginTop: 5, fontWeight: "bold" },
      activeTintColor: "#7A28CB",
      inactiveTintColor: "#9e9e9e",
      activeBackgroundColor: "#e5cfff",
      activeTabColor: "#7A28CB",
    }}
    appearance={{
      topPadding: 10,
      bottomPadding: 10,
      horizontalPadding: 10,
      tabBarBackground: "#ffffff",
    }}
  >
    <Tabs.Screen
      name="Home"
      component={Home}
      options={{
        tabBarIcon: ({ focused, color }: any) => (
          <TabBarIcon focused={focused} tintColor={color} name="home-sharp" />
        ),
      }}
    />
    {/* 
    <Tabs.Screen
      name="Schedule"
      component={Home}
      options={{
        tabBarIcon: ({ focused, color }: any) => (
          <TabBarIcon focused={focused} tintColor={color} name="time" />
        ),
      }}
    />
    <Tabs.Screen
      name="Tasks"
      component={Home}
      options={{
        tabBarIcon: ({ focused, color }: any) => (
          <TabBarIcon focused={focused} tintColor={color} name="list" />
        ),
      }}
    /> */}

    <Tabs.Screen
      name="Profile"
      component={Profile}
      options={{
        tabBarIcon: ({ focused, color }: any) => (
          <TabBarIcon focused={focused} tintColor={color} name="person" />
        ),
      }}
    />
  </Tabs.Navigator>
);
