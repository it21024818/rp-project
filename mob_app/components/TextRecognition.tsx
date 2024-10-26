// src/TextRecognition.tsx
import React, { useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import {
  launchImageLibrary,
  ImagePickerResponse,
} from "react-native-image-picker";
import axios from "axios";

const API_KEY = "YOUR_GOOGLE_VISION_API_KEY"; // Replace with your actual API key

const TextRecognition: React.FC = () => {
  const [recognizedText, setRecognizedText] = useState<string>("");

  const pickImage = async () => {
    launchImageLibrary(
      { mediaType: "photo", includeBase64: true },
      (response: ImagePickerResponse) => {
        if (response.didCancel || !response.assets) {
          console.log("User cancelled image picker");
        } else {
          const base64Image = response.assets[0]?.base64;
          if (base64Image) {
            recognizeText(base64Image);
          }
        }
      }
    );
  };

  const recognizeText = async (base64Image: string) => {
    const body = {
      requests: [
        {
          image: {
            content: base64Image,
          },
          features: [
            {
              type: "TEXT_DETECTION",
            },
          ],
        },
      ],
    };

    try {
      const response = await axios.post(
        `https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`,
        body,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const text =
        response.data.responses[0].fullTextAnnotation?.text ||
        "No text recognized";
      setRecognizedText(text);
    } catch (error) {
      console.error("Text recognition error: ", error);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Pick an image" onPress={pickImage} />
      <Text style={styles.text}>{recognizedText}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 16,
    padding: 10,
  },
});

export default TextRecognition;
