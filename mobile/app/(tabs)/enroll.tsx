import { View, Text, TextInput, Button } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { api } from "../../services/api";
import { useState } from "react";

export default function EnrollScreen() {
  const [name, setName] = useState("");

  const enroll = async () => {
    const result = await ImagePicker.launchCameraAsync({ quality: 1 });
    if (result.canceled) return;

    const form = new FormData();
    form.append("name", name);
    form.append("file", {
      uri: result.assets[0].uri,
      name: "face.jpg",
      type: "image/jpeg",
    } as any);

    await api.post("/enroll-face", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    alert("Face enrolled successfully");
    setName("");
  };

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: "#000" }}>
      <Text style={{ color: "#fff", fontSize: 20, marginBottom: 12 }}>
        Enroll Face
      </Text>

      <TextInput
        placeholder="Person name"
        placeholderTextColor="#666"
        value={name}
        onChangeText={setName}
        style={{
          borderWidth: 1,
          borderColor: "#222",
          borderRadius: 10,
          padding: 12,
          color: "#fff",
          marginBottom: 16,
        }}
      />

      <Button title="Capture & Enroll" onPress={enroll} />
    </View>
  );
}
