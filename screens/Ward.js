import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import TiangList from './../components/TiangList';

export default function Ward({route, navigation}) {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>เตียง</Text>
            <TiangList wardID={route.params.wardId} navigation={navigation} />
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