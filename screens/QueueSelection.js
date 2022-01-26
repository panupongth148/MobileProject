import React, { useState, useEffect } from "react";
import { Button, Input } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import { View, Text, StyleSheet, Picker } from "react-native";
import firebase from "../data/firebaseDB";

export default function QueueSelection({ route, navigation }) {
  const [selectedValue, setSelectedValue] = useState(null);

  const [type, setType] = useState("Doctor");
  const [wardInfo, setWardInfo] = useState(["sdds", "dsds"]);
  const [department, setDepartment] = useState(null);
  const [typeOfWard, setTypeOfWard] = useState(null);
  const [listTypeOfWard, setListTypeOfWard] = useState(["โปรดเลือกแผนก"]);
  const [wardName, setWardName] = useState([]);
  const [bedValue, setbedValue] = useState([]);
  const [listWardName, setListWardName] = useState(["โปรดเลือกประเภทวอร์ด"]);
  const [listBedName, setListBedName] = useState([
    { bedName: "โปรดเลือก ward", bedId: "0" },
  ]);
  const [wardId, setWardId] = useState(null);
  const [bedId, setBedId] = useState(null);

  useEffect(() => {
    (async () => {
      const snapshot = await firebase.firestore().collection("ward").get();
      await snapshot.forEach((doc) => {
        wardInfo.push(doc.data());
      });
      changeDepartment("internal_medicine");
    })();
  }, []);

  const onSubmit = async () => {
    try {
      let iddoc_bed;
      const snapshotGetBed = await firebase
        .firestore()
        .collection("bed")
        .where("BedID", "==", bedId)
        .get();
      await snapshotGetBed.forEach((doc) => {
        iddoc_bed = doc.id;
      });
      firebase
        .firestore()
        .collection("bed")
        .doc(iddoc_bed)
        .update({ PatientID: route.params.PatientID, StateOfBed: "used" });

      let docid_queue;
      const snapshotGetQueue = await firebase
        .firestore()
        .collection("queue")
        .where("PatientID", "==", route.params.PatientID)
        .get();
      await snapshotGetQueue.forEach((doc) => {
        docid_queue = doc.id;
      });
      await firebase.firestore().collection("queue").doc(docid_queue).delete();
    } catch (err) {
      console.log(err);
    }
    
    alert("ลงทะเบียนเตียงสำเร็จ");
    navigation.replace("Queue");
  };

  const changeDepartment = async (depart) => {
    // setListTypeOfWard(["โปรดเลือกประเภทของวอร์ด"])
    setDepartment(depart);

    const all_data = [];
    const snapshotGetDepartment = await firebase
      .firestore()
      .collection("ward")
      .where("Department", "==", depart)
      .get();
    await snapshotGetDepartment.forEach((doc) => {
      if (
        !all_data.includes(doc.data().TypeOfWard) &&
        doc.data().TypeOfWard != ""
      ) {
        all_data.push(doc.data().TypeOfWard);
      }
    });

    if (all_data.includes("โปรดเลือกแผนก")) {
      all_data.splice(0, 1);
    }

    setListTypeOfWard(all_data);
    changeType(all_data[0], depart);
  };

  const changeType = async (type, depart) => {
    // setListTypeOfWard(["โปรดเลือกประเภทของวอร์ด"])
    setTypeOfWard(type);

    const all_data = [];
    const snapshotGetWardName = await firebase
      .firestore()
      .collection("ward")
      .where("TypeOfWard", "==", type)
      .where("Department", "==", depart)
      .get();
    await snapshotGetWardName.forEach((doc) => {
      all_data.push(doc.data().WardName);
    });

    if (all_data.includes("โปรดเลือก ward")) {
      all_data.splice(0, 1);
    }

    setListWardName(all_data);
    changeWard(all_data[0]);
  };

  const changeWard = async (wardN) => {
    // setListTypeOfWard(["โปรดเลือกประเภทของวอร์ด"])
    setWardName(wardN);

    const all_data = [];
    let wID;
    const snapshotGetWardID = await firebase
      .firestore()
      .collection("ward")
      .where("WardName", "==", wardN)
      .get();
    await snapshotGetWardID.forEach((doc) => {
      wID = doc.data().WardID;
    });

    const snapshotGetBedInfo = await firebase
      .firestore()
      .collection("bed")
      .where("WardID", "==", wID)
      .get();
    await snapshotGetBedInfo.forEach((doc) => {
      if (doc.data().StateOfBed != "used") {
        all_data.push({
          bedName: doc.data().BedName,
          bedId: doc.data().BedID,
          state: doc.data().StateOfBed,
        });
      }
    });

    if (all_data.includes("โปรดเลือกประเภทของวอร์ด")) {
      all_data.splice(0, 1);
    }

    setListBedName(all_data);
    changeBed(all_data[0].bedId);
  };

  const changeBed = async (bedId) => {
    setbedValue(bedId);
    setBedId(bedId);
  };

  let typeWardItem = listTypeOfWard.map((s, i) => {
    return <Picker.Item key={i} value={s} label={s} />;
  });
  let wardNameItem = listWardName.map((s, i) => {
    return <Picker.Item key={i} value={s} label={s} />;
  });

  let bedNameItem = listBedName.map((s, i) => {
    return (
      <Picker.Item value={s.bedId} label={s.bedName + " [ " + s.state + " ]"} />
    );
  });
  return (
    <View style={styles.container}>
      <Text style={styles.text}>เลือกเตียง</Text>

      {wardInfo && (
        <Picker
          selectedValue={department}
          style={{
            height: 40,
            width: "95%",
            marginBottom: 5,
            borderRadius: 10,
            borderColor: "#e3e1da",
          }}
          onValueChange={(itemValue, itemIndex) => changeDepartment(itemValue)}
        >
          <Picker.Item label="อายุรกรรม" value="internal_medicine" />
          <Picker.Item label="ศัลยกรรม" value="surgey" />
          <Picker.Item label="วอร์ดฉุกเฉิน" value="er" />
          <Picker.Item label="วอร์ดปราศจากเชื้อโรค" value="or" />
          <Picker.Item label="ICU" value="icu" />
          <Picker.Item label="ห้องคลอด" value="delivery_room" />
          <Picker.Item label="นรีเวช" value="gynecology" />
          <Picker.Item label="กุมารเวช" value="pediatrics" />
        </Picker>
      )}
      <Text style={styles.text}>เลือกประเภท</Text>
      <Picker
        selectedValue={typeOfWard}
        style={{
          height: 40,
          width: "95%",
          marginBottom: 5,
          borderRadius: 10,
          borderColor: "#e3e1da",
        }}
        onValueChange={(itemValue, itemIndex) =>
          changeType(itemValue, department)
        }
      >
        {typeWardItem}
      </Picker>

      <Text style={styles.text}>เลือก ward</Text>
      <Picker
        selectedValue={wardName}
        style={{
          height: 40,
          width: "95%",
          marginBottom: 5,
          borderRadius: 10,
          borderColor: "#e3e1da",
        }}
        onValueChange={(itemValue, itemIndex) => changeWard(itemValue)}
      >
        {wardNameItem}
      </Picker>

      <Text style={styles.text}>เลือก เตียง</Text>
      <Picker
        selectedValue={bedValue}
        style={{
          height: 40,
          width: "95%",
          marginBottom: 5,
          borderRadius: 10,
          borderColor: "#e3e1da",
        }}
        onValueChange={(itemValue, itemIndex) => changeBed(itemValue)}
      >
        {bedNameItem}
      </Picker>

      <Button
        type="outline"
        icon={<Icon name="check" size={20} color="#2196F3" />}
        title="ยืนยัน"
        style={styles.appButtonContainer}
        onPress={onSubmit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    flexDirection: "column",
    // justifyContent: "center",
    alignItems: "center",
    width: "100%",
    // height: "100%",
    paddingVertical: 30,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
    marginTop: 10,
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
    elevation: 8,
    // backgroundColor: "#2196F3",
    // borderRadius: 10,
    // paddingVertical: 10,
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
