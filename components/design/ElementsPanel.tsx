import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ShapeType, useDesignStore } from '../../stores/designStore';

interface ElementsPanelProps {
  onClose: () => void;
  onPickImage: () => void;
}

const elements: { name: string; icon: keyof typeof Ionicons.glyphMap; type: string | null }[] = [
  { name: 'Rectangle', icon: 'square-outline', type: 'rectangle' },
  { name: 'Circle', icon: 'ellipse-outline', type: 'circle' },
  { name: 'Line', icon: 'remove-outline', type: 'line' },
  { name: 'Image', icon: 'image-outline', type: null }, // type is null for image picker
];

export default function ElementsPanel({ onClose, onPickImage }: ElementsPanelProps) {
  const { setActiveTool, setShapeType } = useDesignStore();

  const handleSelect = (type: string | null) => {
    if (type) {
      setActiveTool('shape');
      setShapeType(type as ShapeType);
      onClose();
    } else {
      // It's the image button
      onPickImage();
      onClose();
    }
  };

  return (
    <View style={styles.panel}>
      <Text style={styles.title}>Elements</Text>
      <View style={styles.grid}>
        {elements.map(element => (
          <TouchableOpacity 
            key={element.name} 
            style={styles.elementButton}
            onPress={() => handleSelect(element.type)}
          >
            <Ionicons name={element.icon} size={32} color="#333" />
            <Text style={styles.elementLabel}>{element.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Ionicons name="close" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    position: 'absolute',
    bottom: 80,
    left: 16,
    right: 16,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  elementButton: {
    alignItems: 'center',
    padding: 16,
    width: '30%',
  },
  elementLabel: {
    marginTop: 8,
    fontSize: 12,
  },
  closeButton: {
    position: 'absolute',
    top: -12,
    right: -12,
    backgroundColor: '#333',
    borderRadius: 15,
    padding: 4,
  },
}); 