import React, { useState, useEffect } from "react";
import { Button, Input } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import {
  View,
  Text,
  StyleSheet,
} from "react-native";
import QueueList from "./../components/QueueList";
import firebase from "../data/firebaseDB";

export default function ManageQueue({ navigation }) {
  const [type, setType] = useState("Doctor");
  const [list, setList] = useState(null);
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    (async () => {
      const queueID = [];
      const patientID = [];
      const snapshot = await firebase.firestore().collection("queue").get();
      await snapshot.forEach((doc) => {
        queueID.push(doc.data().QueueID);
        patientID.push(doc.data().PatientID);
      });

      let accNum = [];
      const snapshotGetPatient = await firebase
        .firestore()
        .collection("patient")
        .get();
      await snapshotGetPatient.forEach((doc) => {
        if (patientID.includes(doc.data().PatientID)) {
          accNum.push(doc.data().AccountNumber);
        }
      });
      
      let NAME;
      const listName = [];
      let d = new Date();
      let year = d.getFullYear();
      
      const snapshotGetAccount = await firebase
        .firestore()
        .collection("account")
        .get();
      await snapshotGetAccount.forEach((doc) => {
        if (accNum.includes(doc.data().AccountNumber)) {
          NAME = doc.data().FirstName + " " + doc.data().LastName;
          let date = doc.data().Dob;
          const age = parseInt(year) - parseInt(date);

          listName.push({
            name: NAME,
            age: age,
          });
        }
      });

      const prescriptionId = [];
      const patientIdDATA = [];
      const snapshotGetPrescription = await firebase
        .firestore()
        .collection("medical_prescription")
        .get();
      await snapshotGetPrescription.forEach((doc) => {
        if (patientID.includes(doc.data().PatientID)) {
          patientIdDATA.push(doc.data().PatientID);
          prescriptionId.push(doc.data().PrescriptionID);
        }
      });

      const treatmentDATA = [];
      const snapshotGetTreatmentInfo = await firebase
        .firestore()
        .collection("treatment_info")
        .get();
      await snapshotGetTreatmentInfo.forEach((doc) => {
        if (prescriptionId.includes(doc.data().PrescriptionID)) {
          treatmentDATA.push(doc.data());
        }
      });
      
      const queueData = [];
      for (let i = 0; i < listName.length; i++) {
        queueData.push({
          Key: queueID[i],
          PatientID: patientIdDATA[i],
          Name: listName[i].name,
          Age: listName[i].age,
          Treatment: treatmentDATA[i],
        });
      }

      setList(queueData);
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>จัดการคิว</Text>

      {list && <QueueList queue={list} navigation={navigation} />}

      <Button
        type="outline"
        style={styles.appButtonContainer}
        icon={<Icon name="check" size={20} color="#2196F3" />}
        title=" ตกลง"
      />
    </View>
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
