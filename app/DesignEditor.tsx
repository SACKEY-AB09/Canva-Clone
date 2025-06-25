import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import BottomBar from '../components/design/BottomBar';
import ColorPanel from '../components/design/ColorPanel';
import ElementsPanel from '../components/design/ElementsPanel';
import InteractiveCanvas from '../components/design/InteractiveCanvas';
import TextPropertiesPanel from '../components/design/TextPropertiesPanel';
import TopBar from '../components/design/TopBar';
import { useDesigns } from '../contexts/DesignContext';
import { useDesignStore } from '../stores/designStore';

const { width: screenWidth } = Dimensions.get('window');

export default function DesignEditor() {
  const router = useRouter();
  const { id: designId } = useLocalSearchParams();
  const { getDesignById, updateDesign } = useDesigns();
  const hasLoaded = useRef(false);
  
  const { 
    undo, redo, setActiveTool, loadDesign, getAsJson, 
    addElement, setSelectedElement, createNewDesign 
  } = useDesignStore.getState();
  const canvasBackgroundColor = useDesignStore(state => state.currentDesign.backgroundColor);
  
  const design = getDesignById(designId as string);
  const [designName, setDesignName] = useState(design?.label || 'Untitled');
  const [isElementsPanelVisible, setIsElementsPanelVisible] = useState(false);
  const [isColorPanelVisible, setIsColorPanelVisible] = useState(false);
  const [isCanvasFocused, setIsCanvasFocused] = useState(true);

  const selectedElementId = useDesignStore(state => state.selectedElementId);
  const isTextElementSelected = useDesignStore(state => {
    if (!state.selectedElementId) return false;
    const el = state.currentDesign?.elements.find(e => e.id === state.selectedElementId);
    return el?.type === 'text';
  });

  useEffect(() => {
    if (hasLoaded.current) return;
    console.log('--- Design Editor Mounts ---');
    if (design?.content) {
      console.log('Loading existing design content...');
      loadDesign(design.content);
    } else {
      console.log('No saved content. Using default empty design from store.');
      loadDesign(null);
    }
    hasLoaded.current = true;
  }, [design, loadDesign]);

  const handleSave = () => {
    if (!design) return;
    const designContent = getAsJson();
    updateDesign(design.id, {
      ...design,
      label: designName,
      content: designContent,
    });
    Alert.alert('Saved!', 'Your design has been saved.');
  };

  const handleText = () => {
    setActiveTool('text');
    setIsColorPanelVisible(false);
    setIsElementsPanelVisible(false);
    setIsCanvasFocused(true);
  };

  const handleShare = () => Alert.alert('Share', 'Share functionality coming soon!');
  const handleMore = () => Alert.alert('More', 'More options coming soon!');

  const openElementsPanel = () => {
    setIsElementsPanelVisible(true);
    setIsColorPanelVisible(false);
    setIsCanvasFocused(false);
  };
  
  const openColorPanel = () => {
    setIsColorPanelVisible(true);
    setIsElementsPanelVisible(false);
    setIsCanvasFocused(false);
  };

  const handleImagePick = async () => {
    // No permissions needed to launch the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      addElement({
        type: 'image',
        x: 50,
        y: 50,
        width: result.assets[0].width / 4, // resize for canvas
        height: result.assets[0].height / 4,
        rotation: 0,
        zIndex: 10, // bring to front
        properties: {
          imageUrl: result.assets[0].uri,
        },
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TopBar 
          onSave={handleSave} 
          onUndo={undo} 
          onRedo={redo} 
          onShare={handleShare}
        />
        
        <View style={styles.mainContent}>
          <View 
            style={[
              styles.canvasContainer, 
              { backgroundColor: canvasBackgroundColor },
              isCanvasFocused && styles.canvasContainerFocused
            ]}
          >
            <TouchableOpacity style={styles.floatingButton}>
              <Ionicons name="chatbubble-ellipses-outline" size={24} color="#333" />
              <Ionicons name="ellipsis-horizontal" size={24} color="#333" style={{ marginLeft: 8 }}/>
            </TouchableOpacity>

            <InteractiveCanvas />
          </View>
        </View>

        {isElementsPanelVisible && (
          <ElementsPanel 
            onClose={() => setIsElementsPanelVisible(false)} 
            onPickImage={handleImagePick}
          />
        )}
        {isColorPanelVisible && <ColorPanel onClose={() => setIsColorPanelVisible(false)} />}

        {isTextElementSelected && selectedElementId ? (
          <TextPropertiesPanel 
            elementId={selectedElementId}
            onClose={() => setSelectedElement(null)} 
          />
        ) : (
          <BottomBar 
            onElements={openElementsPanel}
            onText={handleText}
            onColor={openColorPanel}
            onMore={handleMore}
            onClose={() => router.back()}
          />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  canvasContainer: {
    width: screenWidth - 32,
    height: screenWidth - 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'transparent',
    borderWidth: 2,
    borderRadius: 8,
    padding: 16,
    position: 'relative',
  },
  canvasContainerFocused: {
    borderColor: '#6A3DE8',
  },
  floatingButton: {
    position: 'absolute',
    top: -24,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 25,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    zIndex: 10,
  },
}); 