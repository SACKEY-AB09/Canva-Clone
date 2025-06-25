import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useShallow } from 'zustand/react/shallow';
import { useDesignStore } from '../../stores/designStore';
import CanvasElement from './CanvasElement';

export default function InteractiveCanvas() {
  const {
    currentDesign,
    addElement,
    selectedElementId,
    setSelectedElement,
    activeTool,
    primaryColor,
    shapeType,
  } = useDesignStore(
    useShallow(state => ({
      currentDesign: state.currentDesign,
      addElement: state.addElement,
      selectedElementId: state.selectedElementId,
      setSelectedElement: state.setSelectedElement,
      activeTool: state.activeTool,
      primaryColor: state.primaryColor,
      shapeType: state.shapeType,
    }))
  );
  const { setActiveTool } = useDesignStore.getState();

  const handleCanvasTap = (evt: any) => {
    const { locationX, locationY } = evt.nativeEvent;

    if (activeTool === 'text') {
      addElement({
        type: 'text', x: locationX, y: locationY, width: 150, height: 40, rotation: 0, zIndex: currentDesign.elements.length,
        properties: { text: 'Double tap to edit', fontSize: 20, color: primaryColor },
      });
      setActiveTool('select');
    } else if (activeTool === 'shape') {
      addElement({
        type: 'shape', x: locationX - 50, y: locationY - 50, width: 100, height: 100, rotation: 0, zIndex: currentDesign.elements.length,
        properties: { shapeType, backgroundColor: primaryColor },
      });
      setActiveTool('select');
    } else {
      setSelectedElement(null);
    }
  };

  return (
    <View style={styles.canvasContainer}>
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={handleCanvasTap} activeOpacity={1} />
        {currentDesign?.elements.map(element => (
          <CanvasElement 
            key={element.id}
            element={element}
            isSelected={selectedElementId === element.id}
            onSelect={setSelectedElement}
            activeTool={activeTool}
          />
        ))}
    </View>
  );
}

const styles = StyleSheet.create({
  canvasContainer: {
    flex: 1,
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: 10,
    overflow: 'hidden',
  },
}); 