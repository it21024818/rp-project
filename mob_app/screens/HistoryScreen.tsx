import {
  Text,
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import ContainerFrame from "../components/ContainerFrame";
import HomePageComp from "../components/HomeDisplay";
import Font from "../constants/Font";
import { Color, FontSize, Padding, Border } from "../Styles/GlobalStyles";
import { useGetDetailedScheduledForUserQuery } from "../Redux/API/schedules.api.slice";
import { ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import Colors from "../constants/Colors";
import { useAppSelector } from "../hooks/redux-hooks";
import { DateUtils } from "../utils/DateUtils";
import { useNavigation } from "@react-navigation/native";
import { Button, Card, Input } from "native-base";
import AppTextInput from "../components/AppTextInput";
import PrimaryButton from "../components/PrimaryButton";
import { Ionicons as Icon } from "@expo/vector-icons";
import Screen from "../components/Screen";

const HistoryScreen = () => {
  const { navigate } = useNavigation();
  const user = useAppSelector((state) => state.user);

  const isLoading = true;

  const handlePredictionPress = (id?: string) => {
    navigate("Prediction");
  };

  return (
    <Screen contentStyle={{ height: "92%" }}>
      <ScrollView stickyHeaderIndices={[0]}>
        <View
          style={{
            backgroundColor: Colors.colorWhite,
            paddingBottom: 10,
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Text
              style={{
                fontSize: FontSize.size_9xl,
                fontWeight: "600",
                color: Colors.primary,
                fontFamily: Font["poppins-bold"],
              }}
            >
              History
            </Text>
            <View style={{ flex: 1 }} />
            <TouchableOpacity onPress={() => navigate("Login")}>
              <Icon name={"log-out-outline"} color={Colors.primary} size={30} />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity onPress={() => handlePredictionPress()}>
          <View
            style={[
              {
                height: 106,
                borderRadius: 8,
                backgroundColor: Colors.lightPrimary,
                padding: 16,
                justifyContent: "center",
              },
            ]}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                height: "100%",
                width: "100%",
              }}
            >
              <View
                style={{
                  backgroundColor: Colors.primary,
                  borderRadius: 8,
                  marginRight: 8,
                  width: "20%",
                  height: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon name="arrow-forward-circle" size={24} color={"white"} />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  numberOfLines={1}
                  style={[
                    {
                      fontSize: FontSize.size_base,
                      fontWeight: "600",
                      flex: 1,
                      marginBottom: 4,
                    },
                  ]}
                >
                  Blah Blah Blah Blah Blah Blah Blah Blah
                </Text>
                <Text
                  style={[
                    {
                      fontSize: FontSize.size_sm,
                      flex: 1,
                      marginBottom: 4,
                    },
                  ]}
                >
                  Mar 1, 2023
                </Text>
                <View
                  style={{
                    flex: 1,
                    backgroundColor: Colors.midPrimary,
                    borderRadius: 4,
                    padding: 4,
                    width: 60,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={[
                      {
                        fontSize: FontSize.size_base,
                        fontWeight: "600",
                        color: Colors.primary,
                      },
                    ]}
                  >
                    True
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: Color.white,
    marginTop: 20,
    width: "100%",
    maxHeight: "88%",
    paddingHorizontal: 20,
    paddingVertical: 37,
    overflow: "hidden",
    flex: 1,
  },
});

export default HistoryScreen;
