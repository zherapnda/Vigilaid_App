import NoiseOverlay from '@/components/noiseBackground';
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { getLessonContent } from '../src/index.js'; // Adjust the import path as needed

const { width, height } = Dimensions.get('window');

const LessonScreen = () => {
    const router = useRouter();
    const params = useLocalSearchParams();
    const lessonId = params.lessonId;
    const lessonInfo = params.lessonInfo ? JSON.parse(params.lessonInfo) : null;
    const [currentSection, setCurrentSection] = useState(0);
    const [lessonData, setLessonData] = useState(null);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;

    useEffect(() => {
        console.log('LessonScreen params:', { lessonId, lessonInfo });
        
        // Load lesson content
        if (lessonInfo && lessonInfo.title) {
            const content = getLessonContent(lessonInfo.title); // Using title as key
            console.log('Loading content by title:', lessonInfo.title, content);
            setLessonData(content);
        } else if (lessonId) {
            // Fallback: try to get content by lessonId
            const content = getLessonContent(lessonId);
            console.log('Loading content by lessonId:', lessonId, content);
            setLessonData(content);
        }

        // Animate in
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 600,
                useNativeDriver: true,
            })
        ]).start();
    }, [lessonInfo, lessonId]);

    const formatContent = (content) => {
        if (!content) return [];
        
        // Split content into lines and process markdown-like formatting
        const lines = content.split('\n').filter(line => line.trim() !== '');
        const formattedLines = [];

        lines.forEach((line, index) => {
            const trimmed = line.trim();
            
            if (trimmed.startsWith('# ')) {
                // Main headers
                formattedLines.push({
                    type: 'header1',
                    text: trimmed.substring(2),
                    key: `h1-${index}`
                });
            } else if (trimmed.startsWith('## ')) {
                // Sub headers
                formattedLines.push({
                    type: 'header2',
                    text: trimmed.substring(3),
                    key: `h2-${index}`
                });
            } else if (trimmed.startsWith('### ')) {
                // Sub-sub headers
                formattedLines.push({
                    type: 'header3',
                    text: trimmed.substring(4),
                    key: `h3-${index}`
                });
            } else if (trimmed.startsWith('> ')) {
                // Important notes/quotes
                formattedLines.push({
                    type: 'quote',
                    text: trimmed.substring(2),
                    key: `quote-${index}`
                });
            } else if (trimmed.startsWith('- ')) {
                // Bullet points
                formattedLines.push({
                    type: 'bullet',
                    text: trimmed.substring(2),
                    key: `bullet-${index}`
                });
            } else if (trimmed === '---') {
                // Divider
                formattedLines.push({
                    type: 'divider',
                    key: `divider-${index}`
                });
            } else if (trimmed.length > 0) {
                // Regular paragraphs
                formattedLines.push({
                    type: 'paragraph',
                    text: trimmed,
                    key: `p-${index}`
                });
            }
        });

        return formattedLines;
    };

    const renderFormattedText = (text) => {
        if (!text) return text;
        
        // Handle bold text **text**
        let formatted = text.replace(/\*\*(.*?)\*\*/g, (match, p1) => `<bold>${p1}</bold>`);
        // Handle italic text *text*
        formatted = formatted.replace(/\*(.*?)\*/g, (match, p1) => `<italic>${p1}</italic>`);
        
        // Split by formatting tags and render
        const parts = formatted.split(/(<bold>.*?<\/bold>|<italic>.*?<\/italic>)/);
        
        return parts.map((part, index) => {
            if (part.startsWith('<bold>')) {
                return (
                    <Text key={index} style={styles.boldText}>
                        {part.replace(/<\/?bold>/g, '')}
                    </Text>
                );
            } else if (part.startsWith('<italic>')) {
                return (
                    <Text key={index} style={styles.italicText}>
                        {part.replace(/<\/?italic>/g, '')}
                    </Text>
                );
            } else {
                return part;
            }
        });
    };

    const renderContentLine = (line) => {
        switch (line.type) {
            case 'header1':
                return (
                    <Text key={line.key} style={styles.header1}>
                        {renderFormattedText(line.text)}
                    </Text>
                );
            case 'header2':
                return (
                    <Text key={line.key} style={styles.header2}>
                        {renderFormattedText(line.text)}
                    </Text>
                );
            case 'header3':
                return (
                    <Text key={line.key} style={styles.header3}>
                        {renderFormattedText(line.text)}
                    </Text>
                );
            case 'quote':
                return (
                    <View key={line.key} style={styles.quoteContainer}>
                        <View style={styles.quoteLine} />
                        <Text style={styles.quoteText}>
                            {renderFormattedText(line.text)}
                        </Text>
                    </View>
                );
            case 'bullet':
                return (
                    <View key={line.key} style={styles.bulletContainer}>
                        <View style={styles.bulletDot} />
                        <Text style={styles.bulletText}>
                            {renderFormattedText(line.text)}
                        </Text>
                    </View>
                );
            case 'divider':
                return <View key={line.key} style={styles.divider} />;
            case 'paragraph':
                return (
                    <Text key={line.key} style={styles.paragraphText}>
                        {renderFormattedText(line.text)}
                    </Text>
                );
            default:
                return null;
        }
    };

    const nextSection = () => {
        if (lessonData && currentSection < lessonData.sections.length - 1) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setCurrentSection(currentSection + 1);
            
            // Animate content change
            Animated.sequence([
                Animated.timing(fadeAnim, {
                    toValue: 0.3,
                    duration: 150,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                })
            ]).start();
        }
    };

    const prevSection = () => {
        if (currentSection > 0) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setCurrentSection(currentSection - 1);
            
            // Animate content change
            Animated.sequence([
                Animated.timing(fadeAnim, {
                    toValue: 0.3,
                    duration: 150,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                })
            ]).start();
        }
    };

    const goToQuiz = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        router.push({
            pathname: '/quiz',
            params: { 
                lessonId: lessonId,
                lessonTitle: lessonInfo.title,
                quizId: lessonId // This should match your quiz file naming
            }
        });
    };

    if (!lessonData) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>
                    {lessonInfo ? 'Loading lesson...' : 'Lesson not found'}
                </Text>
                <Text style={styles.loadingText}>
                    lessonId: {lessonId}
                </Text>
                <Text style={styles.loadingText}>
                    lessonInfo: {JSON.stringify(lessonInfo)}
                </Text>
            </View>
        );
    }

    const currentSectionData = lessonData.sections[currentSection];
    const formattedContent = formatContent(currentSectionData.content);
    const isLastSection = currentSection === lessonData.sections.length - 1;

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            
            {/* Background */}
            <LinearGradient 
                colors={['#fdd1d1ff', '#fcf4f4eb','#ffffff','#fdfbf9','#a60000ff']}
                style={StyleSheet.absoluteFill} 
                start={{ x:-1, y:1}}
                end={{x:1,y:1.4}}
            />
            <NoiseOverlay opacity={1.9} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity 
                    onPress={() => router.back()}
                    style={styles.backButton}
                >
                    <MaterialIcons name="arrow-back" size={24} color="#530404" />
                </TouchableOpacity>
                
                <View style={styles.headerInfo}>
                    <Text style={styles.headerTitle}>{lessonData.title}</Text>
                    <Text style={styles.headerProgress}>
                        Section {currentSection + 1} of {lessonData.sections.length}
                    </Text>
                </View>
                
                <View style={[styles.lessonIcon, { backgroundColor: lessonData.color + '20' }]}>
                    <MaterialIcons name={lessonData.icon} size={24} color={lessonData.color} />
                </View>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                    <View 
                        style={[
                            styles.progressFill, 
                            { 
                                width: `${((currentSection + 1) / lessonData.sections.length) * 100}%`,
                                backgroundColor: lessonData.color 
                            }
                        ]} 
                    />
                </View>
            </View>

            {/* Content */}
            <ScrollView 
                style={styles.contentScrollView}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                <LinearGradient
                    colors={['#BB2B29', '#ffffff', '#BB2B29']}
                    style={styles.contentSection}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <NoiseOverlay opacity={0.5} />
                    
                    <View style={styles.sectionHeader}>
                        <View style={styles.sectionIconCircle}>
                            <MaterialIcons name="menu-book" size={20} color="#530404" />
                        </View>
                        <Text style={styles.sectionTitle}>{currentSectionData.title}</Text>
                    </View>

                    <Animated.View 
                        style={[
                            styles.contentBox,
                            {
                                opacity: fadeAnim,
                                transform: [{ translateY: slideAnim }]
                            }
                        ]}
                    >
                        <NoiseOverlay opacity={0.8} />
                        <ScrollView 
                            style={styles.textContent}
                            showsVerticalScrollIndicator={false}
                            nestedScrollEnabled={true}
                        >
                            {formattedContent.map(line => renderContentLine(line))}
                        </ScrollView>
                    </Animated.View>
                </LinearGradient>
            </ScrollView>

            {/* Navigation Footer */}
            <View style={styles.footer}>
                <TouchableOpacity 
                    style={[styles.navButton, currentSection === 0 && styles.disabledButton]}
                    onPress={prevSection}
                    disabled={currentSection === 0}
                >
                    <MaterialIcons name="chevron-left" size={20} color={currentSection === 0 ? "#ccc" : "#530404"} />
                    <Text style={[styles.navButtonText, currentSection === 0 && styles.disabledText]}>
                        Previous
                    </Text>
                </TouchableOpacity>

                {isLastSection ? (
                    <TouchableOpacity 
                        style={styles.quizButton}
                        onPress={goToQuiz}
                    >
                        <MaterialIcons name="quiz" size={20} color="#fff" />
                        <Text style={styles.quizButtonText}>Take Quiz</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity 
                        style={styles.navButton}
                        onPress={nextSection}
                    >
                        <Text style={styles.navButtonText}>Next</Text>
                        <MaterialIcons name="chevron-right" size={20} color="#530404" />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    loadingText: {
        fontSize: 16,
        color: '#666',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderBottomWidth: 1,
        borderBottomColor: '#E5B4B8',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#E5B4B8',
    },
    headerInfo: {
        flex: 1,
        marginLeft: 15,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4b4949ff',
    },
    headerProgress: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
    lessonIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
    progressContainer: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
    },
    progressBar: {
        height: 6,
        backgroundColor: '#E5B4B8',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 3,
    },
    contentScrollView: {
        flex: 1,
    },
    contentContainer: {
        padding: 10,
        paddingBottom: 10,
    },
    contentSection: {
        borderWidth: 4,
        borderColor: "#931111ff",
        borderRadius: 18,
        padding: 10,
        elevation: 10,
        height: 685
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    sectionIconCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#530404',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    sectionTitle: {
        fontSize: 20,
        color: "#4b4949ff",
        fontWeight: '600',
    },
    contentBox: {
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#530404',
        borderRadius: 12,
        maxHeight: height * 0.67,
        paddingHorizontal: 20,
        padding: -5
    },
    textContent: {
        paddingVertical: 20,
    },
    header1: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#2E7D32',
        marginBottom: 12,
        marginTop: 8,
    },
    header2: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#BB2B29',
        marginBottom: 10,
        marginTop: 12,
    },
    header3: {
        fontSize: 16,
        fontWeight: '600',
        color: '#530404',
        marginBottom: 8,
        marginTop: 10,
    },
    paragraphText: {
        fontSize: 14,
        color: '#333',
        lineHeight: 20,
        marginBottom: 8,
    },
    quoteContainer: {
        flexDirection: 'row',
        backgroundColor: '#E8F5E8',
        borderRadius: 8,
        padding: 12,
        marginVertical: 8,
        borderLeftWidth: 4,
        borderLeftColor: '#2E7D32',
    },
    quoteLine: {
        width: 3,
        backgroundColor: '#2E7D32',
        marginRight: 10,
        borderRadius: 2,
    },
    quoteText: {
        flex: 1,
        fontSize: 14,
        color: '#2E7D32',
        fontWeight: '500',
        lineHeight: 18,
    },
    bulletContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 6,
        paddingLeft: 10,
    },
    bulletDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#BB2B29',
        marginTop: 7,
        marginRight: 10,
    },
    bulletText: {
        flex: 1,
        fontSize: 14,
        color: '#333',
        lineHeight: 20,
    },
    divider: {
        height: 1,
        backgroundColor: '#E5B4B8',
        marginVertical: 15,
    },
    boldText: {
        fontWeight: 'bold',
        color: '#530404',
    },
    italicText: {
        fontStyle: 'italic',
        color: '#666',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderTopWidth: 1,
        borderTopColor: '#E5B4B8',
    },
    navButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#E5B4B8',
    },
    disabledButton: {
        backgroundColor: '#f5f5f5',
        borderColor: '#ddd',
    },
    navButtonText: {
        fontSize: 14,
        color: '#530404',
        fontWeight: '600',
        marginHorizontal: 4,
    },
    disabledText: {
        color: '#ccc',
    },
    quizButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2E7D32',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        elevation: 3,
    },
    quizButtonText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 8,
    },
});

export default LessonScreen;