import { useRef, useState } from 'react';
import { Animated, PanResponder, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Svg, { Ellipse, Rect } from 'react-native-svg';
import { DesignElement, useDesignStore } from '../../stores/designStore';

interface CanvasElementProps {
  element: DesignElement;
  isSelected: boolean;
  onSelect: (id: string) => void;
  activeTool: string;
}

export default function CanvasElement({ element, isSelected, onSelect, activeTool }: CanvasElementProps) {
  const { updateElement } = useDesignStore.getState();
  const [isEditing, setIsEditing] = useState(false);

  const pan = useRef(new Animated.ValueXY({ x: element.x, y: element.y })).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => activeTool === 'select',
      onPanResponderGrant: () => {
        onSelect(element.id);
        pan.setOffset({ x: element.x, y: element.y });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (e, gesture) => {
        pan.flattenOffset();
        // Note: gesture.moveX/Y is relative to the screen, not the canvas.
        // A more robust solution would involve measuring the canvas parent.
        // For now, this provides basic drag functionality.
        const newX = element.x + gesture.dx;
        const newY = element.y + gesture.dy;
        updateElement(element.id, { x: newX, y: newY });
      },
    })
  ).current;

  if (isEditing && element.type === 'text') {
    return (
      <View style={[styles.elementContainer, { transform: [{translateX: element.x}, {translateY: element.y}] }]}>
        <TextInput
          style={{
            width: element.width, height: element.height,
            fontSize: element.properties.fontSize, color: element.properties.color,
            borderWidth: 1, borderColor: '#007AFF', padding: 4, zIndex: 999
          }}
          value={element.properties.text}
          onChangeText={(text) => updateElement(element.id, { properties: { text } })}
          onBlur={() => setIsEditing(false)}
          autoFocus={true}
          multiline={true}
        />
      </View>
    );
  }

  return (
    <Animated.View
      style={[
        styles.elementContainer,
        {
          transform: pan.getTranslateTransform(),
          borderColor: isSelected ? '#007AFF' : 'transparent',
          zIndex: element.zIndex,
        },
      ]}
      {...panResponder.panHandlers}
    >
      <TouchableOpacity
        onPress={() => onSelect(element.id)}
        onLongPress={() => {
          if (element.type === 'text') setIsEditing(true);
        }}
        activeOpacity={0.8}
      >
        {element.type === 'text' && (
          <Text style={{ fontSize: element.properties.fontSize, color: element.properties.color }}>
            {element.properties.text}
          </Text>
        )}
        {element.type === 'shape' && (
          <View style={{width: element.width, height: element.height}}>
            <Svg height={element.height} width={element.width}>
              {element.properties.shapeType === 'rectangle' ? (
                <Rect x="0" y="0" width={element.width} height={element.height} fill={element.properties.backgroundColor} />
              ) : (
                <Ellipse cx={element.width / 2} cy={element.height / 2} rx={element.width / 2} ry={element.height / 2} fill={element.properties.backgroundColor} />
              )}
            </Svg>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  elementContainer: {
    position: 'absolute',
    borderWidth: 2,
    padding: 4,
  },
}); 