// App.js
import React from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import EventList from './components/EventList';
import EventDetail from './components/EventDetail';

const Stack = createStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="EventList">
          <Stack.Screen 
            name="EventList" 
            component={EventList} 
            options={{ title: 'Daftar Event' }} 
          />
          <Stack.Screen 
            name="EventDetail" 
            component={EventDetail} 
            options={{ title: 'Detail Event' }} 
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
