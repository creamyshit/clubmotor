import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';

export default function Profile({ authData, navigation, setAuthData }) {
  const [profile, setProfile] = useState(null);

  const fetchProfile = () => {
    fetch('https://7065-114-10-27-48.ngrok-free.app/profile', {
      headers: {
        'Authorization': `Bearer ${authData.token}`
      }
    })
      .then(response => response.json())
      .then(data => {
        if (data.user) {
          setProfile(data.user);
        } else {
          Alert.alert("Error", data.error);
        }
      })
      .catch(err => {
        Alert.alert("Error", err.toString());
      });
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleLogout = () => {
    setAuthData(null);
    navigation.navigate("Login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      {profile ? (
        <>
          <Text>Username: {profile.username}</Text>
          <Text>Email: {profile.email}</Text>
          <Text>User ID: {profile.id}</Text>
        </>
      ) : (
        <Text>Loading profile...</Text>
      )}
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, alignItems: 'center' },
  title: { fontSize: 24, marginBottom: 20 },
});
