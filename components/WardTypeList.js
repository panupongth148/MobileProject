import React from "react";
import { Button } from "react-native-elements";
import { FlatList, View, StyleSheet } from "react-native";

const WardTypeList = (props) => {

  const renderWardType = (itemData) => {
    return (
      <View style={styles.list}>
        <Button
          style={{ marginTop: 5 }}
          type="outline"
          title={itemData.item.TypeOfWard}
          onPress={() => {
            props.navigation.navigate("WardType", {
              prev: "Department",
              wardType: itemData.item.TypeOfWard,
              department: itemData.item.Department,
            });
          }}
          style={styles.appButtonContainer}
        />
      </View>
    );
  };

  return (
    <FlatList
      style={styles.flat}
      data={props.wardInfo}
      renderItem={renderWardType}
      // keyExtractor={item => item.Key}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
    marginTop: 2,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
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
    paddingVertical: 10,
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

export default WardTypeList;
