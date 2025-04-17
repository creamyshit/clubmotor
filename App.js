// App.js
import React, { useState } from 'react';
import { Button } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Import komponen yang sudah ada
import Login from './components/Login';
import Register from './components/Register';
import NewsScreen from './components/News'; // Halaman News (placeholder atau sesuai implementasi kamu)
import EventList from './components/EventList'; // Halaman EventList yang sudah kamu miliki
import JualBeliScreen from './components/JualBeli'; // Halaman Jual & Beli
import Profile from './components/Profile';
import EventDetail from './components/EventDetail';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Navigator untuk menu utama menggunakan bottom tab
function MainTabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="News" component={NewsScreen} />
      {/* Gunakan EventList pada tab "Events" */}
      <Tab.Screen name="Events" component={EventList} />
      <Tab.Screen
        name="JualBeli"
        component={JualBeliScreen}
        options={{ title: 'Jual & Beli' }}
      />
    </Tab.Navigator>
  );
}

// Navigator utama yang menggabungkan bottom tab dan layar lain
function MainStack({ authData, setAuthData }) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={MainTabNavigator}
        options={({ navigation }) => ({
          headerTitle: 'Club Motor',
          // Tombol Profile di header untuk navigasi ke halaman Profile
          headerRight: () => (
            <Button
              title="Profile"
              onPress={() => navigation.navigate('Profile')}
            />
          ),
        })}
      />
      <Stack.Screen
        name="Profile"
        options={{ headerTitle: 'Profile' }}
      >
        {(props) => (
          <Profile {...props} authData={authData} setAuthData={setAuthData} />
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
  // authData akan menyimpan { user, token } bila sudah login, atau null jika belum
  const [authData, setAuthData] = useState(null);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        {authData ? (
          <MainStack authData={authData} setAuthData={setAuthData} />
        ) : (
          // Jika belum login, tampilkan layar autentikasi (Login dan Register)
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Login">
              {(props) => <Login {...props} setAuthData={setAuthData} />}
            </Stack.Screen>
            <Stack.Screen name="Register" component={Register} />
          </Stack.Navigator>
        )}
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
