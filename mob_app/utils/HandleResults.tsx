import { useEffect } from "react";
import Toast from "react-native-toast-message";
import { setItem } from "./Genarals";
import { useNavigation } from "@react-navigation/native";
import RoutePaths from "./RoutePaths";
import { useAppDispatch } from "../hooks/redux-hooks";
import { setUser } from "../Redux/slices/userSlice";
import { useToast } from "native-base";
import ToastAlert from "../components/ToastAlert";

export const HandleResult = ({ result }: { result: any }) => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const toast = useToast();

  useEffect(() => {
    if (result.isError) {
      // Handle error response
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
      navigation.navigate("BottomTab");
      console.log("error");
    } else if (result.isSuccess) {
      // Handle success response
      const responseData = result.data;

      if (responseData?.tokens && responseData.user) {
        setItem(RoutePaths.token, responseData.tokens.accessToken);
        setItem("user", responseData.user);
        dispatch(setUser(responseData.user));

        toast.show({
          placement: "bottom",
          render: () => <ToastAlert title="Sign in successful" />,
        });

        navigation.navigate("BottomTab");
      } else {
        // Handle invalid response data
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
        console.log("error");
      }

      toast.show({
        placement: "bottom",
        render: () => <ToastAlert title="Log in successful" />,
      });
    }
  }, [result]);

  return null;
};
