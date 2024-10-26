import {
  Box,
  FormControl,
  Input,
  Select,
  Text,
  TextArea,
  WarningOutlineIcon,
} from "native-base";
import React from "react";
import { StyleSheet } from "react-native";
import { Color } from "../Styles/GlobalStyles";
import Colors from "../constants/Colors";
import Font from "../constants/Font";
import FontSize from "../constants/FontSize";

type Props = {
  isError?: boolean;
  errorMessage?: string;
  label?: string;
  placeholder?: string;
  value?: string;
  type?: "password" | "textarea" | "text" | "select";
  options?: { label: string; value: string }[];
  onChange: (text: string) => void;
};

const commonBorderRadius = 8;

const FormInputField = ({
  errorMessage,
  label,
  placeholder,
  type,
  isError,
  onChange,
  options,
  value,
}: Props) => {
  const getInternalInput = () => {
    if (type === "select") {
      return (
        <Select
          style={styles.commonInputField}
          size={"xl"}
          onValueChange={onChange}
          borderRadius={commonBorderRadius}
          selectedValue={value}
        >
          {options?.map(({ label, value }) => (
            <Select.Item key={value} value={value} label={label} />
          ))}
        </Select>
      );
    }

    if (type === "textarea") {
      return (
        <TextArea
          style={styles.commonInputField}
          placeholder={placeholder}
          size={"xl"}
          autoCorrect={false}
          autoCapitalize={"none"}
          autoCompleteType={false}
          onChangeText={onChange}
          borderRadius={commonBorderRadius}
          value={value}
          _focus={{
            backgroundColor: Colors.lightPrimary,
            style: [styles.commonInputField, styles.commonInputFocusField],
            borderColor: Colors.primary,
          }}
        />
      );
    }

    return (
      <Input
        style={styles.commonInputField}
        placeholder={placeholder}
        size={"xl"}
        type={type}
        autoCorrect={false}
        autoCapitalize={"none"}
        onChangeText={onChange}
        borderRadius={commonBorderRadius}
        value={value}
        _focus={{
          style: [styles.commonInputField, styles.commonInputFocusField],
          borderColor: Colors.primary,
        }}
      />
    );
  };

  return (
    <Box alignItems="center">
      <FormControl isInvalid={isError}>
        <FormControl.Label>
          <Text style={styles.labelText}>{label}</Text>
        </FormControl.Label>
        {getInternalInput()}
        <FormControl.ErrorMessage>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </FormControl.ErrorMessage>
      </FormControl>
    </Box>
  );
};

const styles = StyleSheet.create({
  commonInputField: {
    height: 60,
    fontSize: FontSize.small,
  },
  commonInputFocusField: {
    backgroundColor: Colors.lightPrimary,
    fontSize: FontSize.small,
  },
  labelText: {
    color: Colors.darkblue,
    fontFamily: Font["poppins-regular"],
    fontSize: FontSize.medium,
    marginBottom: 6,
  },
  errorText: {
    fontFamily: Font["poppins-regular"],
    fontSize: FontSize.small,
  },
});

export default FormInputField;
