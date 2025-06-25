import { Ionicons } from '@expo/vector-icons';
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { ShapeType, ToolType, useDesignStore } from '../../stores/designStore';

const TOOLS = [
  { id: 'select', icon: 'cursor', label: 'Select' },
  { id: 'text', icon: 'text', label: 'Text' },
  { id: 'shape', icon: 'square-outline', label: 'Shape' },
  { id: 'image', icon: 'image-outline', label: 'Image' },
  { id: 'table', icon: 'grid-outline', label: 'Table' },
  { id: 'draw', icon: 'brush-outline', label: 'Draw' },
  { id: 'eraser', icon: 'trash-outline', label: 'Eraser' },
] as const;

const SHAPES = [
  { id: 'rectangle', icon: 'square-outline', label: 'Rectangle' },
  { id: 'circle', icon: 'ellipse-outline', label: 'Circle' },
  { id: 'triangle', icon: 'triangle-outline', label: 'Triangle' },
  { id: 'line', icon: 'remove-outline', label: 'Line' },
] as const;

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

const COLORS = [
  '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00',
  '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#008000', '#FFC0CB',
  '#A52A2A', '#808080', '#C0C0C0', '#FFD700', '#FF6347', '#32CD32',
];

export default function Toolbar() {
  const {
    activeTool,
    primaryColor,
    secondaryColor,
    fontSize,
    fontFamily,
    isBold,
    isItalic,
    isUnderlined,
    textAlign,
    shapeType,
    borderWidth,
    borderRadius,
    setActiveTool,
    setPrimaryColor,
    setSecondaryColor,
    setFontSize,
    setFontFamily,
    setTextStyle,
    setTextAlign,
    setShapeType,
    setBorderWidth,
    setBorderRadius,
  } = useDesignStore();

  const renderToolSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Tools</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {TOOLS.map((tool) => (
          <TouchableOpacity
            key={tool.id}
            style={[
              styles.toolButton,
              activeTool === tool.id && styles.activeToolButton,
            ]}
            onPress={() => setActiveTool(tool.id as ToolType)}
          >
            <Ionicons
              name={tool.icon as any}
              size={20}
              color={activeTool === tool.id ? '#007AFF' : '#333'}
            />
            <Text style={[
              styles.toolLabel,
              activeTool === tool.id && styles.activeToolLabel,
            ]}>
              {tool.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderColorSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Colors</Text>
      <View style={styles.colorContainer}>
        <View style={styles.colorPicker}>
          <Text style={styles.colorLabel}>Primary</Text>
          <TouchableOpacity
            style={[styles.colorButton, { backgroundColor: primaryColor }]}
            onPress={() => {/* Open color picker */}}
          />
        </View>
        <View style={styles.colorPicker}>
          <Text style={styles.colorLabel}>Background</Text>
          <TouchableOpacity
            style={[styles.colorButton, { backgroundColor: secondaryColor }]}
            onPress={() => {/* Open color picker */}}
          />
        </View>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {COLORS.map((color) => (
          <TouchableOpacity
            key={color}
            style={[styles.colorSwatch, { backgroundColor: color }]}
            onPress={() => setPrimaryColor(color)}
          />
        ))}
      </ScrollView>
    </View>
  );

  const renderTextSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Text</Text>
      <View style={styles.textControls}>
        <View style={styles.fontControl}>
          <Text style={styles.controlLabel}>Font</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {FONTS.map((font) => (
              <TouchableOpacity
                key={font}
                style={[
                  styles.fontButton,
                  fontFamily === font && styles.activeFontButton,
                ]}
                onPress={() => setFontFamily(font)}
              >
                <Text style={[
                  styles.fontButtonText,
                  { fontFamily: font },
                  fontFamily === font && styles.activeFontButtonText,
                ]}>
                  Aa
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        
        <View style={styles.fontControl}>
          <Text style={styles.controlLabel}>Size</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {FONT_SIZES.map((size) => (
              <TouchableOpacity
                key={size}
                style={[
                  styles.sizeButton,
                  fontSize === size && styles.activeSizeButton,
                ]}
                onPress={() => setFontSize(size)}
              >
                <Text style={[
                  styles.sizeButtonText,
                  fontSize === size && styles.activeSizeButtonText,
                ]}>
                  {size}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.textStyleControls}>
          <TouchableOpacity
            style={[styles.styleButton, isBold && styles.activeStyleButton]}
            onPress={() => setTextStyle('bold', !isBold)}
          >
            <Ionicons name="text" size={16} color={isBold ? '#007AFF' : '#333'} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.styleButton, isItalic && styles.activeStyleButton]}
            onPress={() => setTextStyle('italic', !isItalic)}
          >
            <Ionicons name="text" size={16} color={isItalic ? '#007AFF' : '#333'} style={{ fontStyle: 'italic' }} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.styleButton, isUnderlined && styles.activeStyleButton]}
            onPress={() => setTextStyle('underline', !isUnderlined)}
          >
            <Ionicons name="text" size={16} color={isUnderlined ? '#007AFF' : '#333'} style={{ textDecorationLine: 'underline' }} />
          </TouchableOpacity>
        </View>

        <View style={styles.alignControls}>
          <TouchableOpacity
            style={[styles.alignButton, textAlign === 'left' && styles.activeAlignButton]}
            onPress={() => setTextAlign('left')}
          >
            <Ionicons name="text" size={16} color={textAlign === 'left' ? '#007AFF' : '#333'} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.alignButton, textAlign === 'center' && styles.activeAlignButton]}
            onPress={() => setTextAlign('center')}
          >
            <Ionicons name="text" size={16} color={textAlign === 'center' ? '#007AFF' : '#333'} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.alignButton, textAlign === 'right' && styles.activeAlignButton]}
            onPress={() => setTextAlign('right')}
          >
            <Ionicons name="text" size={16} color={textAlign === 'right' ? '#007AFF' : '#333'} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderShapeSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Shapes</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {SHAPES.map((shape) => (
          <TouchableOpacity
            key={shape.id}
            style={[
              styles.shapeButton,
              shapeType === shape.id && styles.activeShapeButton,
            ]}
            onPress={() => setShapeType(shape.id as ShapeType)}
          >
            <Ionicons
              name={shape.icon as any}
              size={20}
              color={shapeType === shape.id ? '#007AFF' : '#333'}
            />
            <Text style={[
              styles.shapeLabel,
              shapeType === shape.id && styles.activeShapeLabel,
            ]}>
              {shape.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      <View style={styles.shapeControls}>
        <View style={styles.controlRow}>
          <Text style={styles.controlLabel}>Border Width</Text>
          <TextInput
            style={styles.numberInput}
            value={borderWidth.toString()}
            onChangeText={(text) => setBorderWidth(parseInt(text) || 0)}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.controlRow}>
          <Text style={styles.controlLabel}>Border Radius</Text>
          <TextInput
            style={styles.numberInput}
            value={borderRadius.toString()}
            onChangeText={(text) => setBorderRadius(parseInt(text) || 0)}
            keyboardType="numeric"
          />
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {renderToolSection()}
      {renderColorSection()}
      {renderTextSection()}
      {renderShapeSection()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  toolButton: {
    alignItems: 'center',
    padding: 12,
    marginRight: 8,
    borderRadius: 8,
    backgroundColor: '#fff',
    minWidth: 60,
  },
  activeToolButton: {
    backgroundColor: '#e3f2fd',
    borderColor: '#007AFF',
    borderWidth: 2,
  },
  toolLabel: {
    fontSize: 12,
    color: '#333',
    marginTop: 4,
  },
  activeToolLabel: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  colorContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  colorPicker: {
    alignItems: 'center',
    marginRight: 16,
  },
  colorLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  colorButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  colorSwatch: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  textControls: {
    gap: 16,
  },
  fontControl: {
    gap: 8,
  },
  controlLabel: {
    fontSize: 12,
    color: '#666',
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
  textStyleControls: {
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
  alignControls: {
    flexDirection: 'row',
    gap: 8,
  },
  alignButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  activeAlignButton: {
    backgroundColor: '#e3f2fd',
    borderColor: '#007AFF',
  },
  shapeButton: {
    alignItems: 'center',
    padding: 12,
    marginRight: 8,
    borderRadius: 8,
    backgroundColor: '#fff',
    minWidth: 60,
  },
  activeShapeButton: {
    backgroundColor: '#e3f2fd',
    borderColor: '#007AFF',
    borderWidth: 2,
  },
  shapeLabel: {
    fontSize: 12,
    color: '#333',
    marginTop: 4,
  },
  activeShapeLabel: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  shapeControls: {
    marginTop: 12,
    gap: 12,
  },
  controlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  numberInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 8,
    width: 60,
    textAlign: 'center',
    backgroundColor: '#fff',
  },
}); 