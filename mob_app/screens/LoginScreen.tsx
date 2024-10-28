import {
  Image,
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
import { useAppDispatch } from "../hooks/redux-hooks";
import { setUser } from "../Redux/slices/userSlice";
import { useToast } from "native-base";
import ToastAlert from "../components/ToastAlert";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

const LoginScreen: React.FC<Props> = ({ navigation: { navigate } }) => {
  const dispatch = useAppDispatch();
  const toast = useToast();
  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const [data, setData] = useState({
    email: "it21058578@my.sliit.lk",
    password: "password",
  });

  const isLoading = isLoginLoading;

  const handleChange = (name: any, text: any) => {
    setData({ ...data, [name]: text });
  };

  const handleLogin = async () => {
    try {
      const loginResult = await login(data).unwrap();
      dispatch(setUser(loginResult));
      navigate("BottomTab");
    } catch (error) {
      toast.show({
        placement: "bottom",
        render: () => (
          <ToastAlert
            title="Failed to Login"
            description={(error as any)?.data.message}
            type="error"
          />
        ),
      });
    }
  };

  return (
    <Screen>
      <View
        style={{
          alignItems: "center",
        }}
      >
        <Image
          style={{ width: 256, height: 256 }}
          resizeMode="contain"
          source={require("../assets/images/logo.png")}
        />
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
        editable={!isLoading}
        placeholder="Email"
        value={data.email}
        onChangeText={(text) => handleChange("email", text)}
      />
      <AppTextInput
        editable={!isLoading}
        placeholder="Password"
        value={data.password}
        secureTextEntry
        onChangeText={(text) => handleChange("password", text)}
      />
      <View style={{ flex: 1 }} />
      <PrimaryButton
        isLoading={isLoading}
        label="Forgot your password?"
        onPress={() => navigate("ForgotPassword")}
        variant="TEXT"
      />
      <PrimaryButton
        isLoading={isLoading}
        label="Sign In"
        onPress={handleLogin}
      />
      <PrimaryButton
        isLoading={isLoading}
        label="Create new account"
        onPress={() => navigate("Register")}
        variant="SUBTLE"
      />
    </Screen>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({});
