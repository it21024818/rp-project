import { Text, StyleSheet, View, TouchableOpacity } from "react-native";
import Font from "../constants/Font";
import { Color, FontSize } from "../Styles/GlobalStyles";
import { useState } from "react";
import Colors from "../constants/Colors";
import { useAppDispatch, useAppSelector } from "../hooks/redux-hooks";
import { useNavigation } from "@react-navigation/native";
import AppTextInput from "../components/AppTextInput";
import PrimaryButton from "../components/PrimaryButton";
import Screen from "../components/Screen";
import { Ionicons as Icon } from "@expo/vector-icons";
import { useCreatePredictionMutation } from "../Redux/api/predictions.api.slice";
import { useToast } from "native-base";
import ToastAlert from "../components/ToastAlert";
import { setUser } from "../Redux/slices/userSlice";

const Home = () => {
  const { navigate } = useNavigation();
  const dispatch = useAppDispatch();
  const toast = useToast();
  const [createPrediction, { isLoading: isCreatePredictionLoading }] =
    useCreatePredictionMutation();
  const [input, setInput] = useState<string>(
    "Text Text Text Text Text Text Text Text Text Text Text Text Text Text Text Text Text "
  );

  const isLoading = isCreatePredictionLoading;

  const handlePredict = async () => {
    try {
      if (input.trim().split(" ").length < 10) {
        toast.show({
          placement: "bottom",
          render: () => (
            <ToastAlert
              title="Failed to predict"
              description="Text needs to be longer than 10 words"
              type="error"
            />
          ),
        });
        return;
      }
      const prediction = await createPrediction(input.trim()).unwrap();
      if (prediction.error) {
        throw "Unknown error occurred";
      }
      navigate("Prediction", { prediction } as any);
    } catch (error) {
      console.error(error);
      toast.show({
        placement: "bottom",
        render: () => (
          <ToastAlert
            title="Failed to predict"
            description={
              (error as any)?.data?.message ??
              "An unknown error occurred. Please try again later."
            }
            type="error"
          />
        ),
      });
    }
  };

  const handleClear = () => {
    setInput("");
  };

  return (
    <Screen contentStyle={{ height: "92%" }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
        }}
      >
        <Text
          style={{
            fontSize: FontSize.size_9xl,
            fontWeight: "600",
            color: Colors.primary,
            fontFamily: Font["poppins-bold"],
            flex: 1,
          }}
        >
          Predict
        </Text>
        <View style={{ flex: 1 }} />
        <TouchableOpacity
          onPress={() => {
            dispatch(setUser({}));
            navigate("Login");
          }}
        >
          <Icon name={"log-out-outline"} color={Colors.primary} size={30} />
        </TouchableOpacity>
      </View>
      <AppTextInput
        multiline
        editable={!isLoading}
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
