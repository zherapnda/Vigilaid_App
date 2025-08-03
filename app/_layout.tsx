import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    
   OutfitBlack: require('../assets/fonts/Outfit/static/Outfit-Black.ttf'),
   OutfitBold: require('../assets/fonts/Outfit/static/Outfit-Bold.ttf'),
   OutfitExtraBold: require('../assets/fonts/Outfit/static/Outfit-ExtraBold.ttf'),
   OutfitExtraLight: require('../assets/fonts/Outfit/static/Outfit-ExtraLight.ttf'),
   OutfitLight: require('../assets/fonts/Outfit/static/Outfit-Light.ttf'),
   OutfitMedium: require('../assets/fonts/Outfit/static/Outfit-Medium.ttf'),
   OutfitRegular: require('../assets/fonts/Outfit/static/Outfit-Regular.ttf'),
   OutfitSemiBold: require('../assets/fonts/Outfit/static/Outfit-SemiBold.ttf'),
   OutfitThin: require('../assets/fonts/Outfit/static/Outfit-Thin.ttf'),

   // Poppins
   PoppinsBlack: require('../assets/fonts/Poppins/Poppins-Black.ttf'),
   PoppinsBlackItalic: require('../assets/fonts/Poppins/Poppins-BlackItalic.ttf'),
   PoppinsBold: require('../assets/fonts/Poppins/Poppins-Bold.ttf'),
   PoppinsBoldItalic: require('../assets/fonts/Poppins/Poppins-BoldItalic.ttf'),
   PoppinsExtraBold: require('../assets/fonts/Poppins/Poppins-ExtraBold.ttf'),
   PoppinsExtraBoldItalic: require('../assets/fonts/Poppins/Poppins-ExtraBoldItalic.ttf'),
   PoppinsExtraLight: require('../assets/fonts/Poppins/Poppins-ExtraLight.ttf'),
   PoppinsExtraLightItalic: require('../assets/fonts/Poppins/Poppins-ExtraLightItalic.ttf'),
   PoppinsItalic: require('../assets/fonts/Poppins/Poppins-Italic.ttf'),
   PoppinsLight: require('../assets/fonts/Poppins/Poppins-Light.ttf'),
   PoppinsLightItalic: require('../assets/fonts/Poppins/Poppins-LightItalic.ttf'),
   PoppinsMedium: require('../assets/fonts/Poppins/Poppins-Medium.ttf'),
   PoppinsMediumItalic: require('../assets/fonts/Poppins/Poppins-MediumItalic.ttf'),
   PoppinsRegular: require('../assets/fonts/Poppins/Poppins-Regular.ttf'),
   PoppinsSemiBold: require('../assets/fonts/Poppins/Poppins-SemiBold.ttf'),
   PoppinsSemiBoldItalic: require('../assets/fonts/Poppins/Poppins-SemiBoldItalic.ttf'),
   PoppinsThin: require('../assets/fonts/Poppins/Poppins-Thin.ttf'),
   PoppinsThinItalic: require('../assets/fonts/Poppins/Poppins-ThinItalic.ttf'), 
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="lesson" options={{ headerShown: false }} />
        <Stack.Screen name="quiz" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
