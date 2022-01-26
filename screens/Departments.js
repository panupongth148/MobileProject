import React from "react";
import { View, Text, StyleSheet, TextInput, Button } from "react-native";
import WardTypeList from "./../components/WardTypeList";
import { useState, useEffect } from "react";
import firebase from "../data/firebaseDB";

export default function Departments({ route, navigation }) {
  const [ward_List, setWard_List] = useState(null);

  const getCollection = async (querySnapshot) => {
    const all_data = [];
    const check = [];
    await querySnapshot.forEach((res) => {
      if (!check.includes(res.data().TypeOfWard)) {
        check.push(res.data().TypeOfWard);
        all_data.push(res.data());
        setWard_List(all_data);
      }
    });
  };

  useEffect(() => {
    (async () => {
      let Depart = "";
      if (route.params.departmentName == "อายุรกรรม")
        Depart = "internal_medicine";
      else if (route.params.departmentName == "ศัลยกรรม")
        Depart = "sg";
      else if (route.params.departmentName == "วอร์ดฉุกเฉิน")
        Depart = "er";
      else if (route.params.departmentName == "วอร์ดปราศจากเชื้อโรค")
        Depart = "or";
      else if (route.params.departmentName == "ICU")
        Depart = "icu";
      else if (route.params.departmentName == "ห้องคลอด")
        Depart = "delivery_room";
      else if (route.params.departmentName == "นรีเวช")
        Depart = "gynecology";
      else if (route.params.departmentName == "กุมารเวช")
        Depart = "pediatrics";

      const unsubscribe = await firebase
        .firestore()
        .collection("ward")
        .where("Department", "==", Depart)
        .onSnapshot(getCollection);

      return () => {
        unsubscribe();
      };
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>แผนก{route.params.departmentName}</Text>
      {ward_List && (
        <WardTypeList wardInfo={ward_List} navigation={navigation} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    // height: "100%",
    paddingVertical: 30,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
    marginBottom: 30,
  },
  inputBox: {
    borderWidth: 1,
    borderColor: "black",
    width: "40%",
    marginBottom: 30,
    paddingHorizontal: 6,
  },
});
