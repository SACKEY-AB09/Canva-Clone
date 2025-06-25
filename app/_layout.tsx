import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
// import { useFonts } from 'expo-font';
import { Montserrat_400Regular, Montserrat_700Bold, useFonts } from '@expo-google-fonts/montserrat';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { DesignProvider } from '../contexts/DesignContext';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsloaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
  });

  if (!fontsloaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <DesignProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="Splash" options={{headerShown: false}} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name= "SignUpfill" options={{headerShown: false}} />
          <Stack.Screen name="LogIn" options={{headerShown :false}} />
          <Stack.Screen name="Profile" options={{ headerShown: false }} />
          <Stack.Screen name="Menu" options={{ headerShown: false }} />
          {/* Add more screens as needed */}
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </DesignProvider>
  );
}
