import * as tf from '@tensorflow/tfjs';

// Audio preprocessing utilities for emergency sound detection
export class AudioProcessor {
  constructor() {
    this.sampleRate = 16000;
    this.fftSize = 512;
    this.hopLength = 256;
    this.melBins = 232;
    this.timeSteps = 43;
  }

  // Convert audio buffer to mel spectrogram
  async audioToMelSpectrogram(audioBuffer) {
    try {
      console.log('🎵 Processing audio to mel spectrogram...');
      
      // Convert audio buffer to float32 array
      const audioData = this.audioBufferToFloat32(audioBuffer);
      
      // Apply windowing and compute STFT
      const stft = this.computeSTFT(audioData);
      
      // Convert to mel spectrogram
      const melSpectrogram = this.stftToMelSpectrogram(stft);
      
      // Normalize and reshape to model input format
      const normalizedSpectrogram = this.normalizeSpectrogram(melSpectrogram);
      
      console.log('✅ Audio processing complete');
      return normalizedSpectrogram;
      
    } catch (error) {
      console.error('❌ Audio processing error:', error);
      throw error;
    }
  }

  // Convert AudioBuffer to float32 array
  audioBufferToFloat32(audioBuffer) {
    const channelData = audioBuffer.getChannelData(0); // Mono channel
    const float32Array = new Float32Array(channelData.length);
    
    for (let i = 0; i < channelData.length; i++) {
      float32Array[i] = channelData[i];
    }
    
    return float32Array;
  }

  // Compute Short-Time Fourier Transform
  computeSTFT(audioData) {
    const stft = [];
    const window = this.hammingWindow(this.fftSize);
    
    for (let i = 0; i <= audioData.length - this.fftSize; i += this.hopLength) {
      const frame = audioData.slice(i, i + this.fftSize);
      
      // Apply window
      for (let j = 0; j < this.fftSize; j++) {
        frame[j] *= window[j];
      }
      
      // Compute FFT (simplified - in production use a proper FFT library)
      const fft = this.simpleFFT(frame);
      stft.push(fft);
    }
    
    return stft;
  }

  // Simple FFT implementation (for demo purposes)
  simpleFFT(frame) {
    // This is a simplified FFT - in production, use a proper FFT library
    const n = frame.length;
    const real = new Float32Array(n);
    const imag = new Float32Array(n);
    
    // Copy input to real part
    for (let i = 0; i < n; i++) {
      real[i] = frame[i];
      imag[i] = 0;
    }
    
    // Simple DFT computation
    for (let k = 0; k < n; k++) {
      let realSum = 0;
      let imagSum = 0;
      
      for (let j = 0; j < n; j++) {
        const angle = (-2 * Math.PI * k * j) / n;
        realSum += real[j] * Math.cos(angle) - imag[j] * Math.sin(angle);
        imagSum += real[j] * Math.sin(angle) + imag[j] * Math.cos(angle);
      }
      
      real[k] = realSum;
      imag[k] = imagSum;
    }
    
    // Compute magnitude spectrum
    const magnitude = new Float32Array(n / 2);
    for (let i = 0; i < n / 2; i++) {
      magnitude[i] = Math.sqrt(real[i] * real[i] + imag[i] * imag[i]);
    }
    
    return magnitude;
  }

  // Convert STFT to mel spectrogram
  stftToMelSpectrogram(stft) {
    const melSpectrogram = [];
    
    for (let i = 0; i < stft.length; i++) {
      const melBins = this.applyMelFilterbank(stft[i]);
      melSpectrogram.push(melBins);
    }
    
    return melSpectrogram;
  }

  // Apply mel filterbank
  applyMelFilterbank(spectrum) {
    // Simplified mel filterbank - in production use proper mel filterbank
    const melBins = new Float32Array(this.melBins);
    
    for (let i = 0; i < this.melBins; i++) {
      let sum = 0;
      for (let j = 0; j < spectrum.length; j++) {
        // Simplified mel filter weights
        const weight = Math.exp(-Math.pow((j - i * spectrum.length / this.melBins), 2) / 100);
        sum += spectrum[j] * weight;
      }
      melBins[i] = sum;
    }
    
    return melBins;
  }

  // Normalize spectrogram and reshape for model input
  normalizeSpectrogram(melSpectrogram) {
    // Pad or truncate to expected time steps
    let processedSpectrogram = melSpectrogram;
    
    if (melSpectrogram.length > this.timeSteps) {
      processedSpectrogram = melSpectrogram.slice(0, this.timeSteps);
    } else if (melSpectrogram.length < this.timeSteps) {
      // Pad with zeros
      const padding = new Array(this.timeSteps - melSpectrogram.length).fill(
        new Float32Array(this.melBins).fill(0)
      );
      processedSpectrogram = [...melSpectrogram, ...padding];
    }
    
    // Convert to tensor and reshape to [1, 43, 232, 1]
    const tensor = tf.tensor4d(processedSpectrogram, [1, this.timeSteps, this.melBins, 1]);
    
    // Normalize to [0, 1] range
    const normalized = tf.div(tf.sub(tensor, tf.min(tensor)), 
                             tf.sub(tf.max(tensor), tf.min(tensor)));
    
    return normalized;
  }

  // Hamming window function
  hammingWindow(size) {
    const window = new Float32Array(size);
    for (let i = 0; i < size; i++) {
      window[i] = 0.54 - 0.46 * Math.cos((2 * Math.PI * i) / (size - 1));
    }
    return window;
  }

  // Alternative: Use Web Audio API for better audio processing
  async processAudioWithWebAudio(audioBuffer) {
    try {
      console.log('🎵 Using Web Audio API for processing...');
      
      // Create offline audio context for processing
      const offlineContext = new OfflineAudioContext(
        1, // mono
        audioBuffer.length,
        this.sampleRate
      );
      
      // Create audio source
      const source = offlineContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(offlineContext.destination);
      source.start();
      
      // Render audio
      const renderedBuffer = await offlineContext.startRendering();
      
      // Convert to the format your model expects
      const processedData = this.audioBufferToFloat32(renderedBuffer);
      
      // For now, return a placeholder tensor with correct shape
      // In production, implement proper mel spectrogram conversion
      const placeholderSpectrogram = tf.randomNormal([1, this.timeSteps, this.melBins, 1]);
      
      return placeholderSpectrogram;
      
    } catch (error) {
      console.error('❌ Web Audio processing error:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export const audioProcessor = new AudioProcessor(); 