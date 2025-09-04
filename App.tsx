import { StatusBar } from 'expo-status-bar';
import './global.css';
import { AppNavigator } from './src/navigation/AppNavigator';
import { AuthProvider } from './src/contexts/AuthContext';
import { ExerciseProvider } from './src/contexts/ExerciseContext';

export default function App() {
  return (
    <AuthProvider>
      <ExerciseProvider>
        <AppNavigator />
        <StatusBar style="light" />
      </ExerciseProvider>
    </AuthProvider>
  );
}
