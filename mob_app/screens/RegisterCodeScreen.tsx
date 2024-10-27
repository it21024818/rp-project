import { Image, Text, View } from "react-native";
import React from "react";
import FontSize from "../constants/FontSize";
import Colors from "../constants/Colors";
import Font from "../constants/Font";
import AppTextInput from "../components/AppTextInput";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import PrimaryButton from "../components/PrimaryButton";
import Screen from "../components/Screen";
import { useToast } from "native-base";
import ToastAlert from "../components/ToastAlert";
import { useAuthorizeUserMutation } from "../Redux/api/auth.api.slice";

const RegisterCodeScreen = () => {
  const { goBack, navigate } = useNavigation();
  const toast = useToast();
  const [code, setCode] = useState("");
  const [authorizeUser, { isLoading: isAuthorizeUserLoading }] =
    useAuthorizeUserMutation();

  const isLoading = isAuthorizeUserLoading;

  const handleCompletRegistration = async () => {
    try {
      await authorizeUser(code).unwrap();
      toast.show({
        placement: "bottom",
        render: () => (
          <ToastAlert
            title="Successfully Authorized!"
            description={`Your registration is complete\nYou can now sign in!`}
            type="info"
          />
        ),
      });
      navigate("Login");
    } catch (error) {
      toast.show({
        placement: "bottom",
        render: () => (
          <ToastAlert
            title="Failed to Authorize"
            description={(error as any)?.data.message}
            type="error"
          />
        ),
      });
    }
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
        Complete your Registration
      </Text>
      <Text
        style={{
          fontFamily: Font["poppins-regular"],
          fontSize: FontSize.small,
          textAlign: "center",
          marginTop: 16,
        }}
      >
        Please copy and paste the code you have received in your registration
        email here.
      </Text>
      <View style={{ flex: 1 }} />
      <AppTextInput
        placeholder="Code"
        onChangeText={setCode}
        editable={!isLoading}
      />
      <View style={{ flex: 1 }} />
      <PrimaryButton
        variant="TEXT"
        isLoading={isLoading}
        label="Back to Registration"
        onPress={() => goBack()}
      />
      <PrimaryButton
        label="Submit"
        onPress={handleCompletRegistration}
        isLoading={isLoading}
        isDisabled={code.trim().length < 1}
      />
    </Screen>
  );
};

export default RegisterCodeScreen;
