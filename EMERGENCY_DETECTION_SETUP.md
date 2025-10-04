# Emergency Sound Detection Setup Guide

## Overview
This guide explains how to integrate your trained Google Teachable Machine model for emergency sound detection into the Vigilaid app.

## Current Status
✅ **Shake Detection**: Working - detects phone shake to trigger recording  
✅ **Audio Recording**: Working - records 3 seconds of audio  
✅ **UI**: Working - displays emergency instructions  
⚠️ **AI Model Integration**: Partially implemented - needs final integration  

## What's Already Working
1. **Shake Detection**: Uses accelerometer to detect phone shake
2. **Audio Recording**: Records 3 seconds of audio when shake detected
3. **Emergency Instructions**: Displays first aid steps for detected emergencies
4. **Fallback Mode**: Manual emergency selection if AI fails

## What Needs to be Integrated
1. **Audio Preprocessing**: Convert recorded audio to spectrogram format
2. **Model Inference**: Feed spectrogram to your trained model
3. **Real-time Detection**: Replace simulation with actual AI predictions

## Your Model Details
- **Input Shape**: `[1, 43, 232, 1]` (batch, time_steps, mel_bins, channels)
- **Output**: 7 classes (6 emergency types + background noise)
- **Format**: TensorFlow.js model (.json + .bin files)

## Integration Steps

### Step 1: Install TensorFlow.js Dependencies
```bash
npm install @tensorflow/tfjs @tensorflow/tfjs-react-native
```

### Step 2: Update EmergencyScreen.js
Replace the `processAudio` function with real model inference:

```javascript
const processAudio = async (audioUri) => {
  try {
    console.log('🧠 Processing audio with AI...');
    setProcessingStatus('Running AI analysis...');
    
    // 1. Load audio file
    const audioBuffer = await loadAudioFromUri(audioUri);
    
    // 2. Convert to spectrogram
    const spectrogram = await audioProcessor.audioToMelSpectrogram(audioBuffer);
    
    // 3. Run model inference
    const predictions = await modelRef.current.predict(spectrogram);
    const probabilities = await predictions.data();
    
    // 4. Find highest probability
    const maxIndex = probabilities.indexOf(Math.max(...probabilities));
    const confidence = probabilities[maxIndex];
    
    // 5. Handle results
    if (confidence > 0.5) {
      const detectedCategory = emergencyCategories[maxIndex];
      setDetectedEmergency(detectedCategory);
      // ... rest of success handling
    }
    
  } catch (error) {
    console.error('❌ AI processing error:', error);
    showEmergencySelection();
  }
};
```

### Step 3: Audio Preprocessing
The `audioProcessor.js` file contains the necessary functions to:
- Convert audio to mel spectrogram
- Reshape to model input format `[1, 43, 232, 1]`
- Normalize audio data

### Step 4: Model Loading
```javascript
const loadModel = async () => {
  try {
    const modelUrl = require('../assets/model/model.json');
    modelRef.current = await tf.loadLayersModel(modelUrl);
    console.log('✅ Model loaded successfully');
  } catch (error) {
    console.error('❌ Model loading failed:', error);
  }
};
```

## Testing Your Integration

### 1. Test Audio Recording
- Shake your phone
- Verify 3-second recording works
- Check console logs for audio processing

### 2. Test Model Loading
- Verify model.json and weights.bin load
- Check input/output shapes match expectations

### 3. Test Real-time Detection
- Record emergency sounds (coughing, choking, etc.)
- Verify model predictions are accurate
- Test confidence thresholds

## Troubleshooting

### Common Issues

1. **Model Loading Fails**
   - Check file paths in assets/model/
   - Verify model.json and weights.bin exist
   - Check TensorFlow.js version compatibility

2. **Audio Processing Errors**
   - Verify microphone permissions
   - Check audio format compatibility
   - Test with different audio lengths

3. **Shape Mismatch Errors**
   - Ensure input shape matches `[1, 43, 232, 1]`
   - Check spectrogram generation
   - Verify normalization

### Debug Commands
```javascript
// Add these to your code for debugging
console.log('Model input shape:', modelRef.current.inputs[0].shape);
console.log('Spectrogram shape:', spectrogram.shape);
console.log('Predictions:', probabilities);
```

## Performance Optimization

1. **Model Quantization**: Consider converting to TensorFlow Lite
2. **Audio Chunking**: Process audio in smaller segments
3. **Background Processing**: Use Web Workers for audio processing
4. **Caching**: Cache processed spectrograms

## Next Steps

1. **Complete Integration**: Replace simulation with real model
2. **Audio Quality**: Improve audio preprocessing accuracy
3. **Real-time Processing**: Enable continuous monitoring
4. **Model Updates**: Retrain with more emergency sounds
5. **User Feedback**: Collect accuracy feedback from users

## Support

If you encounter issues:
1. Check console logs for error messages
2. Verify all dependencies are installed
3. Test with simple audio files first
4. Ensure model format matches TensorFlow.js requirements

## Files to Modify
- `screens/EmergencyScreen.js` - Main emergency detection logic
- `src/audioProcessor.js` - Audio preprocessing utilities
- `assets/model/` - Your trained model files

The foundation is ready - just integrate your trained model and you'll have a working emergency sound detection system! 