import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface TopBarProps {
  onSave: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onShare: () => void;
}

export default function TopBar({ onSave, onUndo, onRedo, onShare }: TopBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <TouchableOpacity style={styles.button}>
          <Ionicons name="menu" size={26} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={onUndo}>
          <Ionicons name="arrow-undo" size={24} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={onRedo}>
          <Ionicons name="arrow-redo" size={24} color="#333" />
        </TouchableOpacity>
      </View>
      <View style={styles.right}>
        <TouchableOpacity style={styles.button}>
          <Ionicons name="sparkles-outline" size={24} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Ionicons name="play-outline" size={24} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={onShare}>
          <Ionicons name="arrow-up-outline" size={24} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={onSave}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>
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
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    padding: 8,
  },
  saveButton: {
    backgroundColor: '#6A3DE8',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginLeft: 12,
  },
  saveText: {
    color: '#fff',
    fontWeight: 'bold',
  },
}); 