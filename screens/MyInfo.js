import React, { useState, useEffect } from "react";
import { Button, Input, Card } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { toggleUser } from "./../store/actions/UsersAction";
import firebase from "../data/firebaseDB";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MyInfo({ navigation }) {
  const user = useSelector((state) => state.users.accountInfo);
  const patientInfo = useSelector((state) => state.users.patientInfo);
  const treatmentInfo = useSelector((state) => state.users.treatmentInfo);
  const medicineData = useSelector((state) => state.users.medicineData);
  const [editState, setEditState] = useState(false);
  const [FirstName, setFirstName] = useState(user.FirstName);
  const [LastName, setLastName] = useState(user.LastName);
  const [Gender, setGender] = useState(user.Gender);
  const [Address, setAddress] = useState(user.Address);
  const [PhoneNumber, setPhoneNumber] = useState(user.PhoneNumber);
  const [Email, setEmail] = useState(user.Email);
  const [Dob, setDob] = useState(user.Dob);

  const dispatch = useDispatch();

  let docAccountID;
  let accountInfo;
  let medicalRole;

  const onSubmitEdit = async () => {
    const snapshot = await firebase
      .firestore()
      .collection("account")
      .where("AccountNumber", "==", user.AccountNumber)
      .get();
    await snapshot.forEach((res) => {
      docAccountID = res.id;
      accountInfo = res.data();
    });
    
    const snapshot2 = await firebase
      .firestore()
      .collection("medical_personel")
      .where("AccountNumber", "==", user.AccountNumber)
      .get();
    await snapshot2.forEach((res) => {
      medicalRole = res.data();
    });

    try {
      // Update firebase
      firebase.firestore().collection("account").doc(docAccountID).update({
        FirstName: FirstName,
        LastName: LastName,
        Gender: Gender,
        Address: Address,
        PhoneNumber: PhoneNumber,
        Email: Email,
        Dob: Dob,
      });
      // Update redux
      accountInfo.FirstName = FirstName;
      accountInfo.LastName = LastName;
      accountInfo.Gender = Gender;
      accountInfo.Address = Address;
      accountInfo.PhoneNumber = PhoneNumber;
      accountInfo.Email = Email;
      accountInfo.Dob = Dob;

      const patient = {
        patientInfo: patientInfo,
        accountInfo: accountInfo,
        treatmentInfo: treatmentInfo,
        medicineData: medicineData,
        medicalRole: medicalRole,
      };
      
      dispatch(toggleUser(patient));
    } catch (err) {
      console.log(err);
    }
    console.log("success");
    setEditState(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll}>
        <Card style={{ width: "380" }}>
          <Card.Title>ข้อมูลของฉัน ({user.Type == "patient" ? "ผู้ป่วย" : "บุคลากร"})</Card.Title>
          <Card.Divider />
          {/* <Card.Image source={require('../images/pic2.jpg')}> */}
          {!editState ? (
              <Text style={styles.normalText}>{<Icon name="user-circle" size={24} color="#2196F3" />}  ชื่อ : {user.FirstName} {user.LastName}</Text>
            ) : (
              <Input
                placeholder="กรอกชื่อ"
                value={FirstName}
                onChangeText={setFirstName}
                leftIcon={<Icon name="user-circle" size={24} color="#2196F3" />}
              ></Input>
            )}
            {!editState ? (
              <SafeAreaView>
                </SafeAreaView>
            ) : (
              <Input
                placeholder="กรอกนามสกุล"
                value={LastName}
                onChangeText={setLastName}
                leftIcon={<Icon name="user-circle" size={28} color="#2196F3" />}
              ></Input>
            )}
            {!editState ? (
              <Text style={styles.normalText}>{<Icon name="intersex" size={24} color="#2196F3" />}  เพศ : {user.Gender}</Text>
            ) : (
              <Input
                placeholder="กรอกเพศ"
                value={Gender}
                onChangeText={setGender}
                leftIcon={<Icon name="intersex" size={24} color="#2196F3" />}
              ></Input>
            )}
            {!editState ? (
              <Text style={styles.normalText}>{<Icon name="building-o" size={24} color="#2196F3" />}  ที่อยู่ : {user.Address}</Text>
            ) : (
              <Input
                placeholder="กรอกที่อยู่"
                value={Address}
                onChangeText={setAddress}
                leftIcon={<Icon name="building-o" size={24} color="#2196F3" />}
              ></Input>
            )}
            {!editState ? (
              <Text style={styles.normalText}>
                {<Icon name="fax" size={24} color="#2196F3" />}  เบอร์โทรศัพท์ : {user.PhoneNumber}
              </Text>
            ) : (
              <Input
                placeholder="กรอกเบอร์โทรศัพท์"
                value={PhoneNumber}
                onChangeText={setPhoneNumber}
                leftIcon={<Icon name="fax" size={22} color="#2196F3" />}
              ></Input>
            )}
            {!editState ? (
              <Text style={styles.normalText}>{<Icon name="envelope" size={24} color="#2196F3" />}  E-mail : {user.Email}</Text>
            ) : (
              <Input
                placeholder="กรอกอีเมล"
                value={Email}
                onChangeText={setEmail}
                leftIcon={<Icon name="envelope" size={18} color="#2196F3" />}
              ></Input>
            )}
            {!editState ? (
              <Text style={styles.normalText}>{<Icon name="calendar" size={24} color="#2196F3" />}  วันเกิด : {user.Dob}</Text>
            ) : (
              <Input
                placeholder="กรอกวันเกิด"
                value={Dob}
                onChangeText={setDob}
                leftIcon={<Icon name="calendar" size={24} color="#2196F3" />}
              ></Input>
            )}
            {editState ? (
              <Button
                style={styles.appButtonContainer}
                icon={<Icon name="check" size={20} color="#2196F3" />}
                type="outline"
                onPress={onSubmitEdit}
                title="ยืนยัน"
              />
            ) : (
              <Button
                style={styles.appButtonContainer}
                icon={<Icon name="edit" size={20} color="#2196F3" />}
                type="outline"
                onPress={() => {
                  setEditState(true);
                }}
                title=" แก้ไขข้อมูล"
              />
            )}

            <Button
                style={styles.appButtonContainer}
                icon={<Icon name="power-off" size={20} color="#2196F3" />}
                type="outline"
                onPress={() => {
                  navigation.replace("Login");
                  localStorage.removeItem("tokenTiangPrompt");
                }}
                title=" ออกจากระบบ"
              />
          {/* </Card.Image> */}
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    justifyContent: "center",
    paddingVertical: 30,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
    marginBottom: 30,
  },
  normalText: {
    marginVertical: 20,
    paddingHorizontal: 6,
  },
  appButtonContainer: {
    elevation: 8,
    paddingHorizontal: 12,
    width: "100%",
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
  scroll: {
    flex: 1,
  },
  center: {
    alignItems: "center",
  },
});
