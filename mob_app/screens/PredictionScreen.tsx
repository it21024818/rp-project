import {
  Text,
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  ImageBackground,
} from "react-native";
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
import { Button, Card, Input } from "native-base";
import AppTextInput from "../components/AppTextInput";
import PrimaryButton from "../components/PrimaryButton";
import { Ionicons as Icon } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Screen from "../components/Screen";

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

const PredictionScreen = () => {
  const { goBack } = useNavigation();
  const user = useAppSelector((state) => state.user);

  const isLoading = true;

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
        <Block
          backgroundColor={Colors.lightPrimary}
          titleColor={Colors.primary}
          icon="?"
          result="False"
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
        <Block
          backgroundColor={Colors.lightPrimary}
          titleColor={Colors.primary}
          icon="?"
          result="Generic"
          flavour="Result is based on analysis of sarcasm presence in the content"
          title="Sarcasm"
          intro="This text has sarcasm of type"
        />
        <Block
          backgroundColor={Colors.lightPrimary}
          titleColor={Colors.primary}
          icon="?"
          result="Positive"
          flavour="Result is based on the sentiment presence in the content"
          title="Sentiment"
          intro="This text has"
          outro="sentiment"
        />
        <Block
          backgroundColor={Colors.lightPrimary}
          titleColor={Colors.primary}
          icon="?"
          result="Tweet"
          flavour="This result indicates the type of text detected"
          title="Type"
          intro="This text looks like a"
        />
        <Block
          backgroundColor={Colors.lightPrimary}
          titleColor={Colors.primary}
          icon="?"
          result="Bad"
          flavour="This result is based on the analysis of text quality in the text"
          title="Text Quality"
          intro="This text seems to exhibit"
          outro="text quality"
        />
        <Block
          backgroundColor={Colors.lightPrimary}
          titleColor={Colors.primary}
          icon="?"
          result="Right-Leaning"
          flavour="This result is based on the presence of political bias in the content with regards to the US political system"
          title="Political Bias"
          intro="This text seems to be"
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
        <NewsBlock
          title="Title: The Thing (1982) - IMD"
          description="The Thing: Directed by John Carpenter. With Kurt Russell, Wilford Brimley, T.K. Carter, David Clennon. A research team in Antarctica is hunted by a"
        />
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: Color.white,
    marginTop: 20,
    width: "100%",
    maxHeight: "88%",

    paddingVertical: 37,
    overflow: "hidden",
    flex: 1,
    gap: 8,
  },
});

export default PredictionScreen;
