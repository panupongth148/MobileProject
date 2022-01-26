import React, { useState, useEffect } from "react";
import { Button, Input } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import {
  View,
  Text,
  StyleSheet,
} from "react-native";
import { useDispatch } from "react-redux";
import firebase from "../data/firebaseDB";
import { toggleUser } from "./../store/actions/UsersAction";

export default function Login({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userInfo, setUser] = useState(null);
  const [userRef, setUserRef] = useState(
    firebase.firestore().collection("account")
  );

  const dispatch = useDispatch();

  const getCollection = (querySnapshot) => {
    const all_data = [];
    querySnapshot.forEach((res) => {
      const {
        UserName,
        FirstName,
        LastName,
        Dob,
        Address,
        PhoneNumber,
        Type,
        Gender,
        Email,
      } = res.data();
      
      all_data.push({
        key: res.id,
        UserName,
        FirstName,
        LastName,
        Dob,
        Address,
        PhoneNumber,
        Type,
        Gender,
        Email,
      });
      setList(all_data);
    });
  };

  // create token id
  const generateToken = () => {
    const result = [];
    const characters =
      "*/=-$#!@^&ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 100; i++) {
      result.push(
        characters.charAt(Math.floor(Math.random() * characters.length))
      );
    }
    return result.join("");
  };

  //check user
  // const getUser = (querySnapshot) => {
  //   querySnapshot.forEach((res) => {
  //     console.log(res.id, " => ", res.data());
  //   });
  // };

  useEffect(() => {
    (async () => {
      // const token = await generateToken();
      // const unsubscribe = await userRef.onSnapshot(getCollection);

      //   await firebase.firestore().collection("token").add({
      //    token: token

      // })
      // .then((res) => {
      //    console.log("sucess")
      // }
      // ).catch((err) =>{
      //   console.log("ลงทะเบียนไม่สำเร็จ");
      //   alert("ลงทะเบียนไม่สำเร็จ");
      // })

      return () => {
        unsubscribe();
      };
    })();
  }, []);

  const onSubmitLogin = async () => {
    // _storeData();

    const token = await generateToken();

    const snapshot = await userRef.where("UserName", "==", username).get();

    if (snapshot.empty) {
      console.log("No matching documents.");
      return;
    }

    let idUser;
    let passEn;

    let type;
    await snapshot.forEach((doc) => {
      idUser = doc.data().AccountNumber;
      passEn = doc.data().Password;
      type = doc.data().Type;
    });

    var C = require("crypto-js");
    const snapshotS = await firebase
      .firestore()
      .collection("secret")
      .where("AccountNumber", "==", idUser)
      .get();

    if (snapshotS.empty) {
      console.log("No matching documents.");
      return;
    }
    let secret;
    await snapshotS.forEach((doc) => {
      secret = doc.data().Secret;
    });
    var Decrypted = C.AES.decrypt(passEn, secret);
    var result = Decrypted.toString(C.enc.Utf8);

    if (result === password) {
      const snapshot = await firebase
        .firestore()
        .collection("account")
        .where("AccountNumber", "==", idUser)
        .get();

      if (snapshot.empty) {
        console.log("No matching documents.");
        return;
      }
      let accountData;

      await snapshot.forEach((doc) => {
        accountData = doc.data();
      });

      // set patient
      if (type == "patient") {
        let patientId;
        const snapshotS = await firebase
          .firestore()
          .collection("patient")
          .where("AccountNumber", "==", idUser)
          .get();

        if (snapshotS.empty) {
          console.log("No matching documents.");
          return;
        }
        
        let patientData;
        let accNum;
        await snapshotS.forEach((doc) => {
          patientId = doc.data().PatientID;
          patientData = doc.data();
          accNum = doc.data().AccountNumber;
        });

        const snapshotcon = await firebase
          .firestore()
          .collection("medical_prescription")
          .where("PatientID", "==", patientId)
          .get();

        //condition mearge enrolled
        if (snapshotcon.empty) {
          console.log("Not enroll");
          const patient = {
            patientInfo: patientData,
            accountInfo: accountData,
            treatmentInfo: null,
            medicineData: null,
            bedData: null,
            medicalRole: null
          };

          dispatch(toggleUser(patient));

          navigation.replace("Main");
        } else {
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

          // ward
          const snapshotgetBed = await firebase
            .firestore()
            .collection("bed")
            .where("PatientID", "==", patientId)
            .get();

          if (snapshotgetBed.empty) {
            console.log("No matching documents.");
            return;
          }

          let bedName;
          let wardId;
          await snapshotgetBed.forEach((doc) => {
            bedName = doc.data().BedName;
            wardId = doc.data().WardID;
          });

          const snapshotgetWard = await firebase
            .firestore()
            .collection("ward")
            .where("WardID", "==", wardId)
            .get();

          if (snapshotgetWard.empty) {
            console.log("No matching documents.");
            return;
          }
          let wardName;
          await snapshotgetWard.forEach((doc) => {
            wardName = doc.data().WardName;
          });

          const bedDATA = {
            BedName: bedName,
            WardName: wardName,
          };

          const patient = {
            patientInfo: patientData,
            accountInfo: accountData,
            treatmentInfo: treatmentData,
            medicineData: finalMed,
            bedData: bedDATA,
            medicalRole:null
          };

          // send action to redux store
          dispatch(toggleUser(patient));

          navigation.replace("Main");
        }
      } else {
        const snapshotGetmedical = await firebase.firestore().collection("medical_personel")
          .where("AccountNumber", "==", idUser).get();

        if (snapshotGetmedical.empty) {
          console.log("No matching documents.");
          return;
        }

        let medicPerson;
        await snapshotGetmedical.forEach((doc) => {
          medicPerson = doc.data();
        });
        
        const patient = {
          patientInfo: null,
          accountInfo: accountData,
          treatmentInfo: null,
          medicineData: null,
          bedData: null,
          medicalRole: medicPerson
        };

        dispatch(toggleUser(patient));

        navigation.replace("Main");
      }
    } else {
      alert("In correct password");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>เข้าสู่ระบบ</Text>

      <Input
        onChangeText={setUsername}
        value={username}
        placeholder="กรุณากรอกชื่อผู้ใช้"
        leftIcon={<Icon name="user" size={24} color="#2196F3" />}
      />
      <Input
        secureTextEntry={true}
        onChangeText={setPassword}
        value={password}
        placeholder="กรุณากรอกรหัสผ่าน"
        leftIcon={<Icon name="lock" size={26} color="#2196F3" />}
      />
      
      <Button
        icon={<Icon name="arrow-circle-o-right" size={30} color="#2196F3" />}
        style={styles.appButtonContainer}
        onPress={onSubmitLogin}
        type="outline"
        title="  เข้าสู่ระบบ"
      />

      <Button
        style={styles.appButtonContainer}
        icon={<Icon name="edit" size={30} color="#2196F3" />}
        type="outline"
        onPress={() => {
          // to Register page
          navigation.navigate("Register", { prev: "Login" });
        }}
        title="ลงทะเบียน"
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
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
  },
  appButtonContainer: {
    width: 200,
    marginTop: 5,
  },
  appButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase",
  },
});
