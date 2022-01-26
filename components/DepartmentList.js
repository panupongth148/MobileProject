//                       _oo0oo_
//                      o8888888o
//                      88" . "88
//                      (| -_- |)
//                      0\  =  /0
//                    ___/`---'\___
//                  .' \|     |// '.
//                 / \|||  :  |||// \
//                / _||||| -:- |||||- \
//               |   | \\  -  /// |   |
//               | \_|  ''\---/''  |_/ |
//               \  .-\__  '-'  ___/-. /
//             ___'. .'  /--.--\  `. .'___
//          ."" '<  `.___\_<|>_/___.' >' "".
//         | | :  `- \`.;`\ _ /`;.`/ - ` : | |
//         \  \ `_.   \_ __\ /__ _/   .-` /  /
//     =====`-.____`.___ \_____/___.-`___.-'=====

import React from "react";
import { FlatList, View, StyleSheet } from "react-native";
import { Button } from "react-native-elements";

const DepartmentList = (props) => {
  const renderDepartment = (itemData) => {
    return (
      <View style={styles.list}>
        <Button
          type="outline"
          title={itemData.item.Title}
          onPress={() => {
            props.navigation.navigate("Department", {
              prev: "Home",
              departmentName: itemData.item.Title,
            });
          }}
          // key={itemData.item.key}
          style={styles.appButtonContainer}
        />
      </View>
    );
  };

  return (
    <FlatList
      style={styles.flat}
      data={props.dep}
      numColumns={2}
      renderItem={renderDepartment}
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
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginTop: 5,
    marginLeft: 5,
    padding: 10,
    fontSize: 14,
    color: "#fff",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  appButtonText: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase",
  },
});

export default DepartmentList;
