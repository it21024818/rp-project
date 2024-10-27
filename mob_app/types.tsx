import { NativeStackScreenProps } from "@react-navigation/native-stack";
import dayjs, { Dayjs } from "dayjs";

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  ForgotPassword: undefined;
  Welcome: undefined;
  History: undefined;
  Prediction: undefined;
  RegisterCode: undefined;
  Login: undefined;
  Register: undefined;
  Home: undefined;
  children: undefined;
  BottomTab: undefined;
  CTasks: undefined;
  PersonalRoomSchedule: undefined;
  AdminRoomDetail: undefined;
  RoomManagmentProfileSetti: undefined;
  Settings: undefined;
  EditTask: undefined;
  AdminRoom: undefined;
  EditRoom: undefined;
  CreateRoom: undefined;
  TaskDetail: undefined;
  RoomDetails: undefined;
  AddTask: undefined;
  Screen1: undefined;
  Screen2: undefined;
  Screen3: undefined;
  Screen4: undefined;
};

//schedule types
export type scheduleTypes = {
  id: number;
  title: String;
  startTime: String;
  endTime: String;
  date: String;
  room: String;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;

//Bottom nav types

export enum TabElementDisplayOptions {
  ICON_ONLY = "icon-only",
  LABEL_ONLY = "label-only",
  BOTH = "both",
}

export enum DotSize {
  SMALL = "small",
  MEDIUM = "medium",
  LARGE = "large",
  DEFAULT = "default", // not in docs
}

export enum TabButtonLayout {
  VERTICAL = "vertical",
  HORIZONTAL = "horizontal",
}

export interface IAppearanceOptions {
  topPadding: number;
  bottomPadding: number;
  horizontalPadding: number;
  tabBarBackground: string;
  activeTabBackgrounds?: string | string[];
  activeColors?: string | string[];
  floating: boolean;
  dotCornerRadius: number;
  whenActiveShow: TabElementDisplayOptions;
  whenInactiveShow: TabElementDisplayOptions;
  dotSize: DotSize;
  shadow: boolean;
  tabButtonLayout: TabButtonLayout;
}

//Soft Tab Two
export interface TabTwoAppearanceOptions {
  topPadding: number;
  bottomPadding: number;
  horizontalPadding: number;
  tabBarBackground: string;
  activeTabBackgrounds?: string | string[];
  activeColors?: string | string[];
  activeTabColors?: string | string[];
  dotSize?: DotSize;
  tabButtonLayout: TabButtonLayout;
}

// Room Types

interface Task {
  id: number;
  title: string;
  startTime: string;
  endTime: string;
  date: string;
}

interface Member {
  id: number;
  name: string;
}

interface Admin {
  id: number;
  name: string;
}

export interface RoomType {
  id: number;
  name: string;
  tasks: Task[];
  members: Member[];
  admins: Admin[];
}

//
export type popTypes = {
  text: undefined;
  iconName: undefined;
  value: undefined;
};

// Types schdules

interface PopulatedScheduleDto {
  roomId: string;
  userId: string;
  date: Date;
  tag: RoomTag;
  totalScheduled: string;
  taskList: TaskType[];
}

export interface TaskType {
  taskId: string;
  taskName: string;
  startTime: string;
  endTime: string;
}

export interface Schedule {
  _id: string;
  userId: string;
  date: Date;
  schedules: PopulatedScheduleDto[];
}

enum RoomTag {
  OFFICE = "OFFICE",
  HOME = "HOME",
  EDUCATION = "EDUCATION",
  BUSINESS = "BUSINESS",
}

//tasks types

enum TaskPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

export interface Tasks {
  _id: string;
  name: string;
  description: string;
  duration: number;
  date: Date;
  priority: TaskPriority;
  roomId: string;
  assignedUserIds: string[];
  roomName: string;
  roomTag: string;
}

//rooms

export interface IRoom {
  _id: string;
  name: string;
  description: string;
  organization: string;
  tag: RoomTag;
}
