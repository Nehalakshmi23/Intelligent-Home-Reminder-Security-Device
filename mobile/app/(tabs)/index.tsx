import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
} from "react-native";
import CameraView from "../../components/CameraView";
import StatCard from "../../components/StatCard";
import { api } from "../../services/api";

type Alert = {
  id: string;
  type: "motion" | "emergency" | "security" | "reminder";
};

type Detection = {
  name: string;
  isKnown: boolean;
  reminders: string[];
};

export default function Dashboard() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [detection, setDetection] = useState<Detection | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAlerts = async () => {
    const res = await api.get("/alerts");
    setAlerts(res.data);
  };

  const fetchDetection = async () => {
    const res = await api.get("/current-detection");
    if (res.data?.name) setDetection(res.data);
    else setDetection(null);
  };

  const refreshAll = async () => {
    setRefreshing(true);
    await fetchAlerts();
    await fetchDetection();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchAlerts();
    fetchDetection();
    // WebSocket disabled - REST API polling handles all alerts
    // startAlertSocket();

    const a = setInterval(fetchAlerts, 5000);
    const d = setInterval(fetchDetection, 2000);

    return () => {
      clearInterval(a);
      clearInterval(d);
    };
  }, []);

  const counts = {
    motion: alerts.filter(a => a.type === "motion").length,
    emergency: alerts.filter(a => a.type === "emergency").length,
    security: alerts.filter(a => a.type === "security").length,
    reminder: alerts.filter(a => a.type === "reminder").length,
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#000" }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={refreshAll} />
      }
    >
      {/* Header */}
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          color: "#fff",
          margin: 16,
        }}
      >
        Smart Home Dashboard
      </Text>

      {/* Stats */}
      <View
        style={{
          flexDirection: "row",
          gap: 10,
          paddingHorizontal: 16,
          marginBottom: 16,
        }}
      >
        <StatCard label="Motion" value={counts.motion} color="#3b82f6" />
        <StatCard label="Emergency" value={counts.emergency} color="#ef4444" />
      </View>

      <View
        style={{
          flexDirection: "row",
          gap: 10,
          paddingHorizontal: 16,
          marginBottom: 16,
        }}
      >
        <StatCard label="Security" value={counts.security} color="#f59e0b" />
        <StatCard label="Reminders" value={counts.reminder} color="#22c55e" />
      </View>

      {/* Camera */}
      <View style={{ paddingHorizontal: 16 }}>
        <CameraView />
      </View>

      {/* Detection Status */}
      <View
        style={{
          margin: 16,
          padding: 16,
          backgroundColor: "#111",
          borderRadius: 12,
          borderWidth: 1,
          borderColor: "#222",
        }}
      >
        <Text style={{ color: "#aaa", marginBottom: 6 }}>
          Current Detection
        </Text>

        {detection ? (
          <>
            <Text
              style={{
                color: detection.isKnown ? "#22c55e" : "#ef4444",
                fontSize: 16,
                fontWeight: "bold",
              }}
            >
              {detection.name}
            </Text>

            {detection.isKnown &&
              detection.reminders?.length > 0 && (
                <View style={{ marginTop: 10 }}>
                  <Text style={{ color: "#facc15", marginBottom: 6 }}>
                    Don’t forget:
                  </Text>
                  {detection.reminders.map((r, i) => (
                    <Text
                      key={i}
                      style={{ color: "#fff", fontSize: 14 }}
                    >
                      • {r}
                    </Text>
                  ))}
                </View>
              )}
          </>
        ) : (
          <Text style={{ color: "#777" }}>No person detected</Text>
        )}
      </View>
    </ScrollView>
  );
}
