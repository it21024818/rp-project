import React from "react";
import Colors from "../constants/Colors";
import { Button, Text } from "native-base";
import { Label } from "./navBottom/UIComponents";
import { StyleProp, TextStyle, ViewStyle } from "react-native";

type Props = {
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
}: Props) => {
  return (
    <Button
      isLoading={isLoading}
      onPress={onPress}
      style={[
        {
          height: 60,
          marginTop: 10,
          borderRadius: 8,
          backgroundColor: Colors.primary,
        },
        buttonStyle,
      ]}
    >
      <Text
        style={[
          {
            fontSize: 18,
            fontWeight: "600",
            color: Colors.colorWhite,
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
