import React, { useState } from "react";
import Screen from "../components/Screen";
import {
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import ScreenHeader from "../components/ScreenHeader";
import { View } from "react-native";
import { Text } from "react-native";
import {
  BiasOptions,
  FeedbackDetails,
  FeedbackDto,
  ReactionEnum,
  SarcasmOptions,
  SentimentOptions,
} from "../types/types";
import { useCreateFeedbackMutation } from "../Redux/API/feedbacks.api.slice";
import { Checkbox } from "react-native-paper";
import Dropdown from "../components/DropDown";
import Colors from "../constants/Colors";
import PrimaryButton from "../components/PrimaryButton";
import { useNavigation } from "@react-navigation/native";
import { Ionicons as Icon } from "@expo/vector-icons";

const FeedbackScreenV2 = ({ route }: any) => {
  const { predictionId } = (route.params ?? {}) as { predictionId?: string };
  const { navigate, goBack } = useNavigation();
  const [newReview, setNewReview] = useState<FeedbackDto>({
    reaction: ReactionEnum.GOOD,
    details: {
      message: "",
      textQuality: false,
      sentiment: "NEUTRAL",
      sarcasm: "GEN",
      bias: "CENTER",
      isFake: false,
    },
  });
  const [createFeedback, { isLoading: isCreateFeedbackLoading }] =
    useCreateFeedbackMutation();

  const handleInputChange = (
    name: keyof FeedbackDetails,
    value: string | boolean
  ) => {
    setNewReview((prevReview) => ({
      ...prevReview,
      details: {
        ...prevReview.details,
        [name]: value,
      },
    }));
  };

  const handleReactionChange = (reaction: "GOOD" | "BAD") => {
    setNewReview({ ...newReview, reaction });
  };

  const handleSubmitReview = async () => {
    try {
      // Call the createFeedback mutation
      await createFeedback({
        predictionId: predictionId ?? "",
        feedback: newReview,
      }).unwrap();
      goBack();

      // Show success alert
    } catch (error) {
      // Show error alert
      console.error("Error submitting feedback:", error);
    }
  };

  return (
    <Screen>
      <ScreenHeader title="Feedback" hasBackAction />
      <View style={styles.optionContainer}>
        <Text style={styles.optionLabel}>Good or Bad</Text>
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            onPress={() => handleReactionChange(ReactionEnum.GOOD)}
          >
            <Icon
              name="thumbs-up"
              size={24}
              color={
                newReview.reaction === ReactionEnum.GOOD
                  ? Colors.primary
                  : Colors.gray
              }
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleReactionChange(ReactionEnum.BAD)}
          >
            <Icon
              name="thumbs-down"
              size={24}
              color={
                newReview.reaction === ReactionEnum.BAD
                  ? Colors.primary
                  : Colors.gray
              }
            />
          </TouchableOpacity>
        </View>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Message"
        value={newReview.details.message}
        onChangeText={(text) => handleInputChange("message", text)}
        multiline
      />

      {/* Text Quality Checkbox */}
      <View style={styles.checkboxContainer}>
        <View style={styles.checkboxBox}>
          <Checkbox
            status={newReview.details.textQuality ? "checked" : "unchecked"}
            onPress={() =>
              handleInputChange("textQuality", !newReview.details.textQuality)
            }
          />
        </View>
        <Text style={styles.optionLabel1}>Text Quality</Text>
      </View>

      {/* Is Fake Checkbox */}
      <View style={styles.checkboxContainer}>
        <View style={styles.checkboxBox}>
          <Checkbox
            status={newReview.details.isFake ? "checked" : "unchecked"}
            onPress={() =>
              handleInputChange("isFake", !newReview.details.isFake)
            }
          />
        </View>
        <Text style={styles.optionLabel1}>Is Fake</Text>
      </View>

      {/* Sentiment Dropdown */}
      <Text style={styles.optionLabel}>Sentiment</Text>
      <Dropdown
        data={SentimentOptions}
        onChange={(item) => handleInputChange("sentiment", item.value)}
        placeholder="Select Sentiment"
      />

      {/* Sarcasm Dropdown */}
      <Text style={styles.optionLabel}>Sarcasm</Text>
      <Dropdown
        data={SarcasmOptions}
        onChange={(item) => handleInputChange("sarcasm", item.value)}
        placeholder="Select Sarcasm Type"
      />

      {/* Bias Dropdown */}
      <Text style={styles.optionLabel}>Bias</Text>
      <Dropdown
        data={BiasOptions}
        onChange={(item) => handleInputChange("bias", item.value)}
        placeholder="Select Bias"
      />
      <View style={{ flex: 1 }} />
      <PrimaryButton
        label="Submit"
        onPress={handleSubmitReview}
        isLoading={isCreateFeedbackLoading}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1976d2",
    textAlign: "center",
  },
  checkboxBox: {
    backgroundColor: "#f0f0f0", // Background color for the box
    padding: 0,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2, // For Android shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  subtext: {
    fontSize: 15,
    color: "#424242",
    textAlign: "center",
    marginVertical: 10,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1976d2",
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    maxHeight: "80%",
    padding: 20,
    backgroundColor: "#D4BEE4",
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#624E88",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  input: {
    height: 100,
    borderColor: "#9B7EBD",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginTop: 15,
    backgroundColor: "#fff",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 10,
    color: "#3B1E54",
  },
  optionLabel1: {
    fontSize: 16,
    fontWeight: "bold",
    paddingHorizontal: 10,
    color: "#133E87",
  },
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  buttonGroup: {
    marginLeft: 150,
    flexDirection: "row",
    gap: 15,
  },
});

export default FeedbackScreenV2;
