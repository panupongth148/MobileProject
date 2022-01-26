import React, { useState } from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Picker,
} from "react-native";
import firebase from "../data/firebaseDB";

export default function GenWard() {
  const [wardName, setwardName] = useState("");
  const [department, setdepartment] = useState("internal_medicine");
  const [typeOfWard, settypeOfWard] = useState("");

  const generateBed = async () => {
    const wardRef = firebase.firestore().collection("ward");
    const snapshot = await wardRef.get();

    let all_data = [];
    await snapshot.forEach((doc) => {
      all_data.push(doc.data().WardID);
    });

    all_data.sort(function (a, b) {
      return a - b;
    });
    
    let lstId = parseInt(all_data[all_data.length - 1]) + 1;
    await wardRef
      .add({
        WardID: lstId.toString(),
        WardName: wardName,
        Department: department,
        TypeOfWard: typeOfWard,
      })
      .then((res) => {
        console.log("sucess");
      })
      .catch((err) => {
        console.log("error");
      });
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>generate ward</Text>

      <Text style={styles.text}>ward name</Text>
      <TextInput
        style={styles.inputBox}
        placeholder="ชื่อ ward"
        onChangeText={setwardName}
        value={wardName}
      ></TextInput>

      <Text style={styles.text}>Department</Text>
      <Picker
        selectedValue={department}
        style={{ height: 50, width: 150 }}
        onValueChange={(itemValue, itemIndex) => setdepartment(itemValue)}
      >
        <Picker.Item label="อายุรกรรม" value="internal_medicine" />
        <Picker.Item label="ศัลยกรรม" value="surgey" />
        <Picker.Item label="วอร์ดฉุกเฉิน" value="er" />
        <Picker.Item label="วอร์ดปราศจากเชื้อโรค" value="or" />
        <Picker.Item label="ICU" value="icu" />
        <Picker.Item label="ห้องคลอด" value="delivery_room" />
        <Picker.Item label="นรีเวช" value="gynecology" />
        <Picker.Item label="กุมารเวช" value="pediatrics" />
      </Picker>

      <Text style={styles.text}>type</Text>
      <Picker
        selectedValue={typeOfWard}
        style={{ height: 50, width: 150 }}
        onValueChange={(itemValue, itemIndex) => settypeOfWard(itemValue)}
      >
        <Picker.Item label="Male" value="Male" />
        <Picker.Item label="Female" value="Female" />
        <Picker.Item label="Male&Female" value="Male&Female" />
        <Picker.Item label="Vip" value="Vip" />
      </Picker>

      <TouchableOpacity style={styles.appButtonContainer} onPress={generateBed}>
        <Text style={styles.appButtonText}>generate ward</Text>
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
