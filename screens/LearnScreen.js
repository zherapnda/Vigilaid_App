import React from 'react';
import {View, Text, StyleSheet} from 'react-native';    

const LearnScreen = () => {
    return (
        <View style={styles.container}>
        <Text style={styles.title}>Learn Any Emergency</Text>
        <Text style={styles.description}>Choose Your Module</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    description: {
        fontSize: 16,
        color: '#666',
    },
});

export default LearnScreen;
