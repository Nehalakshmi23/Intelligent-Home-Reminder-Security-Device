import { View, Text, TextInput, Button, ScrollView } from "react-native";
import { api } from "../../services/api";
import { useEffect, useState } from "react";

export default function RemindersScreen() {
  const [users, setUsers] = useState<any[]>([]);
  const [selected, setSelected] = useState<string>("");
  const [item, setItem] = useState("");

  const fetchUsers = async () => {
    const res = await api.get("/users");
    setUsers(res.data);
    if (res.data.length > 0) setSelected(res.data[0].name);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const addReminder = async () => {
    const user = users.find(u => u.name === selected);
    if (!user) return;

    await api.post("/update-reminders", {
      name: selected,
      reminders: [...user.reminders, item],
    });

    alert("Reminder added");
    setItem("");
    fetchUsers();
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#000", padding: 16 }}>
      <Text style={{ color: "#fff", fontSize: 20, marginBottom: 16 }}>
        Reminders
      </Text>

      <Text style={{ color: "#aaa" }}>Selected User: {selected}</Text>

      <TextInput
        placeholder="Item name"
        placeholderTextColor="#666"
        value={item}
        onChangeText={setItem}
        style={{
          borderWidth: 1,
          borderColor: "#222",
          borderRadius: 10,
          padding: 12,
          color: "#fff",
          marginVertical: 12,
        }}
      />

      <Button title="Add Reminder" onPress={addReminder} />

      {users.map(u => (
        <View key={u.name} style={{ marginTop: 16 }}>
          <Text style={{ color: "#22c55e", fontWeight: "bold" }}>
            {u.name}
          </Text>
          {u.reminders.map((r: string, i: number) => (
            <Text key={i} style={{ color: "#fff" }}>
              • {r}
            </Text>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}
