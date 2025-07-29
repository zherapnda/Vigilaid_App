import React, { useState, useRef, useEffect } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    ScrollView, 
    TouchableOpacity, 
    Dimensions,
    Animated,
    StatusBar
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import NoiseOverlay from '@/components/noiseBackground';

const { width, height } = Dimensions.get('window');

const LearnScreen = ({ navigation }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const [firstAidLessons] = useState([
        {
            id: 'choking-relief',
            title: "Choking Relief",
            subtitle: "Save a life in seconds",
            icon: "air",
            duration: "15 min",
            modules: 3,
            progress: 100,
            completed: true,
            color: "#2E7D32",
            difficulty: "Essential",
            backgroundImage: null
        },
        {
            id: 'cardiac-emergencies',
            title: "Cardiac Emergencies",
            subtitle: "Heart attack & CPR basics",
            icon: "favorite",
            duration: "20 min",
            modules: 4,
            progress: 75,
            completed: false,
            color: "#BB2B29",
            difficulty: "Critical",
        },
        {
            id: 'bleeding-control',
            title: "Bleeding Control",
            subtitle: "Stop severe bleeding fast",
            icon: "water-drop",
            duration: "12 min",
            modules: 3,
            progress: 0,
            completed: false,
            color: "#B71C1C",
            difficulty: "Essential"
        },
        {
            id: 'burns-treatment',
            title: "Burns Treatment",
            subtitle: "Treat burns properly",
            icon: "local-fire-department",
            duration: "10 min",
            modules: 2,
            progress: 0,
            completed: false,
            color: "#FF6F00",
            difficulty: "Important"
        },
        {
            id: 'allergic-reactions',
            title: "Allergic Reactions",
            subtitle: "Handle severe allergies",
            icon: "warning",
            duration: "15 min",
            modules: 3,
            progress: 0,
            completed: false,
            color: "#7B1FA2",
            difficulty: "Critical"
        },
        {
            id: 'drowning-rescue',
            title: "Drowning Rescue",
            subtitle: "Water emergency response",
            icon: "pool",
            duration: "18 min",
            modules: 4,
            progress: 0,
            completed: false,
            color: "#0277BD",
            difficulty: "Advanced"
        },
        {
            id: 'self-defense',
            title: "Self-Defense Basics",
            subtitle: "Protect yourself & others",
            icon: "security",
            duration: "25 min",
            modules: 5,
            progress: 0,
            completed: false,
            color: "#424242",
            difficulty: "Bonus"
        }
    ]);

    const [naturalDisasterLessons] = useState([
        {
            id: 'earthquake-response',
            title: "Earthquake Response",
            subtitle: "Drop, cover, and hold on",
            icon: "vibration",
            duration: "20 min",
            modules: 4,
            progress: 0,
            completed: false,
            color: "#8B4513",
            difficulty: "Critical"
        },
        {
            id: 'tornado-safety',
            title: "Tornado Safety",
            subtitle: "Find shelter fast",
            icon: "tornado",
            duration: "15 min",
            modules: 3,
            progress: 0,
            completed: false,
            color: "#4B0082",
            difficulty: "Essential"
        },
        {
            id: 'tsunami-evacuation',
            title: "Tsunami Evacuation",
            subtitle: "Get to high ground",
            icon: "waves",
            duration: "18 min",
            modules: 3,
            progress: 0,
            completed: false,
            color: "#006994",
            difficulty: "Critical"
        },
        {
            id: 'wildfire-survival',
            title: "Wildfire Survival",
            subtitle: "Evacuate safely",
            icon: "whatshot",
            duration: "22 min",
            modules: 4,
            progress: 0,
            completed: false,
            color: "#D2691E",
            difficulty: "Advanced"
        }
    ]);

    const [stats] = useState({
        totalCompleted: 1,
        totalLessons: 11,
        currentStreak: 3,
        totalPoints: 1247
    });

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();
    }, []);

    const handleLessonPress = (lesson) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        navigation.navigate('Lesson', { lessonId: lesson.id, lessonInfo: lesson });
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            
            {/* Background */}
            <LinearGradient 
                colors={['#a60000ff', '#fcf4f4eb','#ffffff','#fdfbf9','#a60000ff']}
                style={StyleSheet.absoluteFill} 
                start={{ x:-1, y:1}}
                end={{x:1,y:1.4}}
            />
            <NoiseOverlay opacity={1.9} />

            {/* Scrollable Content */}
            <ScrollView 
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}>

                {/* Title Header */}
                <View style={styles.titleContainer}>
                    <Text style={styles.mainTitle}>Emergency Training</Text>
                    <Text style={styles.mainSubtitle}>Be prepared. Save lives.</Text>
                </View>

                {/* Progress Box with Yellow Accent */}
                <Animated.View style={[styles.progressBox, { opacity: fadeAnim }]}>
                    <LinearGradient
                        colors={['#FFC107', '#ffffff', '#FFC107']}
                        style={styles.progressBoxGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}>
                        <NoiseOverlay opacity={0.6} />
                       
                        <View style={styles.progressBoxContent}>
                            <View style={styles.statItem}>
                               <View style={[styles.statIconCircle, { borderColor: '#F57C00' }]}>
                                   <MaterialIcons name="school" size={28} color="#F57C00" />
                               </View>
                               <Text style={[styles.statNumber, { color: '#F57C00' }]}>{stats.totalCompleted}/{stats.totalLessons}</Text>
                               <Text style={styles.statLabel}>Lessons Completed</Text>
                            </View>

                            <View style={[styles.statDivider, { backgroundColor: 'rgba(245, 124, 0, 0.3)' }]} />

                            <View style={styles.statItem}>
                                <View style={[styles.statIconCircle, { borderColor: '#F57C00' }]}>
                                    <MaterialIcons name="stars" size={28} color="#FFB300" />
                                </View>
                                <Text style={[styles.statNumber, { color: '#F57C00' }]}>{stats.totalPoints}</Text>
                                <Text style={styles.statLabel}>Points</Text>
                            </View>
                        </View>
                    </LinearGradient>
                </Animated.View>

                {/* First Aid Emergencies Section */}
                <View style={styles.sectionContainer}>
                    <View style={styles.sectionHeader}>
                        <MaterialIcons name="medical-services" size={24} color="#BB2B29" />
                        <Text style={styles.sectionTitle}>First Aid Emergencies</Text>
                    </View>
                    
                    <LinearGradient
                        colors={['#BB2B29', '#ffffff', '#BB2B29']}
                        style={styles.lessonsContainer}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}>
                        <NoiseOverlay opacity={0.5} />
                        
                        <View style={styles.lessonsGrid}>
                            {firstAidLessons.map((lesson, index) => (
                                <Animated.View
                                    key={lesson.id}
                                    style={{
                                        opacity: fadeAnim,
                                        transform: [{
                                            translateY: fadeAnim.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [20, 0],
                                            })
                                        }]
                                    }}>
                                    <TouchableOpacity
                                        style={[
                                            styles.lessonCard,
                                            lesson.completed && styles.completedCard
                                        ]}
                                        onPress={() => handleLessonPress(lesson)}
                                        activeOpacity={0.8}>
                                        
                                        <View style={styles.cardContent}>
                                            <View style={[styles.iconContainer, { backgroundColor: lesson.color + '20' }]}>
                                                <MaterialIcons 
                                                    name={lesson.icon} 
                                                    size={32} 
                                                    color={lesson.color} 
                                                />
                                                {lesson.completed && (
                                                    <View style={styles.checkBadge}>
                                                        <MaterialIcons name="check" size={12} color="#fff" />
                                                    </View>
                                                )}
                                            </View>
                                            
                                            <Text style={styles.lessonTitle} numberOfLines={1}>
                                                {lesson.title}
                                            </Text>
                                            <Text style={styles.lessonSubtitle} numberOfLines={2}>
                                                {lesson.subtitle}
                                            </Text>
                                            
                                            <View style={styles.lessonMeta}>
                                                <View style={styles.lessonMetaRow}>
                                                    <MaterialIcons name="timer" size={14} color="#666" />
                                                    <Text style={styles.lessonMetaText}>{lesson.duration}</Text>
                                                </View>
                                                <View style={[styles.difficultyDot, { backgroundColor: lesson.color }]} />
                                            </View>
                                            
                                            <View style={styles.miniProgressBar}>
                                                <View 
                                                    style={[
                                                        styles.miniProgressFill,
                                                        { 
                                                            width: `${lesson.progress}%`,
                                                            backgroundColor: lesson.completed ? '#2E7D32' : lesson.color
                                                        }
                                                    ]} 
                                                />
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                </Animated.View>
                            ))}
                        </View>
                    </LinearGradient>
                </View>

                {/* Natural Disasters Section */}
                <View style={styles.sectionContainer}>
                    <View style={styles.sectionHeader}>
                        <MaterialIcons name="crisis-alert" size={24} color="#FFA000" />
                        <Text style={styles.sectionTitle}>Natural Disasters</Text>
                    </View>
                    
                    <LinearGradient
                        colors={['#FFA000', '#ffffff', '#FFA000']}
                        style={styles.lessonsContainer}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}>
                        <NoiseOverlay opacity={0.5} />
                        
                        <View style={styles.lessonsGrid}>
                            {naturalDisasterLessons.map((lesson, index) => (
                                <Animated.View
                                    key={lesson.id}
                                    style={{
                                        opacity: fadeAnim,
                                        transform: [{
                                            translateY: fadeAnim.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [20, 0],
                                            })
                                        }]
                                    }}>
                                    <TouchableOpacity
                                        style={[
                                            styles.lessonCard,
                                            lesson.completed && styles.completedCard
                                        ]}
                                        onPress={() => handleLessonPress(lesson)}
                                        activeOpacity={0.8}>
                                        
                                        <View style={styles.cardContent}>
                                            <View style={[styles.iconContainer, { backgroundColor: lesson.color + '20' }]}>
                                                <MaterialIcons 
                                                    name={lesson.icon} 
                                                    size={32} 
                                                    color={lesson.color} 
                                                />
                                                {lesson.completed && (
                                                    <View style={styles.checkBadge}>
                                                        <MaterialIcons name="check" size={12} color="#fff" />
                                                    </View>
                                                )}
                                            </View>
                                            
                                            <Text style={styles.lessonTitle} numberOfLines={1}>
                                                {lesson.title}
                                            </Text>
                                            <Text style={styles.lessonSubtitle} numberOfLines={2}>
                                                {lesson.subtitle}
                                            </Text>
                                            
                                            <View style={styles.lessonMeta}>
                                                <View style={styles.lessonMetaRow}>
                                                    <MaterialIcons name="timer" size={14} color="#666" />
                                                    <Text style={styles.lessonMetaText}>{lesson.duration}</Text>
                                                </View>
                                                <View style={[styles.difficultyDot, { backgroundColor: lesson.color }]} />
                                            </View>
                                            
                                            <View style={styles.miniProgressBar}>
                                                <View 
                                                    style={[
                                                        styles.miniProgressFill,
                                                        { 
                                                            width: `${lesson.progress}%`,
                                                            backgroundColor: lesson.completed ? '#2E7D32' : lesson.color
                                                        }
                                                    ]} 
                                                />
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                </Animated.View>
                            ))}
                        </View>
                    </LinearGradient>
                </View>

                {/* Special Section */}
                <View style={styles.specialSection}>
                    <Text style={styles.sectionTitle}>Essential Skills</Text>
                    <TouchableOpacity
                        style={styles.specialCard}
                        onPress={() => navigation.navigate('FirstAidKit')}
                        activeOpacity={0.8}>
                        
                        <LinearGradient
                            colors={['#FF6F00', '#ffffff', '#FF6F00']}
                            style={styles.specialGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}>
                            <NoiseOverlay opacity={0.5} />
                            
                            <MaterialIcons name="medical-services" size={36} color="#FF6F00" />
                            <View style={styles.specialTextContent}>
                                <Text style={styles.specialTitle}>First-Aid Kit Preparation</Text>
                                <Text style={styles.specialSubtitle}>Learn what you need & why</Text>
                            </View>
                            <MaterialIcons name="chevron-right" size={28} color="#530404" />
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

const CARD_WIDTH = (width - 68) / 2;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "transparent",
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 100,
    },
    titleContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    mainTitle: {
        fontSize: 32,
        color: "#4b4949ff",
        fontFamily: "PoppinsBold",
        marginBottom: 5,
    },
    mainSubtitle: {
        fontSize: 16,
        color: "#666",
        fontFamily: "PoppinsRegular",
    },
    progressBox: {
        marginBottom: 30,
        borderRadius: 20,
        overflow: 'hidden',
        elevation: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    progressBoxGradient: {
        borderWidth: 4,
        borderColor: "#F57C00",
        borderRadius: 20,
        paddingVertical: 25,
        paddingHorizontal: 10,
    },
    progressBoxContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statIconCircle: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: 'rgba(255,255,255,0.9)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
        borderWidth: 2,
        elevation: 3,
    },
    statNumber: {
        fontSize: 20,
        fontFamily: 'PoppinsBold',
        marginBottom: 2,
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
        fontFamily: 'PoppinsRegular',
    },
    statDivider: {
        width: 1,
        height: 60,
    },
    sectionContainer: {
        marginBottom: 30,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        marginLeft: 5,
    },
    sectionTitle: {
        fontSize: 22,
        color: "#4b4949ff",
        fontFamily: "PoppinsMedium",
        marginLeft: 10,
    },
    lessonsContainer: {
        borderWidth: 4,
        borderColor: "#931111ff",
        borderRadius: 20,
        padding: 15,
        elevation: 10,
    },
    lessonsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    lessonCard: {
        width: CARD_WIDTH,
        backgroundColor: "#fff",
        borderWidth: 3,
        borderColor: "#530404",
        borderRadius: 16,
        marginBottom: 16,
        elevation: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        overflow: 'hidden',
    },
    completedCard: {
        borderColor: "#2E7D32",
        backgroundColor: "#F8FFF8",
    },
    cardContent: {
        padding: 15,
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
        elevation: 3,
        position: 'relative',
    },
    checkBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#2E7D32',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
    lessonTitle: {
        fontSize: 16,
        color: "#333",
        fontFamily: "PoppinsBold",
        marginBottom: 3,
    },
    lessonSubtitle: {
        fontSize: 12,
        color: "#666",
        fontFamily: "PoppinsRegular",
        marginBottom: 10,
        minHeight: 32,
    },
    lessonMeta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    lessonMetaRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    lessonMetaText: {
        fontSize: 11,
        color: "#666",
        fontFamily: "PoppinsRegular",
        marginLeft: 3,
    },
    difficultyDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    miniProgressBar: {
        height: 4,
        backgroundColor: '#FFE5E5',
        borderRadius: 2,
        overflow: 'hidden',
    },
    miniProgressFill: {
        height: '100%',
        borderRadius: 2,
    },
    specialSection: {
        marginTop: 10,
    },
    specialCard: {
        borderRadius: 16,
        overflow: 'hidden',
        elevation: 12,
        marginBottom: 20,
    },
    specialGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderWidth: 4,
        borderColor: "#D84315",
        borderRadius: 16,
    },
    specialTextContent: {
        flex: 1,
        marginLeft: 15,
    },
    specialTitle: {
        fontSize: 18,
        color: '#4b4949ff',
        fontFamily: 'PoppinsBold',
    },
    specialSubtitle: {
        fontSize: 14,
        color: '#666',
        fontFamily: 'PoppinsRegular',
        marginTop: 2,
    },
});

export default LearnScreen;