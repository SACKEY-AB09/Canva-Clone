import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDesignStore } from '../../stores/designStore';

const colors = [
  '#FFFFFF', '#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
  '#800000', '#8B4513', '#2F4F4F', '#008080', '#4682B4', '#6A5ACD', '#8A2BE2', '#C71585',
  '#D2691E', '#FF7F50', '#DC143C', '#00CED1', '#32CD32', '#FFD700', '#ADFF2F', '#F0E68C',
];

interface ColorPanelProps {
  onClose: () => void;
}

export default function ColorPanel({ onClose }: ColorPanelProps) {
  const { setPrimaryColor, updateElement, selectedElementId, setBackgroundColor } = useDesignStore();

  const handleSelectColor = (color: string) => {
    // This function will now only set the color for new elements or selected elements
    setPrimaryColor(color);
    if (selectedElementId) {
      updateElement(selectedElementId, {
        properties: { backgroundColor: color, color: color, borderColor: color },
      });
    }
  };

  const handleSetBackgroundColor = (color: string) => {
    setBackgroundColor(color);
  };

  return (
    <View style={styles.panel}>
      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
        <Ionicons name="close-circle" size={30} color="#666" />
      </TouchableOpacity>
      <Text style={styles.title}>Element Color</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.colorContainer}>
        {colors.map((color) => (
          <TouchableOpacity key={color} style={[styles.colorOption, { backgroundColor: color }]} onPress={() => handleSelectColor(color)} />
        ))}
      </ScrollView>
      <Text style={styles.title}>Canvas Background</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.colorContainer}>
        {colors.map((color) => (
          <TouchableOpacity key={`bg-${color}`} style={[styles.colorOption, { backgroundColor: color }]} onPress={() => handleSetBackgroundColor(color)} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
    height: 250,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  colorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 1,
  },
}); 