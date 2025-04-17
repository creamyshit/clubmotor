import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function News() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>News</Text>
      <Text>Ini adalah halaman News. Tampilkan berita terbaru di sini.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, marginBottom: 10 },
});
