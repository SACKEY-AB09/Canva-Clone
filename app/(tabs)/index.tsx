import { KeyboardAvoidingView, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import CategoryTabs from '../../components/CategoryTabs';
import Header from '../../components/Header';
import Section from '../../components/Section';
import { useDesigns } from '../../contexts/DesignContext';

// Dummy data for other sections
const whiteboardData = [
  { id: '1', label: 'Whiteboard', image: 'https://placehold.co/120x90/fff/000?text=Whiteboard' },
  { id: '2', label: 'Whiteboard', image: 'https://placehold.co/120x90/fff/000?text=Whiteboard' },
];
const storiesData = [
  { id: '1', label: 'Your Story', image: 'https://placehold.co/120x90/eee/000?text=Story' },
  { id: '2', label: 'Your Story', image: 'https://placehold.co/120x90/eee/000?text=Story' },
];
const docsData = [
  { id: '1', label: 'Doc', image: 'https://placehold.co/120x90/ddd/000?text=Doc' },
  { id: '2', label: 'Doc', image: 'https://placehold.co/120x90/ddd/000?text=Doc' },
];

export default function HomeScreen() {
  const { recentDesigns } = useDesigns();

  return (
    <KeyboardAvoidingView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Header />
      <ScrollView>
        <CategoryTabs />
        {/* <QuickActions /> */}
        <Section title="Recent Designs" data={recentDesigns} showAddButton={true} />
        <Section title="Whiteboard" data={whiteboardData} />
        <Section title="Your stories" data={storiesData} />
        <Section title="Docs" data={docsData} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export function HomeTab() {
  return (
    <View style={[styles.container, styles.centered]}>
      <Text style={styles.text}>Welcome to the Home Tab!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    columnGap: 10,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});