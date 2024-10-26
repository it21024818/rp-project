import { Button, Text } from "native-base";
import React from "react";
import Colors from "../constants/Colors";

type Props = {
  isSelected?: boolean;
  onClick: (children: string) => void;
  children?: string;
};

const TagButton = ({ isSelected, onClick, children }: Props) => {
  return (
    <Button
      size="sm"
      variant="subtle"
      style={{
        borderRadius: 4,
        backgroundColor: isSelected ? Colors.lightPrimary : "transparent",
      }}
      onPress={() => onClick(children ?? "")}
    >
      <Text style={{ fontSize: 14, fontWeight: "500", color: Colors.primary }}>
        {children}
      </Text>
    </Button>
  );
};

export default TagButton;
