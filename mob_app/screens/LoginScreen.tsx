import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import Spacing from "../constants/Spacing";
import FontSize from "../constants/FontSize";
import Colors from "../constants/Colors";
import Font from "../constants/Font";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import AppTextInput from "../components/AppTextInput";
import { useLoginMutation } from "../Redux/API/auth.api.slice";
import { useState } from "react";
import { HandleResult } from "../utils/HandleResults";
import Toast from "react-native-toast-message";
import PrimaryButton from "../components/PrimaryButton";
import Screen from "../components/Screen";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

const LoginScreen: React.FC<Props> = ({ navigation: { navigate } }) => {
  const [sendUserInfo, result] = useLoginMutation();
  const [data, setData] = useState({
    email: "Disirathihan@gmail.com",
    password: "12345678",
  });

  const handleChange = (name: any, text: any) => {
    setData({ ...data, [name]: text });
  };

  const handleLogin = async () => {
    sendUserInfo(data);
  };

  return (
    <Screen>
      <View style={{ flex: 1 }} />
      <View
        style={{
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 48,
            color: Colors.primary,
            fontFamily: Font["poppins-bold"],
          }}
        >
          LIGHTHOUSE
        </Text>
        <Text
          style={{
            fontFamily: Font["poppins-semiBold"],
            fontSize: FontSize.large,
            maxWidth: "60%",
            textAlign: "center",
          }}
        >
          Welcome back!
        </Text>
      </View>
      <View style={{ flex: 1 }} />
      <AppTextInput
        placeholder="Email"
        value={data.email}
        onChangeText={(text) => handleChange("email", text)}
      />
      <AppTextInput
        placeholder="Password"
        value={data.password}
        secureTextEntry
        onChangeText={(text) => handleChange("password", text)}
      />
      <View style={{ flex: 1 }} />
      <PrimaryButton
        label="Forgot your password?"
        onPress={() => navigate("ForgotPassword")}
        variant="TEXT"
      />
      <PrimaryButton label="Sign In" onPress={handleLogin} />
      <PrimaryButton
        label="Create new account"
        onPress={() => navigate("Register")}
        variant="SUBTLE"
      />
      <HandleResult result={result} />
    </Screen>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({});
