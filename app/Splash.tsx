import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';

const SplashScreen = () => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/'); // Navigate to app/index.tsx
    }, 2000); // 2 seconds
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/Logo.jpg')} style={styles.logo} />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Light purple background
    justifyContent: 'center',
    alignItems: 'center',
  }, 
  logo: {
    width:300,
    height:300,
    borderRadius:200,
  },
});
