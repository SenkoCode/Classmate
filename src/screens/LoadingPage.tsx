import { SafeAreaView } from "react-native-safe-area-context";
import { ActivityIndicator, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { globalStyles } from "../style/style";

export default function LoadingPage() {
  return (
    <LinearGradient
      colors={["#0f172a", "#4338ca"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={style.container}
    >
      <SafeAreaView style={style.loader}>
        <ActivityIndicator size="large" color="#ffffff" />
      </SafeAreaView>
    </LinearGradient>
  );
}

const style = StyleSheet.create({
  loader: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  container: {
    flex: 1,
  },
});
