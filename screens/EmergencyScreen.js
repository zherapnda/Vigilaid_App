import NoiseOverlay from '@/components/noiseBackground';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Accelerometer } from 'expo-sensors';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    Vibration,
    View
} from 'react-native';

const { width, height } = Dimensions.get('window');

const EmergencyScreen = () => {
  const [showInstructions, setShowInstructions] = useState(false);
  const [showListeningPopup, setShowListeningPopup] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const accelerometerSubscription = useRef(null);
  const lastShakeTime = useRef(0);
  const soundRef = useRef(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Choking first aid instructions
  const chokingInstructions = {
      title: 'CHOKING EMERGENCY',
      steps: [
      'Stay calm and assess: Can they cough? Can they speak?',
      'IF YOU ARE ALONE (self-administered): Find a sturdy chair or table edge',
      'SELF-HELP: Stand in front of the chair, bend forward, drive your abdomen UP against it with forceful thrusts',
      'SELF-HELP ALTERNATIVE: Make fist with one hand, place above navel, cover with other hand, thrust upward repeatedly',
      'IF HELPING SOMEONE: Stand behind them, wrap arms around waist',
      'Make a fist with one hand and place it just above their navel',
      'Grasp your fist with other hand and give quick upward thrusts',
      'Continue thrusts until object is expelled or person becomes unconscious',
      'Call 911 immediately (or have someone call)',
      'If unconscious, begin CPR and continue emergency procedures'
      ],
      emergency: true
  };

  useEffect(() => {
    setupShakeDetection();
    return () => {
      cleanup();
    };
  }, []);

  const setupShakeDetection = () => {
    accelerometerSubscription.current = Accelerometer.addListener(({ x, y, z }) => {
      const acceleration = Math.sqrt(x * x + y * y + z * z);
      const currentTime = Date.now();
      
      // Detect shake (adjust threshold as needed)
      if (acceleration > 2.5 && currentTime - lastShakeTime.current > 2000) {
        lastShakeTime.current = currentTime;
        handleShakeDetected();
      }
    });
    
    Accelerometer.setUpdateInterval(100);
    console.log('✅ Shake detection active');
  };

  const handleShakeDetected = () => {
      console.log('🚨 SHAKE DETECTED! 🚨');
      Vibration.vibrate([500, 200, 500]);
    showChokingInstructions();
  };

  const showChokingInstructions = () => {
    console.log('🚨 Starting emergency detection');
    setShowListeningPopup(true);
      setIsListening(true);
    startListeningAnimation();
    startVoiceInstructions();
  };

  const startListeningAnimation = () => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
  };

  const startVoiceInstructions = async () => {
    try {
      // Simulate AI listening for 3 seconds
      setTimeout(() => {
      setIsListening(false);
        setShowListeningPopup(false);
        setShowInstructions(true);
        speakInstructions();
      }, 3000);
    } catch (error) {
      console.error('Error starting voice instructions:', error);
    }
  };

  const speakInstructions = async () => {
    try {
      // For demo purposes, we'll simulate voice instructions
      // In a real app, you would use Text-to-Speech here
      console.log('🔊 Speaking choking instructions...');
      
      // Simulate speaking each step with delays
      for (let i = 0; i < chokingInstructions.steps.length; i++) {
        setCurrentStep(i);
        console.log(`🔊 Speaking step ${i + 1}: ${chokingInstructions.steps[i]}`);
        
        // Simulate speaking time (2-3 seconds per step)
        await new Promise(resolve => setTimeout(resolve, 2500));
      }
      
      console.log('🔊 Voice instructions completed');
    } catch (error) {
      console.error('Error speaking instructions:', error);
    }
  };

  const cleanup = () => {
    if (accelerometerSubscription.current) {
      accelerometerSubscription.current.remove();
    }
  };

  const renderInstructions = () => {
    return (
      <ScrollView style={styles.instructionsContainer}>
        <LinearGradient
          colors={['#BB2B29', '#ffffff', '#BB2B29']}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <NoiseOverlay opacity={1.0} />
          <View style={styles.headerContent}>
            <View style={styles.iconCircle}>
              <MaterialIcons name="warning" size={24} color="#530404" />
            </View>
            <Text style={styles.headerText}>{chokingInstructions.title}</Text>
            <Text style={styles.emergencyText}>📞 CALL 911 IMMEDIATELY</Text>
            <View style={styles.voiceIndicator}>
              <MaterialIcons name="volume-up" size={20} color="#530404" />
              <Text style={styles.voiceText}>Voice instructions playing...</Text>
            </View>
        </View>
        </LinearGradient>
        
        <View style={styles.stepsContainer}>
          {chokingInstructions.steps.map((step, index) => (
            <View key={index} style={[
              styles.stepItem,
              index === currentStep && styles.currentStepItem
            ]}>
              <View style={[
                styles.stepNumber,
                index === currentStep && styles.currentStepNumber
              ]}>
                <Text style={styles.stepNumberText}>{index + 1}</Text>
                {index === currentStep && (
                  <MaterialIcons name="volume-up" size={12} color="white" />
                )}
              </View>
              <Text style={[
                styles.stepText,
                index === currentStep && styles.currentStepText
              ]}>{step}</Text>
            </View>
          ))}
        </View>
        
        <TouchableOpacity 
          style={styles.resetButton}
          onPress={() => {
            setShowInstructions(false);
            setCurrentStep(0);
          }}
        >
          <Text style={styles.resetButtonText}>🔄 New Detection</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient 
        colors={['#fdd1d1ff', '#fcf4f4eb','#ffffff','#fdfbf9','#a60000ff']}
        style={StyleSheet.absoluteFill} 
        start={{ x:-1, y:1}}
        end={{x:1,y:1.4}}
      />
      <NoiseOverlay opacity={2.6} />
      
      {!showInstructions ? (
        <View style={styles.centerContent}>
          <LinearGradient
            colors={['#BB2B29', '#ffffff', '#BB2B29']}
            style={styles.emergencySection}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <NoiseOverlay opacity={1.0} />
            
            <View style={styles.headerContent}>
              <View style={styles.iconCircle}>
                <MaterialIcons name="warning" size={24} color="#530404" />
              </View>
          <Text style={styles.title}>🚨 Emergency AI Detector</Text>
            </View>
          
          <View style={styles.statusContainer}>
            <Text style={styles.statusReady}>
              ✅ Shake Detection: ACTIVE
            </Text>
            <Text style={styles.statusReady}>
                🤖 AI Model: READY FOR CHOKING DETECTION
              </Text>
            </View>
          
          <TouchableOpacity 
              style={styles.button}
              onPress={showChokingInstructions}
          >
            <Text style={styles.buttonText}>
                🚨 Test Emergency Detection
            </Text>
          </TouchableOpacity>

          <Text style={styles.instructionText}>
              💡 Shake your phone to activate emergency detection{'\n'}
            📱 Best on real device • 🤖 AI-powered analysis
          </Text>
          </LinearGradient>
        </View>
      ) : (
        renderInstructions()
      )}

      {/* Listening Popup Modal */}
      <Modal
        visible={showListeningPopup}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <LinearGradient
            colors={['#BB2B29', '#ffffff', '#BB2B29']}
            style={styles.modalContent}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <NoiseOverlay opacity={1.0} />
            
            <View style={styles.modalHeader}>
              <Animated.View style={[styles.listeningIcon, { transform: [{ scale: pulseAnim }] }]}>
                <MaterialIcons name="mic" size={40} color="#530404" />
              </Animated.View>
              <Text style={styles.modalTitle}>🎤 AI Listening...</Text>
              <Text style={styles.modalSubtitle}>Analyzing emergency sounds</Text>
            </View>
            
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View style={styles.progressFill} />
              </View>
              <Text style={styles.progressText}>Detecting emergency type...</Text>
            </View>
          </LinearGradient>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emergencySection: {
    backgroundColor: "rgba(255,236,238,0.95)",
    borderWidth: 4,
    borderColor: "#931111ff",
    borderRadius: 18,
    padding: 20,
    elevation: 10,
    alignItems: 'center',
    minWidth: width - 40,
  },
  headerContent: {
    alignItems: 'center',
    marginBottom: 20,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#530404',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#530404',
    textAlign: 'center',
    fontFamily: 'PoppinsBold',
  },
  statusContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  statusReady: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#27ae60',
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: 'PoppinsMedium',
  },
  button: {
    backgroundColor: '#530404',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    borderWidth: 2,
    borderColor: '#BB2B29',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'PoppinsBold',
  },
  instructionText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 18,
    fontFamily: 'PoppinsRegular',
  },
  instructionsContainer: {
    flex: 1,
  },
  header: {
    backgroundColor: "rgba(255,236,238,0.95)",
    borderWidth: 4,
    borderColor: "#931111ff",
    borderRadius: 18,
    padding: 20,
    margin: 20,
    elevation: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#530404',
    textAlign: 'center',
    fontFamily: 'PoppinsBold',
  },
  emergencyText: {
    fontSize: 16,
    color: '#e74c3c',
    fontWeight: 'bold',
    marginTop: 5,
    textAlign: 'center',
    fontFamily: 'PoppinsBold',
  },
  stepsContainer: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#530404',
    borderRadius: 12,
    padding: 20,
    margin: 20,
    elevation: 5,
  },
  stepItem: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'flex-start',
  },
  stepNumber: {
    backgroundColor: '#BB2B29',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    marginTop: 2,
    borderWidth: 2,
    borderColor: '#530404',
  },
  stepNumberText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
    fontFamily: 'PoppinsBold',
  },
  stepText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    fontFamily: 'PoppinsMedium',
  },
  resetButton: {
    backgroundColor: '#530404',
    margin: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#BB2B29',
  },
  resetButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'PoppinsBold',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: "rgba(255,236,238,0.95)",
    borderWidth: 4,
    borderColor: "#931111ff",
    borderRadius: 18,
    padding: 30,
    elevation: 10,
    alignItems: 'center',
    minWidth: width - 40,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  listeningIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    borderWidth: 3,
    borderColor: '#530404',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#530404',
    textAlign: 'center',
    fontFamily: 'PoppinsBold',
    marginBottom: 5,
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    fontFamily: 'PoppinsMedium',
  },
  progressContainer: {
    alignItems: 'center',
    width: '100%',
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#ddd',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#530404',
    width: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#530404',
    fontFamily: 'PoppinsMedium',
  },
  // Voice indicator styles
  voiceIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#530404',
  },
  voiceText: {
    fontSize: 12,
    color: '#530404',
    fontFamily: 'PoppinsMedium',
    marginLeft: 5,
  },
  // Current step highlighting
  currentStepItem: {
    backgroundColor: '#fff3cd',
    borderRadius: 8,
    padding: 5,
    borderWidth: 2,
    borderColor: '#530404',
  },
  currentStepNumber: {
    backgroundColor: '#530404',
    borderColor: '#BB2B29',
  },
  currentStepText: {
    color: '#530404',
    fontWeight: 'bold',
    fontFamily: 'PoppinsBold',
  },
});

export default EmergencyScreen;