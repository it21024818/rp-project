import { useLocation } from "react-router-dom";
import RoutePaths from "./RoutePaths";
import AsyncStorage from '@react-native-async-storage/async-storage'; 

export const toggleLinkClass = (
  path: string,
  activeClass: string = active,
  inactiveClass: string = inactive
) => {
  const currentLink = useLocation().pathname;

  return currentLink === path ? activeClass : inactiveClass;
};

export const getItem = async (keyname: string) => {
  try {
    const value = await AsyncStorage.getItem(keyname);
    return value;
  } catch (error) {
    console.error('Error getting data: ', error);
    return null;
  }
};

export const setItem = async (keyname: string, value: string | Object) => {
  try {
    const valueString = typeof value !== 'string' ? JSON.stringify(value) : value.toString();
    await AsyncStorage.setItem(keyname, valueString);
  } catch (error) {
    console.error('Error storing data: ', error);
  }
};

export const removeItem = async (keyname: string) => {
  try {
    await AsyncStorage.removeItem(keyname);
  } catch (error) {
    console.error('Error removing data: ', error);
  }
};

export const checkLogin = async () => {
  try {
    const isLogged = await AsyncStorage.getItem(RoutePaths.token);
    return !!isLogged;
  } catch (error) {
    console.error('Error checking login: ', error);
    return false;
  }
};


export const BASE_URL = "http://localhost:3000"; // BASE URL FOR API FETCHING

const active = "d-block p-3 fd-nav-active"; // WHERE MENU IS ACTIVE CLASS

const inactive = "d-block p-3 text-black"; // WHERE MENU IS NOT ACTIVE CLASS