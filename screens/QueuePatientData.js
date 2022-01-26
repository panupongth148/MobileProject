import React from "react";
import {
  View,
  Text,
  StyleSheet,
} from "react-native";
import { Button, Input, Card } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";

export default function QueuePatientData({ route, navigation }) {
  return (
    <View style={styles.container}>
      <Card style={{ width: "380" }}>
        <Card.Title>ข้อมูลผู้ป่วยที่จองคิว</Card.Title>
        <Card.Divider />
        {/* <Card.Image source={require('../images/pic2.jpg')}> */}
        <Text style={{ marginBottom: 10 }}>
          ชื่อ : {route.params.queue.Name}
        </Text>
        <Text style={{ marginBottom: 10 }}>
          อายุ : {route.params.queue.Age}
        </Text>
        <Text style={{ marginBottom: 10 }}>
          ชนิด : {route.params.queue.Treatment.TypeOfCure}{" "}
        </Text>
        <Text style={{ marginBottom: 10 }}>
          สาเหตุ : {route.params.queue.Treatment.CureName}
        </Text>
        <Text style={{ marginBottom: 10 }}>
          ระดับอาการ : {route.params.queue.Treatment.StateOfIllness}
        </Text>
        <Text style={{ marginBottom: 10 }}>
          พิเศษ : {route.params.queue.Treatment.SpecialTreat}
        </Text>
        <Text style={{ marginBottom: 10 }}>
          วันรักษา : {route.params.queue.Treatment.TreatDay}
        </Text>

        <Button
          icon={<Icon name="th" color="#2196F3" size={24}/>}
          type="outline"
          title="  เลือกเตียง"
          onPress={() => {
            navigation.navigate("Selection", {
              PatientID: route.params.queue.PatientID,
            });
          }}
        />
        {/* </Card.Image> */}
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    flexDirection: "column",
    justifyContent: "center",
    // alignItems: "center",
    width: "100",
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
  normalText: {
    marginVertical: 20,
    paddingHorizontal: 6,
  },
});
