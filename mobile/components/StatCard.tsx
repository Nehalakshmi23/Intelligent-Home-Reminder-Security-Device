import { View, Text } from "react-native";

export default function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#111",
        padding: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#222",
      }}
    >
      <Text style={{ color: "#aaa", fontSize: 12 }}>{label}</Text>
      <Text style={{ color, fontSize: 20, fontWeight: "bold" }}>
        {value}
      </Text>
    </View>
  );
}
