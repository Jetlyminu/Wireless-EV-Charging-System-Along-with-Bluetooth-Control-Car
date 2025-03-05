import { AppRegistry } from "react-native";
import App from "./App";
import { name as jettus } from "./app.json";
import { Platform } from "react-native";

if (Platform.OS === "web") {
  import { render } from "react-dom";
  render(<App />, document.getElementById("root"));
} else {
  AppRegistry.registerComponent(jettus, () => App);
}
