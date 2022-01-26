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

export default function GenBed() {
  const [startId, setstartId] = useState("");
  const [intitialKey, setintitialKey] = useState("");
  const [wardId, setwardId] = useState("");
  const [maxBed, setmaxBed] = useState("");
  const [wardIDList, setWardIDList] = useState([]);
  const [wardName, setWardName] = useState([]);

  const getCollection = async (querySnapshot) => {
    await querySnapshot.forEach((res) => {
      wardName.push(res.data().WardName);
      wardIDList.push(res.data().WardIDList);
    });
  };

  const generateBed = async () => {
    const bedRef = firebase.firestore().collection("bed");
    const snapshot = await bedRef.get();

    let all_data = [];
    await snapshot.forEach((doc) => {
      all_data.push(doc.data().BedID);
    });
    
    all_data.sort(function (a, b) {
      return a - b;
    });
    
    let lstId = parseInt(all_data[all_data.length - 1]) + 1;
    for (let i = parseInt(startId); i < parseInt(maxBed); i++) {
      await bedRef
        .add({
          BedID: lstId.toString(),
          // BedName: intitialKey + "_"+i,
          BedName: intitialKey + i,
          WardID: wardId,
          StateOfBed: "empty",
          PatientID: null,
        })
        .then((res) => {
          console.log("sucess");
          // alert("sucess")
        })
        .catch((err) => {
          console.log("ลงทะเบียนไม่สำเร็จ");
          // alert("สร้างไม่สำเร็จ");
          i = maxBed.length;
        });
      lstId++;
    }
  };

  let serviceItems = wardName.map((s, i) => {
    console.log("s :" + s + "i : " + i);
    return <Picker.Item key={i} value={s} label={s} />;
  });

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>generate bed</Text>

      <Text style={styles.text}>คำขึ้นต้น</Text>
      <TextInput
        style={styles.inputBox}
        placeholder="คำขึ้นต้น"
        onChangeText={setintitialKey}
        value={intitialKey}
      ></TextInput>

      <Text style={styles.text}>id เริ่ม</Text>
      <TextInput
        style={styles.inputBox}
        placeholder="เร่ิม id"
        onChangeText={setstartId}
        value={startId}
      ></TextInput>
      
      <Text style={styles.text}>จำนวนสูงสุด</Text>
      <TextInput
        style={styles.inputBox}
        placeholder="จำนวนสูงสุด"
        onChangeText={setmaxBed}
        value={maxBed}
      ></TextInput>

      <Text style={styles.text}>ward ID</Text>
      <TextInput
        style={styles.inputBox}
        placeholder="wardid"
        onChangeText={setwardId}
        value={wardId}
      ></TextInput>

      <TouchableOpacity style={styles.appButtonContainer} onPress={generateBed}>
        <Text style={styles.appButtonText}>generate bed</Text>
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
