import { StatusBar } from "expo-status-bar";
import { SafeAreaView, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

const pwaUrl = process.env.EXPO_PUBLIC_ROAMFX_URL || "https://roamfx-frontend.onrender.com";

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <WebView
        source={{ uri: pwaUrl }}
        startInLoadingState
        allowsBackForwardNavigationGestures
        javaScriptEnabled
        domStorageEnabled
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f6f0"
  }
});
