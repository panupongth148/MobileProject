import React, { useEffect, useRef } from 'react';
import { Animated, View, Button, StyleSheet } from 'react-native';

export default function Welcome({navigation}) {
    const anim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.spring(anim, {
            toValue: 0.5,
            friction: 0.7,
            useNativeDriver: true,
        }).start( () => { anim.setValue(0.5); } );
        // navigation.replace("Login");
    }, []);

    return (
        <View style={styles.screen}>
            <Animated.Image
                style={{ width: 620, height: 450, transform: [{scale: anim}]}}
                source={require("./../assets/TiangPrompt_Logo.png")}
            />

            <Button title="กดเพื่อเข้าใช้งาน" onPress={() => { navigation.replace("Login") }}></Button>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});