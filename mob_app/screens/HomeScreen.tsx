import { Text, StyleSheet, View, ScrollView } from "react-native";
import ContainerFrame from "../components/ContainerFrame";
import HomePageComp from "../components/HomeDisplay";
import Font from "../constants/Font";
import { Color, FontSize, Padding, Border } from "../Styles/GlobalStyles";
import { useGetDetailedScheduledForUserQuery } from "../Redux/API/schedules.api.slice";
import { ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import Colors from "../constants/Colors";
import { useAppSelector } from "../hooks/redux-hooks";
import { DateUtils } from "../utils/DateUtils";
import { useNavigation } from "@react-navigation/native";
import { Input } from "native-base";
import AppTextInput from "../components/AppTextInput";
import PrimaryButton from "../components/PrimaryButton";
import Screen from "../components/Screen";

const Home = () => {
  const { navigate } = useNavigation();
  const user = useAppSelector((state) => state.user);
  const [input, setInput] = useState<string>("");

  const isLoading = false;

  const handlePredict = () => {
    navigate("Prediction");
  };

  const handleClear = () => {
    setInput("");
  };

  return (
    <Screen contentStyle={{ height: "92%" }}>
      <Text
        style={{
          fontSize: FontSize.size_9xl,
          fontWeight: "600",
          color: Colors.primary,
          fontFamily: Font["poppins-bold"],
        }}
      >
        Unveil The Truth
      </Text>
      <AppTextInput
        multiline
        editable={isLoading}
        value={input || ""}
        onChangeText={setInput}
        style={{ flex: 1, paddingTop: 20, paddingBottom: 20 }}
        placeholder="Insert your news article"
      />
      <PrimaryButton
        isLoading={isLoading}
        label={"Clear"}
        variant="SUBTLE"
        onPress={handleClear}
      />
      <PrimaryButton
        isLoading={isLoading}
        label={"Scan"}
        icon={"scan-circle"}
      />
      <PrimaryButton
        isLoading={isLoading}
        label={"Predict"}
        onPress={handlePredict}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  home: {
    backgroundColor: Color.white,
    marginTop: 20,
    width: "100%",
    maxHeight: "88%",
    paddingHorizontal: 20,
    paddingVertical: 37,
    overflow: "hidden",
    flex: 1,
  },
});

export default Home;
