import { View } from 'react-native';
import EmergencyScreen from '../screens/EmergencyScreen';
import { Stack } from 'expo-router';

export const unstable_settings = {
  headerShown: false,
};

export default function Emergency() {
  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen options={{ headerShown: false }} />
      <EmergencyScreen />
    </View>
  );
}