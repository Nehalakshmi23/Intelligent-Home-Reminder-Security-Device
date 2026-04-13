import { Tabs } from "expo-router";
import { Home, Bell, UserPlus, List, RefreshCw } from "lucide-react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: "#000" },
        tabBarActiveTintColor: "#2563eb",
        tabBarInactiveTintColor: "#777",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <Home color={color} />,
        }}
      />
      <Tabs.Screen
        name="alerts"
        options={{
          title: "Alerts",
          tabBarIcon: ({ color }) => <Bell color={color} />,
        }}
      />
      <Tabs.Screen
        name="enroll"
        options={{
          title: "Enroll",
          tabBarIcon: ({ color }) => <UserPlus color={color} />,
        }}
      />
      <Tabs.Screen
        name="reenroll"
        options={{
          title: "Update",
          tabBarIcon: ({ color }) => <RefreshCw color={color} />,
        }}
      />
      <Tabs.Screen
        name="reminders"
        options={{
          title: "Reminders",
          tabBarIcon: ({ color }) => <List color={color} />,
        }}
      />
    </Tabs>
  );
}
