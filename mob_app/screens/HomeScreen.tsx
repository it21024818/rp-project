import * as React from "react";
import { Text, StyleSheet, View, ScrollView } from "react-native";
import ContainerFrame from "../components/ContainerFrame";
import HomePageComp from "../components/HomeDisplay";
import Font from "../constants/Font";
import { Color, FontSize, Padding, Border } from "../Styles/GlobalStyles";
import { useGetDetailedScheduledForUserQuery } from "../Redux/API/schedules.api.slice";
import { ActivityIndicator } from "react-native";
import { useEffect } from "react";
import Colors from "../constants/Colors";
import { useAppSelector } from "../hooks/redux-hooks";
import { DateUtils } from "../utils/DateUtils";
import { useNavigation } from "@react-navigation/native";

const Home = () => {
  const navigation = useNavigation();
  const user = useAppSelector((state) => state.user);
  const userID = user?._id;
  const date = new Date().toISOString().split("T")[0];
  const {
    data: detailedScheduleList,
    isLoading,
    isError,
    refetch: refetchDetaiedScheduleList,
  } = useGetDetailedScheduledForUserQuery({ userID, date });

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      refetchDetaiedScheduleList();
    });
    return unsubscribe;
  }, []);

  const getJoinedTaskList = () => {
    const allTaskLists: any[][] = detailedScheduleList.schedules.map(
      (schedule: any) =>
        schedule.taskList.map((task: any) => ({
          ...task,
          roomName: schedule.roomName,
        }))
    );
    const joinedTaskList = allTaskLists.flat(1);
    return joinedTaskList;
  };

  if (isLoading || isError) {
    return (
      <View style={styles.home}>
        <View style={styles.frameParent}>
          <ContainerFrame />
          {/* <ActivityIndicator
            style={styles.contentContainer}
            color="#0000ff"
            size="large"
          /> */}
        </View>
        <HomePageComp />
      </View>
    );
  }

  return (
    <View style={styles.home}>
      <View style={styles.frameParent}>
        <ContainerFrame />
      </View>
      <HomePageComp />
    </View>
  );
};

const styles = StyleSheet.create({
  noschedules: {
    paddingVertical: 60,
    paddingHorizontal: 30,
    color: Colors.colorTomato,
    fontSize: 20,
    fontFamily: Font["poppins-bold"],
  },
  contentContainer: {
    paddingVertical: 100,
  },
  viewAllBtn: {
    color: "#393f93",
    fontSize: 12,
    fontFamily: Font["poppins-regular"],
  },
  frameScrollViewContent: {
    marginHorizontal: 25,
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  frameFlexBox: {
    flexDirection: "row",
    position: "absolute",
    alignItems: "center",
    overflow: "hidden",
  },
  taskTypo: {
    textAlign: "left",
    color: Color.midnightblue,
    fontFamily: Font["poppins-semiBold"],
    fontWeight: "600",
    fontSize: FontSize.size_5xl,
    height: 32,
  },
  frameLayout1: {
    height: 100,
    width: 326,
    flexDirection: "row",
    left: 0,
    position: "absolute",
    alignItems: "center",
    overflow: "hidden",
  },
  parentLayout1: {
    paddingVertical: Padding.p_base,
    width: 98,
    borderRadius: Border.br_5xs,
    paddingHorizontal: Padding.p_xs,
  },
  textTypo: {
    fontFamily: Font["poppins-bold"],
    fontWeight: "700",
    color: Color.white,
    textAlign: "left",
  },
  parentLayout: {
    width: 155,
    paddingVertical: Padding.p_base,
    paddingHorizontal: Padding.p_xs,
    borderRadius: Border.br_5xs,
  },
  wrapperLayout: {
    paddingVertical: Padding.p_11xs,
    height: 20,
    width: 108,
    borderRadius: Border.br_10xs,
    position: "absolute",
  },
  altriumRoom01Typo: {
    height: 20,
    width: 83,
    fontSize: FontSize.size_3xs,
    fontFamily: Font["poppins-regular"],
    fontWeight: "500",
    textAlign: "left",
  },
  frameLayout: {
    height: 114,
    width: 322,
    backgroundColor: Color.ghostwhite,
    borderRadius: Border.br_mini,
  },
  todayTask: {},
  viewAll: {
    marginLeft: 119,
  },
  frame: {
    top: 388,
    width: 400,
    height: 32,
    flexDirection: "row",
    left: 0,
  },
  personal: {
    color: Color.white,
    fontFamily: Font["poppins-regular"],
    fontSize: FontSize.size_sm,
    textAlign: "left",
  },
  text: {
    fontSize: FontSize.size_xl,
    marginTop: 5,
  },
  personalParent: {
    backgroundColor: "#4cd97b",
  },
  workParent: {
    backgroundColor: "#4db5ff",
    marginLeft: 16,
  },
  educationParent: {
    backgroundColor: "#9059ff",
    marginLeft: 16,
  },
  frame1: {
    top: 258,
  },
  text3: {
    marginTop: 4,
    fontSize: FontSize.size_5xl,
    fontFamily: Font["poppins-bold"],
    fontWeight: "700",
  },
  tasksForDayParent: {
    backgroundColor: "#ffb259",
  },
  totalSheduledTimeParent: {
    backgroundColor: "#ff5959",
    marginLeft: 16,
  },
  frame2: {
    top: 142,
  },
  myTask: {
    top: 95,
    left: 0,
    position: "absolute",
    color: Color.midnightblue,
    fontFamily: Font["poppins-semiBold"],
    fontWeight: "600",
  },
  frameParent: {
    width: 327,
    height: 100,
  },
  seProjectGroup: {
    color: "#8f99eb",
  },
  seProjectGroupWrapper: {
    top: 73,
    left: 35,
    backgroundColor: "rgba(143, 153, 235, 0.2)",
    paddingHorizontal: Padding.p_xs,
    height: 20,
    width: 108,
    borderRadius: Border.br_10xs,
  },
  frameChild: {
    borderStyle: "solid",
    borderColor: "#8f99eb",
    borderRightWidth: 2,
    width: 2,
    height: 37,
  },
  projectProgressMeeting: {
    fontSize: FontSize.size_sm,
    color: Color.darkslateblue,
    fontFamily: Font["poppins-regular"],
    fontWeight: "500",
    textAlign: "left",
  },
  text4: {
    color: Color.lightsteelblue,
    fontFamily: Font["poppins-regular"],
    fontSize: FontSize.size_sm,
    textAlign: "left",
  },
  projectProgressMeetingParent: {
    width: 175,
    marginLeft: 16,
  },
  frame4: {
    top: 15,
    left: 19,
    width: 192,
    height: 49,
  },
  altriumRoom01: {
    color: Color.lightcoral_100,
  },
  altriumRoom01Wrapper: {
    top: 75,
    left: 36,
    backgroundColor: Color.lightcoral_200,
    paddingHorizontal: Padding.p_6xs,
    alignItems: "flex-end",
  },
  frameContainer: {
    marginTop: 18,
  },
  home: {
    backgroundColor: Color.white,
    marginTop: 20,
    width: "100%",
    maxHeight: "90%",
    paddingHorizontal: 0,
    paddingVertical: 37,
    alignItems: "center",
    overflow: "hidden",
    flex: 1,
  },
});

export default Home;
