import {
  Dimensions,
  Image,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import Spacing from "../constants/Spacing";
import FontSize from "../constants/FontSize";
import Colors from "../constants/Colors";
import Font from "../constants/Font";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import PrimaryButton from "../components/PrimaryButton";
import { Color } from "../Styles/GlobalStyles";
const { height } = Dimensions.get("window");

type Props = NativeStackScreenProps<RootStackParamList, "Welcome">;

const WelcomeScreen: React.FC<Props> = ({ navigation: { navigate } }) => {
  return (
    <SafeAreaView>
      <View
        style={{
          backgroundColor: Color.white,
          width: "100%",
          height: "100%",
          overflow: "hidden",
          paddingHorizontal: 20,
        }}
      >
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
            fontSize: FontSize.xxLarge,
            color: Colors.primary,
            fontFamily: Font["poppins-bold"],
            textAlign: "center",
          }}
        >
          Spot the facts
        </Text>
        <Text
          style={{
            fontSize: FontSize.xLarge,
            color: Colors.midPrimary,
            fontFamily: Font["poppins-bold"],
            textAlign: "center",
          }}
        >
          Clear your doubts
        </Text>
        <Text
          style={{
            fontSize: FontSize.small,
            color: Colors.text,
            fontFamily: Font["poppins-regular"],
            textAlign: "center",
            marginTop: Spacing * 2,
          }}
        >
          Question everything, for truth stands strong when doubts are cleared,
          and fake news fades in the light of understanding
        </Text>
        <View style={{ flex: 1 }} />
        <PrimaryButton label="Sign In" onPress={() => navigate("Login")} />
        <PrimaryButton
          label="Create new account"
          variant="SUBTLE"
          onPress={() => navigate("Register")}
        />
      </View>
    </SafeAreaView>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({});
