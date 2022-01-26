import React from "react";
import { FlatList, View, StyleSheet, Text } from "react-native";
import { Card, ListItem, Button } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";

const MedicineList = (props) => {
  var count = 1;
  const renderMedicine = (itemData) => {
    return (
      <View style={styles.list}>
        <Card>
          <Card.Title>
          ยาตัวที่ {count++}
          </Card.Title>
          <Card.Divider />
          <Text style={{ marginBottom: 10 }}>{<Icon name="medkit" size={20} color="#2196F3" />} {itemData.item.MedicineName}</Text>
          <Text
            style={{ color: "black", height: 40, width: "100%", fontSize: 15 }}
          >
            {<Icon name="cutlery" size={20} color="#2196F3" />}  {itemData.item.Unit} เม็ด
          </Text>
        </Card>
      </View>
    );
  };

  return (
    <FlatList
      style={styles.flat}
      data={props.med}
      numColumns={2}
      renderItem={renderMedicine}
      keyExtractor={(item) => item.MedicineID}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
    flexDirection: "Column",
    justifyContent: "center",
    alignItems: "center",
  },
  flat: {
    margin: 15,
  },
  sectionHeader: {
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    fontSize: 18,
    fontWeight: "bold",
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
});

export default MedicineList;
