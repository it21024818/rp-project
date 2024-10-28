import {
  Text,
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import * as Linking from "expo-linking";
import Font from "../constants/Font";
import { Color, FontSize } from "../Styles/GlobalStyles";
import Colors from "../constants/Colors";
import { useAppSelector } from "../hooks/redux-hooks";
import { useNavigation } from "@react-navigation/native";
import { Ionicons as Icon } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Screen from "../components/Screen";
import { PredictionDto } from "../types/types";
import { useToast } from "native-base";
import ToastAlert from "../components/ToastAlert";
import Reviews from "./FeedbackScreen";

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
        <Icon name={icon as any} color={titleColor} size={24} />
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
        <Icon name={icon as any} color={Colors.gray} size={24} />
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
  const { prediction } = (route.params ?? {}) as { prediction?: PredictionDto };
  const { goBack } = useNavigation();
  const toast = useToast();

  return (
    <Screen>
      <ScrollView
        stickyHeaderIndices={[0]}
        contentContainerStyle={{
          gap: 8,
        }}
      >
        <View
          style={{
            backgroundColor: Colors.colorWhite,
            paddingBottom: 10,
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
            }}
          >
            <TouchableOpacity onPress={() => goBack()}>
              <Icon name={"arrow-back"} color={Colors.primary} size={30} />
            </TouchableOpacity>
            <Text
              style={{
                fontSize: FontSize.size_9xl,
                fontWeight: "600",
                color: Colors.primary,
                fontFamily: Font["poppins-bold"],
              }}
            >
              Prediction
            </Text>
          </View>
        </View>
        <Text
          style={{
            fontSize: FontSize.size_base,
            marginBottom: 16,
          }}
        >
          {prediction?.text}
        </Text>
        <Block
          backgroundColor={Colors.lightPrimary}
          titleColor={Colors.primary}
          icon="?"
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
            icon="?"
            result={prediction?.result?.sarcasmTypeResult?.prediction ?? ""}
            flavour="Result is based on analysis of sarcasm presence in the content"
            title="Sarcasm"
            intro="This text has sarcasm of type"
          />
        ) : (
          <DisabledBlock icon="" title="Sarcasm was not detected" />
        )}
        <Block
          backgroundColor={Colors.lightPrimary}
          titleColor={Colors.primary}
          icon="?"
          result={prediction?.result?.sentimentTypeResult.prediction ?? ""}
          flavour="Result is based on the sentiment presence in the content"
          title="Sentiment"
          intro="This text has"
          outro="sentiment"
        />
        <Block
          backgroundColor={Colors.lightPrimary}
          titleColor={Colors.primary}
          icon="?"
          result={prediction?.result?.sentimentTextTypeResult.prediction ?? ""}
          flavour="This result indicates the type of text detected"
          title="Type"
          intro="This text looks like a"
        />
        <Block
          backgroundColor={Colors.lightPrimary}
          titleColor={Colors.primary}
          icon="?"
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
          icon="?"
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
        {/* Pass the sourcePredictionId if available */}
        {prediction?._id && <Reviews id={prediction._id} />}
      </ScrollView>
    </Screen>
  );
};

export default PredictionScreen;
