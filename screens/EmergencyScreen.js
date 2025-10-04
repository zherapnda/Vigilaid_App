import { Audio } from 'expo-av';
import { Accelerometer } from 'expo-sensors';
import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Dimensions,
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
  const [isListening, setIsListening] = useState(false);
  const [detectedEmergency, setDetectedEmergency] = useState(null);
  const [recording, setRecording] = useState(null);
  const [processingStatus, setProcessingStatus] = useState('');
  const [audioLevel, setAudioLevel] = useState(0);
  
  const accelerometerSubscription = useRef(null);
  const lastShakeTime = useRef(0);
  const audioContext = useRef(null);
  const analyser = useRef(null);
  const microphone = useRef(null);

  // Your 6 emergency categories (in the same order you trained them)
  const emergencyCategories = [
    'Allergies',
    'Bleeding', 
    'Burns',
    'Choking',
    'Cardiac Emergencies',
    'Drowning'
  ];

  // First aid instructions
  const firstAidInstructions = {
    'Allergies': {
      title: 'ALLERGIC REACTION',
      steps: [
        'Stay calm and assess the severity of the reaction',
        'If the person has an EpiPen, help them use it immediately',
        'Remove or avoid the allergen if known',
        'If breathing difficulties: Call 911 immediately',
        'For mild reactions: Give antihistamine if available',
        'Monitor breathing and consciousness',
        'Place person in comfortable position',
        'If unconscious: Place in recovery position',
        'Stay with the person until help arrives'
      ],
      emergency: true
    },
    'Bleeding': {
      title: 'SEVERE BLEEDING',
      steps: [
        'Apply direct pressure to the wound with clean cloth',
        'Elevate the injured area above heart level if possible',
        'Do not remove embedded objects',
        'If blood soaks through, add more cloth on top',
        'Apply pressure to pressure points if bleeding continues',
        'Call 911 for severe bleeding immediately',
        'Watch for signs of shock (pale, cold, rapid pulse)',
        'Keep the person warm and lying down',
        'Do not give food or water'
      ],
      emergency: true
    },
    'Burns': {
      title: 'BURN INJURY',
      steps: [
        'Remove person from heat source safely',
        'Cool the burn with cool (not cold) water for 10-20 minutes',
        'Remove jewelry/clothing before swelling begins',
        'Do not use ice, butter, or ointments',
        'Cover with sterile, non-stick bandage',
        'For severe burns (larger than palm): Call 911',
        'Treat for shock if necessary',
        'Give small sips of water if conscious',
        'Monitor breathing and vital signs'
      ],
      emergency: false
    },
    'Choking': {
      title: 'CHOKING EMERGENCY',
      steps: [
        'Encourage coughing if person is conscious',
        'If unable to cough/speak: Perform back blows',
        'Give 5 sharp back blows between shoulder blades',
        'If unsuccessful: Perform abdominal thrusts (Heimlich)',
        'Place hands above navel, thrust inward and upward',
        'Alternate 5 back blows and 5 abdominal thrusts',
        'If unconscious: Begin CPR immediately',
        'Call 911 immediately',
        'Continue until object is expelled or help arrives'
      ],
      emergency: true
    },
    'Cardiac Emergencies': {
      title: 'CARDIAC EMERGENCY',
      steps: [
        'Call 911 immediately',
        'Check if person is responsive and breathing',
        'If no pulse/breathing: Begin CPR immediately',
        'Push hard and fast in center of chest (100-120/min)',
        'Allow complete chest recoil between compressions',
        'Give 30 compressions, then 2 rescue breaths',
        'Use AED if available and follow voice prompts',
        'Continue CPR until emergency services arrive',
        'Do not stop unless person starts breathing normally'
      ],
      emergency: true
    },
    'Drowning': {
      title: 'DROWNING EMERGENCY',
      steps: [
        'Ensure your safety before attempting rescue',
        'Get person out of water safely',
        'Call 911 immediately',
        'Check for consciousness and breathing',
        'If not breathing: Begin rescue breathing immediately',
        'Tilt head back, lift chin, give 2 rescue breaths',
        'If no pulse: Begin CPR (30 compressions, 2 breaths)',
        'Turn person on side if they vomit',
        'Keep person warm and monitor vital signs',
        'Continue CPR until emergency services arrive'
      ],
      emergency: true
    }
  };

  useEffect(() => {
    initializeApp();
    return () => {
      cleanup();
    };
  }, []);

  const initializeApp = async () => {
    try {
      console.log('🚀 Initializing emergency detector...');
      setProcessingStatus('Setting up audio system...');
      
      await setupAudio();
      setupShakeDetection();
      
      setProcessingStatus('');
      console.log('✅ Emergency detector initialized successfully');
    } catch (error) {
      console.error('❌ Initialization error:', error);
      setProcessingStatus('Initialization failed');
    }
  };

  const setupAudio = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Microphone permission is required');
        return;
      }
      
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      console.log('✅ Audio setup complete');
    } catch (error) {
      console.error('❌ Audio setup error:', error);
    }
  };

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
    if (!isListening) {
      console.log('🚨 SHAKE DETECTED! 🚨');
      Vibration.vibrate([500, 200, 500]);
      startListening();
    }
  };

  const startListening = async () => {
    try {
      setIsListening(true);
      setDetectedEmergency(null);
      setProcessingStatus('Starting recording...');
      console.log('🎤 Starting to listen...');
      
      const recordingOptions = {
        android: {
          extension: '.wav',
          outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_DEFAULT,
          audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_DEFAULT,
          sampleRate: 16000,
          numberOfChannels: 1,
          bitRate: 128000,
        },
        ios: {
          extension: '.wav',
          audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
          sampleRate: 16000,
          numberOfChannels: 1,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
      };

      const { recording: newRecording } = await Audio.Recording.createAsync(recordingOptions);
      setRecording(newRecording);
      setProcessingStatus('Recording... (3 seconds)');

      // Record for 3 seconds
      setTimeout(() => {
        stopListening();
      }, 3000);

    } catch (error) {
      console.error('❌ Recording error:', error);
      setIsListening(false);
      setProcessingStatus('Recording failed');
      Alert.alert('Recording Error', 'Could not start recording');
    }
  };

  const stopListening = async () => {
    try {
      if (recording) {
        console.log('⏹️ Stopping recording...');
        setProcessingStatus('Processing audio...');
        
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        console.log('📁 Recording saved to:', uri);
        
        await processAudio(uri);
        setRecording(null);
      }
      setIsListening(false);
    } catch (error) {
      console.error('❌ Stop recording error:', error);
      setIsListening(false);
      setProcessingStatus('Processing failed');
    }
  };

  const processAudio = async (audioUri) => {
    try {
      console.log('🧠 Processing audio for emergency detection...');
      setProcessingStatus('Analyzing emergency sounds...');
      
      // Simulate audio analysis with realistic emergency detection
      // In a real implementation, you would:
      // 1. Convert audio to spectrogram
      // 2. Feed it to your trained model
      // 3. Get predictions back
      
      // For now, we'll simulate the AI analysis
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate processing time
      
      // Simulate model prediction with realistic probabilities
      const simulatedProbabilities = Array(6).fill(0).map(() => Math.random());
      const total = simulatedProbabilities.reduce((a, b) => a + b, 0);
      const normalizedProbs = simulatedProbabilities.map(p => p / total);
      
      // Find highest probability
      const maxIndex = normalizedProbs.indexOf(Math.max(...normalizedProbs));
      const confidence = normalizedProbs[maxIndex];
      
      console.log('📊 AI Results:');
      console.log('- Predicted class:', emergencyCategories[maxIndex]);
      console.log('- Confidence:', (confidence * 100).toFixed(1) + '%');
      console.log('- All probabilities:', normalizedProbs.map(p => (p * 100).toFixed(1) + '%'));
      
      if (confidence > 0.3) { // Lower threshold for testing
        const detectedCategory = emergencyCategories[maxIndex];
        setDetectedEmergency(detectedCategory);
        setProcessingStatus('Detection complete!');
        Vibration.vibrate([200, 100, 200, 100, 200]);
        
        Alert.alert(
          '🤖 AI Detection Complete',
          `Detected: ${detectedCategory}\nConfidence: ${(confidence * 100).toFixed(1)}%`,
          [{ text: 'Show Instructions', onPress: () => {} }]
        );
      } else {
        setProcessingStatus('Low confidence detection');
        Alert.alert(
          '🤔 Low Confidence Detection',
          `Best guess: ${emergencyCategories[maxIndex]} (${(confidence * 100).toFixed(1)}%)\n\nPlease select manually:`,
          [
            { text: 'Manual Selection', onPress: showEmergencySelection },
            { text: 'Try Again', onPress: startListening }
          ]
        );
      }
      
    } catch (error) {
      console.error('❌ Audio processing error:', error);
      setProcessingStatus('Processing failed');
      Alert.alert('Processing Error', 'Failed to process audio. Using manual selection.');
      showEmergencySelection();
    }
  };

  const showEmergencySelection = () => {
    Alert.alert(
      '📋 Select Emergency Type',
      'Choose the emergency you need help with:',
      [
        ...emergencyCategories.map((emergency, index) => ({
          text: emergency,
          onPress: () => {
            setDetectedEmergency(emergency);
            setProcessingStatus('Manual selection');
            Vibration.vibrate([200, 100, 200]);
          }
        })),
        {
          text: 'Cancel',
          style: 'cancel'
        }
      ]
    );
  };

  const cleanup = () => {
    if (accelerometerSubscription.current) {
      accelerometerSubscription.current.remove();
    }
    if (recording) {
      recording.stopAndUnloadAsync();
    }
  };

  const renderInstructions = () => {
    if (!detectedEmergency) return null;

    const instructions = firstAidInstructions[detectedEmergency];
    
    return (
      <ScrollView style={styles.instructionsContainer}>
        <View style={[styles.header, instructions.emergency ? styles.emergencyHeader : styles.normalHeader]}>
          <Text style={styles.headerText}>{instructions.title}</Text>
          {instructions.emergency && (
            <Text style={styles.emergencyText}>📞 CALL 911 IMMEDIATELY</Text>
          )}
        </View>
        
        <View style={styles.stepsContainer}>
          {instructions.steps.map((step, index) => (
            <View key={index} style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{index + 1}</Text>
              </View>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>
        
        <TouchableOpacity 
          style={styles.resetButton}
          onPress={() => {
            setDetectedEmergency(null);
            setProcessingStatus('');
          }}
        >
          <Text style={styles.resetButtonText}>🔄 New Detection</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {!detectedEmergency ? (
        <View style={styles.centerContent}>
          <Text style={styles.title}>🚨 Emergency AI Detector</Text>
          <Text style={styles.subtitle}>Shake your phone to activate</Text>
          
          <View style={styles.statusContainer}>
            <Text style={styles.statusReady}>
              ✅ Shake Detection: ACTIVE
            </Text>
            <Text style={styles.statusReady}>
              ✅ Audio Recording: READY
            </Text>
            <Text style={styles.statusReady}>
              🤖 AI Model: SIMULATED (Ready for integration)
            </Text>
            {processingStatus && (
              <Text style={[styles.statusText, styles.statusPending]}>
                🔄 {processingStatus}
              </Text>
            )}
          </View>
          
          {isListening && (
            <View style={styles.listeningContainer}>
              <Text style={styles.listeningText}>🎤 LISTENING...</Text>
              <Text style={styles.listeningSubtext}>AI analyzing emergency sounds</Text>
              <View style={styles.progressBar}>
                <View style={styles.progressFill} />
              </View>
            </View>
          )}
          
          <TouchableOpacity 
            style={[styles.button, isListening && styles.buttonDisabled]}
            onPress={startListening}
            disabled={isListening}
          >
            <Text style={styles.buttonText}>
              {isListening ? '🎤 Listening...' : '🎤 Test Detection'}
            </Text>
          </TouchableOpacity>

          <Text style={styles.instructionText}>
            💡 Shake detection is ACTIVE!{'\n'}
            Try shaking your phone to activate emergency detection.{'\n\n'}
            📱 Best on real device • 🤖 AI-powered analysis
          </Text>
        </View>
      ) : (
        renderInstructions()
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  statusContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  statusReady: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#27ae60',
    marginBottom: 8,
    textAlign: 'center',
  },
  statusPending: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#f39c12',
    marginBottom: 8,
    textAlign: 'center',
  },
  statusError: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 12,
    color: '#e74c3c',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  listeningContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  listeningText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginBottom: 5,
  },
  listeningSubtext: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  progressBar: {
    width: 200,
    height: 6,
    backgroundColor: '#ddd',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#e74c3c',
    width: '100%',
    borderRadius: 3,
  },
  button: {
    backgroundColor: '#3498db',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonDisabled: {
    backgroundColor: '#bdc3c7',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  instructionText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 18,
  },
  instructionsContainer: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  emergencyHeader: {
    backgroundColor: '#e74c3c',
  },
  normalHeader: {
    backgroundColor: '#f39c12',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  emergencyText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
    marginTop: 5,
  },
  stepsContainer: {
    padding: 20,
  },
  stepItem: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'flex-start',
  },
  stepNumber: {
    backgroundColor: '#3498db',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    marginTop: 2,
  },
  stepNumberText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  stepText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  resetButton: {
    backgroundColor: '#95a5a6',
    margin: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  resetButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EmergencyScreen;