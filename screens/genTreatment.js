import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  TouchableOpacity,
  Picker,
  View,
  ScrollView,
} from "react-native";
import { Button, Input } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import firebase from "../data/firebaseDB";

export default function GenTreatment({ navigation }) {
  const [medicalpersonId, setmedicalpersonId] = useState("");
  const [stateOfIllness, setstateOfIllness] = useState("");
  const [specialTreat, setspecialTreat] = useState("");
  const [treatDay, settreatDay] = useState("");
  const [typeOfCure, settypeOfCure] = useState("");
  const [cureName, setcureName] = useState("");
  const [medicineSelected, setMedicineSelect] = useState("");
  const [listMedic, setListMedic] = useState([]);
  const [listMedicSelect, setListMedicSelect] = useState([]);
  const [redered, setRedndered] = useState(null);
  const [unit, setUnit] = useState("");
  const [isFullFill, setFullfill] = useState(true);
  const [mount, setMount] = useState(true);

  useEffect(() => {
    (async () => {
      if (mount) {
        const snapshot = await firebase
          .firestore()
          .collection("medicine")
          .get();
          
        await snapshot.forEach((doc) => {
          listMedic.push(doc.data());
        });

        setMount(false);

        setRedndered(true);
      }
    })();
    setFullfill(
      medicalpersonId === "" ||
        stateOfIllness === "" ||
        treatDay === "" ||
        typeOfCure === "" ||
        cureName === "" ||
        listMedicSelect.length === 0
    );
  }, [
    medicalpersonId,
    stateOfIllness,
    treatDay,
    typeOfCure,
    cureName,
    listMedicSelect,
  ]);

  const onSubmit = async () => {
    const wardRef = firebase.firestore().collection("treatment_info");
    const snapshot = await wardRef.get();
    let all_data = [];
    await snapshot.forEach((doc) => {
      all_data.push(doc.data().TreatmentInfoID);
    });

    all_data.sort(function (a, b) {
      return a - b;
    });

    let lstId = parseInt(all_data[all_data.length - 1]) + 1;
    await wardRef
      .add({
        TreatmentInfoID: lstId.toString(),
        PrescriptionID: lstId.toString(),
        MedicalPersonelID: medicalpersonId,
        SpecialTreat: specialTreat,
        StateOfIllness: stateOfIllness,
        TreatDay: treatDay,
        TypeOfCure: typeOfCure,
        CureName: cureName,
      })

      .then((res) => {
        console.log("sucess");
        return;
      })
      .catch((err) => {
        console.log("error");
      });

    const mmp = firebase
      .firestore()
      .collection("medicine_medicine_prescription");

    const snapshotM = await mmp.get();
    let all_datam = [];
    await snapshotM.forEach((doc) => {
      all_datam.push(doc.data().PrescriptionID);
    });

    all_datam.sort(function (a, b) {
      return a - b;
    });

    let lstIdM = parseInt(all_data[all_data.length - 1]) + 1;
    for (let i = 0; i < listMedicSelect.length; i++) {
      await mmp
        .add({
          PrescriptionID: lstIdM.toString(),
          MedicineID: listMedicSelect[i].medicineId,
          Unit: listMedicSelect[i].unit,
        })

        .then((res) => {
          console.log("sucess");
          return;
        })
        .catch((err) => {
          console.log("error");
        });
    }
    alert("ลงทะเบียนสำเร็จ");
    navigation.navigate("Prescription");
  };

  const addSelectedMedic = () => {
    const editMedicine = [];
    let isEdit = false;

    listMedicSelect.forEach((item, index) => {
      if (item.medicineId == medicineSelected) {
        isEdit = true;
        editMedicine.push({ medicineId: item.medicineId, unit: unit });
      } else {
        editMedicine.push(item);
      }
    });

    if (isEdit) {
      setListMedicSelect(editMedicine);
    } else {
      setListMedicSelect((listMedicSelect) => [
        ...listMedicSelect,
        { medicineId: medicineSelected, unit: unit },
      ]);
    }
  };

  let MedicineItem = listMedic.map((s, i) => {
    return (
      <Picker.Item key={i + 1} value={s.MedicineID} label={s.MedicineName} />
    );
  });

  let MedicineSlelectItem = listMedicSelect.map((s, i) => {
    for (let j = 0; j < listMedic.length; j++) {
      if (listMedic[j].MedicineID == s.medicineId) {
        return (
          <Text style={styles.text3} key={i}>
            {" "}
            {i + 1}). {listMedic[j].MedicineName} {s.unit} Units{" "}
          </Text>
        );
      }
    }
  });

  return (
    <ScrollView>
      <SafeAreaView style={styles.container}>
        {redered && <Text style={styles.text}>Prescription</Text>}

        <Input
          style={styles.inputBox}
          placeholder="รหัสประจำตัว"
          onChangeText={setmedicalpersonId}
          value={medicalpersonId}
          leftIcon={<Icon name="user-o" size={24} color="#2196F3" />}
        />

        <Input
          style={styles.inputBox}
          placeholder="ชื่อการรักษา"
          onChangeText={setcureName}
          value={cureName}
          leftIcon={<Icon name="pencil" size={24} color="#2196F3" />}
        />

        <Input
          style={styles.inputBox}
          placeholder="ชนิดของการรักษา"
          onChangeText={settypeOfCure}
          value={typeOfCure}
          leftIcon={<Icon name="medkit" size={21} color="#2196F3" />}
        />

        <Input
          style={styles.inputBox}
          placeholder="การรักษาเพิ่มเติม"
          onChangeText={setspecialTreat}
          value={specialTreat}
          leftIcon={<Icon name="flask" size={23} color="#2196F3" />}
        />

        <Input
          style={styles.inputBox}
          placeholder="ระดับอาการป่วย"
          onChangeText={setstateOfIllness}
          value={stateOfIllness}
          leftIcon={<Icon name="wheelchair" size={23} color="#2196F3" />}
        />

        <Input
          style={styles.inputBox}
          placeholder="จำนวนวันเข้ารักษา"
          onChangeText={settreatDay}
          value={treatDay}
          leftIcon={<Icon name="calendar-plus-o" size={21} color="#2196F3" />}
        />

        <View style={{ width: "90%", alignItems: "center" }}>
          <Picker
            selectedValue={medicineSelected}
            style={{
              height: 40,
              width: "100%",
              marginBottom: 5,
              borderRadius: 10,
              borderColor: "#e3e1da",
            }}
            onValueChange={(itemValue, itemIndex) =>
              setMedicineSelect(itemValue)
            }
          >
            <Picker.Item key={0} value="" label="-- กรุณาเลือกชนิดของยา --" />
            {MedicineItem}
          </Picker>

          <View
            style={{
              width: "85%",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <Input
              style={{
                borderColor: "gray",
                flex: 2,
                borderWidth: 1,
                borderRadius: 10,
                padding: 10,
                marginBottom: 7,
              }}
              placeholder="จำนวน"
              onChangeText={setUnit}
              value={unit}
            />
            <Button
              style={styles.appButtonContainer}
              onPress={addSelectedMedic}
              icon={<Icon name="plus" size={20} color="#2196F3" />}
              type="outline"
              title="เพิ่ม"
            ></Button>
          </View>
        </View>

        <Text style={styles.text2}>
          ยาที่ลงทะเบียนแล้ว :{" "}
          {MedicineSlelectItem.length === 0 ? "ไม่มี" : null}
        </Text>
        <View style={{ marginBottom: 30, alignItems: "center" }}>
          {MedicineSlelectItem}
        </View>

        <TouchableOpacity
          style={{
            elevation: 8,
            backgroundColor: isFullFill ? "#555" : "#2196F3",
            borderRadius: 10,
            paddingVertical: 10,
            paddingHorizontal: 12,
            width: 200,
            marginTop: 5,
            marginLeft: 5,
            marginBottom: 20,
          }}
          onPress={onSubmit}
          disabled={isFullFill}
        >
          <Text style={styles.appButtonText}>ลงทะเบียน</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </ScrollView>
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
  text2: {
    fontSize: 15,
    fontWeight: "bold",
    color: "black",
    marginTop: 5,
    marginBottom: 10,
  },
  text3: {
    fontSize: 13,
    fontWeight: "bold",
    color: "black",
    marginBottom: 5,
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
    fles: 1,
    width: "80%",
    height: "100%",
    fontSize: 14,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase",
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
});
