import { View, Text } from "native-base";
import React from "react";
import { StyleSheet } from "react-native";
import Colors from "../constants/Colors";

type Props = {
  title?: string;
  description?: string;
  type?: "info" | "error";
};

const ToastAlert = ({ title, description, type = "info" }: Props) => {
  const getAccentStyle = () => {
    const accentStyle = {
      backgroundColor: Colors.primary,
    };
    if (type === "error") {
      accentStyle.backgroundColor = Colors.colorTomato;
    }
    return accentStyle;
  };

  return (
    <View style={styles.shadowView}>
      <View style={styles.containerView}>
        <View style={[styles.topAccentView, getAccentStyle()]} />
        <View style={styles.contentView}>
          <Text style={styles.titleText}>{title}</Text>
          <Text style={styles.descriptionText}>{description}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  shadowView: {
    shadowOffset: { width: 0, height: 4 },
    shadowColor: Colors.primary,
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  containerView: {
    backgroundColor: Colors.colorWhite,
    borderRadius: 8,
    padding: 18,
    position: "relative",
    overflow: "hidden",
  },
  topAccentView: {
    position: "absolute",
    width: "120%",
    height: 4,
  },
  contentView: {},
  titleText: {
    fontWeight: "600",
    fontSize: 16,
    marginBottom: 4,
  },
  descriptionText: {},
});

export default ToastAlert;
