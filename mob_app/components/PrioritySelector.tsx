import { Box, Pressable, Select } from "native-base";
import Dropdown from "react-native-paper-dropdown";
import React, { useState } from "react";
import { StyleSheet } from "react-native";

type Props = {
  value: string;
  onChange: (value?: string) => void;
};

const PrioritySelector = ({ value, onChange }: Props) => {
  return (
    <Box>
      <Select
        placeholder="Choose Priority"
        selectedValue={value}
        onValueChange={onChange}
        style={styles.selectInput}
      >
        <Select.Item label={"High"} value="HIGH" />
        <Select.Item label={"Medium"} value="MEDIUM" />
        <Select.Item label={"Low"} value="LOW" />
      </Select>
    </Box>
  );
};

const styles = StyleSheet.create({
  selectInput: {
    height: 50,
    fontSize: 14,
  },
});

export default PrioritySelector;
