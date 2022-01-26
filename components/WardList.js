import React, { useState, useEffect } from "react";
import { Button } from "react-native-elements";
import { FlatList, View, StyleSheet } from "react-native";
import firebase from "../data/firebaseDB";

const WardList = (props) => {
  const [ward, setWard] = useState(null);

  const getCollection = async (querySnapshot) => {
    const all_data = [];
    await querySnapshot.forEach((res) => {
      if (res.data().Department == props.wardRoom.department) {
        all_data.push(res.data());
      }
    });
    setWard(all_data);
  };

  useEffect(() => {
    (async () => {
      const unsubscribe = await firebase
        .firestore()
        .collection("ward")
        .where("TypeOfWard", "==", props.wardRoom.wardType)
        .onSnapshot(getCollection);

      return () => {
        unsubscribe();
      };
    })();
  }, [props.wardType]);

  const renderWard = (itemData) => {
    return (
      <View style={styles.list}>
        {ward && (
          <Button
            style={{ marginTop: 5 }}
            type="outline"
            onPress={() => {
              props.navigation.navigate("Ward", {
                prev: "WardType",
                wardId: itemData.item.WardID,
              });
            }}
            title={itemData.item.WardName}
          />
        )}
      </View>
    );
  };
  
  return (
    <FlatList
      style={styles.flat}
      data={ward}
      numColumns={2}
      renderItem={renderWard}
      keyExtractor={(item) => item.Key}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  flat: {
    margin: 15,
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

export default WardList;
