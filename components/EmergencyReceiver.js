// EmergencyReceiver.js
import React, { useEffect, useState } from 'react';
import { Vibration, Alert } from 'react-native';
import { Audio } from 'expo-av';

export default function EmergencyReceiver({ eventId }) {
  const [emergencyActive, setEmergencyActive] = useState(false);
  
  // Fungsi polling untuk mendapatkan status sinyal darurat
  useEffect(() => {
    const interval = setInterval(() => {
      fetch(`https://your-backend-api.com/events/${eventId}/emergency-status`)
        .then(response => response.json())
        .then(data => {
          // Anggap data.active bernilai true jika ada sinyal darurat aktif
          setEmergencyActive(data.active);
        })
        .catch(error => {
          console.error('Error fetching emergency status:', error);
        });
    }, 5000); // polling setiap 5 detik; sesuaikan sesuai kebutuhan
    return () => clearInterval(interval);
  }, [eventId]);

  // Efek untuk mengeksekusi getaran dan memainkan suara ketika emergency aktif
  useEffect(() => {
    let soundObject;
    
    async function playAlertSound() {
      try {
        soundObject = new Audio.Sound();
        await soundObject.loadAsync(require('./assets/emergency.mp3')); // Pastikan file suara tersedia di folder assets
        await soundObject.playAsync();
      } catch (error) {
        console.error('Error playing alert sound:', error);
      }
    }

    if (emergencyActive) {
      // Aktifkan getaran dengan pola tertentu (misalnya getar 500ms, jeda 1000ms, dst) dan set repeat true
      Vibration.vibrate([500, 1000, 500, 1000], true);
      playAlertSound();
      
      // Opsional: Tampilkan alert lokal agar user sadar (hati-hati jangan terlalu mengganggu)
      Alert.alert('Emergency', 'Sinyal darurat diterima!');
    } else {
      Vibration.cancel();
    }
    
    // Bersihkan resource bila komponen unmount atau emergencyActive berubah
    return () => {
      Vibration.cancel();
      if (soundObject) {
        soundObject.unloadAsync();
      }
    };
  }, [emergencyActive]);

  return null; // Komponen ini tidak menampilkan UI apa pun
}
