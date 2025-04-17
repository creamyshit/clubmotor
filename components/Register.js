import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';

export default function Register({ navigation }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    fetch('https://7065-114-10-27-48.ngrok-free.app/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    })
      .then(response => response.json())
      .then(data => {
        if (data.user) {
          Alert.alert("Registration Successful");
          navigation.navigate("Login");
        } else {
          Alert.alert("Registration Failed", data.error || "Unknown error");
        }
      })
      .catch(err => {
        Alert.alert("Registration Error", err.toString());
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <TextInput
        placeholder="Username"
        value={username}
        style={styles.input}
        onChangeText={setUsername}
      />
      <TextInput
        placeholder="Email"
        value={email}
        style={styles.input}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        value={password}
        style={styles.input}
        secureTextEntry
        onChangeText={setPassword}
      />
      <Button title="Register" onPress={handleRegister} />
      <Button title="Go to Login" onPress={() => navigation.navigate("Login")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5
  },
});
