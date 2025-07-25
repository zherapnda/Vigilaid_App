import React from 'react';
import {View, Text, StyleSheet} from 'react-native';


const ForumScreen = () => {
    return (
        <View style={styles.container}>
        <Text style={styles.title}>User Profile</Text>
        <Text style={styles.description}>Manage your profile settings here.</Text>
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

export default ForumScreen;
