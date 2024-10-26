import { View, Text, Skeleton } from "native-base";
import React from "react";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import Colors from "../constants/Colors";
import Font from "../constants/Font";
import FontSize from "../constants/FontSize";
import { LinearGradient } from "expo-linear-gradient";

type Props = {
  title: string;
  content: string;
  wrapperStyle?: StyleProp<ViewStyle>;
  isLoading?: boolean;
};

const DataBlock = (props: Props) => {
  const { title, content, wrapperStyle, isLoading } = props;
  return (
    <View style={[styles.dataBlockWrapper, wrapperStyle]}>
      {false ? (
        <>
          <Skeleton
            borderRadius={4}
            maxWidth={24}
            height={4}
            marginBottom={2.5}
            startColor={"white"}
            opacity={0.2}
          />
          <Skeleton
            borderRadius={4}
            maxWidth={40}
            height={4}
            startColor={"white"}
            opacity={0.2}
          />
        </>
      ) : (
        <>
          <Text style={styles.titleText}>{title}</Text>
          <Text style={styles.contentText}>{content}</Text>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  dataBlockWrapper: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: Colors.lightPrimary,
  },
  titleText: {
    fontFamily: Font["poppins-bold"],
    fontSize: FontSize.medium,
    color: Colors.primary,
  },
  contentText: {
    fontFamily: Font["poppins-regular"],
    fontSize: FontSize.medium,
    color: Colors.midPrimary,
  },
});

export default DataBlock;
