import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import RoomScheduleBox from "./schedule/roomScheduleBox";
import Colors from "../constants/Colors";
import Font from "../constants/Font";
import { useGetDetailedScheduledForUserQuery } from "../Redux/api/schedules.api.slice";
import { ActivityIndicator } from "react-native";
import { useState } from "react";
import { useEffect } from "react";
import { useAppSelector } from "../hooks/redux-hooks";
import moment from "moment";
import { Color } from "../Styles/GlobalStyles";
import { DateUtils } from "../utils/DateUtils";
import EmptyListPlaceholder from "./EmptyListPlaceholder";

interface ScheduleScreenProps {
  selectedDate?: Date;
  selectedCategory?: string;
}

const ScheduleScreen: React.FC<ScheduleScreenProps> = ({
  selectedDate,
  selectedCategory,
}) => {
  const user = useAppSelector((state) => state.user);
  const date = selectedDate?.toISOString().split("T")[0];
  const userID = user?._id;
  const {
    data,
    isFetching: isDetailedScheduleFetching,
    isError,
    refetch: refetchDetailedSchedules,
  } = useGetDetailedScheduledForUserQuery({
    userID,
    date,
  });

  const [groupedTaskList, setGroupedTaskList] = useState<Record<string, any[]>>(
    {}
  );

  // Cause a refetch everytime date is switched in calender.
  useEffect(() => {
    refetchDetailedSchedules();
  }, [selectedDate?.toDateString()]);

  // Once data comes through or category is changed, build grouped task list
  useEffect(() => {
    if (data) {
      const groupedTaskList: Record<string, any[]> = {};
      const schedules = data?.schedules ?? [];
      schedules.forEach((schedule: any) => {
        if (selectedCategory && selectedCategory !== schedule.tag) return;
        schedule.taskList.forEach((task: any) => {
          if (groupedTaskList[task.startTime] === undefined) {
            groupedTaskList[task.startTime] = [];
          }
          groupedTaskList[task.startTime].push(task);
        });
      });
      setGroupedTaskList(groupedTaskList);
    }
  }, [data, isDetailedScheduleFetching, selectedCategory]);

  const getSortedGroupedTaskList = (): [string, any[]][] => {
    const sortedKeys = Object.keys(groupedTaskList).sort((a, b) =>
      moment(a).isBefore(moment(b)) ? 1 : -1
    );
    return sortedKeys.map((key) => [key, groupedTaskList[key]]);
  };

  const getSelectedTaskTotalDuration = () => {
    const durationInMs = Object.values(groupedTaskList).reduce((a, b) => {
      const singleScheduleTotalDuration = b.reduce((c, d) => {
        const diffInMs = moment(d.endTime).diff(d.startTime);
        return diffInMs;
      }, 0);
      return a + singleScheduleTotalDuration;
    }, 0);
    const durationMoment = moment.duration(durationInMs);
    return DateUtils.getDurationAsString(durationMoment.asMilliseconds());
  };

  if (isDetailedScheduleFetching || isError) {
    return (
      <ActivityIndicator
        style={styles.contentContainer}
        color="#0000ff"
        size="large"
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.Box}>
        <Text style={styles.today}>Day Plan</Text>
        <Text>{getSelectedTaskTotalDuration()}</Text>
      </View>
      <FlatList
        data={getSortedGroupedTaskList()}
        keyExtractor={([startTime]) => startTime}
        renderItem={({ item: [startTime, tasks] }) => {
          const formattedStartDate = moment(startTime).format("LT");
          return (
            <View style={styles.timeSlotContainer}>
              <Text style={styles.timeSlot}>{formattedStartDate}</Text>
              {tasks.map((schedule: any) => (
                <RoomScheduleBox {...schedule} key={schedule._id} />
              ))}
            </View>
          );
        }}
        ListEmptyComponent={
          <EmptyListPlaceholder
            title={"Schedule is empty"}
            content={
              selectedCategory
                ? `No ${selectedCategory.toLocaleLowerCase()} tasks scheduled for ${moment(
                    selectedDate
                  ).format("MMM Do")}`
                : `No tasks scheduled for ${moment(selectedDate).format(
                    "MMM Do"
                  )}`
            }
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  emptyTaskListView: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  emptyTaskListText: {
    fontSize: 16,
    color: Color.dimgray,
  },
  contentContainer: {
    paddingVertical: 100,
  },
  container: {
    padding: 25,
  },
  Box: {
    height: 30,
    marginBottom: 30,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  timeSlotContainer: {
    marginBottom: 16,
  },
  timeSlot: {
    fontSize: 15,
    fontWeight: "bold",
    marginLeft: 5,
    marginBottom: 8,
    color: Colors.primary,
  },
  scheduleItem: {
    padding: 10,
    backgroundColor: "#e5e5e5",
    marginBottom: 8,
  },
  h45MinTypo: {
    fontFamily: Font["poppins-regular"],
    textAlign: "left",
  },
  today: {
    fontSize: 20,
    width: "auto",
    height: 26,
    fontFamily: Font["poppins-regular"],
    fontWeight: "500",
    textAlign: "left",
    color: Colors.darkText,
  },
  h45Min: {
    left: 260,
    color: "#000",
    width: 69,
    height: 19,
    fontSize: 14,
    fontFamily: Font["poppins-regular"],
    position: "absolute",
  },
});

export default ScheduleScreen;
