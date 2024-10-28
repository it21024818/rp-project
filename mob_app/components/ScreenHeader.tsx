import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Colors from "../constants/Colors";
import { FontSize } from "../Styles/GlobalStyles";
import Font from "../constants/Font";
import { useAppDispatch } from "../hooks/redux-hooks";
import { Ionicons as Icon } from "@expo/vector-icons";
import { setUser } from "../Redux/slices/userSlice";
import { useNavigation } from "@react-navigation/native";

type Props = {
  title: string;
  hasBackAction?: boolean;
  hasLogoutAction?: boolean;
  rightActions?: {
    icon: string;
    onPress: Function;
  }[];
  leftActions?: {
    icon: string;
    onPress: Function;
  }[];
};

const ScreenHeader = ({
  hasBackAction,
  title,
  leftActions = [],
  rightActions = [],
  hasLogoutAction,
}: Props) => {
  const { goBack, navigate } = useNavigation();
  const dispatch = useAppDispatch();

  const getLeftActions = () => {
    let temp = leftActions;
    if (hasBackAction) {
      temp = [
        {
          icon: "arrow-back",
          onPress: goBack,
        },
        ...leftActions,
      ];
    }
    return temp;
  };

  const getRightActions = () => {
    let temp = rightActions;
    if (hasLogoutAction) {
      temp = [
        {
          icon: "log-out-outline",
          onPress: () => {
            dispatch(setUser({}));
            navigate("Login");
          },
        },
        ...rightActions,
      ];
    }
    return temp;
  };

  return (
    <View
      style={{
        backgroundColor: Colors.colorWhite,
        paddingBottom: 10,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
        }}
      >
        {getLeftActions()?.map(({ icon, onPress }) => (
          <TouchableOpacity onPress={() => onPress()}>
            <Icon name={icon as any} color={Colors.primary} size={30} />
          </TouchableOpacity>
        ))}
        <Text
          style={{
            fontSize: FontSize.size_9xl,
            fontWeight: "600",
            color: Colors.primary,
            fontFamily: Font["poppins-bold"],
          }}
        >
          {title}
        </Text>
        <View style={{ flex: 1 }} />
        {getRightActions()?.map(({ icon, onPress }) => (
          <TouchableOpacity onPress={() => onPress()}>
            <Icon name={icon as any} color={Colors.primary} size={30} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default ScreenHeader;
