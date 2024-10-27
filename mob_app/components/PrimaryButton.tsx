import React from "react";
import Colors from "../constants/Colors";
import { Button, Text } from "native-base";
import { Label } from "./navBottom/UIComponents";
import { StyleProp, TextStyle, ViewStyle } from "react-native";

type Props = {
  variant?: "PRIMARY" | "SUBTLE";
  onPress?: () => void;
  label?: string;
  buttonStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  isLoading?: boolean;
};

const PrimaryButton = ({
  onPress,
  label,
  buttonStyle,
  textStyle,
  isLoading,
  variant = "PRIMARY",
}: Props) => {
  const getBackground = () => {
    switch (variant) {
      case "PRIMARY":
        return Colors.primary;
      case "SUBTLE":
        return Colors.lightPrimary;
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case "PRIMARY":
        return Colors.colorWhite;
      case "SUBTLE":
        return Colors.primary;
    }
  };

  return (
    <Button
      isLoading={isLoading}
      onPress={onPress}
      style={[
        {
          height: 60,
          marginTop: 10,
          borderRadius: 8,
          backgroundColor: getBackground(),
        },
        buttonStyle,
      ]}
    >
      <Text
        style={[
          {
            fontSize: 18,
            fontWeight: "600",
            color: getTextColor(),
            textAlign: "center",
          },
          textStyle,
        ]}
      >
        {label}
      </Text>
    </Button>
  );
};

export default PrimaryButton;
