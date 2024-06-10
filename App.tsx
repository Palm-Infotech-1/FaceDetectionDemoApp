import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import CameraScreen from './src/screens/CameraScreen';
import CameraV2 from './src/screens/CameraV2';

export default function App() {
  return (
    <View style={styles.container}>
      <CameraV2 />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
