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

type Props = NativeStackScreenProps<RootStackParamList, "Register">;

const RegisterScreen: React.FC<Props> = ({ navigation: { navigate } }) => {
  const navigation = useNavigation();
  const [sendUserInfo, result] = useRegisterMutation();
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    region: "",
    country: "",
    matchPassword: "",
  });

  const handleChange = (name: any, text: any) => {
    setData({ ...data, [name]: text });
  };

  const handleRegister = async () => {
    try {
      await sendUserInfo(data).unwrap();
      navigation.goBack();
    } catch (error) {
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
      <HandleResult result={result} />
      <PrimaryButton label="Register" onPress={handleRegister} />
    </Screen>
  );
};

export default RegisterScreen;
