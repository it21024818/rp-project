import { View, Text } from "native-base";
import React from "react";
import Colors from "../constants/Colors";

type Props = {
  title?: string;
  content?: string;
};

const EmptyListPlaceholder = ({ title = "No Items found", content }: Props) => {
  return (
    <View
      style={{
        width: "100%",
        backgroundColor: Colors.lightPrimary,
        paddingVertical: 20,
        paddingHorizontal: 20,
        borderRadius: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
      }}
    >
      <Text
        style={{
          fontSize: 18,
          fontWeight: "600",
          color: Colors.primary,
          textAlign: "center",
        }}
      >
        {title}
      </Text>
      <Text
        style={{
          fontSize: 14,
          textAlign: "center",
          color: Colors.midPrimary,
        }}
      >
        {content}
      </Text>
    </View>
  );
};

export default EmptyListPlaceholder;
