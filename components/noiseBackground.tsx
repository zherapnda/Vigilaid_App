import React from 'react';
import { Image, StyleSheet, View, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

type Props = {
  opacity?: number;
};

export default function NoiseOverlay({ opacity = 0.1 }: Props) {
  // Estimate texture size (adjust to match your actual texture)
  const textureSize = 75;
  
  // Calculate how many tiles needed to cover screen
  const cols = Math.ceil(width / textureSize) + 1;
  const rows = Math.ceil(height / textureSize) + 1;
  
  return (
    <View style={[StyleSheet.absoluteFill, { opacity }]}>
      {Array.from({ length: rows }, (_, row) =>
        Array.from({ length: cols }, (_, col) => (
          <Image
            key={`texture-${row}-${col}`}
            source={require('../assets/background/grilled-noise.png')}
            style={[
              styles.textureImage,
              {
                left: col * textureSize,
                top: row * textureSize,
                width: textureSize,
                height: textureSize,
              }
            ]}
            resizeMode="cover"
          />
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  textureImage: {
    position: 'absolute',
  },
});