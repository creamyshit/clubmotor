// App.js
import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Login from './components/Login';
import Register from './components/Register';
import NewsScreen from './components/News';
import EventList from './components/EventList';
import JualBeliScreen from './components/JualBeli';
import Profile from './components/Profile';
import EventDetail from './components/EventDetail';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="News" component={NewsScreen} />
      <Tab.Screen name="Events" component={EventList} />
      <Tab.Screen
        name="JualBeli"
        component={JualBeliScreen}
        options={{ title: 'Jual & Beli' }}
      />
    </Tab.Navigator>
  );
}

function MainStack({ authData, setAuthData }) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={MainTabNavigator}
        options={({ navigation }) => ({
          headerTitle: 'Club Motor',
          headerRight: () => (
            <Button
              title="Profile"
              onPress={() => navigation.navigate('Profile')}
            />
          ),
        })}
      />
      <Stack.Screen name="Profile" options={{ headerTitle: 'Profile' }}>
        {(props) => (
          <Profile
            {...props}
            authData={authData}
            setAuthData={setAuthData}
          />
        )}
      </Stack.Screen>
      <Stack.Screen
        name="EventDetail"
        component={EventDetail}
        options={{ headerTitle: 'Detail Event' }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  const [authData, setAuthData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load stored auth data on mount
  useEffect(() => {
    AsyncStorage.getItem('authData')
      .then((json) => {
        if (json) {
          const data = JSON.parse(json);
          setAuthData(data);
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  // Whenever authData changes, persist (or remove)
  useEffect(() => {
    if (authData) {
      AsyncStorage.setItem('authData', JSON.stringify(authData)).catch(
        console.error
      );
    } else {
      AsyncStorage.removeItem('authData').catch(console.error);
    }
  }, [authData]);

  // While loading stored data, show splash
  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        {authData ? (
          <MainStack authData={authData} setAuthData={setAuthData} />
        ) : (
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Login">
              {(props) => (
                <Login {...props} setAuthData={setAuthData} />
              )}
            </Stack.Screen>
            <Stack.Screen name="Register" component={Register} />
          </Stack.Navigator>
        )}
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
