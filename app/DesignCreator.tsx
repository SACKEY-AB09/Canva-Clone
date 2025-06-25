import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDesigns } from '../contexts/DesignContext';

interface DesignData {
  id: string;
  label: string;
  image: string;
  createdAt: Date;
  isCompleted: boolean;
}

export default function DesignCreator() {
  const router = useRouter();
  const { addDesign } = useDesigns();
  const [designName, setDesignName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleSaveDesign = () => {
    if (!designName.trim()) {
      Alert.alert('Error', 'Please enter a design name');
      return;
    }

    setIsCreating(true);
    
    // Simulate design creation process
    setTimeout(() => {
      const newDesign = {
        label: designName.trim(),
        image: `https://placehold.co/120x90/FFB6E6/fff?text=${encodeURIComponent(designName.trim())}`,
        isCompleted: false,
      };

      // Add the design to recent designs using context
      addDesign(newDesign);
      
      // Navigate back to home
      router.back();
    }, 1000);
  };

  const handleCancel = () => {
    if (designName.trim()) {
      Alert.alert(
        'Discard Design?',
        'Are you sure you want to discard this design?',
        [
          { text: 'Keep Editing', style: 'cancel' },
          { 
            text: 'Discard', 
            style: 'destructive',
            onPress: () => router.back()
          },
        ]
      );
    } else {
      router.back();
    }
  };

  return (
    <SafeAreaView style={{flex:1}}>
        <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={handleCancel} style={styles.backButton}>
          <Ionicons name="close" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Design</Text>
        <TouchableOpacity 
          onPress={handleSaveDesign} 
          style={[styles.saveButton, isCreating && styles.saveButtonDisabled]}
          disabled={isCreating}
        >
          <Text style={styles.saveButtonText}>
            {isCreating ? 'Creating...' : 'Create'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Design Name</Text>
          <TextInput
            style={styles.input}
            value={designName}
            onChangeText={setDesignName}
            placeholder="Enter design name..."
            placeholderTextColor="#999"
            maxLength={50}
          />
        </View>

        <View style={styles.previewContainer}>
          <Text style={styles.label}>Preview</Text>
          <View style={styles.previewCard}>
            <View style={styles.previewImage}>
              <Text style={styles.previewText}>
                {designName || 'Your Design'}
              </Text>
            </View>
            <Text style={styles.previewLabel} numberOfLines={1}>
              {designName || 'Untitled Design'}
            </Text>
          </View>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Design Creator</Text>
          <Text style={styles.infoText}>
            Create a new design that will be saved to your recent designs. 
            You can edit and customize it later.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
    </SafeAreaView>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Montserrat_700Bold',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveButtonDisabled: {
    backgroundColor: '#999',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#F9F9F9',
  },
  previewContainer: {
    marginBottom: 24,
  },
  previewCard: {
    width: 120,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  previewImage: {
    width: '100%',
    height: 90,
    backgroundColor: '#FFB6E6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  previewLabel: {
    padding: 8,
    fontSize: 14,
    color: '#333',
  },
  infoContainer: {
    backgroundColor: '#F0F8FF',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
}); 