import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface DesignElement {
  id: string;
  type: 'text' | 'shape' | 'image' | 'table';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  zIndex: number;
  properties: {
    text?: string;
    fontSize?: number;
    fontFamily?: string;
    color?: string;
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: number;
    borderRadius?: number;
    opacity?: number;
    shapeType?: 'rectangle' | 'circle' | 'triangle' | 'line';
    imageUrl?: string;
    tableData?: string[][];
    tableRows?: number;
    tableCols?: number;
    // Text style properties
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    textAlign?: 'left' | 'center' | 'right';
    // Drawing properties
    drawingPath?: Array<{ x: number; y: number }>;
  };
}

export interface DesignCanvas {
  id: string;
  name: string;
  width: number;
  height: number;
  backgroundColor: string;
  elements: DesignElement[];
  createdAt: Date;
  updatedAt: Date;
}

export type ToolType = 'select' | 'text' | 'shape' | 'image' | 'table' | 'draw' | 'eraser';
export type ShapeType = 'rectangle' | 'circle' | 'triangle' | 'line';

export interface DesignState {
  // Current design
  currentDesign: DesignCanvas;
  
  // Tool state
  activeTool: ToolType;
  selectedElementId: string | null;
  
  // Color state
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  
  // Text state
  fontSize: number;
  fontFamily: string;
  isBold: boolean;
  isItalic: boolean;
  isUnderlined: boolean;
  textAlign: 'left' | 'center' | 'right';
  
  // Shape state
  shapeType: ShapeType;
  borderWidth: number;
  borderRadius: number;
  
  // Canvas state
  canvasWidth: number;
  canvasHeight: number;
  zoom: number;
  panX: number;
  panY: number;
  
  // History
  undoStack: DesignElement[][];
  redoStack: DesignElement[][];
  
  // Actions
  setActiveTool: (tool: ToolType) => void;
  setSelectedElement: (elementId: string | null) => void;
  setPrimaryColor: (color: string) => void;
  setSecondaryColor: (color: string) => void;
  setBackgroundColor: (color: string) => void;
  setFontSize: (size: number) => void;
  setFontFamily: (family: string) => void;
  setTextStyle: (style: 'bold' | 'italic' | 'underline', value: boolean) => void;
  setTextAlign: (align: 'left' | 'center' | 'right') => void;
  setShapeType: (type: ShapeType) => void;
  setBorderWidth: (width: number) => void;
  setBorderRadius: (radius: number) => void;
  setCanvasSize: (width: number, height: number) => void;
  setZoom: (zoom: number) => void;
  setPan: (x: number, y: number) => void;
  
  // Design actions
  createNewDesign: (name: string, width?: number, height?: number) => void;
  addElement: (element: Omit<DesignElement, 'id'>) => void;
  updateElement: (elementId: string, updates: Partial<DesignElement>) => void;
  deleteElement: (elementId: string) => void;
  duplicateElement: (elementId: string) => void;
  bringToFront: (elementId: string) => void;
  sendToBack: (elementId: string) => void;
  
  // History actions
  saveToHistory: () => void;
  undo: () => void;
  redo: () => void;
  
  // Save/Load
  saveDesign: () => void;
  loadDesign: (content: string | null) => void;
  exportDesign: () => string;
  getAsJson: () => string;
}

const defaultDesign: DesignCanvas = {
  id: 'default',
  name: 'Untitled Design',
  width: 800,
  height: 600,
  backgroundColor: '#ffffff',
  elements: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const useDesignStore = create<DesignState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentDesign: defaultDesign,
      activeTool: 'select',
      selectedElementId: null,
      primaryColor: '#000000',
      secondaryColor: '#ffffff',
      backgroundColor: '#ffffff',
      fontSize: 16,
      fontFamily: 'Arial',
      isBold: false,
      isItalic: false,
      isUnderlined: false,
      textAlign: 'left',
      shapeType: 'rectangle',
      borderWidth: 1,
      borderRadius: 0,
      canvasWidth: 800,
      canvasHeight: 600,
      zoom: 1,
      panX: 0,
      panY: 0,
      undoStack: [],
      redoStack: [],

      // Tool actions
      setActiveTool: (tool) => set({ activeTool: tool }),
      setSelectedElement: (elementId) => set({ selectedElementId: elementId }),
      
      // Color actions
      setPrimaryColor: (color) => set({ primaryColor: color }),
      setSecondaryColor: (color) => set({ secondaryColor: color }),
      setBackgroundColor: (color) => set(state => {
        if (!state.currentDesign) return {};
        return {
          currentDesign: { ...state.currentDesign, backgroundColor: color },
          backgroundColor: color,
        };
      }),
      
      // Text actions
      setFontSize: (size) => set({ fontSize: size }),
      setFontFamily: (family) => set({ fontFamily: family }),
      setTextStyle: (style, value) => {
        set((state) => ({
          ...state,
          [style === 'bold' ? 'isBold' : style === 'italic' ? 'isItalic' : 'isUnderlined']: value
        }));
      },
      setTextAlign: (align) => set({ textAlign: align }),
      
      // Shape actions
      setShapeType: (type) => set({ shapeType: type }),
      setBorderWidth: (width) => set({ borderWidth: width }),
      setBorderRadius: (radius) => set({ borderRadius: radius }),
      
      // Canvas actions
      setCanvasSize: (width, height) => set({ canvasWidth: width, canvasHeight: height }),
      setZoom: (zoom) => set({ zoom }),
      setPan: (x, y) => set({ panX: x, panY: y }),
      
      // Design actions
      createNewDesign: (name = 'Untitled Design', width = 800, height = 600) => {
        const newDesign: DesignCanvas = {
          id: Date.now().toString(),
          name,
          width,
          height,
          backgroundColor: '#ffffff',
          elements: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set({
          currentDesign: newDesign,
          undoStack: [],
          redoStack: [],
        });
        console.log('--- New Design Created ---', newDesign);
      },
      
      addElement: (element) => {
        const { currentDesign, undoStack } = get();
        if (!currentDesign) {
          // This case should no longer happen due to default design
          return;
        }
        
        const newElement: DesignElement = { ...element, id: Date.now().toString() };
        set({
          undoStack: [...undoStack, currentDesign.elements],
          redoStack: [],
          currentDesign: {
            ...currentDesign,
            elements: [...currentDesign.elements, newElement],
            updatedAt: new Date()
          }
        });
      },
      
      updateElement: (elementId, updates) => {
        const { currentDesign, undoStack } = get();
        if (!currentDesign) return;
        set({
          undoStack: [...undoStack, currentDesign.elements],
          redoStack: [],
          currentDesign: {
            ...currentDesign,
            elements: currentDesign.elements.map(el => {
              if (el.id === elementId) {
                // Deep merge for the properties object to avoid overwriting
                const newProperties = updates.properties 
                  ? { ...el.properties, ...updates.properties }
                  : el.properties;
                return { ...el, ...updates, properties: newProperties };
              }
              return el;
            }),
            updatedAt: new Date()
          }
        });
      },
      
      deleteElement: (elementId) => {
        const { currentDesign, undoStack } = get();
        if (!currentDesign) return;
        set({
          undoStack: [...undoStack, currentDesign.elements],
          redoStack: [],
          currentDesign: {
            ...currentDesign,
            elements: currentDesign.elements.filter(el => el.id !== elementId),
            updatedAt: new Date()
          },
          selectedElementId: null
        });
      },
      
      duplicateElement: (elementId) => {
        const { currentDesign } = get();
        if (!currentDesign) return;
        
        const element = currentDesign.elements.find(el => el.id === elementId);
        if (!element) return;
        
        const duplicatedElement: DesignElement = {
          ...element,
          id: Date.now().toString(),
          x: element.x + 20,
          y: element.y + 20,
        };
        
        const updatedDesign = {
          ...currentDesign,
          elements: [...currentDesign.elements, duplicatedElement],
          updatedAt: new Date(),
        };
        
        set({ currentDesign: updatedDesign });
        get().saveToHistory();
      },
      
      bringToFront: (elementId) => {
        const { currentDesign } = get();
        if (!currentDesign) return;
        
        const elements = [...currentDesign.elements];
        const elementIndex = elements.findIndex(el => el.id === elementId);
        if (elementIndex === -1) return;
        
        const element = elements.splice(elementIndex, 1)[0];
        element.zIndex = Math.max(...elements.map(el => el.zIndex)) + 1;
        elements.push(element);
        
        const updatedDesign = {
          ...currentDesign,
          elements,
          updatedAt: new Date(),
        };
        
        set({ currentDesign: updatedDesign });
        get().saveToHistory();
      },
      
      sendToBack: (elementId) => {
        const { currentDesign } = get();
        if (!currentDesign) return;
        
        const elements = [...currentDesign.elements];
        const elementIndex = elements.findIndex(el => el.id === elementId);
        if (elementIndex === -1) return;
        
        const element = elements.splice(elementIndex, 1)[0];
        element.zIndex = Math.min(...elements.map(el => el.zIndex)) - 1;
        elements.unshift(element);
        
        const updatedDesign = {
          ...currentDesign,
          elements,
          updatedAt: new Date(),
        };
        
        set({ currentDesign: updatedDesign });
        get().saveToHistory();
      },
      
      // History actions
      saveToHistory: () => {
        const { currentDesign, undoStack } = get();
        if (!currentDesign) return;
        
        set({
          undoStack: [...undoStack, JSON.parse(JSON.stringify(currentDesign))],
          redoStack: [],
        });
      },
      
      undo: () => set(state => {
        if (state.undoStack.length === 0 || !state.currentDesign) return {};
        const lastState = state.undoStack[state.undoStack.length - 1];
        return {
          currentDesign: { ...state.currentDesign, elements: lastState },
          undoStack: state.undoStack.slice(0, -1),
          redoStack: [state.currentDesign.elements, ...state.redoStack],
        };
      }),
      
      redo: () => set(state => {
        if (state.redoStack.length === 0 || !state.currentDesign) return {};
        const nextState = state.redoStack[0];
        return {
          currentDesign: { ...state.currentDesign, elements: nextState },
          undoStack: [state.currentDesign.elements, ...state.undoStack],
          redoStack: state.redoStack.slice(1),
        };
      }),
      
      // Save/Load actions
      saveDesign: () => {
        const { currentDesign } = get();
        if (!currentDesign) return;
        
        // In a real app, this would save to backend
        console.log('Saving design:', currentDesign);
      },
      
      loadDesign: (content: string | null) => {
        if (!content) {
          set({ currentDesign: defaultDesign, undoStack: [], redoStack: [] });
          return;
        }
        try {
          const loadedState = JSON.parse(content);
          set({
            currentDesign: loadedState.currentDesign || defaultDesign,
            undoStack: loadedState.undoStack || [],
            redoStack: loadedState.redoStack || [],
          });
        } catch (e) {
          console.error("Failed to load design:", e);
          set({ currentDesign: defaultDesign, undoStack: [], redoStack: [] });
        }
      },
      
      exportDesign: () => {
        const { currentDesign } = get();
        if (!currentDesign) return '';
        
        // In a real app, this would export as image/PDF
        return JSON.stringify(currentDesign);
      },

      getAsJson: () => {
        const stateToSave = {
          currentDesign: get().currentDesign,
          undoStack: get().undoStack,
          redoStack: get().redoStack,
        };
        return JSON.stringify(stateToSave);
      },
    }),
    {
      name: 'design-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        currentDesign: state.currentDesign,
        undoStack: state.undoStack,
        redoStack: state.redoStack,
      }),
    }
  )
); 