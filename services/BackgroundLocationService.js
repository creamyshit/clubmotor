// services/BackgroundLocationService.js
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';

const LOCATION_TASK_NAME = 'background-location-task';

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error('Background location task error:', error);
    return;
  }
  if (data) {
    const { locations } = data;
    if (locations?.length > 0) {
      const { coords, timestamp } = locations[0];
      try {
        await fetch('https://1d9b-158-140-190-176.ngrok-free.app/events/update-location', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: 'currentUserId', // replace dynamically later
            latitude: coords.latitude,
            longitude: coords.longitude,
            timestamp,
          }),
        });
      } catch (err) {
        console.error('Error sending background location:', err);
      }
    }
  }
});

export async function startBackgroundLocation() {
  let bgPerm = { status: 'undetermined' };
  try {
    bgPerm = await Location.requestBackgroundPermissionsAsync();
  } catch (err) {
    console.warn('Background permission API unavailable:', err);
    return;
  }
  if (bgPerm.status !== 'granted') {
    console.warn('Background location permission denied');
    return;
  }

  await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
    accuracy: Location.Accuracy.Balanced,
    timeInterval: 15000,
    distanceInterval: 100,
    mayShowUserSettingsDialog: true,
  });
}

export async function stopBackgroundLocation() {
  const hasStarted = await Location.hasStartedLocationUpdatesAsync(
    LOCATION_TASK_NAME
  );
  if (hasStarted) {
    await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
  }
}
