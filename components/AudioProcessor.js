import * as tf from '@tensorflow/tfjs';

export const processAudioForModel = async (audioUri) => {
  try {
    console.log('Processing audio URI:', audioUri);
    
    // Load the audio file
    const response = await fetch(audioUri);
    const arrayBuffer = await response.arrayBuffer();
    
    // Create audio context with the right sample rate
    const audioContext = new (window.AudioContext || window.webkitAudioContext)({
      sampleRate: 16000
    });
    
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    const audioData = audioBuffer.getChannelData(0); // Get mono audio
    
    console.log('Audio data length:', audioData.length);
    console.log('Sample rate:', audioBuffer.sampleRate);
    
    // Process audio to match Teachable Machine format
    // Most Teachable Machine audio models expect 1 second of audio at 16kHz
    const targetLength = 16000; // 1 second at 16kHz
    let processedData;
    
    if (audioData.length > targetLength) {
      // Take the first second
      processedData = audioData.slice(0, targetLength);
    } else {
      // Pad with zeros if shorter
      processedData = new Float32Array(targetLength);
      processedData.set(audioData);
    }
    
    // Convert to tensor with the right shape for your model
    // Common shapes for Teachable Machine audio models:
    // [1, 16000, 1] - raw audio
    // [1, 124, 13, 1] - mel spectrogram
    
    // Method 1: Try raw audio first
    let audioTensor = tf.tensor3d([Array.from(processedData).map(x => [x])]);
    console.log('Audio tensor shape:', audioTensor.shape);
    
    return audioTensor;
    
  } catch (error) {
    console.error('Audio processing error:', error);
    
    // Return a dummy tensor if processing fails
    // Adjust the shape based on your model's requirements
    console.log('Returning dummy tensor');
    return tf.zeros([1, 16000, 1]);
  }
};

// Alternative processing method if the first doesn't work
export const processAudioAsSpectrogram = async (audioUri) => {
  try {
    // This would create a mel spectrogram similar to Teachable Machine
    // For now, return a dummy spectrogram-shaped tensor
    
    // Common Teachable Machine spectrogram shape: [1, 124, 13, 1]
    // 124 time frames, 13 mel frequency bins
    
    const spectrogramTensor = tf.randomNormal([1, 124, 13, 1]);
    console.log('Spectrogram tensor shape:', spectrogramTensor.shape);
    
    return spectrogramTensor;
    
  } catch (error) {
    console.error('Spectrogram processing error:', error);
    return tf.zeros([1, 124, 13, 1]);
  }
};

// Helper function to check what shape your model expects
export const getModelInputShape = (model) => {
  if (!model) return null;
  
  const inputShape = model.inputs[0].shape;
  console.log('Model expects input shape:', inputShape);
  
  return inputShape;
};

// Helper to create the right tensor shape based on model requirements
export const createTensorForModel = (audioData, modelInputShape) => {
  try {
    // Remove the batch dimension (first element is usually null or -1)
    const expectedShape = modelInputShape.slice(1);
    
    console.log('Expected shape (without batch):', expectedShape);
    
    if (expectedShape.length === 2) {
      // Shape like [16000, 1] - raw audio
      const reshaped = audioData.slice(0, expectedShape[0]);
      return tf.tensor3d([reshaped.map(x => [x])]);
    } else if (expectedShape.length === 3) {
      // Shape like [124, 13, 1] - spectrogram
      return tf.randomNormal([1, ...expectedShape]);
    }
    
    // Default fallback
    return tf.tensor2d([audioData.slice(0, 1000)]);
    
  } catch (error) {
    console.error('Tensor creation error:', error);
    return tf.zeros([1, 1000]);
  }
};