import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Dimensions} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {MaterialIcons} from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import NoiseOverlay from '@/components/noiseBackground';

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
        <View style={styles.container}>
            {/* Base Gradient Background */}
            <LinearGradient 
                colors={['#a60000ff', '#fcf4f4eb','#ffffff','#fdfbf9','#a60000ff']}
                style={StyleSheet.absoluteFill} 
                start={{ x:-1, y:1}}
                end={{x:1,y:1.4}}
            />
            
            {/* Noise Texture Overlay - Now properly tiled */}
            <NoiseOverlay opacity={1.9} />
            
            {/* Scrollable Content */}
            <ScrollView 
                style={styles.scrollContainer} 
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}>

                <View style={styles.emergencySection}>
                    <Text style={styles.emergencyTitle}>Emergency</Text>

                    <TouchableOpacity 
                        style={styles.sendGPSButton} 
                        onPress={handleEmergencyAlert} 
                        activeOpacity={0.9}>
                        <LinearGradient
                            colors={['#530404', '#8B0000']}
                            style={styles.gradientButton}>
                            <Text style={styles.sendGPSButtonText}>Send GPS Location</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    scrollContainer: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    scrollContent: {
        padding: 20,
        minHeight: '100%',
        paddingBottom: 100, // Space for tab bar
    },
    emergencySection: {
        backgroundColor: 'rgba(255, 236, 238, 0.95)', // Added transparency to show texture beneath
        borderColor: '#530404',
        borderWidth: 2.5,
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    emergencyTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#530404',
        marginBottom: 10,
    },
    sendGPSButton: {
        borderRadius: 8,
        overflow: 'hidden',
    },
    gradientButton: {
        paddingVertical: 15,
        alignItems: 'center',
    },
    sendGPSButtonText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
    }
});

export default HomeScreen;