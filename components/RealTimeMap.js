// RealTimeMap.js
import React, { useState, useEffect } from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';

export default function RealTimeMap({ eventId }) {
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    // Update lokasi peserta setiap 10 detik (interval ini dapat disesuaikan)
    const intervalId = setInterval(() => {
      fetch(`http://192.168.31.158:8080/events/${eventId}/participants/location`)
        .then(response => response.json())
        .then(data => setParticipants(data))
        .catch(error => console.error('Error fetching participant locations:', error));
    }, 10000);
    
    return () => clearInterval(intervalId);
  }, [eventId]);

  // Tentukan initialRegion berdasarkan lokasi peserta pertama (atau sesuaikan kebutuhan)
  const initialRegion = {
    latitude: participants[0]?.latitude || 0,
    longitude: participants[0]?.longitude || 0,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  return (
    <View style={{ height: 300 }}>
      <MapView style={{ flex: 1 }} initialRegion={initialRegion}>
        {participants.map((participant, index) => (
          <Marker 
            key={index}
            coordinate={{ latitude: participant.latitude, longitude: participant.longitude }}
          >
            <Image 
              source={require('../assets/flag.png')} 
              style={styles.flagIcon}
            />
            <Callout>
              <Text>{participant.name}</Text>
            </Callout>
          </Marker>
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  flagIcon: {
    width: 30,
    height: 30,
    // Kamu bisa menambahkan styling tambahan sesuai kebutuhan
  },
});
