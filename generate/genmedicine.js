import React, { useState } from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import firebase from "../data/firebaseDB";

export default function GenMedicine() {
  const [medicineName, setmedicineName] = useState("");
  const [remaining, setremaining] = useState("");
  const [uses, setuses] = useState("");

  const generateBed = async () => {
    const medicineRef = firebase.firestore().collection("medicine");
    const snapshot = await medicineRef.get();

    let all_data = [];
    await snapshot.forEach((doc) => {
      all_data.push(parseInt(doc.data().MedicineID));
    });
    
    all_data.sort(function (a, b) {
      return a - b;
    });
    
    let lstId = parseInt(all_data[all_data.length - 1]) + 1;
    await medicineRef
      .add({
        MedicineID: lstId.toString(),
        MedicineName: medicineName,
        Remaining: remaining,
        Uses: uses,
      })
      .then((res) => {
        console.log("sucess");
      })
      .catch((err) => {
        console.log("ลงทะเบียนไม่สำเร็จ");
        alert("สร้างไม่สำเร็จ");
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>generate medicine</Text>

      <Text style={styles.text}>ชื่อยา</Text>
      <TextInput
        style={styles.inputBox}
        placeholder="ชื่อยา"
        onChangeText={setmedicineName}
        value={medicineName}
      ></TextInput>

      <Text style={styles.text}>คงเหลือ</Text>
      <TextInput
        style={styles.inputBox}
        placeholder="คงเหลือ"
        onChangeText={setremaining}
        value={remaining}
      ></TextInput>

      <Text style={styles.text}>วิธีการใช้</Text>
      <TextInput
        style={styles.inputBox}
        placeholder="วิธีการใช้"
        onChangeText={setuses}
        value={uses}
        multiline
        numberOfLines={4}
      ></TextInput>

      <TouchableOpacity style={styles.appButtonContainer} onPress={generateBed}>
        <Text style={styles.appButtonText}>generate medicine</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    paddingVertical: 30,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
    marginBottom: 30,
  },
  inputBox: {
    borderColor: "gray",
    width: "100%",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 7,
  },
  appButtonContainer: {
    elevation: 8,
    backgroundColor: "#2196F3",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    width: 200,
    marginTop: 5,
    marginLeft: 5,
  },
  appButtonText: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase",
  },
});
