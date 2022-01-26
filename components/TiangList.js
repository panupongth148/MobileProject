import React, { useState, useEffect } from "react";
import { Button } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import {
  FlatList,
  View,
  StyleSheet,
} from "react-native";
import firebase from "../data/firebaseDB";

const TiangList = (props) => {
  const [tiang, setTiang] = useState(null);

  const getCollection = async (querySnapshot) => {
    const all_data = [];
    await querySnapshot.forEach((res) => {
      all_data.push(res.data());
    });
    setTiang(all_data);
  };

  useEffect(() => {
    (async () => {
      const unsubscribe = await firebase
        .firestore()
        .collection("bed")
        .where("WardID", "==", props.wardID)
        .onSnapshot(getCollection);
      return () => {
        unsubscribe();
      };
    })();
  }, [props.wardID]);

  const onSelectTiang = async (bedId, patientId, navigation) => {
    const snapshotS = await firebase
      .firestore()
      .collection("patient")
      .where("PatientID", "==", patientId)
      .get();

    if (snapshotS.empty) {
      // console.log("No matching documents.");
      return;
    }

    let patientData;
    let accNum;
    await snapshotS.forEach((doc) => {
      patientData = doc.data();
      accNum = doc.data().AccountNumber;
    });
    
    const snapshot = await firebase
      .firestore()
      .collection("account")
      .where("AccountNumber", "==", accNum)
      .get();

    if (snapshot.empty) {
      // console.log("No matching documents.");
      return;
    }

    let accountData;
    await snapshot.forEach((doc) => {
      accountData = doc.data();
    });

    const snapshotpre = await firebase
      .firestore()
      .collection("medical_prescription")
      .where("PatientID", "==", patientId)
      .get();

    if (snapshotpre.empty) {
      // console.log("No matching documents.");
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
      // console.log("No matching documents.");
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
      // console.log("No matching documents.");
      return;
    }

    await snapshotMedic.forEach((doc) => {
      medicineId.push(doc.data().MedicineID);
      unitList.push({
        medicineId: doc.data().MedicineID,
        unit: doc.data().Unit,
      });
    });

    const snapshotMedicine = await firebase
      .firestore()
      .collection("medicine")
      .where("MedicineID", "in", medicineId)
      .get();

    if (snapshotMedicine.empty) {
      // console.log("No matching documents.");
      return;
    }

    const medicineDATA = [];
    await snapshotMedicine.forEach((doc) => {
      medicineDATA.push(doc.data());
    });

    //ward info
    const snapshotgetBed = await firebase
      .firestore()
      .collection("bed")
      .where("PatientID", "==", patientId)
      .get();

    if (snapshotgetBed.empty) {
      // console.log("No matching documents.");
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
      // console.log("No matching documents.");
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

    let finalMed = [];
    for (let i = 0; i < medicineDATA.length; i++) {
      finalMed.push({
        MedicineID: medicineDATA[i].MedicineID,
        MedicineName: medicineDATA[i].MedicineName,
        Unit: unitList[0].unit,
      });
    }

    const patient = {
      patientInfo: patientData,
      accountInfo: accountData,
      treatmentInfo: treatmentData,
      medicineData: finalMed,
      bedData: bedDATA,
      medicalRole: null,
    };
    
    navigation.navigate("PatientScreen", {
      prev: "Ward",
      patientData: patient,
    });
  };

  const renderTiang = (itemData) => {
    return (
      <View style={styles.list}>
        {tiang && (
          <Button
            style={{ marginTop: 5 }}
            icon={
              itemData.item.StateOfBed == "empty" ? (
                <Icon name="check" size={20} color="green" />
              ) : (
                <Icon name="remove" size={20} color="red" />
              )
            }
            type="outline"
            title={" " + itemData.item.BedName}
            disabled={itemData.item.Status == "empty" ? true : false}
            onPress={() => {
              onSelectTiang(
                itemData.item.BedID,
                itemData.item.PatientID,
                props.navigation
              );
            }}
          />
        )}
      </View>
    );
  };

  return (
    <FlatList
      style={styles.flat}
      numColumns={2}
      data={tiang}
      renderItem={renderTiang}
      keyExtractor={(item) => item.Key}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
    marginTop: 2,
    flexDirection: "column",
    justifyContent: "center",
    marginLeft: 2,
    marginRight: 2,
    marginBottom: 4,
  },
  flat: {
    marginTop: 0,
    marginBottom: 5,
    width: "100%",
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

export default TiangList;
