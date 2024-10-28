import {
  Text,
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Font from "../constants/Font";
import { Color, FontSize } from "../Styles/GlobalStyles";
import { ActivityIndicator } from "react-native";
import { useCallback, useEffect, useState } from "react";
import Colors from "../constants/Colors";
import { useAppDispatch, useAppSelector } from "../hooks/redux-hooks";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Ionicons as Icon } from "@expo/vector-icons";
import Screen from "../components/Screen";
import { useGetPredictionsMutation } from "../Redux/API/predictions.api.slice";
import { PredictionDto } from "../types/types";
import moment from "moment";
import { setUser } from "../Redux/slices/userSlice";
import ScreenHeader from "../components/ScreenHeader";
import { Skeleton } from "native-base";

const HistoryScreen = () => {
  const { navigate } = useNavigation();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);
  const [getPredictions, { isLoading: isGetPredictionsLoading }] =
    useGetPredictionsMutation();
  const [data, setData] = useState<PredictionDto[]>([]);
  const [pageNum, setPageNum] = useState<number>(1);

  const isLoading = isGetPredictionsLoading;

  const getPredictionPage = async (pageNum: number) => {
    const predictionPage = await getPredictions({
      pageNum: pageNum,
      pageSize: 20,
      userId: user.user?._id ?? "",
    }).unwrap();
    setData((prev) => [...prev, ...predictionPage.content]);
  };

  useFocusEffect(
    useCallback(() => {
      setData([]);
      getPredictionPage(1);
    }, [user.user?._id])
  );

  const handlePredictionPress = (prediction: PredictionDto) => {
    navigate("Prediction", { prediction } as any);
  };

  return (
    <Screen contentStyle={{ height: "92%" }}>
      <ScrollView
        stickyHeaderIndices={[0]}
        contentContainerStyle={{ gap: 8 }}
        scrollEventThrottle={10000}
        onScroll={({ nativeEvent }) => {
          const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
          const paddingToBottom = 256;
          if (
            !isLoading &&
            layoutMeasurement.height + contentOffset.y >=
              contentSize.height - paddingToBottom
          ) {
            getPredictionPage(pageNum + 1);
            setPageNum((prev) => prev + 1);
          }
        }}
      >
        <ScreenHeader title="History" hasLogoutAction />
        {data.map((item, idx) => (
          <TouchableOpacity
            key={idx}
            onPress={() => handlePredictionPress(item)}
          >
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
                    {item.text}
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
                    {moment(item.createdAt ?? "").format("MMM Do YY")}
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
                      {item.result?.finalFakeResult ? "True" : "Fake"}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
        {(data.length < 1 || isLoading) && (
          <Skeleton
            style={{
              height: 106,
              borderRadius: 8,
              backgroundColor: Colors.lightPrimary,
              justifyContent: "center",
            }}
          />
        )}
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
