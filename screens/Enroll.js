import React, { useState, useEffect } from "react";
import { Button, Input } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";

import {
  View,
  Text,
  StyleSheet,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { toggleUser } from "./../store/actions/UsersAction";
import firebase from "../data/firebaseDB";

export default function Enroll({ navigation }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [prescription, setPrescription] = useState("");
  const [phoneNumberCousin, setPhoneNumberCousin] = useState("");

  const user = useSelector((state) => state.users.accountInfo);
  const patient = useSelector((state) => state.users.patientInfo);

  const dispatch = useDispatch();

  async function onSubmit() {
    let docpatientId;

    const snapshotGetPatient = await firebase
      .firestore()
      .collection("patient")
      .where("PatientID", "==", patient.PatientID)
      .get();

    await snapshotGetPatient.forEach((res) => {
      docpatientId = res.id;
    });

    // PhoneNumberOfCousin
    try {
      //update
      firebase
        .firestore()
        .collection("patient")
        .doc(docpatientId)
        .update({ PhoneNumberOfCousin: phoneNumberCousin });

      const snapshot = await firebase.firestore().collection("queue").get();
      let all_data = [];
      await snapshot.forEach((doc) => {
        all_data.push(doc.data().QueueID);
      });
      
      all_data.sort(function (a, b) {
        return a - b;
      });

      let lstId = parseInt(all_data[all_data.length - 1]) + 1;
      await firebase
        .firestore()
        .collection("queue")
        .add({
          QueueID: lstId.toString(),
          PatientID: patient.PatientID,
          PrescriptionID: prescription,
          Department: null,
        })
        .then((res) => {
          console.log("sucess add queue");
        })
        .catch((err) => {
          console.log("add queue  table not success");
        });

      await firebase
        .firestore()
        .collection("medical_prescription")
        .add({
          PatientID: patient.PatientID,
          PrescriptionID: prescription,
        })
        .then((res) => {
          console.log("sucess add midic prescription");
        })
        .catch((err) => {
          console.log("ลงทะเบียนไม่สำเร็จ");
          alert("ลงทะเบียนไม่สำเร็จ");
        });

      /* Medicine and treatment info */
      let patientId = patient.PatientID;
      const snapshotpre = await firebase
        .firestore()
        .collection("medical_prescription")
        .where("PatientID", "==", patientId)
        .get();

      if (snapshotpre.empty) {
        console.log("No matching documents.");
        return;
      }

      let prescriptionId;
      await snapshotpre.forEach((doc) => {
        prescriptionId = doc.data().PrescriptionID;
      });

      const snapshotTreatInfo = await firebase
        .firestore()
        .collection("treatment_info")
        .where("PrescriptionID", "==", prescriptionId)
        .get();

      if (snapshotTreatInfo.empty) {
        console.log("No matching documents.");
        return;
      }

      let treatmentData;
      await snapshotTreatInfo.forEach((doc) => {
        treatmentData = doc.data();
      });

      const medicineId = [];
      const unitList = [];
      const snapshotMedic = await firebase
        .firestore()
        .collection("medicine_medicine_prescription")
        .where("PrescriptionID", "==", prescriptionId)
        .get();

      if (snapshotMedic.empty) {
        console.log("No matching documents.");
        return;
      }

      await snapshotMedic.forEach((doc) => {
        medicineId.push(doc.data().MedicineID);
        unitList.push({
          medicineID: doc.data().MedicineID,
          unit: doc.data().Unit,
        });
      });
      
      const snapshotMedicine = await firebase
        .firestore()
        .collection("medicine")
        .where("MedicineID", "in", medicineId)
        .get();

      if (snapshotMedicine.empty) {
        console.log("No matching documents.");
        return;
      }

      const medicineDATA = [];
      await snapshotMedicine.forEach((doc) => {
        medicineDATA.push(doc.data());
      });

      let finalMed = [];
      for (let i = 0; i < medicineDATA.length; i++) {
        finalMed.push({
          MedicineID: medicineDATA[i].MedicineID,
          MedicineName: medicineDATA[i].MedicineName,
          Unit: unitList[0].unit,
        });
      }

      let patientInfo = {
        AccountNumber: user.AccountNumber,
        PatientID: patient.PatientID,
        phoneNumberCousin: phoneNumberCousin,
      };

      let treatmentInfo = treatmentData;
      let medicineData = finalMed;
      let bedData = null;

      const data = {
        patientInfo: patientInfo,
        accountInfo: user,
        treatmentInfo: treatmentInfo,
        medicineData: medicineData,
        bedData: bedData,
        medicalRole:null
      };

      dispatch(toggleUser(data));
    } catch (err) {
      console.log(err);
    }

    navigation.replace("Patient", {});
  }
  
  return (
    <View style={styles.container}>
      <Text style={styles.text}>ลงทะเบียนจองเตียง</Text>
      
      <Input
        style={styles.inputBox}
        placeholder="กรุณากรอกชื่อ"
        onChangeText={setFirstName}
        value={firstName}
        leftIcon={<Icon name="user-o" size={24} color="#2196F3" />}
      />
      
      <Input
      style={styles.inputBox}
        placeholder="กรุณากรอกนามสกุล"
        onChangeText={setLastName}
        value={lastName}
        leftIcon={<Icon name="user-o" size={24} color="#2196F3" />}
      />
      
      <Input
        style={styles.inputBox}
        placeholder="กรุณากรอกรหัสใบรับรองแพทย์"
        onChangeText={setPrescription}
        value={prescription}
        leftIcon={<Icon name="wpforms" size={24} color="#2196F3" />}
      />
      
      <Input
        style={styles.inputBox}
        placeholder="กรุณากรอกเบอร์โทรสำรอง 10 หลัก (0-9)"
        onChangeText={setPhoneNumberCousin}
        value={phoneNumberCousin}
        leftIcon={<Icon name="fax" size={22} color="#2196F3" />}
      />
      
      <Button
        style={styles.appButtonText}
        icon={<Icon name="check" size={20} color="#2196F3" />}
        type="outline"
        onPress={onSubmit}
        title="ตกลง"
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
    width: "100%",
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
    width: 200,
    fontSize: 14,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase",
  },
});
