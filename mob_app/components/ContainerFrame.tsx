import * as React from "react";
import { Text, StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import Font from "../constants/Font";
import { FontSize, Color, Border } from "../Styles/GlobalStyles";
import { useAppSelector } from "../hooks/redux-hooks";

const ContainerFrame = () => {
  const user = useAppSelector((state) => state.user);
  const userName = user?.firstName;

  return (
    <View style={styles.topRow}>
      <View>
        <Text style={styles.hiTharindu}>Hi, {userName}</Text>
        <Text style={styles.letsMakeThis}>Let's ensure safer news...</Text>
      </View>
      <View style={styles.frame2}>
        <Image
          style={styles.personedSkinTonewhitePo}
          contentFit="cover"
          source={require("../assets/personed-skin-tonewhite-posture1-happy.png")}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  topRow: {
    marginTop: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  frameLayout: {
    height: 56,
    overflow: "hidden",
  },
  hiTharindu: {
    fontSize: FontSize.size_9xl,
    lineHeight: 31,
    fontWeight: "600",
    fontFamily: Font["poppins-regular"],
    color: Color.midnightblue,
    textAlign: "left",
  },
  letsMakeThis: {
    fontSize: FontSize.size_sm,
    lineHeight: 17,
    fontFamily: Font["poppins-regular"],
    color: Color.dimgray,
    marginTop: 8,
    textAlign: "left",
  },
  frame1: {
    overflow: "hidden",
  },
  personedSkinTonewhitePo: {
    width: 37,
    height: 36,
  },
  frame2: {
    borderRadius: Border.br_sm,
    backgroundColor: Color.white,
    shadowColor: "#f1f7ff",
    shadowOffset: {
      width: -3,
      height: 7,
    },
    shadowRadius: 13,
    elevation: 13,
    shadowOpacity: 1,
    alignItems: "center",
    overflow: "hidden",
  },
  frame: {
    position: "absolute",
    top: 20,
    left: 0,
    width: 327,
    flexDirection: "row",
    overflow: "hidden",
  },
});

export default ContainerFrame;
