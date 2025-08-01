import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Dimensions,
    Animated,
    TextInput,
    Modal
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import NoiseOverlay from '@/components/noiseBackground';

const { width } = Dimensions.get('window');

const ProfileScreen = ({ navigation }) => {
    const [expandedSection, setExpandedSection] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [showImagePicker, setShowImagePicker] = useState(false);
    
    // Animation values for expandable sections
    const animatedHeights = useRef({
        allergies: new Animated.Value(0),
        emergency: new Animated.Value(0),
        medical: new Animated.Value(0)
    }).current;

    const [userProfile, setUserProfile] = useState({
        name: "John Doe",
        email: "john.doe@email.com",
        phone: "+1 (555) 123-4567",
        bloodType: "O+",
        profileImage: null,
        badges: [
            { id: 1, name: "Tiger", icon: "pets", color: "#FF6F00", earned: true },
            { id: 2, name: "Life Saver", icon: "favorite", color: "#BB2B29", earned: true },
            { id: 3, name: "Quick Learner", icon: "school", color: "#2E7D32", earned: true },
            { id: 4, name: "Community Hero", icon: "groups", color: "#7B1FA2", earned: false },
            { id: 5, name: "Expert", icon: "workspace-premium", color: "#FFD700", earned: false }
        ],
        allergies: [
            "Penicillin",
            "Peanuts",
            "Shellfish"
        ],
        emergencyContacts: [
            { name: "Jane Doe", relation: "Spouse", phone: "+1 (555) 987-6543" },
            { name: "Dr. Smith", relation: "Primary Doctor", phone: "+1 (555) 456-7890" }
        ],
        medicalConditions: [
            "Asthma",
            "Type 2 Diabetes"
        ],
        medications: [
            "Albuterol Inhaler - As needed",
            "Metformin - 500mg twice daily"
        ]
    });

    const [stats] = useState({
        lessonsCompleted: 5,
        totalPoints: 1247,
        leaderboardRank: 42,
        commentsPosted: 23,
        helpfulVotes: 156
    });

    const toggleSection = (section) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        
        if (expandedSection === section) {
            // Collapse
            Animated.timing(animatedHeights[section], {
                toValue: 0,
                duration: 300,
                useNativeDriver: false
            }).start();
            setExpandedSection(null);
        } else {
            // Collapse any open section
            if (expandedSection) {
                Animated.timing(animatedHeights[expandedSection], {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: false
                }).start();
            }
            
            // Expand new section
            const heightValue = section === 'medical' ? 200 : 150;
            Animated.timing(animatedHeights[section], {
                toValue: heightValue,
                duration: 300,
                useNativeDriver: false
            }).start();
            setExpandedSection(section);
        }
    };

    const InfoBox = ({ title, icon, color, section, children }) => (
        <View style={styles.infoBoxContainer}>
            <TouchableOpacity
                style={[styles.infoBoxHeader, { borderColor: color }]}
                onPress={() => toggleSection(section)}
                activeOpacity={0.8}>
                <View style={styles.infoBoxTitle}>
                    <View style={[styles.iconCircle, { backgroundColor: color + '20' }]}>
                        <MaterialIcons name={icon} size={24} color={color} />
                    </View>
                    <Text style={styles.infoBoxTitleText}>{title}</Text>
                </View>
                <MaterialIcons 
                    name={expandedSection === section ? "expand-less" : "expand-more"} 
                    size={24} 
                    color={color} 
                />
            </TouchableOpacity>
            
            <Animated.View 
                style={[
                    styles.infoBoxContent,
                    { 
                        maxHeight: animatedHeights[section],
                        opacity: animatedHeights[section].interpolate({
                            inputRange: [0, 150],
                            outputRange: [0, 1]
                        })
                    }
                ]}>
                <View style={styles.infoBoxInner}>
                    {children}
                </View>
            </Animated.View>
        </View>
    );

    return (
        <View style={styles.container}>
            <LinearGradient 
                colors={['#a60000ff', '#fcf4f4eb','#ffffff','#fdfbf9','#a60000ff']}
                style={StyleSheet.absoluteFill} 
                start={{ x:-1, y:1}}
                end={{x:1,y:1.4}}
            />
            <NoiseOverlay opacity={1.9} />

            <ScrollView 
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}>

                {/* Profile Header */}
                <LinearGradient
                    colors={['#BB2B29', '#ffffff', '#BB2B29']}
                    style={styles.profileHeader}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}>
                    <NoiseOverlay opacity={0.8} />
                    
                    {/* Profile Image */}
                    <TouchableOpacity 
                        style={styles.profileImageContainer}
                        onPress={() => setShowImagePicker(true)}>
                        {userProfile.profileImage ? (
                            <Image source={{ uri: userProfile.profileImage }} style={styles.profileImage} />
                        ) : (
                            <View style={styles.profileImagePlaceholder}>
                                <MaterialIcons name="person" size={50} color="#fff" />
                            </View>
                        )}
                        <View style={styles.editImageBadge}>
                            <MaterialIcons name="camera-alt" size={16} color="#fff" />
                        </View>
                    </TouchableOpacity>
                    
                    <Text style={styles.userName}>{userProfile.name}</Text>
                    <Text style={styles.userEmail}>{userProfile.email}</Text>
                    
                    {/* Quick Stats */}
                    <View style={styles.quickStats}>
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>{stats.lessonsCompleted}</Text>
                            <Text style={styles.statLabel}>Lessons</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>{stats.totalPoints}</Text>
                            <Text style={styles.statLabel}>Points</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>#{stats.leaderboardRank}</Text>
                            <Text style={styles.statLabel}>Rank</Text>
                        </View>
                    </View>
                </LinearGradient>

                {/* Badges Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Achievements</Text>
                    <View style={styles.badgesContainer}>
                        {userProfile.badges.map((badge) => (
                            <TouchableOpacity
                                key={badge.id}
                                style={[
                                    styles.badgeItem,
                                    !badge.earned && styles.unearned
                                ]}
                                activeOpacity={0.8}>
                                <View style={[
                                    styles.badgeIcon,
                                    { backgroundColor: badge.earned ? badge.color : '#ccc' }
                                ]}>
                                    <MaterialIcons 
                                        name={badge.icon} 
                                        size={28} 
                                        color="#fff" 
                                    />
                                </View>
                                <Text style={[
                                    styles.badgeName,
                                    !badge.earned && styles.unearnedText
                                ]}>
                                    {badge.name}
                                </Text>
                                {!badge.earned && (
                                    <MaterialIcons name="lock" size={16} color="#ccc" />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Medical Information */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Medical Information</Text>
                    
                    {/* Allergies */}
                    <InfoBox 
                        title="Allergies & Reactions" 
                        icon="warning" 
                        color="#BB2B29" 
                        section="allergies">
                        <View style={styles.infoList}>
                            {userProfile.allergies.map((allergy, index) => (
                                <View key={index} style={styles.infoItem}>
                                    <MaterialIcons name="error-outline" size={16} color="#BB2B29" />
                                    <Text style={styles.infoItemText}>{allergy}</Text>
                                </View>
                            ))}
                            <TouchableOpacity style={styles.addButton}>
                                <MaterialIcons name="add" size={20} color="#BB2B29" />
                                <Text style={styles.addButtonText}>Add Allergy</Text>
                            </TouchableOpacity>
                        </View>
                    </InfoBox>

                    {/* Emergency Contacts */}
                    <InfoBox 
                        title="Emergency Contacts" 
                        icon="phone" 
                        color="#2E7D32" 
                        section="emergency">
                        <View style={styles.contactsList}>
                            {userProfile.emergencyContacts.map((contact, index) => (
                                <View key={index} style={styles.contactItem}>
                                    <View>
                                        <Text style={styles.contactName}>{contact.name}</Text>
                                        <Text style={styles.contactRelation}>{contact.relation}</Text>
                                    </View>
                                    <Text style={styles.contactPhone}>{contact.phone}</Text>
                                </View>
                            ))}
                            <TouchableOpacity style={styles.addButton}>
                                <MaterialIcons name="person-add" size={20} color="#2E7D32" />
                                <Text style={styles.addButtonText}>Add Contact</Text>
                            </TouchableOpacity>
                        </View>
                    </InfoBox>

                    {/* Medical Records */}
                    <InfoBox 
                        title="Medical Records" 
                        icon="folder" 
                        color="#FFA000" 
                        section="medical">
                        <View style={styles.medicalContent}>
                            <View style={styles.medicalSection}>
                                <Text style={styles.medicalLabel}>Blood Type:</Text>
                                <Text style={styles.medicalValue}>{userProfile.bloodType}</Text>
                            </View>
                            <View style={styles.medicalSection}>
                                <Text style={styles.medicalLabel}>Conditions:</Text>
                                {userProfile.medicalConditions.map((condition, index) => (
                                    <Text key={index} style={styles.medicalItem}>• {condition}</Text>
                                ))}
                            </View>
                            <View style={styles.medicalSection}>
                                <Text style={styles.medicalLabel}>Current Medications:</Text>
                                {userProfile.medications.map((med, index) => (
                                    <Text key={index} style={styles.medicalItem}>• {med}</Text>
                                ))}
                            </View>
                            <TouchableOpacity style={styles.viewAllButton}>
                                <Text style={styles.viewAllText}>View Full Medical History</Text>
                                <MaterialIcons name="arrow-forward" size={16} color="#FFA000" />
                            </TouchableOpacity>
                        </View>
                    </InfoBox>
                </View>

                {/* Activity Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Community Activity</Text>
                    
                    <TouchableOpacity style={styles.activityCard}>
                        <LinearGradient
                            colors={['#7B1FA2', '#ffffff', '#7B1FA2']}
                            style={styles.activityGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}>
                            <NoiseOverlay opacity={0.5} />
                            <MaterialIcons name="forum" size={32} color="#7B1FA2" />
                            <View style={styles.activityContent}>
                                <Text style={styles.activityTitle}>Forum Contributions</Text>
                                <Text style={styles.activityStats}>{stats.commentsPosted} posts • {stats.helpfulVotes} helpful votes</Text>
                            </View>
                            <MaterialIcons name="chevron-right" size={24} color="#530404" />
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.activityCard}>
                        <LinearGradient
                            colors={['#0277BD', '#ffffff', '#0277BD']}
                            style={styles.activityGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}>
                            <NoiseOverlay opacity={0.5} />
                            <MaterialIcons name="leaderboard" size={32} color="#0277BD" />
                            <View style={styles.activityContent}>
                                <Text style={styles.activityTitle}>Leaderboard</Text>
                                <Text style={styles.activityStats}>Rank #{stats.leaderboardRank} • Top 10%</Text>
                            </View>
                            <MaterialIcons name="chevron-right" size={24} color="#530404" />
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                {/* Next Steps Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Continue Your Journey</Text>
                    
                    <TouchableOpacity style={styles.nextStepsCard}>
                        <View style={styles.nextStepsHeader}>
                            <MaterialIcons name="volunteer-activism" size={24} color="#BB2B29" />
                            <Text style={styles.nextStepsTitle}>Local First Aid Opportunities</Text>
                        </View>
                        <Text style={styles.nextStepsText}>Find Red Cross volunteering and certification courses near you</Text>
                        <View style={styles.nextStepsButton}>
                            <Text style={styles.nextStepsButtonText}>Find Events</Text>
                            <MaterialIcons name="location-on" size={16} color="#fff" />
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "transparent",
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingTop: 50,
        paddingBottom: 100,
    },
    profileHeader: {
        borderRadius: 20,
        marginHorizontal: 20,
        marginBottom: 20,
        padding: 20,
        alignItems: 'center',
        borderWidth: 4,
        borderColor: "#931111ff",
        elevation: 10,
    },
    profileImageContainer: {
        position: 'relative',
        marginBottom: 15,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 4,
        borderColor: '#fff',
    },
    profileImagePlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#530404',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 4,
        borderColor: '#fff',
    },
    editImageBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#FFC107',
        borderRadius: 15,
        width: 30,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
    userName: {
        fontSize: 24,
        color: '#4b4949ff',
        fontFamily: 'PoppinsBold',
        marginBottom: 5,
    },
    userEmail: {
        fontSize: 14,
        color: '#666',
        fontFamily: 'PoppinsRegular',
        marginBottom: 20,
    },
    quickStats: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderRadius: 15,
        padding: 15,
        borderWidth: 2,
        borderColor: '#530404',
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 20,
        color: '#BB2B29',
        fontFamily: 'PoppinsBold',
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
        fontFamily: 'PoppinsRegular',
    },
    statDivider: {
        width: 1,
        height: 40,
        backgroundColor: '#DDD',
    },
    section: {
        marginHorizontal: 20,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        color: '#4b4949ff',
        fontFamily: 'PoppinsMedium',
        marginBottom: 15,
    },
    badgesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -5,
    },
    badgeItem: {
        alignItems: 'center',
        margin: 5,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#f0f0f0',
        width: (width - 60) / 3,
        elevation: 3,
    },
    unearned: {
        opacity: 0.5,
    },
    badgeIcon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 5,
    },
    badgeName: {
        fontSize: 12,
        color: '#333',
        fontFamily: 'PoppinsMedium',
        textAlign: 'center',
    },
    unearnedText: {
        color: '#999',
    },
    infoBoxContainer: {
        marginBottom: 10,
        backgroundColor: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
        elevation: 5,
    },
    infoBoxHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderWidth: 2,
        borderRadius: 12,
    },
    infoBoxTitle: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    infoBoxTitleText: {
        fontSize: 16,
        color: '#333',
        fontFamily: 'PoppinsMedium',
    },
    infoBoxContent: {
        overflow: 'hidden',
    },
    infoBoxInner: {
        padding: 15,
        paddingTop: 0,
    },
    infoList: {
        paddingTop: 10,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    infoItemText: {
        fontSize: 14,
        color: '#333',
        fontFamily: 'PoppinsRegular',
        marginLeft: 8,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        backgroundColor: '#FFE5E5',
        borderRadius: 8,
        marginTop: 10,
    },
    addButtonText: {
        fontSize: 14,
        color: '#BB2B29',
        fontFamily: 'PoppinsMedium',
        marginLeft: 5,
    },
    contactsList: {
        paddingTop: 10,
    },
    contactItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    contactName: {
        fontSize: 14,
        color: '#333',
        fontFamily: 'PoppinsMedium',
    },
    contactRelation: {
        fontSize: 12,
        color: '#666',
        fontFamily: 'PoppinsRegular',
    },
    contactPhone: {
        fontSize: 13,
        color: '#2E7D32',
        fontFamily: 'PoppinsRegular',
    },
    medicalContent: {
        paddingTop: 10,
    },
    medicalSection: {
        marginBottom: 15,
    },
    medicalLabel: {
        fontSize: 14,
        color: '#666',
        fontFamily: 'PoppinsMedium',
        marginBottom: 5,
    },
    medicalValue: {
        fontSize: 16,
        color: '#333',
        fontFamily: 'PoppinsBold',
    },
    medicalItem: {
        fontSize: 14,
        color: '#333',
        fontFamily: 'PoppinsRegular',
        marginLeft: 10,
        marginBottom: 3,
    },
    viewAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        backgroundColor: '#FFF3E0',
        borderRadius: 8,
        marginTop: 10,
    },
    viewAllText: {
        fontSize: 14,
        color: '#FFA000',
        fontFamily: 'PoppinsMedium',
        marginRight: 5,
    },
    activityCard: {
        marginBottom: 10,
        borderRadius: 12,
        overflow: 'hidden',
        elevation: 5,
    },
    activityGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderWidth: 3,
        borderColor: '#530404',
        borderRadius: 12,
    },
    activityContent: {
        flex: 1,
        marginLeft: 15,
    },
    activityTitle: {
        fontSize: 16,
        color: '#333',
        fontFamily: 'PoppinsMedium',
    },
    activityStats: {
        fontSize: 13,
        color: '#666',
        fontFamily: 'PoppinsRegular',
    },
    nextStepsCard: {
        backgroundColor: '#fff',
        borderWidth: 3,
        borderColor: '#BB2B29',
        borderRadius: 12,
        padding: 15,
        elevation: 5,
    },
    nextStepsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    nextStepsTitle: {
        fontSize: 16,
        color: '#333',
        fontFamily: 'PoppinsMedium',
        marginLeft: 10,
    },
    nextStepsText: {
        fontSize: 14,
        color: '#666',
        fontFamily: 'PoppinsRegular',
        marginBottom: 15,
    },
    nextStepsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#BB2B29',
        borderRadius: 8,
        padding: 12,
    },
    nextStepsButtonText: {
        fontSize: 14,
        color: '#fff',
        fontFamily: 'PoppinsBold',
        marginRight: 5,
    },
});

export default ProfileScreen;