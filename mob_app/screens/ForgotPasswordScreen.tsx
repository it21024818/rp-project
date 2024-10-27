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
import { useRegisterMutation } from "../Redux/API/auth.api.slice";
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

const ForgotPasswordScreen = () => {
  const { goBack, navigate } = useNavigation();
  const toast = useToast();
  const [email, setEmail] = useState("");

  const handleForgotPassword = async () => {
    toast.show({
      placement: "bottom",
      render: () => (
        <ToastAlert
          title="Success!"
          description="You will receive an email shortly."
          type="info"
        />
      ),
    });
    goBack();
  };

  return (
    <Screen>
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <Image
          style={{ width: 256, height: 256 }}
          resizeMode="contain"
          source={require("../assets/images/logo.png")}
        />
      </View>
      <Text
        style={{
          fontSize: 48,
          color: Colors.primary,
          fontFamily: Font["poppins-bold"],
          textAlign: "center",
        }}
      >
        LIGHTHOUSE
      </Text>
      <Text
        style={{
          fontSize: 28,
          color: Colors.primary,
          fontFamily: Font["poppins-bold"],
          textAlign: "center",
        }}
      >
        Forgot your password?
      </Text>
      <Text
        style={{
          fontFamily: Font["poppins-regular"],
          fontSize: FontSize.small,
          textAlign: "center",
          marginTop: 16,
        }}
      >
        You will receive a communication with further instructionns on resetting
        your account password. If the email does not arrive withinn 5-10
        minutes, please check your spam folder.
      </Text>
      <View style={{ flex: 1 }} />
      <AppTextInput placeholder="Email" onChangeText={setEmail} />
      <View style={{ flex: 1 }} />
      <PrimaryButton
        variant="TEXT"
        label="I Remembered my Password"
        onPress={() => goBack()}
      />
      <PrimaryButton label="Send Email" onPress={handleForgotPassword} />
    </Screen>
  );
};

export default ForgotPasswordScreen;
