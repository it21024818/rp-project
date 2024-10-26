import * as react from "react";
import { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  Switch,
  Pressable,
  Modal,
  Alert,
} from "react-native";
import { useToast } from "native-base";
import Colors from "../constants/Colors";
import Font from "../constants/Font";
import FontSize from "../constants/FontSize";
import { useNavigation } from "@react-navigation/native";
import ConfirmationModal from "../components/ConfirmationModal";
import { useAppDispatch, useAppSelector } from "../hooks/redux-hooks";
import ToastAlert from "../components/ToastAlert";
import { useDeleteUserMutation } from "../Redux/API/users.api.slice";
import { removeItem } from "../utils/Genarals";
import RoutePaths from "../utils/RoutePaths";
import { logoutCurrentUser } from "../Redux/slices/userSlice";

const Settings = () => {
  const toast = useToast();
  const dispatch = useAppDispatch();
  const navigation = useNavigation(); // Get the navigation objec
  const userId = useAppSelector((state) => state.user);
  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] =
    useState<boolean>(false);
  const [isEnabled1, setIsEnabled1] = useState(false);
  const [isEnabled2, setIsEnabled2] = useState(false);
  const [deleteAccount] = useDeleteUserMutation();

  const toggleSwitchNottification = () =>
    setIsEnabled1((previousState) => !previousState);
  const toggleSwitchRings = () =>
    setIsEnabled2((previousState) => !previousState);

  const handleBackNav = () => {
    // Navigate to the previous screen
    navigation.goBack();
  };

  const handleDeleteAccountConfirm = async () => {
    try {
      console.log("Deleting user with id ", userId);
      await deleteAccount({ userId }).unwrap();
      console.log("Successfully deleted user with id ", userId);
      toast.show({
        placement: "bottom",
        render: () => (
          <ToastAlert
            title="Successfully Deleted Account"
            description="Bye bye!"
          />
        ),
      });
      removeItem(RoutePaths.token);
      removeItem("user");
      dispatch(logoutCurrentUser());
      navigation.navigate("Login");
      console.log("Logged out of account of user with id ", userId);
    } catch (error) {
      console.error(error);
      toast.show({
        placement: "bottom",
        render: () => (
          <ToastAlert
            title="Something went wrong"
            description="An error occurred, please try again later"
            type="error"
          />
        ),
      });
    }
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.box0}>
          <Pressable style={styles.rectangle} onPress={handleBackNav}>
            <Image
              style={styles.backImg}
              source={require("../assets/Arrow.png")}
            />
          </Pressable>
          <Text style={styles.typo1}>Settings</Text>
        </View>
        <View style={styles.box1}>
          <Text style={styles.typoTitle}>Genaral</Text>
        </View>
        <View style={styles.box1}>
          <Text style={styles.typoBoddy}>Language</Text>
          <Pressable style={{ flexDirection: "row" }} onPress={() => {}}>
            <Text style={[styles.typoBoddy, styles.typoRight]}>English</Text>
            <Image
              style={[styles.arwImg, { transform: [{ rotate: "180deg" }] }]}
              source={require("../assets/Arrow.png")}
            />
          </Pressable>
        </View>
        <View style={styles.box1}>
          <Pressable onPress={() => setIsDeleteAccountModalOpen(true)}>
            <Text style={styles.typoBoddy}>Delete Account</Text>
          </Pressable>
        </View>
        <View style={[styles.box1, { marginTop: 20 }]}>
          <Text style={styles.typoTitle}>Notifications</Text>
        </View>
        <View style={styles.box1}>
          <Text style={styles.typoBoddy}>Allow Notification</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#5B67CA" }}
            thumbColor={isEnabled1 ? "#fffff" : "#f4f3f4"}
            ios_backgroundColor="#B1C0DE"
            onValueChange={toggleSwitchNottification}
            value={isEnabled1}
            style={styles.troggle1}
          />
        </View>
        <View style={styles.box1}>
          <Text style={styles.typoBoddy}>Allow the Notification Rings</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#5B67CA" }}
            thumbColor={isEnabled2 ? "#fffff" : "#f4f3f4"}
            ios_backgroundColor="#B1C0DE"
            onValueChange={toggleSwitchRings}
            value={isEnabled2}
            style={styles.troggle2}
          />
        </View>
      </View>
      <ConfirmationModal
        isOpen={isDeleteAccountModalOpen}
        onCancel={() => setIsDeleteAccountModalOpen(false)}
        onConfirm={handleDeleteAccountConfirm}
      >
        Are you sure you want to delete your account? The rooms and tasks you
        have made will be left intact.
      </ConfirmationModal>
    </>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    top: 60,
    marginHorizontal: 25,
  },
  box0: {
    flex: 1,
    flexDirection: "row",
    maxHeight: 120,
  },
  box1: {
    flex: 1,
    flexDirection: "row",
    maxHeight: 50,
  },
  typo1: {
    marginLeft: 90,
    marginTop: 4,
    color: Colors.darkblue,
    fontFamily: Font["poppins-semiBold"],
    fontSize: FontSize.large,
  },
  typoTitle: {
    color: Colors.darkblue,
    fontFamily: Font["poppins-semiBold"],
    fontSize: FontSize.medium,
  },
  typoTitle1: {
    color: Colors.darkblue,
    fontFamily: Font["poppins-semiBold"],
    fontSize: FontSize.large,
  },
  typoBoddy: {
    color: Colors.darkblue,
    fontFamily: Font["poppins-regular"],
    fontSize: FontSize.medium,
  },
  typoRight: {
    marginLeft: 170,
  },
  backImg: {
    marginTop: 8,
  },
  arwImg: {
    margin: 4,
    height: 15,
    width: 15,
  },
  rectangle: {
    width: 40,
    height: 40,
    backgroundColor: Colors.colorWhite,
    borderRadius: 10,
    shadowColor: Colors.darkText,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 2,
    alignItems: "center",
    verticalAlign: "middle",
  },
  troggle1: {
    marginLeft: 140,
  },
  troggle2: {
    marginLeft: 62,
  },
  CheckboxSpace1: {
    marginLeft: 190,
  },
  CheckboxSpace2: {
    marginLeft: 187,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
    justifyContent: "center",
    alignItems: "center",
  },

  // Model Styles
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
