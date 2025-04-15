// EventDetail.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Button,
  Alert,
  ScrollView,
  FlatList,
  Dimensions
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import RealTimeMap from './RealTimeMap';
import EmergencyButton from './EmergencyButton';
import Gallery from './Gallery';
import { startBackgroundLocation, stopBackgroundLocation } from '../services/BackgroundLocationService';

export default function EventDetail({ route, navigation }) {
  const { eventId } = route.params;
  const [event, setEvent] = useState(null);
  const [userJoined, setUserJoined] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [routes] = useState([
    { key: 'gallery', title: 'Gallery' },
    { key: 'participants', title: 'Participants' },
    { key: 'realtime', title: 'Real Time' }
  ]);

  // 1. Request lokasi (foreground dan background) saat komponen dipasang
  useEffect(() => {
    (async () => {
      const { status: fgStatus } = await Location.requestForegroundPermissionsAsync();
      const { status: bgStatus } = await Location.requestBackgroundPermissionsAsync();
      if (fgStatus !== 'granted' || bgStatus !== 'granted') {
        Alert.alert(
          'Izin Lokasi',
          'Izin lokasi foreground dan background belum diberikan. Untuk fungsi realtime, aktifkan izin lokasi di pengaturan.'
        );
      }
    })();
  }, []);

  // 2. Fetch detail event dari backend
  useEffect(() => {
    // Ganti URL backend sesuai konfigurasi
    fetch(`http://192.168.31.158:8080/events/${eventId}`)
      .then(response => response.json())
      .then(data => {
        setEvent(data.event);
        setUserJoined(data.userJoined || false);
      })
      .catch(error => console.error('Error fetching event detail:', error));
  }, [eventId]);

  // 3. Atur background location: start jika event on progress dan user telah join
  useEffect(() => {
    if (event && event.status === 'on progress') {
      startBackgroundLocation();
    } else {
      stopBackgroundLocation();
    }
    return () => {
      stopBackgroundLocation();
    };
  }, [event, userJoined]);

  // Parsing JSON safe untuk kolom points
  let points = [];
  if (event && event.points && typeof event.points === 'string') {
    const trimmed = event.points.trim();
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        points = JSON.parse(event.points);
      } catch (error) {
        console.error('Failed to parse event points JSON:', error, event.points);
      }
    } else {
      console.warn('Event points is not in expected JSON format:', event.points);
    }
  }

  // Tentukan initialRegion dari MapView berdasarkan titik pertama (jika ada)
  const initialRegion = {
    latitude: points.length > 0 ? points[0].latitude : 0,
    longitude: points.length > 0 ? points[0].longitude : 0,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  // Fungsi join event
  const handleJoin = () => {
    if (event.joinType === 'free') {
      fetch(`http://YOUR_BACKEND_URL/events/${eventId}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'currentUserId', name: 'Nama User' }),
      })
        .then(response => response.json())
        .then(() => {
          Alert.alert('Success', 'Anda telah bergabung dalam event.');
          setUserJoined(true);
        })
        .catch(error => console.error('Error joining event:', error));
    } else if (event.joinType === 'approval') {
      fetch(`http://YOUR_BACKEND_URL/events/${eventId}/join-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'currentUserId', name: 'Nama User' }),
      })
        .then(response => response.json())
        .then(() => {
          Alert.alert('Request Sent', 'Tunggu approval dari admin.');
        })
        .catch(error => console.error('Error sending join request:', error));
    }
  };

  // Fungsi cancel participation
  const handleCancelParticipation = () => {
    fetch(`http://YOUR_BACKEND_URL/events/${eventId}/cancel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'currentUserId' }),
    })
      .then(response => response.json())
      .then(() => {
        Alert.alert('Cancelled', 'Anda telah membatalkan partisipasi.');
        setUserJoined(false);
      })
      .catch(error => console.error('Error cancelling participation:', error));
  };

  // Komponen ParticipantsList untuk menampilkan peserta di tab "Participants"
  const ParticipantsList = () => {
    const [participants, setParticipants] = useState([]);
    useEffect(() => {
      fetch(`http://YOUR_BACKEND_URL/events/${eventId}/participants/location`)
        .then(response => response.json())
        .then(data => setParticipants(data))
        .catch(error => console.error('Error fetching participants:', error));
    }, [eventId]);

    return (
      <FlatList
        data={participants}
        keyExtractor={(item, index) =>
          item.name ? item.name.toString() : index.toString()
        }
        renderItem={({ item }) => (
          <View style={{ padding: 8, borderBottomWidth: 1, borderColor: '#ccc' }}>
            <Text>{item.name}</Text>
          </View>
        )}
      />
    );
  };

  // Definisikan Scene untuk masing-masing tab
  const renderScene = SceneMap({
    gallery: () => <Gallery eventId={eventId} userJoined={userJoined} />,
    participants: ParticipantsList,
    realtime: () => <RealTimeMap eventId={eventId} />
  });

  // Tampilkan loading screen jika event belum tersedia
  if (!event) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1 }}>
      {/* Peta statis dengan rute (polyline) dan marker yang menghubungkan titik-titik */}
      <MapView style={{ height: 200 }} initialRegion={initialRegion}>
        {points.length > 0 && (
          <Polyline
            coordinates={points.map(pt => ({
              latitude: pt.latitude,
              longitude: pt.longitude
            }))}
            strokeColor="#FF0000"
            strokeWidth={3}
          />
        )}
        {points.map((point, index) => (
          <Marker
            key={index}
            coordinate={{ latitude: point.latitude, longitude: point.longitude }}
            title={point.label}
          />
        ))}
      </MapView>

      {/* Informasi detail event beserta tombol Join/Cancel */}
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{event.title}</Text>
        <Text>Status: {event.status}</Text>
        <Text>{event.description}</Text>
        {event.status === 'scheduled' && !userJoined && (
          <Button title="Join Event" onPress={handleJoin} />
        )}
        {event.status === 'scheduled' && userJoined && (
          <Button title="Cancel Participation" onPress={handleCancelParticipation} />
        )}
      </View>

      {/* Tab View untuk Gallery, Participants, dan Real Time */}
      <View style={{ height: 400 }}>
        <TabView
          navigationState={{ index: tabIndex, routes }}
          renderScene={renderScene}
          onIndexChange={setTabIndex}
          initialLayout={{ width: Dimensions.get('window').width }}
          renderTabBar={props => <TabBar {...props} />}
        />
      </View>

      {/* Jika event on progress, tampilkan tombol Emergency */}
      {event.status === 'on progress' && (
        <View style={{ padding: 16 }}>
          <EmergencyButton eventId={eventId} />
        </View>
      )}
    </ScrollView>
  );
}
