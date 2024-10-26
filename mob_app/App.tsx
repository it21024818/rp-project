import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import fonts from "./config/fonts";
import store from "./Redux/store";
import Navigation from "./navigation";
import { Provider } from "react-redux";
import { LogBox } from "react-native";
import { NativeBaseProvider } from "native-base";
import { ThemeProvider, Provider as PaperProvider } from "react-native-paper";

// Ignore log notification by message:
LogBox.ignoreLogs(["Warning: ..."]);

// Ignore all log notifications:
LogBox.ignoreAllLogs();

export default function App() {
  const [fontsLoaded] = useFonts(fonts);

  return !fontsLoaded ? null : (
    <Provider store={store}>
      <SafeAreaProvider>
        <PaperProvider>
          <ThemeProvider>
            <NativeBaseProvider>
              <Navigation />
              <StatusBar />
            </NativeBaseProvider>
          </ThemeProvider>
        </PaperProvider>
      </SafeAreaProvider>
    </Provider>
  );
}
