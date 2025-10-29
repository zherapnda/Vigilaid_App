import NoiseOverlay from '@/components/noiseBackground';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import Entypo from '@expo/vector-icons/Entypo';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const {width} = Dimensions.get('window');

const HomeScreen = () => {
    const router = useRouter();
    const[isListening, setListening] = useState(false);
    const[showTruth, setShowTruth] = useState(false);
    const[userStats] = useState({
        points: 1247,
        completedModules: 5,
        totalModules: 10,
        currentBadge: 'Tiger',
    });

    const handleEmergencyAlert = () => {
        console.log('🚨 Emergency Alert pressed - navigating to EmergencyScreen');
        router.push('/emergency');
    };

    const handleSendLocation = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert(
            'Location Sent',
            'Your GPS location has been sent to your emergency contacts.',
            [{text: 'OK', onPress: () => console.log('Location sent')}],
        );
    }

    const [mythOfTheDay] = useState({
        myth: "Tilting your head back for nosebleed will stop the bleeding.",
        truth: "This causes your stomatch to be irritated with blood, instead lean forward",
        imageUrl: "path/to/myth-image.png" // or you can use an icon name
    });

    return (
        <View style={styles.container}>
            {/* Base Gradient Background */}
            <LinearGradient 
                colors={['#fdd1d1ff', '#fcf4f4eb','#ffffff','#fdfbf9','#a60000ff']}
                style={StyleSheet.absoluteFill} 
                start={{ x:-1, y:1}}
                end={{x:1,y:1.4}}
            />
            
            {/* Noise Texture Overlay - Now properly tiled */}
            <NoiseOverlay opacity={2.6} />
            
            {/* Scrollable Content */}
            <ScrollView 
                style={styles.scrollContainer} 
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}>

                <LinearGradient
                    colors={['#BB2B29', '#ffffff', '#BB2B29']}
                    style={styles.emergencySection}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}>

                    <NoiseOverlay opacity={1.0} />
 
                    <View style={styles.mythHeader}>
                       <View style={styles.mythIconCircle}>
                        <MaterialIcons name="warning" size={24} color="#530404" />
                       </View>
                     <Text style={styles.emergencyTitle}>Emergency</Text>
                    </View>


                    <View style={styles.buttonRow}>
                        <NoiseOverlay opacity={1.9} />

                        <TouchableOpacity
                            style={styles.cardButton}
                            onPress= {handleEmergencyAlert}
                            activeOpacity={0.8}>
                                <View style={styles.iconWrapper}>
                                    <NoiseOverlay opacity={1.0} />
                                    <Entypo name="plus" size={125} color="#9b0907ff" />
                                </View>
                                <Text style={styles.cardText}>Emergency Alert</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.cardButton}
                            onPress={handleSendLocation}
                            activeOpacity={0.8}>
                                <View style={styles.iconWrapper}>
                                    <NoiseOverlay opacity={1.0} />
                                    <MaterialIcons name="location-on" size={125} color="#9b0907ff"/>
                                </View>
                                <Text style={styles.cardText}>Send GPS Location</Text>
                        </TouchableOpacity>

                    </View>
                </LinearGradient>
            
                <LinearGradient
                    colors={['#BB2B29', '#ffffff', '#BB2B29']}
                    style={styles.mythSection}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}>

                    <NoiseOverlay opacity={1.0} />

                    <View style={styles.mythHeader}>
                        <View style={styles.mythIconCircle}>
                            <MaterialIcons name="lightbulb" size={24} color="#530404" />
                        </View>
                        <Text style={styles.mythTitle}>Myth of the Day</Text>
                    </View>

                    <View style={styles.mythContent}>
                        <NoiseOverlay opacity={1.0} />
                        <View style={styles.mythRevealBlock}>
                            <NoiseOverlay opacity={0.8} />
                            <MaterialCommunityIcons name="help-circle-outline" size={28} color="#530404" />
                            <Text style={styles.mythBigLabel}>COMMON MYTH:</Text>
                            <Text style={styles.mythText}>{mythOfTheDay.myth}</Text>
                        </View>
    
    
                      {!showTruth && (
                        <TouchableOpacity 
                            style={styles.revealButton}
                            onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                                setShowTruth(true);
                            }}>
                           <NoiseOverlay opacity={1.0} />
                           <MaterialIcons name="visibility" size={20} color="#fff" />
                           <Text style={styles.revealButtonText}>TAP TO REVEAL THE TRUTH</Text>
                           <MaterialIcons name="visibility" size={20} color="#fff" />
                        </TouchableOpacity>
                      )}
    
    
                      {showTruth && (
                        <View style={styles.truthRevealBlock}>
                            <NoiseOverlay opacity={0.8} />
                            <MaterialIcons name="verified" size={24} color="#2E7D32" />
                            <Text style={styles.truthBigLabel}>THE TRUTH:</Text>
                            <Text style={styles.truthText}>{mythOfTheDay.truth}</Text>
                        </View>
                      )}
                    </View>
                </LinearGradient>


                <LinearGradient
                    colors={['#BB2B29', '#ffffff', '#BB2B29']}
                    style={styles.scoreSection}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}>

                    <NoiseOverlay opacity={1.0} />

                    <View style={styles.scoreHeader}>
                        <View style={styles.mythIconCircle}>
                            <MaterialIcons name="military-tech" size={24} color="#530404" />
                        </View>
                        <Text style={styles.scoreTitle}>Your Progress</Text>
                    </View>

                    <View style={styles.progressContainer}>
                        <NoiseOverlay opacity={2.3} />
                        
        
        
                    <View style={styles.progressDetails}>
                        <View style={styles.scoreBadge}>
                            <Text style={styles.scorePoints}>Points: {userStats.points.toLocaleString()}</Text>
                        </View>
                        
            
                    <View style={styles.badgeInfo}>
                        <View style={styles.mythIconCircle}>
                            <MaterialIcons name="emoji-events" size={20} color="#BB2B29" />
                        </View>
                        <Text style={styles.badgeText}>{userStats.currentBadge}</Text>
                    </View>
                </View>
              </View>
            </LinearGradient>





                    
                
            </ScrollView>
        </View>
    );
};

const CARD_WIDTH = (width - 80) / 2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  emergencySection: {
    backgroundColor: "rgba(255,236,238,0.95)",
    borderWidth: 4,
    borderColor: "#931111ff",
    borderShadowColor: "#ECA0A0",
    shadowOffset: { width: 5, height: 20 },
    borderRadius: 18,
    padding: 12,
    elevation: 10,
  },
  emergencyTitle: {
    fontSize: 22,
    color: "#4b4949ff",
    marginBottom: -2,
    marginLeft:-1,
    fontFamily: "PoppinsMedium",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardButton: {
    width: CARD_WIDTH,
    aspectRatio: 0.9,
    backgroundColor: "#fff",
    borderWidth: 5,
    borderColor: "#530404",
    borderRadius: 12,
    borderShadowColor: "#000",
    shadowOffset: { width: 5, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 20,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    paddingBottom: 20,
    paddingTop: 20,
  },
  activeButton: {
    borderColor: "#007aff", 
    borderWidth: 2,
  },
  cardText: {
    fontSize: 20,
    color: "#333",
    textAlign: "center",
    marginTop: 5,
    fontFamily: "PoppinsBold",
    lineHeight: 18,
    paddingBottom: 5,
    marginBottom: 5,
    marginTop: -1,
    paddingTop: 5,
    top: -2,
  },
  mythSection: {
    backgroundColor: "rgba(255,236,238,0.95)",
    borderWidth: 4,
    borderColor: "#931111ff",
    borderRadius: 18,
    padding: 12,
    marginTop: 20, 
    elevation: 10,
 },
 mythHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
 },
 mythIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#530404',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
 },
 mythIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
 },
 mythTitle: {
    fontSize: 22,
    color: "#4b4949ff",
    fontFamily: "PoppinsMedium",
 },
 mythContent: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#530404',
    borderRadius: 12,
    padding: 15,
 },
 mythLabel: {
    fontSize: 14,
    color: "#530404",
    fontFamily: "PoppinsBold",
    marginBottom: 5,
 },
 mythText: {
    fontSize: 14,
    color: "#333",
    backgroundColor: '#ffe8e886',
    borderRadius: 8,
    fontFamily: "PoppinsMedium",
    lineHeight: 20,
    borderColor: '#530404',
    borderWidth: 2,
    paddingTop: 5,
    paddingBottom: 5,
    paddingHorizontal: 10,

 },
 revealButton: {
    backgroundColor: '#530404',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 17,
    borderRadius: 39,
    borderColor: '#bf7876ff',
    borderWidth: 4,
    marginVertical: 15,
 },
 revealButtonText: {
    color: '#fff',
    fontFamily: 'PoppinsBoldItalic',
    marginRight: 8,
    fontSize: 14,
 },
 mythRevealBlock: {
    alignItems: 'center',
    padding: 1,
 },
 truthRevealBlock: {
    alignItems: 'center',
    padding: 10,
    paddingTop: 5,
    marginTop: 15,
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#2E7D32',
 },
 mythBigLabel: {
    fontSize: 17,
    color: '#530404',
    fontFamily: 'PoppinsBold',
    marginTop: 2,
    marginBottom: 2,
    paddingHorizontal: 10,
    paddingVertical: 5,
    paddingRight: 20,
    paddingBottom: 1,
    paddingTop: 0,

 },
 truthBigLabel: {
    fontSize: 16,
    color: '#2E7D32',
    fontFamily: 'PoppinsBold',
    marginTop: 5,
 },
 truthText: {
    fontSize: 14,
    color: '#333',
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    fontFamily: 'PoppinsSemiBoldItalic',
 },
 scoreSection: {
    backgroundColor: "rgba(255,236,238,0.95)",
    borderWidth: 4,
    borderColor: "#931111ff",
    borderRadius: 18,
    padding: 12,
    marginTop: 20,
    elevation: 10,
 },
 scoreHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
 },
 scoreTitle: {
    fontSize: 22,
    color: "#4b4949ff",
    fontFamily: "PoppinsMedium",
    paddingLeft: -50,
 },
 scoreBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#BB2B29',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#530404',
    elevation: 3,
 },
 scorePoints: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'PoppinsBold',
    marginLeft: 5,
 },
 progressContainer: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#530404',
    borderRadius: 12,
    padding: 20,
    elevation: 5,
 },
 progressTrack: {
    height: 30,
    backgroundColor: '#FFE5E5',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#530404',
    overflow: 'hidden',
    position: 'relative',
 },
 progressFill: {
    height: '100%',
    borderRadius: 13,
    position: 'relative',
    overflow: 'hidden',
 },
 progressShimmer: {
    position: 'absolute',
    top: 0,
    left: -100,
    width: 100,
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.3)',
    transform: [{ skewX: '-20deg' }],
 },
 milestone: {
    position: 'absolute',
    top: '50%',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFE5E5',
    borderWidth: 2,
    borderColor: '#530404',
    transform: [{ translateX: -10 }, { translateY: -10 }],
    alignItems: 'center',
    justifyContent: 'center',
 },
 milestoneCompleted: {
    backgroundColor: '#2E7D32',
    borderColor: '#1B5E20',
 },
 progressDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
 },
 progressStats: {
    alignItems: 'flex-start',
 },
 progressLabel: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'PoppinsRegular',
 },
 progressNumbers: {
    fontSize: 18,
    fontFamily: 'PoppinsBold',
 },
 progressCurrent: {
    color: '#BB2B29',
    fontSize: 24,
 },
 progressDivider: {
    color: '#666',
    fontSize: 16,
 },
 progressTotal: {
    color: '#4b4949ff',
    fontSize: 20,
 },
 badgeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFE5E5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BB2B29',
 },
 badgeText: {
    marginLeft: 5,
    color: '#530404',
    fontFamily: 'PoppinsMedium',
    fontSize: 14,
},
});

export default HomeScreen;