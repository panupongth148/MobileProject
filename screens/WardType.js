import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import WardList from './../components/WardList';
import { useState } from "react";

export default function Ward({route, navigation}) {
    const [wardRoom, setWardRoom] = useState({
        department: route.params.department,
        wardType: route.params.wardType
    })

    return (
        <View style={styles.container}>
            <Text style={styles.text}>ห้อง</Text>
            <WardList wardRoom={wardRoom} navigation={navigation} />
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