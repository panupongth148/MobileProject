import React, { useState } from "react";
import { SafeAreaView, Text, StyleSheet, Picker } from "react-native";
import { Button, Input } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import CryptoES from "crypto-es";
import firebase from "../data/firebaseDB";

export default function Register({ navigation }) {
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
        Type: "patient",
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
    const snapshotP = await firebase.firestore().collection("patient").get();
    all_data = [];
    await snapshotP.forEach((doc) => {
      all_data.push(parseInt(doc.data().PatientID));
    });
    all_data.sort(function (a, b) {
      return a - b;
    });

    let lstIdP = parseInt(all_data[all_data.length - 1]) + 1;
    await firebase
      .firestore()
      .collection("patient")
      .add({
        PatientID: lstIdP.toString(),
        AccountNumber: lstId.toString(),
        PhoneNumberOfCousin: null,
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
      <Input
        placeholder="ชื่อ"
        onChangeText={setFirstName}
        value={firstName}
        leftIcon={<Icon name="user-circle" size={18} color="#2196F3" />}
      />
      <Input
        placeholder="นามสกุล"
        onChangeText={setLastName}
        value={lastName}
        leftIcon={<Icon name="user-circle" size={18} color="#2196F3" />}
      />
      <Picker
        selectedValue={gender}
        style={{
          height: 40,
          width: "95%",
          marginBottom: 5,
          borderRadius: 10,
          borderColor: "#e3e1da",
        }}
        onValueChange={(itemValue, itemIndex) => setGender(itemValue)}
      >
        <Picker.Item style={{ color: "black" }} label="Male" value="Male" />
        <Picker.Item label="Female" value="Female" />
      </Picker>

      <Input
        placeholder="ชื่อผู้ใช้"
        onChangeText={setUserName}
        value={userName}
        leftIcon={<Icon name="user" size={24} color="#2196F3" />}
      />
      <Input
        placeholder="รหัสผ่าน"
        secureTextEntry={true}
        onChangeText={setPassword}
        value={password}
        leftIcon={<Icon name="lock" size={24} color="#2196F3" />}
      />
      <Input
        placeholder="E-mail"
        onChangeText={setEmail}
        value={email}
        leftIcon={<Icon name="envelope" size={18} color="#2196F3" />}
      />
      <Input
        placeholder="เบอร์ติดต่อ"
        onChangeText={setPhoneNumber}
        value={phoneNumber}
        leftIcon={<Icon name="fax" size={22} color="#2196F3" />}
      />
      <Input
        placeholder="ที่อยู่"
        onChangeText={setAddress}
        value={address}
        leftIcon={<Icon name="building-o" size={24} color="#2196F3" />}
      />
      <Input
        placeholder="วันเกิด Ex.'2000-01-01'"
        onChangeText={setBirthday}
        value={birthday}
        leftIcon={<Icon name="calendar" size={24} color="#2196F3" />}
      />
      <Button
        style={styles.appButtonContainer}
        icon={<Icon name="check" size={20} color="#2196F3" />}
        type="outline"
        onPress={onSubmitRegister}
        title="ยืนยัน"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  dropdown: {
    margin: 16,
    height: 50,
    borderBottomColor: "gray",
    borderBottomWidth: 0.5,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
    marginLeft: 8,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
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
