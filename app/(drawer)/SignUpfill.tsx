import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

export default function EmailAuth() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    // 1. Validation
    if (!name || !email || !password) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    if (!email.includes('@')) {
      Alert.alert('Error', 'Invalid email address');
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordRegex.test(password)) {
      Alert.alert(
        'Weak Password',
        'Password must be 8+ characters and include a capital letter, number, and special character'
      );
      return;
    }

    // 🔁 Simulated API delay and success
    Alert.alert('Signing up...', 'Please wait');
    setTimeout(() => {
      Alert.alert('Success', 'Account created!');
      router.replace('/(drawer)/(tabs)'); // Navigate to tabs (home screen) within drawer
    }, 1500);

    // 2. API Request
    // setLoading(true);
    // try {
    //   const response = await fetch('https://your-backend.com/api/signup', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ name, email, password }),
    //   });

    //   const data = await response.json();

    //   if (response.ok) {
    //     Alert.alert('Success', 'Account created!');
    //     router.replace('/(tabs)');
    //   } else {
    //     Alert.alert('Signup Failed', data.error || 'Something went wrong');
    //   }
    // } catch (err) {
    //   console.error(err);
    //   Alert.alert('Network Error', 'Could not reach the server');
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.wrapper}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.logo}>Craftiv</Text>
      <View style={styles.container}>
        <Text style={styles.title}>Sign Up</Text>

        {/* Inputs */}
        <TextInput
          placeholder="Name"
          value={name}
          onChangeText={setName}
          style={styles.input}
          placeholderTextColor="#999"
          accessibilityLabel="Name input"
          textContentType="name"
        />
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          placeholderTextColor="#999"
          keyboardType="email-address"
          accessibilityLabel="Email input"
          textContentType="emailAddress"
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          placeholderTextColor="#999"
          secureTextEntry
          accessibilityLabel="Password input"
          textContentType="password"
        />

        {/* Button */}
        <Pressable
          style={[styles.button, loading && { opacity: 0.6 }]}
          onPress={handleSignUp}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Sign Up</Text>
          )}
        </Pressable>

        <Text style={styles.footerText}>
          Already have an account?{' '}
          <Text style={styles.link} onPress={() => router.push('/LogIn2')}>
            Login
          </Text>
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexGrow: 1,
    backgroundColor: '#F4F4FF',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  container: {
    width: '90%',
    backgroundColor: '#F4F4FF',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  logo: {
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#FF2290',
    fontSize: 40,
    position: 'absolute',
    top: '10%',
    left: 0,
    margin: 10,
    fontFamily: 'Transcity',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    marginBottom: 15,
    fontSize: 16,
    color: '#000',
  },
  button: {
    width: '100%',
    backgroundColor: '#FF2290',
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  footerText: {
    marginTop: 20,
    fontSize: 13,
    color: '#444',
  },
  link: {
    color: '#ff007a',
    fontWeight: '500',
  },
});
