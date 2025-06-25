import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface BottomBarProps {
  onElements: () => void;
  onText: () => void;
  onColor: () => void;
  onMore: () => void;
  onClose: () => void;
}

export default function BottomBar({ onElements, onText, onColor, onMore, onClose }: BottomBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.button} onPress={onElements}>
          <Ionicons name="apps-outline" size={24} color="#333" />
          <Text style={styles.label}>Elements</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={onText}>
          <Ionicons name="text" size={24} color="#333" />
          <Text style={styles.label}>Text</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={onColor}>
          <Ionicons name="color-palette-outline" size={24} color="#333" />
          <Text style={styles.label}>Color</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={onMore}>
          <Ionicons name="ellipsis-horizontal-circle-outline" size={24} color="#333" />
          <Text style={styles.label}>More</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Ionicons name="close" size={24} color="#333" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-around',
  },
  button: {
    alignItems: 'center',
    padding: 8,
  },
  label: {
    fontSize: 12,
    marginTop: 4,
    color: '#555',
  },
  closeButton: {
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
  },
}); 