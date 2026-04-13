import { View, Text, Button, ScrollView } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { api } from "../../services/api";
import { useEffect, useState } from "react";

export default function ReEnrollScreen() {
  const [users, setUsers] = useState<string[]>([]);

  const fetchUsers = async () => {
    const res = await api.get("/users");
    setUsers(res.data.map((u: any) => u.name));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const reEnroll = async (name: string) => {
    const result = await ImagePicker.launchCameraAsync({ quality: 1 });
    if (result.canceled) return;

    const form = new FormData();
    form.append("name", name);
    form.append("file", {
      uri: result.assets[0].uri,
      name: "face.jpg",
      type: "image/jpeg",
    } as any);

    await api.post("/re-enroll-face", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    alert(`${name} updated successfully`);
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#000", padding: 16 }}>
      <Text style={{ color: "#fff", fontSize: 20, marginBottom: 16 }}>
        Re-Enroll Face
      </Text>

      {users.map(name => (
        <View key={name} style={{ marginBottom: 12 }}>
          <Button title={`Update ${name}`} onPress={() => reEnroll(name)} />
        </View>
      ))}
    </ScrollView>
  );
}
