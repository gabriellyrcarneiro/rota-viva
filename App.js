import { StatusBar } from 'react-native';
import { SafeAreaView, StyleSheet, Text } from 'react-native';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Text style={styles.title}>Rota Viva</Text>
      <Text style={styles.subtitle}>Guia brasileiro de viagens em construção.</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f7f3ec',
    padding: 24,
  },
  title: {
    color: '#173d35',
    fontSize: 34,
    fontWeight: '800',
  },
  subtitle: {
    color: '#4f5d57',
    fontSize: 16,
    marginTop: 8,
    textAlign: 'center',
  },
});

