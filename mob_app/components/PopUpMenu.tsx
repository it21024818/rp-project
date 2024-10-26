// SimpleMenu.js
import {
    Menu,
    MenuProvider,
    MenuOptions,
    MenuOption,
    MenuTrigger,
   } from "react-native-popup-menu";
   import { Entypo } from "@expo/vector-icons";
   import { StyleSheet } from "react-native";
   import { Color } from "../Styles/GlobalStyles";
   
   const DotMenu = () => {
    return (
      <MenuProvider style={styles.container}>
        <Menu>
          <MenuTrigger
       
          >
            <Entypo name="dots-three-vertical" size={10} color="black" />
          </MenuTrigger>
          <MenuOptions>
            <MenuOption onSelect={() => alert(`Save`)} text="Save" />
            <MenuOption onSelect={() => alert(`Delete`)} text="Delete" />
          </MenuOptions>
        </Menu>
      </MenuProvider>
    );
   };
   
   export default DotMenu;

   const styles = StyleSheet.create({
    container: {
        backgroundColor: Color.ghostwhite,
    },
   });
   