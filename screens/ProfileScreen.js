import NoiseOverlay from '@/components/noiseBackground';
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

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
        ],
        // Additional medical information
        dob: "1985-06-15",
        height: "5'10\"",
        weight: "180 lbs",
        primaryDoctor: "Dr. Sarah Johnson",
        doctorPhone: "+1 (555) 123-4567",
        insuranceProvider: "BlueCross BlueShield",
        insuranceID: "BC123456789",
        medicalNotes: "Regular asthma follow-ups every 6 months. Diabetes management includes A1C checks quarterly.",
        lastPhysicalExam: "2024-01-15",
        preferredHospital: "City Memorial Hospital"
    });

    const [stats] = useState({
        lessonsCompleted: 5,
        totalPoints: 1247,
        leaderboardRank: 42,
        commentsPosted: 23,
        helpfulVotes: 156
    });

    const toggleSection = (section) => {
        console.log('Toggle section:', section, 'Current:', expandedSection);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        
        if (expandedSection === section) {
            // Collapse
            setExpandedSection(null);
            Animated.timing(animatedHeights[section], {
                toValue: 0,
                duration: 300,
                useNativeDriver: false
            }).start();
        } else {
            // Collapse any open section first
            if (expandedSection) {
                Animated.timing(animatedHeights[expandedSection], {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: false
                }).start();
            }
            
            // Expand new section
            const heightValue = section === 'medical' ? 280 : section === 'emergency' ? 100 : 80;
            setExpandedSection(section);
            Animated.timing(animatedHeights[section], {
                toValue: heightValue,
                duration: 300,
                useNativeDriver: false
            }).start();
        }
    };

    const InfoBox = ({ title, icon, color, section, children }) => {
        const isExpanded = expandedSection === section;
        
        return (
            <View style={styles.infoBoxContainer}>
                <TouchableOpacity
                    style={[styles.infoBoxHeader, { borderColor: color }]}
                    onPress={() => toggleSection(section)}
                    activeOpacity={0.8}>
                    <View style={styles.infoBoxTitle}>
                        <View style={[styles.iconCircle, { backgroundColor: color + '20' }]}>
                            <MaterialIcons name={icon} size={20} color={color} />
                        </View>
                        <Text style={styles.infoBoxTitleText}>{title}</Text>
                    </View>
                    <MaterialIcons 
                        name={isExpanded ? "expand-less" : "expand-more"} 
                        size={20} 
                        color={color}
                    />
                </TouchableOpacity>
                
                {isExpanded && (
                    <View style={styles.infoBoxContent}>
                        <View style={styles.infoBoxInner}>
                            {children}
                        </View>
                    </View>
                )}
            </View>
        );
    };

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
                    style={styles.mythSection}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}>

                    <NoiseOverlay opacity={1.0} />

                    <View style={styles.mythHeader}>
                        <View style={styles.mythIconCircle}>
                            <MaterialIcons name="person" size={24} color="#530404" />
                        </View>
                        <Text style={styles.mythTitle}>User Profile</Text>
                    </View>

                    <View 
                        style={styles.mythContent}
                    >
                        <NoiseOverlay opacity={1.0} />
                        
                        {/* Profile Image and Basic Info */}
                        <View style={styles.profileSection}>
                            <TouchableOpacity 
                                style={styles.profileImageContainer}
                                onPress={() => setShowImagePicker(true)}>
                                {userProfile.profileImage ? (
                                    <Image source={{ uri: userProfile.profileImage }} style={styles.profileImage} />
                                ) : (
                                    <View style={styles.profileImagePlaceholder}>
                                        <MaterialIcons name="person" size={40} color="#fff" />
                                    </View>
                                )}
                                <View style={styles.editImageBadge}>
                                    <MaterialIcons name="camera-alt" size={12} color="#fff" />
                                </View>
                            </TouchableOpacity>

                            <View style={styles.userInfo}>
                                <Text style={styles.userName}>{userProfile.name}</Text>
                                <Text style={styles.userEmail}>{userProfile.email}</Text>
                                <Text style={styles.userPhone}>{userProfile.phone}</Text>
                            </View>
                        </View>

                        {/* Quick Stats */}
                        <View style={styles.quickStats}>
                            <View style={styles.statItem}>
                                <Text style={styles.statNumber}>{stats.totalPoints}</Text>
                                <Text style={styles.statLabel}>Points</Text>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.statItem}>
                                <Text style={styles.statNumber}>{stats.lessonsCompleted}</Text>
                                <Text style={styles.statLabel}>Lessons</Text>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.statItem}>
                                <Text style={styles.statNumber}>#{stats.leaderboardRank}</Text>
                                <Text style={styles.statLabel}>Rank</Text>
                            </View>
                        </View>

                        {/* Badges Section */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Achievements</Text>
                            <View style={styles.badgesContainer}>
                                {userProfile.badges.slice(0, 3).map((badge) => (
                                    <View key={badge.id} style={[styles.badgeItem, !badge.earned && styles.unearned]}>
                                        <View style={[styles.badgeIcon, { backgroundColor: badge.color + '20' }]}>
                                            <MaterialIcons name={badge.icon} size={20} color={badge.color} />
                                        </View>
                                        <Text style={[styles.badgeName, !badge.earned && styles.unearnedText]}>
                                            {badge.name}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        </View>

                        {/* Medical Information Sections */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Medical Information</Text>

                            {/* Allergies */}
                            <InfoBox 
                                title="Allergies" 
                                icon="warning" 
                                color="#FF5722" 
                                section="allergies">
                                <View style={styles.infoList}>
                                    {userProfile.allergies.map((allergy, index) => (
                                        <View key={index} style={styles.infoItem}>
                                            <MaterialIcons name="fiber-manual-record" size={8} color="#FF5722" />
                                            <Text style={styles.infoItemText}>{allergy}</Text>
                                        </View>
                                    ))}
                                    <TouchableOpacity style={styles.addButton}>
                                        <MaterialIcons name="add" size={16} color="#FF5722" />
                                        <Text style={[styles.addButtonText, { color: "#FF5722" }]}>Add Allergy</Text>
                                    </TouchableOpacity>
                                </View>
                            </InfoBox>

                            {/* Emergency Contacts */}
                            <InfoBox 
                                title="Emergency Contacts" 
                                icon="contact-phone" 
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
                                        <MaterialIcons name="add" size={16} color="#2E7D32" />
                                        <Text style={[styles.addButtonText, { color: "#2E7D32" }]}>Add Contact</Text>
                                    </TouchableOpacity>
                                </View>
                            </InfoBox>

                            {/* Medical History */}
                            <InfoBox 
                                title="Medical History" 
                                icon="medical-services" 
                                color="#1976D2" 
                                section="medical">
                                <View style={styles.medicalContent}>
                                    <View style={styles.medicalRow}>
                                        <View style={styles.medicalColumn}>
                                            <Text style={styles.medicalLabel}>Blood Type</Text>
                                            <Text style={styles.medicalValue}>{userProfile.bloodType}</Text>
                                        </View>
                                        <View style={styles.medicalColumn}>
                                            <Text style={styles.medicalLabel}>DOB</Text>
                                            <Text style={styles.medicalValue}>{userProfile.dob}</Text>
                                        </View>
                                    </View>
                                    
                                    <View style={styles.medicalRow}>
                                        <View style={styles.medicalColumn}>
                                            <Text style={styles.medicalLabel}>Height</Text>
                                            <Text style={styles.medicalValue}>{userProfile.height}</Text>
                                        </View>
                                        <View style={styles.medicalColumn}>
                                            <Text style={styles.medicalLabel}>Weight</Text>
                                            <Text style={styles.medicalValue}>{userProfile.weight}</Text>
                                        </View>
                                    </View>
                                    
                                    <View style={styles.medicalSection}>
                                        <Text style={styles.medicalLabel}>Primary Doctor</Text>
                                        <Text style={styles.medicalValue}>{userProfile.primaryDoctor}</Text>
                                        <Text style={styles.medicalItem}>{userProfile.doctorPhone}</Text>
                                    </View>
                                    
                                    <View style={styles.medicalSection}>
                                        <Text style={styles.medicalLabel}>Insurance</Text>
                                        <Text style={styles.medicalValue}>{userProfile.insuranceProvider}</Text>
                                        <Text style={styles.medicalItem}>ID: {userProfile.insuranceID}</Text>
                                    </View>
                                    
                                    <View style={styles.medicalSection}>
                                        <Text style={styles.medicalLabel}>Conditions</Text>
                                        <Text style={styles.medicalItem}>{userProfile.medicalConditions.join(', ')}</Text>
                                    </View>
                                    
                                    <View style={styles.medicalSection}>
                                        <Text style={styles.medicalLabel}>Medications ({userProfile.medications.length})</Text>
                                        {userProfile.medications.slice(0, 2).map((med, idx) => (
                                            <Text key={idx} style={styles.medicalItem}>• {med}</Text>
                                        ))}
                                    </View>
                                    
                                    <View style={styles.medicalSection}>
                                        <Text style={styles.medicalLabel}>Last Physical</Text>
                                        <Text style={styles.medicalItem}>{userProfile.lastPhysicalExam}</Text>
                                    </View>
                                    
                                    <View style={styles.medicalSection}>
                                        <Text style={styles.medicalLabel}>Preferred Hospital</Text>
                                        <Text style={styles.medicalItem}>{userProfile.preferredHospital}</Text>
                                    </View>
                                </View>
                            </InfoBox>
                        </View>
                        
                    </View>

                    <View style={styles.section}>
                            <Text style={styles.sectionTitle}></Text>
                            
                            <TouchableOpacity style={styles.nextStepsCard}>
                                <View style={styles.nextStepsHeader}>
                                    <MaterialIcons name="volunteer-activism" size={20} color="#BB2B29" />
                                    <Text style={styles.nextStepsTitle}>Local First Aid Opportunities</Text>
                                </View>
                                <Text style={styles.nextStepsText}>Find Red Cross volunteering and certification courses near you</Text>
                                <View style={styles.nextStepsButton}>
                                    <Text style={styles.nextStepsButtonText}>Find Events</Text>
                                    <MaterialIcons name="location-on" size={14} color="#fff" />
                                </View>
                            </TouchableOpacity>
                        </View>

                </LinearGradient>
            </ScrollView>
        </View>
    );
};

export default ProfileScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "transparent",
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingTop: 10,
        paddingBottom: 100,
    },
    mythSection: {
        backgroundColor: "rgba(255,236,238,0.95)",
        borderWidth: 4,
        borderColor: "#931111ff",
        borderRadius: 18,
        padding: 12,
        marginHorizontal: 20,
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
        paddingHorizontal: 15,
        paddingVertical: 15,
    },
    profileSection: {
        alignItems: 'center',
        marginBottom: 20,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    profileImageContainer: {
        position: 'relative',
        marginBottom: 10,
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 3,
        borderColor: '#BB2B29',
    },
    profileImagePlaceholder: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#530404',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: '#BB2B29',
    },
    editImageBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#FFC107',
        borderRadius: 12,
        width: 24,
        height: 24,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
    userInfo: {
        alignItems: 'center',
    },
    userName: {
        fontSize: 18,
        color: '#4b4949ff',
        marginBottom: 3,
        fontFamily: "PoppinsBlack"
    },
    userEmail: {
        fontSize: 12,
        color: '#666',
        marginBottom: 2,
        fontFamily: "PoppinsBold"
    },
    userPhone: {
        fontSize: 12,
        color: '#666',
        fontFamily: "PoppinsRegular"
    },
    quickStats: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,245,245,0.8)',
        borderRadius: 10,
        padding: 12,
        marginBottom: 15,
        borderWidth: 1.5,
        borderColor: '#530404',
        fontFamily: "PoppinsRegular"
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 16,
        color: '#BB2B29',
        fontWeight: 'bold',
        fontFamily: "PoppinBold"
    },
    statLabel: {
        fontSize: 10,
        color: '#530404',
        fontFamily: "PoppinsMedium"
    },
    statDivider: {
        width: 1,
        height: 30,
        backgroundColor: '#DDD',
    },
    section: {
        marginBottom: 15,
        marginTop: 14,
        
    },
    sectionTitle: {
        fontSize: 16,
        color: '#530404',
        fontWeight: '600',
        marginBottom: 10,
        marginLeft: 3,
        fontFamily: "PoppinsBold"
    },
    badgesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    badgeItem: {
        alignItems: 'center',
        padding: 8,
        backgroundColor: '#fafafa',
        borderRadius: 8,
        borderWidth: 1.5,
        borderColor: '#530404',
        flex: 1,
        marginHorizontal: 2,
    },
    unearned: {
        opacity: 0.5,
    },
    badgeIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 4,
    },
    badgeName: {
        fontSize: 10,
        color: '#333',
        fontWeight: '500',
        textAlign: 'center',
        fontFamily: "PoppinsRegular"
    },
    unearnedText: {
        color: '#999',
    },
    infoBoxContainer: {
        marginBottom: 8,
        backgroundColor: '#fafafa',
        borderRadius: 8,
        overflow: 'hidden',
    },
    infoBoxHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        borderWidth: 1,
        borderRadius: 8,
        backgroundColor: '#fff',
    },
    infoBoxTitle: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconCircle: {
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
    },
    infoBoxTitleText: {
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
        fontFamily: "PoppinsMedium"
    },
    infoBoxContent: {
        overflow: 'hidden',
        backgroundColor: '#fff',
    },
    infoBoxInner: {
        padding: 10,
        paddingTop: 0,
    },
    infoList: {
        paddingTop: 8,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    infoItemText: {
        fontSize: 12,
        color: '#333',
        marginLeft: 6,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
        backgroundColor: '#f8f8f8',
        borderRadius: 6,
        marginTop: 8,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderStyle: 'dashed',
    },
    addButtonText: {
        fontSize: 12,
        fontWeight: '500',
        marginLeft: 4,
    },
    contactsList: {
        paddingTop: 8,
    },
    contactItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 6,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    contactName: {
        fontSize: 12,
        color: '#333',
        fontWeight: '500',
    },
    contactRelation: {
        fontSize: 10,
        color: '#666',
    },
    contactPhone: {
        fontSize: 11,
        color: '#2E7D32',
    },
    medicalContent: {
        paddingTop: 8,
    },
    medicalRow: {
        flexDirection: 'row',
        marginBottom: 10,
        justifyContent: 'space-between',
    },
    medicalColumn: {
        flex: 1,
        marginRight: 8,
    },
    medicalCompact: {
        marginBottom: 6,
    },
    medicalSection: {
        marginBottom: 10,
    },
    medicalLabel: {
        fontSize: 11,
        color: '#666',
        fontWeight: '600',
        marginBottom: 2,
        fontFamily: "PoppinsSemiBold"
    },
    medicalValue: {
        fontSize: 13,
        color: '#333',
        fontWeight: 'bold',
        fontFamily: "PoppinsBold"
    },
    medicalItem: {
        fontSize: 11,
        color: '#333',
        marginTop: 2,
        fontFamily: "PoppinsRegular"
    },
    nextStepsCard: {
        backgroundColor: '#fff',
        borderWidth: 3,
        borderColor: '#530404',
        borderRadius: 8,
        padding: 12,
        marginTop: -12,
    },
    nextStepsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    nextStepsTitle: {
        fontSize: 14,
        color: '#333',
        marginLeft: 8,
        fontFamily: "PoppinsMedium",
        marginTop: 4
    },
    nextStepsText: {
        fontSize: 12,
        color: '#666',
        marginBottom: 10,
        lineHeight: 16,
        fontFamily: "PoppinsRegular"
    },
    nextStepsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#530404',
        borderColor: "#ECA0A0",
        borderWidth: 3,
        borderRadius: 30,
        padding: 8,
    },
    nextStepsButtonText: {
        fontSize: 12,
        color: '#fff',
        marginRight: 4,
        fontFamily: "PoppinsBoldItalic"
    },
});