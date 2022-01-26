import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import DepartmentList from './../components/DepartmentList';
import { DEPARTMENTS } from './../data/data';

export default function Home({navigation}) {

    return (
        <View style={styles.container}>
            <Text style={styles.text}>แผนก</Text>
            <DepartmentList dep={DEPARTMENTS} navigation={navigation} />
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
        marginBottom: 30
    },
    inputBox: {
        borderWidth: 1,
        borderColor: 'black',
        width: '40%',
        marginBottom: 30,
        paddingHorizontal: 6
    }
});