import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Input, Card } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";

export default function Patient({ route }) {
  const [account, setAccount] = useState(route.params.params.accountInfo);
  const [patient, setPatient] = useState(route.params.params.patientInfo);
  const [treatment, setTreatment] = useState(route.params.params.treatmentInfo);
  const [bedData, setbedData] = useState(route.params.params.bedData);

  return (
    <View style={styles.container}>
      <Card style={{ width: "380" }}>
        <Card.Title>ข้อมูลผู้ป่วย</Card.Title>
        <Card.Divider />
        {/* <Card.Image source={require('../images/pic2.jpg')}> */}
        <Text style={{ marginBottom: 10 }}>
          {<Icon name="th" size={24} color="#2196F3" />} ชื่อวอร์ด :{" "}
          {bedData ? bedData.WardName : "กำลังรอลงทะเบียนคิว"}
        </Text>
        <Text style={{ marginBottom: 10 }}>
          {<Icon name="bed" size={24} color="#2196F3" />} ชื่อเตียง :{" "}
          {bedData ? bedData.BedName : "กำลังรอลงทะเบียนคิว"}
        </Text>
        <Text style={{ marginBottom: 10 }}>
          {<Icon name="user" size={30} color="#2196F3" />} ชื่อ :{" "}
          {account.FirstName} {account.LastName}
        </Text>
        <Text style={{ marginBottom: 10 }}>
          {<Icon name="intersex" size={30} color="#2196F3" />} เพศ :{" "}
          {account.Gender == "Male" ? "ชาย" : "หญิง"}
        </Text>
        <Text style={{ marginBottom: 10 }}>
          {<Icon name="fax" size={24} color="#2196F3" />} เบอร์โทรศัพท์ :{" "}
          {account.PhoneNumber}
        </Text>
        <Text style={{ marginBottom: 10 }}>
          {<Icon name="fax" size={24} color="#2196F3" />} เบอร์โทรศัพท์ญาติ :{" "}
          {patient.PhoneNumberOfCousin}
        </Text>
        <Text style={{ marginBottom: 10 }}>
          {<Icon name="th" size={24} color="#2196F3" />} ประเภทโรค :{" "}
          {treatment.TypeOfCure}
        </Text>
        <Text style={{ marginBottom: 10 }}>
          {<Icon name="th" size={24} color="#2196F3" />} ระดับอาการ :{" "}
          {treatment.StateOfIllness}
        </Text>
        <Text style={{ marginBottom: 10 }}>
          {<Icon name="th" size={24} color="#2196F3" />} พิเศษ :{" "}
          {treatment.SpecialTreat}
        </Text>
        {/* </Card.Image> */}
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 30,
  },
  text: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
    marginBottom: 30,
    minWidth: 300,
  },
  normalText: {
    marginVertical: 20,
    paddingHorizontal: 6,
  },
  scroll: {
    flex: 1,
  },
  center: {
    alignItems: "center",
  },
});
