// Gallery.js
import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function Gallery({ eventId, userJoined }) {
  const [media, setMedia] = useState([]);

  useEffect(() => {
    fetch(`https://your-backend-api.com/events/${eventId}/gallery`)
      .then(response => response.json())
      .then(data => setMedia(data))
      .catch(error => console.error('Error fetching gallery:', error));
  }, [eventId]);

  const pickImage = async () => {
    if (!userJoined) {
      alert('Hanya peserta event yang dapat mengupload media.');
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1,
    });
    if (!result.cancelled) {
      const formData = new FormData();
      formData.append('media', {
        uri: result.uri,
        name: 'upload.jpg',
        type: 'image/jpeg'
      });
      fetch(`https://your-backend-api.com/events/${eventId}/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        body: formData,
      })
      .then(response => response.json())
      .then(data => {
        alert('Upload berhasil');
        // Segarkan tampilan gallery
        fetch(`https://your-backend-api.com/events/${eventId}/gallery`)
          .then(response => response.json())
          .then(data => setMedia(data));
      })
      .catch(error => console.error('Error uploading media:', error));
    }
  };

  const renderItem = ({ item }) => (
    <View style={{ margin: 8 }}>
      { item.type.startsWith('image') ? (
        <Image source={{ uri: item.url }} style={{ width: 100, height: 100 }} />
      ) : (
        <Text>Video: {item.url}</Text>
      )}
    </View>
  );

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 18, marginBottom: 8 }}>Gallery</Text>
      { userJoined && (
        <Button title="Upload Media" onPress={pickImage} />
      )}
      <FlatList 
         data={media}
         keyExtractor={(item, index) => index.toString()}
         renderItem={renderItem}
         horizontal
      />
    </View>
  );
}
