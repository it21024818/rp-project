import * as React from "react";
import {
  Text,
  StyleSheet,
  View,
  Pressable,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Image } from "expo-image";
import Colors from "../constants/Colors";
import Font from "../constants/Font";
import FontSize from "../constants/FontSize";
import { useNavigation } from "@react-navigation/native";
import { useState, useEffect } from "react";
import Popover from "react-native-popover-view";
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { useGetAllroomsQuery } from "../Redux/API/rooms.api.slice";
import RoutePaths from "../utils/RoutePaths";
import { removeItem } from "../utils/Genarals";
import { logoutCurrentUser } from "../Redux/slices/userSlice";
import { useAppDispatch, useAppSelector } from "../hooks/redux-hooks";
import { Button, Stack } from "native-base";
import LoadingIndictator from "../components/LoadingIndictator";
import PrimaryButton from "../components/PrimaryButton";
import EmptyListPlaceholder from "../components/EmptyListPlaceholder";
import AppTextInput from "../components/AppTextInput";
import Spacing from "../constants/Spacing";

const RoomManagmentProfileSetti = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);
  const {
    data: roomList,
    isFetching: isRoomListFetching,
    refetch: refetchRoomList,
  } = useGetAllroomsQuery(user._id, {
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    region: "",
    country: "",
    password: "",
  });

  const handleChange = (name: any, text: any) => {
    setData({ ...data, [name]: text });
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      refetchRoomList();
    });
    return unsubscribe;
  }, [navigation, refetchRoomList]);

  const ProfileActionsButton = () => {
    const [isPopoverVisible, setIsPopoverVisible] = useState<boolean>(false);

    const handleSettings = () => {
      navigation.navigate("Settings");
      setIsPopoverVisible(false); // Close the popover
    };

    const handleLogout = () => {
      removeItem(RoutePaths.token);
      removeItem("user");
      dispatch(logoutCurrentUser());
      navigation.navigate("Login");
      setIsPopoverVisible(false); // Close the popover
    };

    return (
      <Popover
        isVisible={isPopoverVisible}
        onRequestClose={() => setIsPopoverVisible(false)}
        from={
          <Pressable onPress={() => setIsPopoverVisible((prev) => !prev)}>
            <Image
              style={{
                width: 30,
                height: 30,
                borderRadius: 8,
              }}
              source={require("../assets/More-Square.png")}
            />
          </Pressable>
        }
      >
        <View style={styles.menuContainer}>
          <TouchableOpacity onPress={handleSettings} style={styles.textRow}>
            <Text>
              <AntDesign name="setting" size={14} color="black" /> Settings
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout} style={styles.textRow}>
            <Text>
              <Ionicons name="log-out-outline" size={14} color="black" /> Log
              Out
            </Text>
          </TouchableOpacity>
        </View>
      </Popover>
    );
  };

  const handleNavigate = () => {
    navigation.navigate("CreateRoom");
  };

  return (
    <View>
      <ScrollView style={{ padding: 25, marginTop: 25 }}>
        <View style={{ position: "absolute", zIndex: 1000, left: "92%" }}>
          <ProfileActionsButton />
        </View>
        <Stack space={4}>
          <Stack space={4} alignItems={"center"} justifyContent={"center"}>
            <View
              style={{
                backgroundColor: "white",
                borderRadius: 16,
                shadowOffset: { width: 0, height: 10 },
                shadowColor: Colors.primary,
                shadowOpacity: 0.1,
                shadowRadius: 8,
              }}
            >
              <Image
                style={{
                  width: 50,
                  height: 50,
                }}
                contentFit="cover"
                source={require("../assets/58-13.png")}
              />
            </View>

            <Text
              style={styles.nameText}
            >{`${user.firstName} ${user.lastName}`}</Text>
            <Text style={styles.emailText}>{user.email}</Text>
          </Stack>

          <View
            style={{
              marginVertical: Spacing,
            }}
          >
            <AppTextInput
              placeholder="firstName"
              onChangeText={(text) => handleChange("firstName", text)}
            />
            <AppTextInput
              placeholder="lastName"
              onChangeText={(text) => handleChange("lastName", text)}
            />
            <AppTextInput
              placeholder="Email"
              onChangeText={(text) => handleChange("email", text)}
            />
            <AppTextInput
              placeholder="region"
              onChangeText={(text) => handleChange("region", text)}
            />
            <AppTextInput
              placeholder="country"
              onChangeText={(text) => handleChange("country", text)}
            />
            <AppTextInput
              placeholder="password"
              secureTextEntry
              onChangeText={(text) => handleChange("password", text)}
            />
          </View>
        </Stack>

        <PrimaryButton label={"Create Room +"} onPress={handleNavigate} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  textRow: {
    marginVertical: 10,
  },
  menuContainer: {
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  nameText: {
    fontSize: 20,
    fontFamily: Font["poppins-semiBold"],
    fontWeight: "600",
    color: Colors.darkblue,
  },
  emailText: {
    fontSize: 14,
    fontFamily: Font["poppins-regular"],
  },
  // Other styles...
});

export default RoomManagmentProfileSetti;
