import React, { useState } from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import firebase from "../data/firebaseDB";

export default function GenConnectMedic() {
  const [PrescriptionID, setPrescriptionID] = useState("");
  const [MedicineId, setMedicineId] = useState("");
  const [Unit, setUnit] = useState("");

  const generateconectMedic = async () => {
    try {
      await firebase.firestore()
        .collection("medicine_medicine_prescription")
        .add({
          PrescriptionID: PrescriptionID,
          MedicineId: MedicineId,
          Unit: Unit,
        });
    } catch (err) {
      console.log(err);
    }
    console.log("sucess");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>generate medicine</Text>
      <Text style={styles.text}>คำขึ้นต้น</Text>

      <TextInput
        style={styles.inputBox}
        placeholder="PrescriptionID"
        onChangeText={setPrescriptionID}
        value={PrescriptionID}
      ></TextInput>

      <Text style={styles.text}>medicine id</Text>
      <TextInput
        style={styles.inputBox}
        placeholder="medicine id"
        onChangeText={setMedicineId}
        value={MedicineId}
      ></TextInput>

      <Text style={styles.text}>จำนวน</Text>
      <TextInput
        style={styles.inputBox}
        placeholder="unit"
        onChangeText={setUnit}
        value={Unit}
      ></TextInput>

      <TouchableOpacity
        style={styles.appButtonContainer}
        onPress={generateconectMedic}
      >
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
