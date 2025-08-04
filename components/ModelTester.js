import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, ScrollView } from 'react-native';
import * as tf from '@tensorflow/tfjs';

const ModelTester = ({ model, emergencyCategories }) => {
  const [testResults, setTestResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const testModelWithDummyData = async () => {
    if (!model) {
      Alert.alert('Error', 'Model not loaded yet');
      return;
    }

    setIsLoading(true);
    
    try {
      // Get model details
      const inputShape = model.inputs[0].shape;
      const outputShape = model.outputs[0].shape;
      
      console.log('Model input shape:', inputShape);
      console.log('Model output shape:', outputShape);

      // Create dummy data with the correct shape
      const dummyShape = inputShape.slice(1); // Remove batch dimension
      console.log('Creating dummy data with shape:', [1, ...dummyShape]);
      
      const dummyData = tf.randomNormal([1, ...dummyShape]);
      
      // Run prediction
      console.log('Running prediction...');
      const prediction = await model.predict(dummyData);
      const probabilities = await prediction.data();
      
      console.log('Raw probabilities:', Array.from(probabilities));

      // Find highest probability
      const maxIndex = Array.from(probabilities).indexOf(Math.max(...probabilities));
      const confidence = probabilities[maxIndex];
      const predictedClass = emergencyCategories[maxIndex];

      const results = {
        inputShape: inputShape,
        outputShape: outputShape,
        probabilities: Array.from(probabilities),
        predictedClass,
        confidence: confidence.toFixed(4),
        maxIndex
      };

      setTestResults(results);

      // Clean up
      dummyData.dispose();
      prediction.dispose();

      Alert.alert(
        'Test Complete', 
        `Input Shape: ${inputShape}\nPredicted: ${predictedClass}\nConfidence: ${(confidence * 100).toFixed(1)}%`
      );

    } catch (error) {
      console.error('Model test error:', error);
      Alert.alert('Test Failed', `Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const checkModelLayers = () => {
    if (!model) {
      Alert.alert('Error', 'Model not loaded');
      return;
    }

    const layerInfo = model.layers.map((layer, index) => ({
      index,
      name: layer.name,
      type: layer.getClassName(),
      inputShape: layer.inputShape,
      outputShape: layer.outputShape
    }));

    console.log('Model layers:', layerInfo);
    
    Alert.alert(
      'Model Info',
      `Total Layers: ${model.layers.length}\nTotal Parameters: ${model.countParams()}\nCheck console for detailed layer info`
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Model Testing & Debugging</Text>
      
      <TouchableOpacity 
        style={[styles.button, isLoading && styles.buttonDisabled]} 
        onPress={testModelWithDummyData}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Testing...' : 'Test Model with Dummy Data'}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.button} onPress={checkModelLayers}>
        <Text style={styles.buttonText}>Check Model Structure</Text>
      </TouchableOpacity>

      {testResults && (
        <View style={styles.results}>
          <Text style={styles.resultTitle}>Last Test Results:</Text>
          
          <Text style={styles.resultText}>
            <Text style={styles.label}>Input Shape: </Text>
            {JSON.stringify(testResults.inputShape)}
          </Text>
          
          <Text style={styles.resultText}>
            <Text style={styles.label}>Output Shape: </Text>
            {JSON.stringify(testResults.outputShape)}
          </Text>
          
          <Text style={styles.resultText}>
            <Text style={styles.label}>Predicted Class: </Text>
            {testResults.predictedClass} (Index: {testResults.maxIndex})
          </Text>
          
          <Text style={styles.resultText}>
            <Text style={styles.label}>Confidence: </Text>
            {testResults.confidence}
          </Text>

          <Text style={styles.label}>All Probabilities:</Text>
          {testResults.probabilities.map((prob, index) => (
            <Text key={index} style={styles.probabilityText}>
              {emergencyCategories[index]}: {(prob * 100).toFixed(1)}%
            </Text>
          ))}
        </View>
      )}

      <View style={styles.instructions}>
        <Text style={styles.instructionTitle}>How to use this tester:</Text>
        <Text style={styles.instructionText}>
          1. Make sure your model files are in assets/model/
        </Text>
        <Text style={styles.instructionText}>
          2. Test with dummy data to see if the model loads correctly
        </Text>
        <Text style={styles.instructionText}>
          3. Check the console logs for detailed debugging info
        </Text>
        <Text style={styles.instructionText}>
          4. Note the input shape - you'll need this for audio processing
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  buttonDisabled: {
    backgroundColor: '#6c757d',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  results: {
    marginTop: 20,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  resultTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
    color: '#495057',
  },
  resultText: {
    marginBottom: 8,
    fontSize: 14,
  },
  label: {
    fontWeight: 'bold',
    color: '#495057',
  },
  probabilityText: {
    fontSize: 12,
    marginLeft: 10,
    color: '#6c757d',
  },
  instructions: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#e9ecef',
    borderRadius: 8,
  },
  instructionTitle: {
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#495057',
  },
  instructionText: {
    fontSize: 14,
    marginBottom: 5,
    color: '#6c757d',
  },
});

export default ModelTester;