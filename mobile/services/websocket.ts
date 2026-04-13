import { Audio } from "expo-av";
import { API_BASE_URL } from "../config/env";

const sounds: Record<string, any> = {
  emergency: require("../assets/sounds/emergency.mp3"),
  security: require("../assets/sounds/security.mp3"),
  reminder: require("../assets/sounds/reminder.mp3"),
};

export function startAlertSocket() {
  // Configure audio mode for playback
  Audio.setAudioModeAsync({
    playsInSilentModeIOS: true,
    staysActiveInBackground: true,
    shouldDuckAndroid: true,
  });

  const wsUrl = API_BASE_URL.replace("https", "wss") + "/ws/alerts";
  console.log("Attempting to connect to WebSocket:", wsUrl);

  const ws = new WebSocket(wsUrl);

  ws.onopen = () => {
    console.log("✅ WebSocket connected successfully!");
  };

  ws.onmessage = async (event) => {
    const alert = JSON.parse(event.data);
    console.log("Alert received:", alert);

    if (sounds[alert.type]) {
      try {
        const { sound } = await Audio.Sound.createAsync(sounds[alert.type]);
        console.log("Playing sound for:", alert.type);
        await sound.playAsync();
      } catch (error) {
        console.error("Error playing sound:", error);
      }
    }
  };

  ws.onerror = (error) => {
    console.error("❌ WebSocket error:", error);
    console.error(
      "Check if the server is running and supports WebSocket at:",
      wsUrl,
    );
  };

  ws.onclose = (event) => {
    console.log("WebSocket closed. Code:", event.code, "Reason:", event.reason);
  };
}
