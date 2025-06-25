import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDesignStore } from '../../stores/designStore';

interface TextPropertiesPanelProps {
  elementId: string;
  onClose: () => void;
}

export default function TextPropertiesPanel({ elementId, onClose }: TextPropertiesPanelProps) {
  const { updateElement, setFontSize, setTextStyle } = useDesignStore.getState();
  const element = useDesignStore(state => state.currentDesign.elements.find(e => e.id === elementId));

  if (!element) return null;

  const handleUpdate = (property: any) => {
    updateElement(elementId, { properties: property });
  };
  
  const increaseSize = () => handleUpdate({ fontSize: (element.properties.fontSize || 16) + 2 });
  const decreaseSize = () => handleUpdate({ fontSize: Math.max(8, (element.properties.fontSize || 16) - 2) });
  
  return (
    <View style={styles.panel}>
      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
        <Ionicons name="close-circle" size={24} color="#666" />
      </TouchableOpacity>
      <Text style={styles.title}>Text Style</Text>
      <View style={styles.row}>
        <TouchableOpacity style={styles.button} onPress={decreaseSize}>
          <Ionicons name="remove" size={20} color="#333" />
        </TouchableOpacity>
        <Text style={styles.valueText}>{element.properties.fontSize || 16}px</Text>
        <TouchableOpacity style={styles.button} onPress={increaseSize}>
          <Ionicons name="add" size={20} color="#333" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
    height: 150,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  button: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  valueText: {
    fontSize: 16,
    fontWeight: '500',
    minWidth: 60,
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
}); 