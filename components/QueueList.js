import React, { useState } from "react";
import { FlatList, View, StyleSheet } from "react-native";
import { Button, Input, ListItem } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";

const QueueList = (props) => {
  const renderQueue = (itemData) => {
    return (
      <View style={styles.list}>
        <ListItem
          bottomDivider
          style={{ width: "90%" }}
          onPress={() => {
            props.navigation.navigate("Patient Data", { queue: itemData.item });
          }}
        >
          <Icon name="user" />
          <ListItem.Content>
            <ListItem.Title>{itemData.item.Name}</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
      </View>
    );
  };

  return (
    <FlatList
      style={styles.flat}
      data={props.queue}
      renderItem={renderQueue}
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
    marginLeft: 2,
    marginRight: 2,
  },
  flat: {
    marginTop: 0,
    marginBottom: 5,
    width: "100%",
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
});

export default QueueList;
