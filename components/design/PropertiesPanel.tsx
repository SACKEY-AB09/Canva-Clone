import { Ionicons } from '@expo/vector-icons';
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useDesignStore } from '../../stores/designStore';

const COLORS = [
  '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00',
  '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#008000', '#FFC0CB',
  '#A52A2A', '#808080', '#C0C0C0', '#FFD700', '#FF6347', '#32CD32',
];

const FONTS = [
  'Arial',
  'Helvetica',
  'Times New Roman',
  'Georgia',
  'Verdana',
  'Courier New',
  'Impact',
  'Comic Sans MS',
];

const FONT_SIZES = [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 64, 72];

export default function PropertiesPanel() {
  const {
    currentDesign,
    selectedElementId,
    updateElement,
    primaryColor,
    setPrimaryColor,
  } = useDesignStore();

  const selectedElement = currentDesign?.elements.find(
    (el) => el.id === selectedElementId
  );

  if (!selectedElement) {
    return (
      <View style={styles.container}>
        <Text style={styles.noSelection}>No element selected</Text>
        <Text style={styles.hint}>Select an element to edit its properties</Text>
      </View>
    );
  }

  const updateElementProperty = (property: string, value: any) => {
    updateElement(selectedElementId!, {
      properties: {
        ...selectedElement.properties,
        [property]: value,
      },
    });
  };

  const renderTextProperties = () => {
    if (selectedElement.type !== 'text') return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Text Properties</Text>
        
        <View style={styles.propertyRow}>
          <Text style={styles.propertyLabel}>Text Content</Text>
          <TextInput
            style={styles.textInput}
            value={selectedElement.properties.text || ''}
            onChangeText={(text) => updateElementProperty('text', text)}
            placeholder="Enter text..."
            multiline
          />
        </View>

        <View style={styles.propertyRow}>
          <Text style={styles.propertyLabel}>Font</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {FONTS.map((font) => (
              <TouchableOpacity
                key={font}
                style={[
                  styles.fontButton,
                  selectedElement.properties.fontFamily === font && styles.activeFontButton,
                ]}
                onPress={() => updateElementProperty('fontFamily', font)}
              >
                <Text style={[
                  styles.fontButtonText,
                  { fontFamily: font },
                  selectedElement.properties.fontFamily === font && styles.activeFontButtonText,
                ]}>
                  Aa
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.propertyRow}>
          <Text style={styles.propertyLabel}>Font Size</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {FONT_SIZES.map((size) => (
              <TouchableOpacity
                key={size}
                style={[
                  styles.sizeButton,
                  selectedElement.properties.fontSize === size && styles.activeSizeButton,
                ]}
                onPress={() => updateElementProperty('fontSize', size)}
              >
                <Text style={[
                  styles.sizeButtonText,
                  selectedElement.properties.fontSize === size && styles.activeSizeButtonText,
                ]}>
                  {size}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.propertyRow}>
          <Text style={styles.propertyLabel}>Text Color</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {COLORS.map((color) => (
              <TouchableOpacity
                key={color}
                style={[styles.colorSwatch, { backgroundColor: color }]}
                onPress={() => updateElementProperty('color', color)}
              />
            ))}
          </ScrollView>
        </View>

        <View style={styles.propertyRow}>
          <Text style={styles.propertyLabel}>Text Style</Text>
          <View style={styles.styleButtons}>
            <TouchableOpacity
              style={[
                styles.styleButton,
                selectedElement.properties.bold && styles.activeStyleButton,
              ]}
              onPress={() => updateElementProperty('bold', !selectedElement.properties.bold)}
            >
              <Ionicons name="text" size={16} color={selectedElement.properties.bold ? '#007AFF' : '#333'} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.styleButton,
                selectedElement.properties.italic && styles.activeStyleButton,
              ]}
              onPress={() => updateElementProperty('italic', !selectedElement.properties.italic)}
            >
              <Ionicons name="text" size={16} color={selectedElement.properties.italic ? '#007AFF' : '#333'} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.styleButton,
                selectedElement.properties.underline && styles.activeStyleButton,
              ]}
              onPress={() => updateElementProperty('underline', !selectedElement.properties.underline)}
            >
              <Ionicons name="text" size={16} color={selectedElement.properties.underline ? '#007AFF' : '#333'} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const renderShapeProperties = () => {
    if (selectedElement.type !== 'shape') return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Shape Properties</Text>
        
        <View style={styles.propertyRow}>
          <Text style={styles.propertyLabel}>Background Color</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {COLORS.map((color) => (
              <TouchableOpacity
                key={color}
                style={[styles.colorSwatch, { backgroundColor: color }]}
                onPress={() => updateElementProperty('backgroundColor', color)}
              />
            ))}
          </ScrollView>
        </View>

        <View style={styles.propertyRow}>
          <Text style={styles.propertyLabel}>Border Color</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {COLORS.map((color) => (
              <TouchableOpacity
                key={color}
                style={[styles.colorSwatch, { backgroundColor: color }]}
                onPress={() => updateElementProperty('borderColor', color)}
              />
            ))}
          </ScrollView>
        </View>

        <View style={styles.propertyRow}>
          <Text style={styles.propertyLabel}>Border Width</Text>
          <TextInput
            style={styles.numberInput}
            value={(selectedElement.properties.borderWidth || 0).toString()}
            onChangeText={(text) => updateElementProperty('borderWidth', parseInt(text) || 0)}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.propertyRow}>
          <Text style={styles.propertyLabel}>Border Radius</Text>
          <TextInput
            style={styles.numberInput}
            value={(selectedElement.properties.borderRadius || 0).toString()}
            onChangeText={(text) => updateElementProperty('borderRadius', parseInt(text) || 0)}
            keyboardType="numeric"
          />
        </View>
      </View>
    );
  };

  const renderCommonProperties = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Common Properties</Text>
      
      <View style={styles.propertyRow}>
        <Text style={styles.propertyLabel}>Width</Text>
        <TextInput
          style={styles.numberInput}
          value={selectedElement.width.toString()}
          onChangeText={(text) => updateElement(selectedElementId!, { width: parseInt(text) || 0 })}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.propertyRow}>
        <Text style={styles.propertyLabel}>Height</Text>
        <TextInput
          style={styles.numberInput}
          value={selectedElement.height.toString()}
          onChangeText={(text) => updateElement(selectedElementId!, { height: parseInt(text) || 0 })}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.propertyRow}>
        <Text style={styles.propertyLabel}>X Position</Text>
        <TextInput
          style={styles.numberInput}
          value={selectedElement.x.toString()}
          onChangeText={(text) => updateElement(selectedElementId!, { x: parseInt(text) || 0 })}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.propertyRow}>
        <Text style={styles.propertyLabel}>Y Position</Text>
        <TextInput
          style={styles.numberInput}
          value={selectedElement.y.toString()}
          onChangeText={(text) => updateElement(selectedElementId!, { y: parseInt(text) || 0 })}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.propertyRow}>
        <Text style={styles.propertyLabel}>Rotation</Text>
        <TextInput
          style={styles.numberInput}
          value={selectedElement.rotation.toString()}
          onChangeText={(text) => updateElement(selectedElementId!, { rotation: parseInt(text) || 0 })}
          keyboardType="numeric"
        />
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Properties</Text>
        <Text style={styles.elementType}>{selectedElement.type}</Text>
      </View>
      
      {renderCommonProperties()}
      {renderTextProperties()}
      {renderShapeProperties()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    flex: 1,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  elementType: {
    fontSize: 14,
    color: '#666',
    textTransform: 'capitalize',
  },
  noSelection: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 50,
  },
  hint: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  propertyRow: {
    marginBottom: 16,
  },
  propertyLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 8,
    backgroundColor: '#fff',
    minHeight: 40,
  },
  numberInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 8,
    backgroundColor: '#fff',
    width: 80,
    textAlign: 'center',
  },
  fontButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 6,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  activeFontButton: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  fontButtonText: {
    fontSize: 14,
    color: '#333',
  },
  activeFontButtonText: {
    color: '#fff',
  },
  sizeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 6,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  activeSizeButton: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  sizeButtonText: {
    fontSize: 12,
    color: '#333',
  },
  activeSizeButtonText: {
    color: '#fff',
  },
  colorSwatch: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  styleButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  styleButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  activeStyleButton: {
    backgroundColor: '#e3f2fd',
    borderColor: '#007AFF',
  },
}); 