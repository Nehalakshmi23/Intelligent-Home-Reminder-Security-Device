import { View, ActivityIndicator } from "react-native";
import { WebView } from "react-native-webview";
import { API_BASE_URL } from "../config/env";

export default function CameraView() {
  return (
    <View
      style={{
        height: 260,
        borderRadius: 12,
        overflow: "hidden",
        backgroundColor: "#000",
      }}
    >
      <WebView
        source={{ uri: `${API_BASE_URL}/video-feed` }}
        style={{ flex: 1 }}
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState
        renderLoading={() => <ActivityIndicator color="#fff" />}
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
      />
    </View>
  );
}
