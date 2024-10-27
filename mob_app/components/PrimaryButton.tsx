import React from "react";
import Colors from "../constants/Colors";
import { Button, Text } from "native-base";
import { Label } from "./navBottom/UIComponents";
import { StyleProp, TextStyle, View, ViewStyle } from "react-native";
import { Ionicons as Icon } from "@expo/vector-icons";

type Props = {
  variant?: "PRIMARY" | "SUBTLE" | "TEXT";
  onPress?: () => void;
  label?: string;
  buttonStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  isLoading?: boolean;
  icon?: string;
};

const PrimaryButton = ({
  onPress,
  label,
  buttonStyle,
  textStyle,
  isLoading,
  variant = "PRIMARY",
  icon,
}: Props) => {
  const getBackground = () => {
    switch (variant) {
      case "PRIMARY":
        return Colors.primary;
      case "SUBTLE":
        return Colors.lightPrimary;
      case "TEXT":
        return undefined;
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case "PRIMARY":
        return Colors.colorWhite;
      case "SUBTLE":
        return Colors.primary;
      case "TEXT":
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
      <View
        style={{
          gap: 4,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon && <Icon name={icon as any} color={getTextColor()} size={32} />}
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
      </View>
    </Button>
  );
};

export default PrimaryButton;
