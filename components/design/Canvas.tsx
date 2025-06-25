import React, { useRef, useState } from 'react';
import {
    Dimensions,
    PanResponder,
    PanResponderInstance,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { DesignElement, useDesignStore } from '../../stores/designStore';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface CanvasProps {
  width: number;
  height: number;
  backgroundColor: string;
}

export default function Canvas({ width, height, backgroundColor }: CanvasProps) {
  const {
    currentDesign,
    selectedElementId,
    setSelectedElement,
    activeTool,
    addElement,
    updateElement,
    primaryColor,
    fontSize,
    fontFamily,
    isBold,
    isItalic,
    isUnderlined,
    textAlign,
    shapeType,
    borderWidth,
    borderRadius,
  } = useDesignStore();

  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingPath, setDrawingPath] = useState<Array<{ x: number; y: number }>>([]);
  const [selectionBox, setSelectionBox] = useState<{
    startX: number;
    startY: number;
    endX: number;
    endY: number;
  } | null>(null);

  const canvasRef = useRef<View>(null);
  const panResponder = useRef<PanResponderInstance | null>(null);

  // Create PanResponder for canvas interactions
  React.useEffect(() => {
    panResponder.current = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        
        if (activeTool === 'select') {
          // Start selection box
          setSelectionBox({
            startX: locationX,
            startY: locationY,
            endX: locationX,
            endY: locationY,
          });
        } else if (activeTool === 'draw') {
          // Start drawing
          setIsDrawing(true);
          setDrawingPath([{ x: locationX, y: locationY }]);
        } else if (activeTool === 'text') {
          // Add text element
          addTextElement(locationX, locationY);
        } else if (activeTool === 'shape') {
          // Add shape element
          addShapeElement(locationX, locationY);
        }
      },
      onPanResponderMove: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        
        if (activeTool === 'select' && selectionBox) {
          // Update selection box
          setSelectionBox({
            ...selectionBox,
            endX: locationX,
            endY: locationY,
          });
        } else if (activeTool === 'draw' && isDrawing) {
          // Continue drawing
          setDrawingPath(prev => [...prev, { x: locationX, y: locationY }]);
        }
      },
      onPanResponderRelease: () => {
        if (activeTool === 'select' && selectionBox) {
          // Finalize selection
          const selectedElements = getElementsInSelection(selectionBox);
          if (selectedElements.length === 1) {
            setSelectedElement(selectedElements[0].id);
          }
          setSelectionBox(null);
        } else if (activeTool === 'draw' && isDrawing) {
          // Finalize drawing
          if (drawingPath.length > 2) {
            addDrawingElement();
          }
          setIsDrawing(false);
          setDrawingPath([]);
        }
      },
    });
  }, [activeTool, selectionBox, isDrawing, drawingPath, setSelectedElement, addElement, updateElement]);

  const addTextElement = (x: number, y: number) => {
    if (!currentDesign) return;
    
    addElement({
      type: 'text',
      x: x - 60, // Center the text element
      y: y - 20,
      width: 120,
      height: 40,
      rotation: 0,
      zIndex: currentDesign.elements.length + 1,
      properties: {
        text: 'Double tap to edit',
        fontSize: fontSize,
        fontFamily: fontFamily,
        color: primaryColor,
        bold: isBold,
        italic: isItalic,
        underline: isUnderlined,
        textAlign: textAlign,
      },
    });
  };

  const addShapeElement = (x: number, y: number) => {
    if (!currentDesign) return;
    
    addElement({
      type: 'shape',
      x: x - 40, // Center the shape element
      y: y - 40,
      width: 80,
      height: 80,
      rotation: 0,
      zIndex: currentDesign.elements.length + 1,
      properties: {
        backgroundColor: primaryColor,
        borderColor: '#000',
        borderWidth: borderWidth,
        borderRadius: borderRadius,
        shapeType: shapeType,
      },
    });
  };

  const addDrawingElement = () => {
    if (!currentDesign || drawingPath.length < 2) return;
    
    // Create a path element from the drawing
    const minX = Math.min(...drawingPath.map(p => p.x));
    const minY = Math.min(...drawingPath.map(p => p.y));
    const maxX = Math.max(...drawingPath.map(p => p.x));
    const maxY = Math.max(...drawingPath.map(p => p.y));
    
    addElement({
      type: 'shape',
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
      rotation: 0,
      zIndex: currentDesign.elements.length + 1,
      properties: {
        backgroundColor: 'transparent',
        borderColor: primaryColor,
        borderWidth: 2,
        borderRadius: 0,
        // Store drawing path data for rendering
        drawingPath: drawingPath.map(p => ({ x: p.x - minX, y: p.y - minY })),
      },
    });
  };

  const getElementsInSelection = (box: {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
  }) => {
    if (!currentDesign) return [];
    
    return currentDesign.elements.filter(element => {
      const elementRight = element.x + element.width;
      const elementBottom = element.y + element.height;
      const boxRight = Math.max(box.startX, box.endX);
      const boxBottom = Math.max(box.startY, box.endY);
      const boxLeft = Math.min(box.startX, box.endX);
      const boxTop = Math.min(box.startY, box.endY);
      
      return !(element.x > boxRight || elementRight < boxLeft || 
               element.y > boxBottom || elementBottom < boxTop);
    });
  };

  const renderElement = (element: DesignElement) => {
    const isSelected = selectedElementId === element.id;
    
    if (element.type === 'text') {
      return (
        <View
          key={element.id}
          style={[
            styles.element,
            styles.textElement,
            {
              left: element.x,
              top: element.y,
              width: element.width,
              height: element.height,
              zIndex: element.zIndex,
              borderColor: isSelected ? '#007AFF' : 'transparent',
              borderWidth: isSelected ? 2 : 0,
            },
          ]}
        >
          <Text
            style={[
              styles.textContent,
              {
                fontSize: element.properties.fontSize || 16,
                fontFamily: element.properties.fontFamily || 'Arial',
                color: element.properties.color || '#000',
                fontWeight: element.properties.bold ? 'bold' : 'normal',
                fontStyle: element.properties.italic ? 'italic' : 'normal',
                textDecorationLine: element.properties.underline ? 'underline' : 'none',
                textAlign: element.properties.textAlign || 'left',
              },
            ]}
            numberOfLines={1}
          >
            {element.properties.text || 'Text'}
          </Text>
          {isSelected && renderResizeHandles(element)}
        </View>
      );
    }
    
    if (element.type === 'shape') {
      return (
        <View
          key={element.id}
          style={[
            styles.element,
            styles.shapeElement,
            {
              left: element.x,
              top: element.y,
              width: element.width,
              height: element.height,
              backgroundColor: element.properties.backgroundColor || '#eee',
              borderRadius: element.properties.borderRadius || 0,
              borderWidth: isSelected ? 2 : element.properties.borderWidth || 0,
              borderColor: isSelected ? '#007AFF' : element.properties.borderColor || 'transparent',
              zIndex: element.zIndex,
            },
          ]}
        >
          {element.properties.drawingPath && renderDrawingPath(element)}
          {isSelected && renderResizeHandles(element)}
        </View>
      );
    }
    
    return null;
  };

  const renderDrawingPath = (element: DesignElement) => {
    if (!element.properties.drawingPath) return null;
    
    // Create SVG-like path rendering
    return (
      <View style={styles.drawingPath}>
        {element.properties.drawingPath.map((point, index) => {
          if (index === 0) return null;
          const prevPoint = element.properties.drawingPath![index - 1];
          return (
            <View
              key={index}
              style={[
                styles.drawingLine,
                {
                  left: prevPoint.x,
                  top: prevPoint.y,
                  width: Math.sqrt(
                    Math.pow(point.x - prevPoint.x, 2) + Math.pow(point.y - prevPoint.y, 2)
                  ),
                  height: 2,
                  backgroundColor: element.properties.borderColor || '#000',
                  transform: [
                    {
                      rotate: `${Math.atan2(point.y - prevPoint.y, point.x - prevPoint.x)}rad`,
                    },
                  ],
                },
              ]}
            />
          );
        })}
      </View>
    );
  };

  const renderResizeHandles = (element: DesignElement) => {
    const handleSize = 12;
    const positions = [
      { key: 'tl', left: -handleSize/2, top: -handleSize/2 },
      { key: 'tr', left: element.width-handleSize/2, top: -handleSize/2 },
      { key: 'bl', left: -handleSize/2, top: element.height-handleSize/2 },
      { key: 'br', left: element.width-handleSize/2, top: element.height-handleSize/2 },
    ];
    
    return positions.map(pos => (
      <View
        key={pos.key}
        style={[
          styles.resizeHandle,
          {
            left: pos.left,
            top: pos.top,
            width: handleSize,
            height: handleSize,
          },
        ]}
      />
    ));
  };

  const renderSelectionBox = () => {
    if (!selectionBox) return null;
    
    const left = Math.min(selectionBox.startX, selectionBox.endX);
    const top = Math.min(selectionBox.startY, selectionBox.endY);
    const width = Math.abs(selectionBox.endX - selectionBox.startX);
    const height = Math.abs(selectionBox.endY - selectionBox.startY);
    
    return (
      <View
        style={[
          styles.selectionBox,
          {
            left,
            top,
            width,
            height,
          },
        ]}
      />
    );
  };

  const renderDrawingPreview = () => {
    if (!isDrawing || drawingPath.length < 2) return null;
    
    return (
      <View style={styles.drawingPreview}>
        {drawingPath.map((point, index) => {
          if (index === 0) return null;
          const prevPoint = drawingPath[index - 1];
          return (
            <View
              key={index}
              style={[
                styles.drawingLine,
                {
                  left: prevPoint.x,
                  top: prevPoint.y,
                  width: Math.sqrt(
                    Math.pow(point.x - prevPoint.x, 2) + Math.pow(point.y - prevPoint.y, 2)
                  ),
                  height: 2,
                  backgroundColor: primaryColor,
                  transform: [
                    {
                      rotate: `${Math.atan2(point.y - prevPoint.y, point.x - prevPoint.x)}rad`,
                    },
                  ],
                },
              ]}
            />
          );
        })}
      </View>
    );
  };

  return (
    <View
      ref={canvasRef}
      style={[
        styles.canvas,
        {
          width,
          height,
          backgroundColor,
        },
      ]}
      {...panResponder.current?.panHandlers}
    >
      {/* Render all design elements */}
      {currentDesign?.elements.map(renderElement)}
      
      {/* Render selection box */}
      {renderSelectionBox()}
      
      {/* Render drawing preview */}
      {renderDrawingPreview()}
      
      {/* Grid overlay for better positioning */}
      <View style={styles.grid} />
    </View>
  );
}

const styles = StyleSheet.create({
  canvas: {
    position: 'relative',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  element: {
    position: 'absolute',
  },
  textElement: {
    padding: 4,
    backgroundColor: 'transparent',
  },
  shapeElement: {
    // Shape styling handled inline
  },
  textContent: {
    flex: 1,
  },
  drawingPath: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  drawingLine: {
    position: 'absolute',
    transformOrigin: 'left center',
  },
  drawingPreview: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
  },
  resizeHandle: {
    position: 'absolute',
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#007AFF',
    borderRadius: 6,
    zIndex: 1000,
  },
  selectionBox: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: '#007AFF',
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    borderStyle: 'dashed',
  },
  grid: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.1,
    // Grid pattern would be implemented with SVG or custom drawing
  },
}); 