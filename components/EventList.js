// EventList.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';

export default function EventList({ navigation }) {
  const [events, setEvents] = useState([]);
  
  useEffect(() => {
    // Fetch daftar event dari backend
    fetch('https://7065-114-10-27-48.ngrok-free.app/events')
      .then(response => response.json())
      .then(data => setEvents(data))
      .catch(error => console.error('Error fetching events:', error));
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      onPress={() => navigation.navigate('EventDetail', { eventId: item.id })}
    >
      <View style={{ padding: 16, borderBottomWidth: 1, borderColor: '#ccc' }}>
        <Text style={{ fontSize: 18 }}>{item.title}</Text>
        <Text>Status: {item.status}</Text>
      </View>
    </TouchableOpacity>
  );
  
  return (
    <View style={{ flex: 1 }}>
      <FlatList 
         data={events}
         keyExtractor={item => item.id.toString()}
         renderItem={renderItem}
      />
    </View>
  );
}
