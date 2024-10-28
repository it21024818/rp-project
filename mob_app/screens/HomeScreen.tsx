import React, { MutableRefObject, useRef, useState } from "react";
import { Text, StyleSheet, View, TouchableOpacity } from "react-native";
import Font from "../constants/Font";
import { FontSize } from "../Styles/GlobalStyles";
import Colors from "../constants/Colors";
import { useAppDispatch } from "../hooks/redux-hooks";
import { useNavigation } from "@react-navigation/native";
import AppTextInput from "../components/AppTextInput";
import PrimaryButton from "../components/PrimaryButton";
import Screen from "../components/Screen";
import { useCreatePredictionMutation } from "../Redux/API/predictions.api.slice";
import { useToast } from "native-base";
import ToastAlert from "../components/ToastAlert";
import { setUser } from "../Redux/slices/userSlice";
import * as ImagePicker from "expo-image-picker";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import ScreenHeader from "../components/ScreenHeader";
import { TextInput } from "react-native";

const Home = () => {
  const GOOGLE_CLOUD_VISION_API_KEY = process.env.EXPO_PUBLIC_API_KEY;
  const { navigate } = useNavigation();
  const dispatch = useAppDispatch();
  const toast = useToast();
  const [createPrediction, { isLoading: isCreatePredictionLoading }] =
    useCreatePredictionMutation();
  const [input, setInput] = useState<string>("");
  const [isInputFocused, setInputFocused] = useState<boolean>(false);
  const [isScanning, setIsScanning] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const isLoading = isCreatePredictionLoading || isScanning;

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

  const handleScan = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestCameraPermissionsAsync();
      if (!permissionResult.granted) {
        alert("Permission to access camera is required!");
        return;
      }

      const imageResult = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!imageResult.canceled) {
        setIsScanning(true);

        const base64Image = await fetch(imageResult.assets[0].uri);
        const imageBlob = await base64Image.blob();
        const reader = new FileReader();
        reader.readAsDataURL(imageBlob);
        reader.onloadend = async () => {
          const base64data = reader.result?.toString().split(",")[1];

          // Sending request to Google Vision API
          const visionResponse = await fetch(
            `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_CLOUD_VISION_API_KEY}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                requests: [
                  {
                    image: { content: base64data },
                    features: [{ type: "TEXT_DETECTION" }],
                  },
                ],
              }),
            }
          );

          const visionResult = await visionResponse.json();
          const text =
            visionResult.responses[0]?.fullTextAnnotation?.text || "";

          setInput(text);
        };
      }
    } catch (error) {
      console.error("OCR Scan error:", error);
      toast.show({
        placement: "bottom",
        render: () => (
          <ToastAlert
            title="Failed to scan"
            description="An error occurred during scanning. Please try again."
            type="error"
          />
        ),
      });
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <Screen contentStyle={{ height: "92%" }}>
      <ScreenHeader title="Predict" hasLogoutAction />
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
        }}
      >
        <AppTextInput
          multiline
          blurOnSubmit
          ref={inputRef}
          isLoading={isLoading || isScanning}
          value={input || ""}
          onChangeText={setInput}
          style={styles.textInput}
          placeholder="Insert your news article"
        />
      </TouchableWithoutFeedback>
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
        onPress={handleScan}
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: FontSize.size_9xl,
    fontWeight: "600",
    color: Colors.primary,
    fontFamily: Font["poppins-bold"],
    flex: 1,
  },
  textInput: {
    flex: 1,
    paddingTop: 20,
    paddingBottom: 20,
  },
});

export default Home;
