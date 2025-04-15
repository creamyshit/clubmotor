// EmergencyButton.js
import React from 'react';
import { TouchableOpacity, Text, Alert } from 'react-native';

export default function EmergencyButton({ eventId }) {
  const sendEmergencySignal = () => {
    fetch(`https://your-backend-api.com/events/${eventId}/emergency`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'currentUserId', timestamp: Date.now() }),
    })
    .then(response => response.json())
    .then(data => {
      Alert.alert('Sinyal Darurat Terkirim', 'Peserta lain akan menerima notifikasi.');
    })
    .catch(error => console.error('Error sending emergency signal:', error));
  };

  return (
    <TouchableOpacity 
      onPress={sendEmergencySignal}
      style={{ 
        backgroundColor: 'red', 
        padding: 16, 
        margin: 16, 
        borderRadius: 50,
        alignItems: 'center'
      }}
    >
      <Text style={{ color: 'white', fontWeight: 'bold' }}>Sinyal Darurat</Text>
    </TouchableOpacity>
  );
}
