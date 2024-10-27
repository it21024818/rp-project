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
import { useRegisterMutation } from "../Redux/api/auth.api.slice";
import { useState } from "react";
import { HandleResult } from "../utils/HandleResults";
import { ScrollView } from "react-native";
import Toast from "react-native-toast-message";
import { useNavigate } from "react-router-dom";
import { useNavigation } from "@react-navigation/native";
import PrimaryButton from "../components/PrimaryButton";
import { Color } from "../Styles/GlobalStyles";
import Screen from "../components/Screen";
import { useToast } from "native-base";
import ToastAlert from "../components/ToastAlert";

type Props = NativeStackScreenProps<RootStackParamList, "Register">;

const RegisterScreen: React.FC<Props> = ({ navigation: { navigate } }) => {
  const navigation = useNavigation();
  const toast = useToast();
  const [register, { isLoading: isRegisterLoading }] = useRegisterMutation();
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    matchPassword: "",
    password: "",
  });

  const isAnyFieldEmpty = Object.values(data).some(
    (val) => val.trim().length < 1
  );

  const handleChange = (name: any, text: any) => {
    setData({ ...data, [name]: text });
  };

  const handleRegister = async () => {
    try {
      const errors: string[] = [];
      if (data.email) {
        const isValid = String(data.email)
          .toLowerCase()
          .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          );
        if (!isValid) {
          errors.push("Email is in incorrect format");
        }
      }

      if (data.matchPassword !== data.password) {
        errors.push("Passwords do not match");
      }

      if (errors.length > 0) {
        toast.show({
          placement: "bottom",
          render: () => (
            <ToastAlert
              title="Form is incomplete"
              description={errors.join("\n")}
              type="error"
            />
          ),
        });
      } else {
        await register(data).unwrap();
        toast.show({
          placement: "bottom",
          render: () => (
            <ToastAlert
              title="Registration Successful"
              description={`You will receive an email at\n${data?.email?.toLowerCase()}\nwith further instructions`}
              type="info"
            />
          ),
        });
        navigate("Login");
      }
    } catch (error) {
      toast.show({
        placement: "bottom",
        render: () => (
          <ToastAlert
            title="Failed to Register"
            description={(error as any)?.data.message}
            type="error"
          />
        ),
      });
      console.error(error);
    }
  };

  return (
    <Screen>
      <View
        style={{
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: FontSize.xLarge,
            color: Colors.primary,
            fontFamily: Font["poppins-bold"],
            marginVertical: Spacing * 3,
          }}
        >
          Create account
        </Text>
        <Text
          style={{
            fontFamily: Font["poppins-regular"],
            fontSize: FontSize.small,
            textAlign: "center",
          }}
        >
          Create an account to start detecting fake news
        </Text>
      </View>
      <View style={{ flex: 1 }} />
      <AppTextInput
        placeholder="First Name"
        onChangeText={(text) => handleChange("firstName", text)}
      />
      <AppTextInput
        placeholder="Last Name"
        onChangeText={(text) => handleChange("lastName", text)}
      />
      <AppTextInput
        placeholder="Email"
        onChangeText={(text) => handleChange("email", text)}
      />
      <AppTextInput
        placeholder="Password"
        secureTextEntry
        onChangeText={(text) => handleChange("password", text)}
      />
      <AppTextInput
        placeholder="Match Password"
        secureTextEntry
        onChangeText={(text) => handleChange("matchPassword", text)}
      />
      <View style={{ flex: 1 }} />
      <PrimaryButton
        variant="TEXT"
        isLoading={isRegisterLoading}
        label="I already have a code"
        onPress={() => navigate("RegisterCode")}
      />
      <PrimaryButton
        isDisabled={isAnyFieldEmpty}
        isLoading={isRegisterLoading}
        label="Register"
        onPress={handleRegister}
      />
    </Screen>
  );
};

export default RegisterScreen;
