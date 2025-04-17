import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function JualBeli() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Jual & Beli</Text>
      <Text>Tampilkan fitur jual dan beli di sini.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, marginBottom: 10 },
});
