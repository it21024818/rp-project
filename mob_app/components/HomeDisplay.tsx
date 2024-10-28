import React, { useState } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import {
  Text,
  TextInput,
  Button,
  Card,
  ProgressBar,
  Paragraph,
} from "react-native-paper";

// Dummy result object for testing purposes. Replace it with the actual API result in real use.
const result = {
  data: {
    result: {
      finalFakeResult: false, // Change this to true for testing fake news
      sarcasmTypeResult: { prediction: "Not Sarcasm", confidence: 0.85 },
      sentimentTypeResult: { prediction: "Positive", confidence: 0.92 },
      textFakeResult: { confidence: 0.15 },
      biasResult: { prediction: "Neutral", confidence: 0.2 },
      biasFakeResult: { confidence: 0.05 },
    },
  },
};

const HomePageComp = () => {
  const [value, setValue] = useState("Default Value");
  const [newsText, setNewsText] = useState("");

  const handleChange = (text: string) => {
    setNewsText(text);
  };

  // Define the generateSummaryReport function
  const generateSummaryReport = (result: any) => {
    if (!result || !result.data || !result.data.result) {
      return "No data available";
    }

    const fakeLikelihood = result.data.result.finalFakeResult
      ? "Based on the analysis, the given text is unlikely to be fake news."
      : "Based on the analysis, it is highly likely that the given text is fake news.";

    const sarcasmReport = `The sarcasm detection model ${
      result.data.result.sarcasmTypeResult?.prediction === "Sarcasm"
        ? "indicates the presence of sarcasm"
        : "shows that sarcasm is either not present"
    } with a confidence of ${(
      result.data.result.sarcasmTypeResult?.confidence * 100
    ).toFixed(2)}%.`;

    const sentimentReport = `Sentiment analysis shows a ${result.data.result.sentimentTypeResult?.prediction.toLowerCase()} sentiment (with a confidence of ${(
      result.data.result.sentimentTypeResult?.confidence * 100
    ).toFixed(2)}%).`;

    const textQualityReport = `The text quality analysis indicates that the text is ${
      result.data.result.textFakeResult?.confidence > 0.5 ? "low" : "good"
    } quality, with a confidence of ${(
      result.data.result.textFakeResult?.confidence * 100
    ).toFixed(2)}%.`;

    const biasReport = `The bias detection model identifies a "${
      result.data.result.biasResult?.prediction
    }" political bias, with a confidence of ${(
      result.data.result.biasFakeResult?.confidence * 100
    ).toFixed(
      2
    )}% that it contributes to the likelihood of the news being fake.`;

    return `${fakeLikelihood}\n\n${sarcasmReport}\n${sentimentReport}\n${textQualityReport}\n${biasReport}`;
  };

  // Determine if the news is fake based on the result
  const isFakeNews = result.data.result.finalFakeResult;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="headlineMedium" style={styles.title}>
            Unveiling Truth in a Sea of Information: Your Guide to Fake News
            Detection.
          </Text>
          <TextInput
            label="Insert your news article"
            multiline
            numberOfLines={20}
            value={newsText}
            onChangeText={handleChange}
            style={styles.textInput}
          />
          <Button
            mode="outlined"
            icon="check-circle"
            onPress={() => console.log("Check button pressed")}
          >
            Check
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="headlineSmall" style={styles.subtitle}>
            Inserted News article
          </Text>
          <TextInput
            multiline
            value={value}
            style={styles.textInput}
            editable={false}
          />
          <Paragraph
            style={[
              styles.paragraph,
              { backgroundColor: isFakeNews ? "#F8D7DA" : "#DCF3EB" },
            ]}
          >
            {isFakeNews ? "This news is fake news." : "This news is true news."}
          </Paragraph>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="headlineSmall" style={styles.subtitle}>
            Summary Report of the News
          </Text>
          <TextInput
            multiline
            value={generateSummaryReport(result)}
            style={styles.textInput}
            editable={false}
          />
          <Paragraph
            style={[
              styles.paragraph,
              { backgroundColor: isFakeNews ? "#F8D7DA" : "#DCF3EB" },
            ]}
          >
            {isFakeNews ? "This news is fake news." : "This news is true news."}
          </Paragraph>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="headlineSmall" style={styles.subtitle}>
            Fake news detection Factors Weights
          </Text>
          <View style={styles.progressContainer}>
            <View style={styles.progressLabel}>
              <Text style={styles.progressText}>Tone of text segments</Text>
              <Text style={styles.progressValue}>30%</Text>
            </View>
            <ProgressBar
              progress={0.3}
              color="#4A90E2"
              style={styles.progressBar}
            />
          </View>

          <View style={styles.progressContainer}>
            <View style={styles.progressLabel}>
              <Text style={styles.progressText}>Sarcastic nature</Text>
              <Text style={styles.progressValue}>30%</Text>
            </View>
            <ProgressBar
              progress={0.3}
              color="#FFB74D"
              style={styles.progressBar}
            />
          </View>

          <View style={styles.progressContainer}>
            <View style={styles.progressLabel}>
              <Text style={styles.progressText}>Political bias</Text>
              <Text style={styles.progressValue}>30%</Text>
            </View>
            <ProgressBar
              progress={0.3}
              color="#81C784"
              style={styles.progressBar}
            />
          </View>

          <View style={styles.progressContainer}>
            <View style={styles.progressLabel}>
              <Text style={styles.progressText}>Quality of the text</Text>
              <Text style={styles.progressValue}>30%</Text>
            </View>
            <ProgressBar
              progress={0.3}
              color="#BA68C8"
              style={styles.progressBar}
            />
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#00000",
  },
  card: {
    marginBottom: 16,
  },
  title: {
    textAlign: "center",
    marginBottom: 16,
  },
  textInput: {
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  subtitle: {
    marginBottom: 8,
  },
  paragraph: {
    padding: 8,
    borderRadius: 4,
    marginBottom: 16,
    color: "#000", // Text color stays constant
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressLabel: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  progressText: {
    color: "gray",
  },
  progressValue: {
    color: "gray",
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
    backgroundColor: "#e0e0e0",
  },
});

export default HomePageComp;
