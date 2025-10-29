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
import { getQuizQuestions } from '../src/index.js';

const { width, height } = Dimensions.get('window');

const QuizScreen = () => {
    const router = useRouter();
    const params = useLocalSearchParams();
    const lessonId = params.lessonId;
    const lessonTitle = params.lessonTitle || params.lessonId;
    const quizId = params.quizId;
    
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [score, setScore] = useState(0);
    const [showResults, setShowResults] = useState(false);
    const [answeredQuestions, setAnsweredQuestions] = useState([]);
    const [isCorrect, setIsCorrect] = useState(null);
    
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const slideAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        console.log('QuizScreen params:', { lessonId, lessonTitle, quizId });
        
        // Load quiz questions
        const quizData = getQuizQuestions(lessonId || quizId);
        console.log('Quiz data loaded:', quizData);
        
        if (quizData && quizData.length > 0) {
            setQuestions(quizData);
        }
    }, [lessonId, lessonTitle, quizId]);

    const handleAnswerSelect = (index) => {
        if (selectedAnswer !== null) return; // Already answered
        
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setSelectedAnswer(index);
        
        const question = questions[currentQuestion];
        const correct = index === question.correct;
        setIsCorrect(correct);
        
        if (correct) {
            setScore(score + 1);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } else {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
        
        // Store the answered question
        setAnsweredQuestions([...answeredQuestions, {
            questionIndex: currentQuestion,
            selectedAnswer: index,
            correct: correct,
            explanation: question.explanation
        }]);
    };

    const handleNext = () => {
        if (selectedAnswer === null) return;
        
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        
        // Animate out
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: -30,
                duration: 200,
                useNativeDriver: true,
            })
        ]).start(() => {
            // Reset animations
            fadeAnim.setValue(0);
            slideAnim.setValue(30);
            
            // Move to next question or show results
            if (currentQuestion < questions.length - 1) {
                setCurrentQuestion(currentQuestion + 1);
                setSelectedAnswer(null);
                setIsCorrect(null);
                
                // Animate in
                Animated.parallel([
                    Animated.timing(fadeAnim, {
                        toValue: 1,
                        duration: 300,
                        useNativeDriver: true,
                    }),
                    Animated.timing(slideAnim, {
                        toValue: 0,
                        duration: 300,
                        useNativeDriver: true,
                    })
                ]).start();
            } else {
                setShowResults(true);
            }
        });
    };

    const handleBackToLessons = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.back();
    };

    const handleRestartQuiz = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setCurrentQuestion(0);
        setSelectedAnswer(null);
        setScore(0);
        setShowResults(false);
        setIsCorrect(null);
        setAnsweredQuestions([]);
        
        // Reset animations
        fadeAnim.setValue(1);
        slideAnim.setValue(0);
    };

    const getAnswerColor = (index) => {
        if (selectedAnswer === null) return { bg: '#fff', text: '#530404', border: '#530404' };
        
        const question = questions[currentQuestion];
        if (index === question.correct) {
            return { bg: '#E8F5E9', text: '#2E7D32', border: '#2E7D32' }; // Correct - green
        } else if (index === selectedAnswer) {
            return { bg: '#FFE5E5', text: '#BB2B29', border: '#BB2B29' }; // Wrong - red
        }
        return { bg: '#fff', text: '#666', border: '#ccc' }; // Unselected
    };

    const getScoreColor = () => {
        const percentage = (score / questions.length) * 100;
        if (percentage >= 80) return '#4CAF50'; // Green
        if (percentage >= 60) return '#FFC107'; // Yellow
        return '#F44336'; // Red
    };

    if (!questions || questions.length === 0) {
    return (
        <View style={styles.container}>
            <LinearGradient 
                colors={['#fdd1d1ff', '#fcf4f4eb','#ffffff','#fdfbf9','#a60000ff']}
                style={StyleSheet.absoluteFill} 
                start={{ x:-1, y:1}}
                end={{x:1,y:1.4}}
            />
            <NoiseOverlay opacity={2.6} />
            <StatusBar barStyle="dark-content" />
            <View style={styles.centerContainer}>
                <MaterialIcons name="quiz" size={64} color="#530404" />
                <Text style={styles.emptyText}>No quiz questions found</Text>
                <TouchableOpacity style={styles.emptyBackButton} onPress={handleBackToLessons}>
                    <Text style={styles.emptyBackButtonText}>Back to Lessons</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
    }

    if (showResults) {
        const percentage = Math.round((score / questions.length) * 100);
        const scoreColor = getScoreColor();
        
        return (
            <View style={styles.container}>
                <LinearGradient 
                    colors={['#fdd1d1ff', '#fcf4f4eb','#ffffff','#fdfbf9','#a60000ff']}
                    style={StyleSheet.absoluteFill} 
                    start={{ x:-1, y:1}}
                    end={{x:1,y:1.4}}
                />
                <NoiseOverlay opacity={2.6} />
                <StatusBar barStyle="dark-content" />
                <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                    <View style={styles.resultsContainer}>
                        <MaterialIcons 
                            name={percentage >= 80 ? "celebration" : percentage >= 60 ? "thumb-up" : "sentiment-dissatisfied"} 
                            size={80} 
                            color={scoreColor} 
                        />
                        <Text style={styles.resultsTitle}>Quiz Complete!</Text>
                        <View style={[styles.scoreCircle, { borderColor: scoreColor }]}>
                            <Text style={[styles.scoreText, { color: scoreColor }]}>{percentage}%</Text>
                        </View>
                        <Text style={styles.scoreSubtext}>
                            You got {score} out of {questions.length} questions correct
                        </Text>
                        
                        <View style={styles.explanationsContainer}>
                            <Text style={styles.explanationsTitle}>Review Your Answers:</Text>
                            {answeredQuestions.map((answered, index) => {
                                const question = questions[answered.questionIndex];
                                return (
                                    <View key={index} style={styles.explanationCard}>
                                        <View style={styles.questionHeader}>
                                            <MaterialIcons 
                                                name={answered.correct ? "check-circle" : "cancel"} 
                                                size={20} 
                                                color={answered.correct ? "#4CAF50" : "#F44336"} 
                                            />
                                            <Text style={styles.questionNumber}>
                                                Q{answered.questionIndex + 1}/{questions.length}
                                            </Text>
                                        </View>
                                        <Text style={styles.questionText}>{question.question}</Text>
                                        <View style={styles.explanationBox}>
                                            <Text style={styles.explanationText}>💡 {answered.explanation}</Text>
                                        </View>
                                    </View>
                                );
                            })}
                        </View>
                        
                        <View style={styles.resultsButtons}>
                            <TouchableOpacity 
                                style={[styles.resultButton, styles.restartButton]} 
                                onPress={handleRestartQuiz}
                            >
                                <MaterialIcons name="refresh" size={24} color="#FFF" />
                                <Text style={styles.resultButtonText}>Restart Quiz</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[styles.resultButton, styles.backButton]} 
                                onPress={handleBackToLessons}
                            >
                                <MaterialIcons name="arrow-back" size={24} color="#FFF" />
                                <Text style={styles.resultButtonText}>Back to Lesson</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }

    const question = questions[currentQuestion];
    const progress = ((currentQuestion + 1) / questions.length) * 100;

    // Simple markdown parser for **bold** text
    const parseMarkdown = (text) => {
        if (!text) return [];
        
        const parts = [];
        const regex = /(\*\*.*?\*\*)/g;
        let lastIndex = 0;
        let match;
        
        while ((match = regex.exec(text)) !== null) {
            // Add text before bold
            if (match.index > lastIndex) {
                parts.push({ type: 'text', content: text.substring(lastIndex, match.index) });
            }
            // Add bold text
            parts.push({ 
                type: 'bold', 
                content: match[1].replace(/\*\*/g, '') 
            });
            lastIndex = match.index + match[0].length;
        }
        
        // Add remaining text
        if (lastIndex < text.length) {
            parts.push({ type: 'text', content: text.substring(lastIndex) });
        }
        
        return parts.length > 0 ? parts : [{ type: 'text', content: text }];
    };

    return (
        <View style={styles.container}>
            <LinearGradient 
                colors={['#fdd1d1ff', '#fcf4f4eb','#ffffff','#fdfbf9','#a60000ff']}
                style={StyleSheet.absoluteFill} 
                start={{ x:-1, y:1}}
                end={{x:1,y:1.4}}
            />
            <NoiseOverlay opacity={2.6} />
            <StatusBar barStyle="dark-content" />
            
            {/* Header */}
            <LinearGradient
                colors={['#BB2B29', '#ffffff', '#BB2B29']}
                style={styles.header}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <NoiseOverlay opacity={1.0} />
                <TouchableOpacity onPress={handleBackToLessons} style={styles.backIconButton}>
                    <MaterialIcons name="arrow-back" size={28} color="#530404" />
                </TouchableOpacity>
                <View style={styles.progressBarContainer}>
                    <View style={[styles.progressBar, { width: `${progress}%` }]} />
                </View>
                <Text style={styles.questionCounter}>
                    Question {currentQuestion + 1} / {questions.length}
                </Text>
            </LinearGradient>

            <Animated.View 
                style={[
                    styles.content,
                    {
                        opacity: fadeAnim,
                        transform: [{ translateY: slideAnim }]
                    }
                ]}
            >
                <ScrollView style={styles.questionScroll} showsVerticalScrollIndicator={false}>
                    {/* Question Card */}
                    <LinearGradient
                        colors={['#BB2B29', '#ffffff', '#BB2B29']}
                        style={styles.questionCard}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <NoiseOverlay opacity={1.0} />
                        <Text style={styles.questionTitle}>
                            {parseMarkdown(question.question).map((part, index) => (
                                part.type === 'bold' ? (
                                    <Text key={index} style={{ fontFamily: 'PoppinsBold' }}>
                                        {part.content}
                                    </Text>
                                ) : (
                                    <Text key={index}>{part.content}</Text>
                                )
                            ))}
                        </Text>
                    </LinearGradient>

                    {/* Answer Options */}
                    <View style={styles.answersContainer}>
                        {question.options.map((option, index) => {
                            const colors = getAnswerColor(index);
                            return (
                                <TouchableOpacity
                                    key={index}
                                    style={[styles.answerButton, { backgroundColor: colors.bg, borderColor: colors.border }]}
                                    onPress={() => handleAnswerSelect(index)}
                                    disabled={selectedAnswer !== null}
                                >
                                    <View style={styles.answerContent}>
                                        <View style={styles.answerIndex}>
                                            <Text style={[styles.answerIndexText, { color: colors.text }]}>
                                                {String.fromCharCode(65 + index)}
                                            </Text>
                                        </View>
                                        <Text style={[styles.answerText, { color: colors.text }]}>
                                            {parseMarkdown(option).map((part, idx) => (
                                                part.type === 'bold' ? (
                                                    <Text key={idx} style={{ fontFamily: 'PoppinsSemiBold' }}>
                                                        {part.content}
                                                    </Text>
                                                ) : (
                                                    <Text key={idx}>{part.content}</Text>
                                                )
                                            ))}
                                        </Text>
                                        {selectedAnswer === index && (
                                            <MaterialIcons 
                                                name={isCorrect ? "check-circle" : "cancel"} 
                                                size={24} 
                                                color={colors.text} 
                                            />
                                        )}
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    {/* Explanation (shown after answer) */}
                    {selectedAnswer !== null && (
                        <Animated.View style={[styles.explanationBox, { borderLeftColor: isCorrect ? '#2E7D32' : '#BB2B29' }]}>
                            <Text style={styles.explanationLabel}>
                                {isCorrect ? "✅ Correct! " : "❌ Incorrect. "}
                                Explanation:
                            </Text>
                            <Text style={styles.explanationText}>{question.explanation}</Text>
                        </Animated.View>
                    )}
                </ScrollView>

                {/* Next Button */}
                <View style={styles.footer}>
                    <TouchableOpacity
                        style={[
                            styles.nextButton,
                            selectedAnswer === null && styles.nextButtonDisabled
                        ]}
                        onPress={handleNext}
                        disabled={selectedAnswer === null}
                    >
                        <Text style={[
                            styles.nextButtonText,
                            selectedAnswer === null && styles.nextButtonTextDisabled
                        ]}>
                            {currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                        </Text>
                        <MaterialIcons 
                            name={currentQuestion === questions.length - 1 ? "check" : "arrow-forward"} 
                            size={24} 
                            color={selectedAnswer === null ? "#666" : "#FFF"} 
                        />
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        color: '#530404',
        fontSize: 18,
        marginTop: 20,
        fontFamily: 'PoppinsRegular',
    },
    header: {
        paddingTop: 50,
        paddingHorizontal: 20,
        paddingBottom: 20,
        borderBottomWidth: 4,
        borderBottomColor: '#931111ff',
    },
    backIconButton: {
        marginBottom: 15,
    },
    progressBarContainer: {
        height: 6,
        backgroundColor: '#E5B4B8',
        borderRadius: 3,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#530404',
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#2E7D32',
        borderRadius: 3,
    },
    questionCounter: {
        color: '#530404',
        fontSize: 14,
        fontFamily: 'PoppinsMedium',
    },
    content: {
        flex: 1,
    },
    questionScroll: {
        flex: 1,
    },
    questionCard: {
        margin: 20,
        padding: 25,
        borderRadius: 15,
        borderWidth: 4,
        borderColor: '#931111ff',
    },
    questionTitle: {
        fontSize: 20,
        color: '#530404',
        fontFamily: 'PoppinsSemiBold',
        lineHeight: 28,
    },
    answersContainer: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    answerButton: {
        padding: 18,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 3,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    answerContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    answerIndex: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#FFE5E5',
        borderWidth: 2,
        borderColor: '#530404',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    answerIndexText: {
        fontSize: 14,
        fontFamily: 'PoppinsSemiBold',
    },
    answerText: {
        flex: 1,
        fontSize: 16,
        fontFamily: 'PoppinsRegular',
    },
    explanationBox: {
        backgroundColor: '#fff',
        margin: 20,
        padding: 20,
        borderRadius: 12,
        borderLeftWidth: 4,
        borderWidth: 2,
        borderColor: '#530404',
    },
    explanationLabel: {
        fontSize: 16,
        color: '#530404',
        fontFamily: 'PoppinsSemiBold',
        marginBottom: 8,
    },
    explanationText: {
        fontSize: 15,
        color: '#333',
        fontFamily: 'PoppinsRegular',
        lineHeight: 22,
    },
    footer: {
        padding: 20,
        borderTopWidth: 4,
        borderTopColor: '#931111ff',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
    },
    nextButton: {
        backgroundColor: '#2E7D32',
        padding: 18,
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#1B5E20',
        elevation: 3,
    },
    nextButtonDisabled: {
        backgroundColor: '#ccc',
        borderColor: '#999',
    },
    nextButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontFamily: 'PoppinsSemiBold',
        marginRight: 8,
    },
    nextButtonTextDisabled: {
        color: '#999',
    },
    // Results screen
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
    },
    resultsContainer: {
        alignItems: 'center',
    },
    resultsTitle: {
        fontSize: 32,
        color: '#530404',
        fontFamily: 'PoppinsBold',
        marginTop: 20,
        marginBottom: 30,
    },
    scoreCircle: {
        width: 150,
        height: 150,
        borderRadius: 75,
        borderWidth: 6,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    scoreText: {
        fontSize: 50,
        fontFamily: 'PoppinsBold',
    },
    scoreSubtext: {
        fontSize: 18,
        color: '#530404',
        fontFamily: 'PoppinsRegular',
        marginBottom: 40,
    },
    explanationsContainer: {
        width: '100%',
        marginTop: 20,
    },
    explanationsTitle: {
        fontSize: 20,
        color: '#530404',
        fontFamily: 'PoppinsSemiBold',
        marginBottom: 20,
    },
    explanationCard: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 12,
        marginBottom: 15,
        borderLeftWidth: 4,
        borderWidth: 2,
        borderColor: '#530404',
    },
    questionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    questionNumber: {
        color: '#999',
        fontSize: 14,
        fontFamily: 'PoppinsMedium',
        marginLeft: 8,
    },
    questionText: {
        fontSize: 16,
        color: '#333',
        fontFamily: 'PoppinsRegular',
        marginBottom: 15,
    },
    resultsButtons: {
        width: '100%',
        marginTop: 30,
    },
    resultButton: {
        padding: 18,
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    restartButton: {
        backgroundColor: '#2E7D32',
        borderWidth: 3,
        borderColor: '#1B5E20',
    },
    backButton: {
        backgroundColor: '#BB2B29',
        borderWidth: 3,
        borderColor: '#931111ff',
    },
    backButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontFamily: 'PoppinsSemiBold',
    },
    emptyBackButton: {
        backgroundColor: '#BB2B29',
        padding: 15,
        paddingHorizontal: 30,
        borderRadius: 12,
        marginTop: 20,
        borderWidth: 3,
        borderColor: '#931111ff',
    },
    emptyBackButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontFamily: 'PoppinsSemiBold',
    },
    resultButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontFamily: 'PoppinsSemiBold',
        marginLeft: 8,
    },
});

export default QuizScreen;
