// BackgroundLocationService.js
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';

const LOCATION_TASK_NAME = 'background-location-task';

// Definisikan background task
TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error('Background location task error:', error);
    return;
  }
  if (data) {
    const { locations } = data;
    if (locations && locations.length > 0) {
      const location = locations[0];
      try {
        await fetch('http://192.168.31.158:8080/events/update-location', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: 'currentUserId', // Ganti dengan ID user sebenarnya
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            timestamp: location.timestamp,
          }),
        });
      } catch (err) {
        console.error('Error sending background location:', err);
      }
    }
  }
});

// Fungsi untuk memulai background location dengan parameter yang hemat baterai
export async function startBackgroundLocation() {
  const { status } = await Location.requestBackgroundPermissionsAsync();
  if (status !== 'granted') {
    console.warn('Permission to access background location was denied');
    return;
  }
  await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
    accuracy: Location.Accuracy.Balanced, // Mode hemat baterai
    timeInterval: 15000, // Update setiap 15 detik (dapat disesuaikan)
    distanceInterval: 100, // Update hanya jika berpindah 100 meter
    mayShowUserSettingsDialog: true,
  });
}

// Fungsi untuk menghentikan background location
export async function stopBackgroundLocation() {
  const hasStarted = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
  if (hasStarted) {
    await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
  }
}
