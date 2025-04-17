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
  try {
    const { status: fgStatus } =
      await Location.requestForegroundPermissionsAsync();
    const { status: bgStatus } =
      await Location.requestBackgroundPermissionsAsync();

    if (fgStatus !== 'granted' || bgStatus !== 'granted') {
      console.warn('Location permissions not granted:', fgStatus, bgStatus);
      return;
    }

    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      accuracy: Location.Accuracy.Highest,
      timeInterval: 15000,
      distanceInterval: 50,
      // **This is the key**: Android will show this notification and keep your task alive
      foregroundService: {
        notificationTitle: 'Club Motor Tracking',
        notificationBody:
          'Your ride location is being recorded in the background.',
        notificationColor: '#FF0000',
      },
      mayShowUserSettingsDialog: true,
    });
  } catch (err) {
    console.warn('startBackgroundLocation error:', err);
  }
}

export async function stopBackgroundLocation() {
  try {
    const started = await Location.hasStartedLocationUpdatesAsync(
      LOCATION_TASK_NAME
    );
    if (started) {
      await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
    }
  } catch (err) {
    console.warn('stopBackgroundLocation error:', err);
  }
}
