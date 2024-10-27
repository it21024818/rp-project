import React from "react";
import { SafeAreaView, View, ViewProps } from "react-native";

type Props = { children: React.ReactNode; contentStyle?: ViewProps["style"] };

const Screen = ({ children, contentStyle }: Props) => {
  return (
    <SafeAreaView>
      <View
        style={[
          {
            width: "100%",
            paddingHorizontal: 20,
            height: "100%",
          },
          contentStyle,
        ]}
      >
        {children}
      </View>
    </SafeAreaView>
  );
};

export default Screen;
