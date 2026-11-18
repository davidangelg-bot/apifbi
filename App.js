// App.js
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/firebaseConfig';

import Login from './src/componentes/Login';
import Registro from './src/componentes/Registro';
import Home from './src/componentes/Home';
import Original from './src/componentes/Original';
import Perfil from './src/componentes/perfil';
import Logout from './src/componentes/Logout';

const Tab = createBottomTabNavigator();

export default function App() {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUsuario(user);
      setCargando(false);
    });
    return unsubscribe;
  }, []);

  if (cargando) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0b0f19' }}>
        <ActivityIndicator size="large" color="#22c55e" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#111827',
            borderTopColor: '#1f2937',
            height: 60,
            paddingBottom: 6,
          },
          tabBarActiveTintColor: usuario ? '#22c55e' : '#ef4444',
          tabBarInactiveTintColor: '#9ca3af',
          tabBarIcon: ({ focused, color, size }) => {
            let iconName = 'ellipse';

            if (route.name === 'Explorar') {
              iconName = focused ? 'planet' : 'planet-outline';
            } else if (route.name === 'Trivia') {
              iconName = focused ? 'game-controller' : 'game-controller-outline';
            } else if (route.name === 'Perfil') {
              // Ícono verde de usuario verificado indicando sesión activa
              return (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons name="person-circle" size={size} color="#22c55e" />
                  <Ionicons name="checkmark-circle" size={14} color="#22c55e" style={{ marginLeft: -4, marginTop: -10 }} />
                </View>
              );
            } else if (route.name === 'Salir') {
              iconName = focused ? 'log-out' : 'log-out-outline';
            } else if (route.name === 'Login') {
              // Ícono rojo de candado indicando que no hay sesión iniciada
              return <Ionicons name="lock-closed" size={size} color="#ef4444" />;
            } else if (route.name === 'Registro') {
              iconName = focused ? 'person-add' : 'person-add-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        {usuario ? (
          <>
            <Tab.Screen name="Explorar" component={Home} />
            <Tab.Screen name="Trivia" component={Original} />
            <Tab.Screen name="Perfil" component={Perfil} />
            <Tab.Screen name="Salir" component={Logout} />
          </>
        ) : (
          <>
            <Tab.Screen name="Login" component={Login} />
            <Tab.Screen name="Registro" component={Registro} />
          </>
        )}
      </Tab.Navigator>
    </NavigationContainer>
  );
}