import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import * as Linking from "expo-linking";
import Font from "../constants/Font";
import { FontSize } from "../Styles/GlobalStyles";
import Colors from "../constants/Colors";
import { useAppSelector } from "../hooks/redux-hooks";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Ionicons as Icon } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Screen from "../components/Screen";
import { PredictionDto } from "../types/types";
import { useToast } from "native-base";
import ToastAlert from "../components/ToastAlert";
import PrimaryButton from "../components/PrimaryButton";
import ScreenHeader from "../components/ScreenHeader";
import { useLazyGetFeedbackByPredictionIdQuery } from "../Redux/API/feedbacks.api.slice";
import { useCallback } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

type BlockProps = {
  icon: string;
  backgroundColor: string;
  titleColor: string;
  title: string;
  result: string;
  flavour: string;
  intro?: string;
  outro?: string;
};

type DisabledBlockProps = {
  icon: string;
  title: string;
};

type NewsBlockProps = {
  imageUri?: string;
  description?: string;
  title?: string;
  onPress?: () => void;
};

const NewsBlock = ({
  title,
  description,
  imageUri,
  onPress,
}: NewsBlockProps) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={{
          borderRadius: 8,
          justifyContent: "center",
          flexDirection: "row",
          gap: 6,
        }}
      >
        <ImageBackground
          style={{
            width: "100%",
            borderRadius: 8,
            overflow: "hidden",
          }}
          source={{
            uri: imageUri,
          }}
          resizeMode="cover"
        >
          <View
            style={{
              width: "100%",
              borderRadius: 8,
              flexDirection: "row",
              overflow: "hidden",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon
              name={"link"}
              size={36}
              color={"rgba(255,255,255, 0.7)"}
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                paddingTop: "14%",
                paddingLeft: 26,
              }}
            />
            <LinearGradient
              start={{ x: 0, y: 1 }}
              style={{ height: "100%", flex: 1, marginLeft: 64 }}
              colors={["rgba(255, 255, 255, 0)", Colors.lightPrimary]}
            />
            <View
              style={{
                flex: 4,
                backgroundColor: Colors.lightPrimary,
                padding: 16,
                gap: 6,
              }}
            >
              <Text
                numberOfLines={1}
                style={{
                  fontWeight: "600",
                  fontSize: FontSize.size_base,
                }}
              >
                {title}
              </Text>
              <Text
                numberOfLines={8}
                style={{
                  fontSize: FontSize.size_sm,
                }}
              >
                {description}
              </Text>
            </View>
          </View>
        </ImageBackground>
      </View>
    </TouchableOpacity>
  );
};

const Block = ({
  backgroundColor,
  titleColor,
  title,
  result,
  intro = "This text is",
  flavour,
  icon,
  outro,
}: BlockProps) => {
  return (
    <View
      style={{
        borderRadius: 8,
        backgroundColor: backgroundColor,
        padding: 16,
        justifyContent: "center",
        gap: 6,
      }}
    >
      <View style={{ flexDirection: "row", gap: 10 }}>
        <MaterialIcons name={icon as any} color={titleColor} size={24} />
        <Text
          style={{
            color: titleColor,
            fontSize: FontSize.size_xl,
            fontWeight: "600",
            fontFamily: Font["poppins-bold"],
          }}
        >
          {title}
        </Text>
      </View>
      <Text
        style={{
          fontSize: FontSize.size_base,
        }}
      >
        {intro}{" "}
        <Text
          style={{
            fontWeight: "600",
          }}
        >
          {result}
        </Text>{" "}
        {outro}
      </Text>
      <Text
        style={{
          fontSize: FontSize.size_sm,
        }}
      >
        {flavour}
      </Text>
    </View>
  );
};

const DisabledBlock = ({ title, icon }: DisabledBlockProps) => {
  return (
    <View
      style={{
        borderRadius: 8,
        backgroundColor: Colors.gray,
        padding: 16,
        justifyContent: "center",
        gap: 6,
      }}
    >
      <View style={{ flexDirection: "row", gap: 10 }}>
        <MaterialIcons
          name={icon as any}
          color={Colors.darkText}
          size={24}
          style={{ width: 24, height: 24 }}
        />
        <Text
          style={{
            color: Colors.darkText,
            fontSize: FontSize.size_base,
            fontWeight: "600",
            fontFamily: Font["poppins-bold"],
          }}
        >
          {title}
        </Text>
      </View>
    </View>
  );
};

const PredictionScreen = ({ route }: any) => {
  const { user } = useAppSelector((state) => state.user);
  const { prediction } = (route.params ?? {}) as { prediction?: PredictionDto };
  const { goBack, navigate } = useNavigation();
  const toast = useToast();
  const [
    getFeedback,
    {
      isLoading: isGetFeedbackLoading,
      isFetching: isGetFeedbackFetching,
      data,
    },
  ] = useLazyGetFeedbackByPredictionIdQuery();

  const isFeedbackPresent = (data ?? []).some(
    (item: any) => item.createdBy === user?._id
  );

  useFocusEffect(
    useCallback(() => {
      getFeedback({ predictionId: prediction?._id ?? "" });
    }, [prediction])
  );

  return (
    <Screen>
      <ScrollView
        stickyHeaderIndices={[0]}
        contentContainerStyle={{
          gap: 8,
        }}
      >
        <ScreenHeader title="Prediction" hasBackAction />
        <Text
          style={{
            fontSize: FontSize.size_base,
            marginBottom: 16,
            textAlign: "justify",
          }}
        >
          {prediction?.text?.trim()}
        </Text>
        <Block
          backgroundColor={Colors.lightPrimary}
          titleColor={Colors.primary}
          icon="plagiarism"
          result={prediction?.result?.finalFakeResult ? "True" : "False"}
          flavour="Result is based on the combination of all results"
          title="Final Result"
        />

        <Text
          style={{
            fontSize: FontSize.size_5xl,
            fontWeight: "600",
            color: Colors.primary,
            fontFamily: Font["poppins-bold"],
            marginBottom: 10,
            marginTop: 10,
          }}
        >
          Model Results
        </Text>
        {prediction?.result?.sarcasmPresentResult?.prediction ? (
          <Block
            backgroundColor={Colors.lightPrimary}
            titleColor={Colors.primary}
            icon="crisis-alert"
            result={prediction?.result?.sarcasmTypeResult?.prediction ?? ""}
            flavour="Result is based on analysis of sarcasm presence in the content"
            title="Sarcasm"
            intro="This text has sarcasm of type"
          />
        ) : (
          <DisabledBlock icon="crisis-alert" title="Sarcasm was not detected" />
        )}
        <Block
          backgroundColor={Colors.lightPrimary}
          titleColor={Colors.primary}
          icon="history-edu"
          result={prediction?.result?.sentimentTypeResult.prediction ?? ""}
          flavour="Result is based on the sentiment presence in the content"
          title="Sentiment"
          intro="This text has"
          outro="sentiment"
        />
        <Block
          backgroundColor={Colors.lightPrimary}
          titleColor={Colors.primary}
          icon="history-edu"
          result={prediction?.result?.sentimentTextTypeResult.prediction ?? ""}
          flavour="This result indicates the type of text detected"
          title="Type"
          intro="This text looks like a"
        />
        <Block
          backgroundColor={Colors.lightPrimary}
          titleColor={Colors.primary}
          icon="fact-check"
          result={
            prediction?.result?.textQualityResult.prediction ? "Bad" : "Good"
          }
          flavour="This result is based on the analysis of text quality in the text"
          title="Text Quality"
          intro="This text seems to exhibit"
          outro="text quality"
        />
        <Block
          backgroundColor={Colors.lightPrimary}
          titleColor={Colors.primary}
          icon="handshake"
          result={prediction?.result?.biasResult.prediction ?? ""}
          flavour="This result is based on the presence of political bias in the content with regards to the US political system"
          title="Political Bias"
          intro="This text seems to be"
          outro="Leaning"
        />
        <Text
          style={{
            fontSize: FontSize.size_5xl,
            fontWeight: "600",
            color: Colors.primary,
            fontFamily: Font["poppins-bold"],
            marginBottom: 10,
            marginTop: 10,
          }}
        >
          Related Search Results
        </Text>
        {(prediction?.searchResults?.length || 0) < 1 && (
          <DisabledBlock icon="search" title="No search results found" />
        )}
        {prediction?.searchResults?.map((item, idx) => (
          <NewsBlock
            key={idx}
            title={item.title}
            description={item.description}
            imageUri={item.thumbnail?.[0]?.src}
            onPress={() => {
              Linking.canOpenURL(item.link)
                .then(() => Linking.openURL(item.link))
                .catch(() =>
                  toast.show({
                    placement: "bottom",
                    render: () => (
                      <ToastAlert
                        title="Could not open link"
                        description={
                          "Lighthouse could not open this link. The app most likely lacks permissions"
                        }
                        type="error"
                      />
                    ),
                  })
                );
            }}
          />
        ))}
        <Text
          style={{
            fontSize: FontSize.size_5xl,
            fontWeight: "600",
            color: Colors.primary,
            fontFamily: Font["poppins-bold"],
            marginBottom: 10,
            marginTop: 10,
          }}
        >
          Leave a review
        </Text>
        <Text
          style={{
            fontSize: FontSize.size_base,
            marginBottom: 16,
            textAlign: "justify",
          }}
        >
          If you want to help us make our fake news predictions better, leave a
          review with what your input on the content!
        </Text>
        <PrimaryButton
          label={
            isFeedbackPresent
              ? "You've already a left a review"
              : "Leave a review"
          }
          isDisabled={isFeedbackPresent}
          isLoading={isGetFeedbackLoading || isGetFeedbackFetching}
          onPress={() =>
            navigate("Feedback", { predictionId: prediction?._id } as any)
          }
        />
      </ScrollView>
    </Screen>
  );
};

export default PredictionScreen;
