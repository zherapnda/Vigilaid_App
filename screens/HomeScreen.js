import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Dimensions} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {MaterialIcon} from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

const {width} = Dimensions.get('window');

const HomeScreen = () => {
    const[isListening, setListening] = useState(false);
    const[userStats] = useState({
        points: 1247,
        completedModules: 5,
        totalModules: 10,
        currentBadge: 'Tiger',
    });

    const handleEmergencyAlert = () => {
        Alert.alert(
            'Emergency Alert',
            'GPS Location shared with emergency contacts.',
            [{text: 'OK', onPress: () => console.log('Alert acknowledged')}],
        );
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
           <View style={{ flex: 1 }}>
             <LinearGradient colors={['#ffe5e5', '#fff0f0','#ffcccc']}
                style={StyleSheet.absoluteFill} 
                start={{ x:0, y:0}}
                end={{x:1,y:1}}/>


             <View style={styles.emergencySection}>
                <Text style={styles.emergencyTitle}>Emergency</Text>

                <TouchableOpacity style={styles.sendGPSButton} onPress={handleEmergencyAlert} activeOpacity={0.8}>
                    <LinearGradient
                        colors={['#1F2937', '#111827']}
                        style={styles.gradientButton}>
                            <Text style={styles.sendGPSButtonText}>Send GPS Location</Text>
                    </LinearGradient>
                        
                </TouchableOpacity>
             </View>
            </View>
        </ScrollView>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
        padding: 20,
    },
    emergencySection: {
        backgroundColor: '#B92D29',
        borderRadius: 10,
        padding: 20,
        marginBottom: 20,
    },
    emergencyTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
    },
    sendGPSButton: {
        backgroundColor: '#fff',
        paddingVertical: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    sendGPSButtonText: {
        fontSize: 16,
        color: '#B92D29',
        fontWeight: 'bold',
    }
});

export default HomeScreen;
