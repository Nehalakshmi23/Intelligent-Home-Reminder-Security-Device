import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { api } from "../../services/api";
import { soundService } from "../../services/sound";

type AlertType = "all" | "motion" | "emergency" | "security" | "reminder";

type Alert = {
  id: string;
  type: AlertType;
  message: string;
  timestamp: string;
};

export default function AlertsScreen() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filter, setFilter] = useState<AlertType>("all");
  const [refreshing, setRefreshing] = useState(false);
  const [lastAlertId, setLastAlertId] = useState<string | null>(null);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const fetchAlerts = async () => {
    try {
      const res = await api.get("/alerts");
      const newAlerts = res.data;
      
      console.log(`📋 Fetched ${newAlerts.length} alerts`);
      
      // Check if there's a new alert (play sound)
      if (newAlerts.length > 0) {
        const latestAlert = newAlerts[0];
        console.log(`Latest alert ID: ${latestAlert.id}, Last ID: ${lastAlertId}`);
        console.log(`Alert type: "${latestAlert.type}" (lowercase), Message: "${latestAlert.message}"`);
        console.log(`Is first load: ${isFirstLoad}`);
        console.log(`ID match: ${latestAlert.id === lastAlertId}`);
        console.log(`Type is motion: ${latestAlert.type === "motion"}`);
        
        // Skip sound on first load
        if (isFirstLoad) {
          console.log('⏭️ First load - skipping sound, just setting ID');
          setLastAlertId(latestAlert.id);
          setIsFirstLoad(false);
        }
        // Play sound for new alerts (except motion)
        else if (latestAlert.id !== lastAlertId) {
          if (latestAlert.type !== "motion") {
            console.log(`🎵 NEW ALERT DETECTED! Type: ${latestAlert.type}`);
            console.log(`🔊 About to play sound for: ${latestAlert.type}`);
            
            const soundType = latestAlert.type as any;
            soundService.playSound(soundType)
              .then(() => console.log(`✅ Sound play completed for ${soundType}`))
              .catch((err) => console.error(`❌ Sound play failed:`, err));
            
            setLastAlertId(latestAlert.id);
          } else {
            console.log('⏭️ Skipped sound because type is motion');
            setLastAlertId(latestAlert.id);
          }
        } else {
          console.log('⏭️ Skipped sound - same alert ID');
        }
      }
      
      setAlerts(newAlerts);
    } catch (error) {
      console.error("Failed to fetch alerts:", error);
    }
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 10000);
    return () => {
      clearInterval(interval);
      soundService.cleanup().catch(console.error);
    };
  }, [lastAlertId]);

  const filtered =
    filter === "all"
      ? alerts
      : alerts.filter(a => a.type === filter);

  const filters: AlertType[] = [
    "all",
    "motion",
    "emergency",
    "security",
    "reminder",
  ];

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#000" }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={async () => {
            setRefreshing(true);
            await fetchAlerts();
            setRefreshing(false);
          }}
        />
      }
    >
      <Text style={{ color: "#fff", fontSize: 20, fontWeight: "bold", margin: 16 }}>
        Alerts
      </Text>

      {/* Test Sound Button */}
      <TouchableOpacity
        onPress={() => {
          console.log("🧪 Testing reminder sound...");
          soundService.playSound("reminder").catch(console.error);
        }}
        style={{
          backgroundColor: "#3b82f6",
          padding: 12,
          borderRadius: 8,
          marginHorizontal: 16,
          marginBottom: 16,
        }}
      >
        <Text style={{ color: "#fff", textAlign: "center", fontWeight: "bold" }}>
          🔊 Test Sound
        </Text>
      </TouchableOpacity>

      {/* Filters */}
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, margin: 16 }}>
        {filters.map(f => (
          <TouchableOpacity
            key={f}
            onPress={() => setFilter(f)}
            style={{
              paddingVertical: 6,
              paddingHorizontal: 12,
              borderRadius: 20,
              backgroundColor: filter === f ? "#2563eb" : "#111",
              borderWidth: 1,
              borderColor: "#222",
            }}
          >
            <Text style={{ color: "#fff", fontSize: 12 }}>
              {f.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Alerts list */}
      <View style={{ paddingHorizontal: 16 }}>
        {filtered.length === 0 ? (
          <Text style={{ color: "#777", textAlign: "center", marginTop: 40 }}>
            No alerts
          </Text>
        ) : (
          filtered.map(a => (
            <View
              key={a.id}
              style={{
                padding: 14,
                marginBottom: 10,
                borderRadius: 12,
                backgroundColor: "#111",
                borderWidth: 1,
                borderColor: "#222",
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>
                {a.type.toUpperCase()}
              </Text>
              <Text style={{ color: "#aaa", marginVertical: 4 }}>
                {a.message}
              </Text>
              <Text style={{ color: "#555", fontSize: 12 }}>
                {new Date(a.timestamp).toLocaleString()}
              </Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}
