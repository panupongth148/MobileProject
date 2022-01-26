import React from "react";
import { View, Text, StyleSheet } from "react-native";
import MedicineList from "./../components/MedicineList";

export default function Medicine({ route }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>ข้อมูลยาผู้ป่วย</Text>
      <MedicineList med={route.params.params} />
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
  normalText: {
    marginVertical: 25,
    paddingHorizontal: 6,
  },
});
