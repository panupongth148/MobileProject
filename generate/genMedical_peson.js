import React, { useState } from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Picker,
} from "react-native";
import CryptoES from "crypto-es";
import firebase from "../data/firebaseDB";

export default function GenMedicPerson({ navigation }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [birthday, setBirthday] = useState("");
  const [userRef, setUserRef] = useState(
    firebase.firestore().collection("account")
  );
  const [list, setList] = useState();
  const [id, setID] = useState(null);

  const generateToken = () => {
    const result = [];
    const characters =
      "*/=-$#!@^&ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 5; i++) {
      result.push(
        characters.charAt(Math.floor(Math.random() * characters.length))
      );
    }
    return result.join("");
  };

  const getCollection = (querySnapshot) => {
    const all_data = [];
    // console.log("In get collection");
    querySnapshot.forEach((res) => {
      all_data.push({
        key: res.id,
      });
      setID(all_data[all_data.length - 1].key);
    });
  };

  const onSubmitRegister = async () => {
    const secret = await generateToken();
    const encrypted = CryptoES.AES.encrypt(
      password.toString(),
      secret
    ).toString();

    // Account table
    const snapshot = await userRef.get();
    let all_data = [];
    await snapshot.forEach((doc) => {
      all_data.push(parseInt(doc.data().AccountNumber));
    });
    
    all_data.sort(function (a, b) {
      return a - b;
    });

    let lstId = parseInt(all_data[all_data.length - 1]) + 1;
    await firebase
      .firestore()
      .collection("account")
      .add({
        AccountNumber: lstId.toString(),
        FirstName: firstName,
        LastName: lastName,
        UserName: userName,
        Password: encrypted,
        Email: email,
        PhoneNumber: phoneNumber,
        Gender: gender,
        Address: address,
        Dob: birthday,
        Type: "medic_person",
      })
      .then((res) => {
        console.log("sucess");
      })
      .catch((err) => {
        console.log("ลงทะเบียนไม่สำเร็จ");
        alert("ลงทะเบียนไม่สำเร็จ");
      });

    // secret
    await firebase
      .firestore()
      .collection("secret")
      .add({
        AccountNumber: lstId.toString(),
        Secret: secret,
      })
      .then((res) => {
        console.log("sucess");
      })
      .catch((err) => {
        console.log("ลงทะเบียนไม่สำเร็จ");
        alert("ลงทะเบียนไม่สำเร็จ");
      });

    // patient
    const snapshotP = await firebase
      .firestore()
      .collection("medical_personel")
      .get();

    all_data = [];
    await snapshotP.forEach((doc) => {
      all_data.push(doc.data().MedicalPersonelID);
    });
    
    let lstIdP = parseInt(all_data[all_data.length - 1]) + 1;
    await firebase
      .firestore()
      .collection("medical_personel")
      .add({
        MedicalPersonelID: lstIdP.toString(),
        AccountNumber: lstId.toString(),
        Role: "nurse",
      })
      .then((res) => {
        console.log("sucess");
      })
      .catch((err) => {
        console.log("ลงทะเบียนไม่สำเร็จ");
        alert("ลงทะเบียนไม่สำเร็จ");
      });
    alert("สมัครสมาชิกเสร็จเรียบร้อย");
    navigation.navigate("Login", { prev: "Register" });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>สมัครสมาชิก</Text>
      <TextInput
        style={styles.inputBox}
        placeholder="ชื่อ"
        onChangeText={setFirstName}
        value={firstName}
      ></TextInput>
      <TextInput
        style={styles.inputBox}
        placeholder="นามสกุล"
        onChangeText={setLastName}
        value={lastName}
      ></TextInput>
      <Picker
        selectedValue={gender}
        style={{ height: 50, width: 150 }}
        onValueChange={(itemValue, itemIndex) => setGender(itemValue)}
      >
        <Picker.Item label="Male" value="Male" />
        <Picker.Item label="Female" value="Female" />
      </Picker>
      <TextInput
        style={styles.inputBox}
        placeholder="ชื่อผู้ใช้"
        onChangeText={setUserName}
        value={userName}
      ></TextInput>
      <TextInput
        style={styles.inputBox}
        placeholder="รหัสผ่าน"
        secureTextEntry={true}
        onChangeText={setPassword}
        value={password}
      ></TextInput>
      <TextInput
        style={styles.inputBox}
        placeholder="E-mail"
        onChangeText={setEmail}
        value={email}
      ></TextInput>
      <TextInput
        style={styles.inputBox}
        placeholder="เบอร์ติดต่อ"
        onChangeText={setPhoneNumber}
        value={phoneNumber}
      ></TextInput>
      <TextInput
        style={styles.inputBox}
        placeholder="ที่อยู่"
        onChangeText={setAddress}
        value={address}
      ></TextInput>
      <TextInput
        style={styles.inputBox}
        placeholder="วันเกิด Ex.'2000-01-01'"
        onChangeText={setBirthday}
        value={birthday}
      ></TextInput>
      <TouchableOpacity
        style={styles.appButtonContainer}
        onPress={onSubmitRegister}
      >
        <Text style={styles.appButtonText}>ยืนยัน</Text>
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
