// src/componentes/Registro.js
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase/firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import avisar from '../avisar';

export default function Registro() {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [fecha, setFecha] = useState('');
  const [telefono, setTelefono] = useState('');
  const navigation = useNavigation();

  const handleRegistro = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, correo, contrasena);
      const user = userCredential.user;

      await setDoc(doc(db, 'usuarios', user.uid), {
        uid: user.uid,
        nombre,
        correo,
        fecha,
        telefono,
        ganados: 0,
        perdidos: 0,
      });

      avisar('Éxito', 'Cuenta creada correctamente');
    } catch (error) {
      avisar('Error al registrarse', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Crear Cuenta</Text>
      <Text style={styles.subtitulo}>Registro de Explorador</Text>

      <TextInput placeholder="Nombre" placeholderTextColor="#6b7280" value={nombre} onChangeText={setNombre} style={styles.input} />
      <TextInput
        placeholder="Correo"
        placeholderTextColor="#6b7280"
        value={correo}
        onChangeText={setCorreo}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />
      <TextInput
        placeholder="Contraseña (mínimo 6)"
        placeholderTextColor="#6b7280"
        value={contrasena}
        onChangeText={setContrasena}
        secureTextEntry
        style={styles.input}
      />
      <TextInput
        placeholder="Fecha de nacimiento (AAAA-MM-DD)"
        placeholderTextColor="#6b7280"
        value={fecha}
        onChangeText={setFecha}
        style={styles.input}
      />
      <TextInput
        placeholder="Teléfono"
        placeholderTextColor="#6b7280"
        value={telefono}
        onChangeText={setTelefono}
        keyboardType="phone-pad"
        style={styles.input}
      />

      <TouchableOpacity style={styles.botonPrincipal} onPress={handleRegistro}>
        <Text style={styles.textoBoton}>Registrarme</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.botonSecundario} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.textoSecundario}>¿Ya tienes cuenta? Inicia sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#0b0f19' },
  titulo: { fontSize: 28, fontWeight: 'bold', color: '#22c55e', textAlign: 'center' },
  subtitulo: { fontSize: 14, color: '#9ca3af', textAlign: 'center', marginBottom: 20 },
  input: {
    backgroundColor: '#111827',
    color: '#fff',
    borderWidth: 1,
    borderColor: '#1f2937',
    padding: 13,
    marginBottom: 12,
    borderRadius: 10,
  },
  botonPrincipal: { backgroundColor: '#22c55e', padding: 14, borderRadius: 10, alignItems: 'center', marginTop: 6 },
  textoBoton: { color: '#0b0f19', fontWeight: 'bold', fontSize: 16 },
  botonSecundario: { marginTop: 14, alignItems: 'center' },
  textoSecundario: { color: '#38bdf8', fontSize: 14 },
});