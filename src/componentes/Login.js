// src/componentes/Login.js
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import avisar from '../avisar';

export default function Login() {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, correo, contrasena);
    } catch (error) {
      avisar('Error al iniciar sesión', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Portal Multiverso</Text>
      <Text style={styles.subtitulo}>Inicia sesión para explorar</Text>

      <TextInput
        placeholder="Correo electrónico"
        placeholderTextColor="#6b7280"
        value={correo}
        onChangeText={setCorreo}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Contraseña"
        placeholderTextColor="#6b7280"
        value={contrasena}
        onChangeText={setContrasena}
        style={styles.input}
        secureTextEntry
      />

      <TouchableOpacity style={styles.botonPrincipal} onPress={handleLogin}>
        <Text style={styles.textoBoton}>Ingresar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.botonSecundario} onPress={() => navigation.navigate('Registro')}>
        <Text style={styles.textoSecundario}>¿No tienes cuenta? Regístrate</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#0b0f19' },
  titulo: { fontSize: 28, fontWeight: 'bold', color: '#22c55e', textAlign: 'center' },
  subtitulo: { fontSize: 14, color: '#9ca3af', textAlign: 'center', marginBottom: 24 },
  input: {
    backgroundColor: '#111827',
    color: '#fff',
    borderWidth: 1,
    borderColor: '#1f2937',
    padding: 14,
    marginBottom: 14,
    borderRadius: 10,
  },
  botonPrincipal: { backgroundColor: '#22c55e', padding: 14, borderRadius: 10, alignItems: 'center', marginTop: 6 },
  textoBoton: { color: '#0b0f19', fontWeight: 'bold', fontSize: 16 },
  botonSecundario: { marginTop: 16, alignItems: 'center' },
  textoSecundario: { color: '#38bdf8', fontSize: 14 },
});