import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import Colors from "../constants/Colors";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import Welcome from "../screens/WelcomeScreen";
import Home from "../screens/HomeScreen";
import BottomTab from "./BottomTab";
import Settings from "../screens/Settings";
import { RootStackParamList } from "../types";
import HistoryScreen from "../screens/HistoryScreen";
import WelcomeScreen from "../screens/WelcomeScreen";
import PredictionScreen from "../screens/PredictionScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: Colors.background,
  },
};

export default function Navigation() {
  return (
    <NavigationContainer theme={theme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

const Stack = createNativeStackNavigator<RootStackParamList>();
``
function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="BottomTab" component={BottomTab} />
      <Stack.Screen name="Prediction" component={PredictionScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
}
