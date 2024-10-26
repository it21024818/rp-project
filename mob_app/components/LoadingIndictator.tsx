import { View } from "native-base";
import React from "react";
import { ActivityIndicator, StyleSheet } from "react-native";

type Props = {};

const LoadingIndictator = (props: Props) => {
  return (
    <View style={styles.loaderWrapper}>
      <ActivityIndicator
        style={styles.contentContainer}
        color="#0000ff"
        size="large"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainer: {},
  loaderWrapper: {
    display: "flex",
    height: "auto",
    width: "100%",
    justifyContent: "center",
  },
});

export default LoadingIndictator;
