import {
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
} from "react-native";
import React, { forwardRef, useState } from "react";
import Colors from "../constants/Colors";
import Font from "../constants/Font";
import FontSize from "../constants/FontSize";
import Spacing from "../constants/Spacing";
import { ActivityIndicator } from "react-native";

const AppTextInput = forwardRef(
  (
    {
      style,
      isLoading,
      editable,
      ...otherProps
    }: TextInputProps & { isLoading?: boolean },
    ref: React.LegacyRef<TextInput>
  ) => {
    const [focused, setFocused] = useState<boolean>(false);
    return (
      <View style={{ flex: otherProps?.multiline ? 1 : undefined }}>
        <TextInput
          ref={ref}
          editable={isLoading || editable}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholderTextColor={Colors.darkText}
          style={[
            {
              fontFamily: Font["poppins-regular"],
              fontSize: FontSize.small,
              padding: Spacing * 2,
              backgroundColor: Colors.lightPrimary,
              borderRadius: Spacing,
              marginVertical: Spacing,
            },
            focused && {
              borderWidth: 3,
              borderColor: Colors.primary,
              shadowOffset: { width: 4, height: Spacing },
              shadowColor: Colors.primary,
              shadowOpacity: 0.2,
              shadowRadius: Spacing,
            },
            style,
          ]}
          {...otherProps}
        />
        {isLoading && (
          <View
            style={{
              flex: 1,
              zIndex: 10,
              backgroundColor: "rgba(255,255,255,0.7)",
              position: "absolute",
              padding: Spacing * 2,
              width: "100%",
              height: "100%",
              borderRadius: Spacing,
              marginBottom: Spacing,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ActivityIndicator />
          </View>
        )}
      </View>
    );
  }
);

export default AppTextInput;

const styles = StyleSheet.create({});
