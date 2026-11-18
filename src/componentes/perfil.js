// src/componentes/perfil.js
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { auth, db } from '../../firebase/firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import avisar from '../avisar';

export default function Perfil() {
  const [nombre, setNombre] = useState('');
  const [fecha, setFecha] = useState('');
  const [telefono, setTelefono] = useState('');
  const [ganados, setGanados] = useState(0);
  const [perdidos, setPerdidos] = useState(0);
  const [cargando, setCargando] = useState(true);

  const uid = auth.currentUser?.uid;

  useEffect(() => {
    if (!uid) return;
    const traerDatos = async () => {
      const docRef = doc(db, 'usuarios', uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setNombre(data.nombre || '');
        setFecha(data.fecha || '');
        setTelefono(data.telefono || '');
        setGanados(data.ganados || 0);
        setPerdidos(data.perdidos || 0);
      }
      setCargando(false);
    };
    traerDatos();
  }, [uid]);

  const actualizarDatos = async () => {
    try {
      const docRef = doc(db, 'usuarios', uid);
      await updateDoc(docRef, { nombre, fecha, telefono });
      avisar('Listo', 'Perfil actualizado correctamente');
    } catch (error) {
      avisar('Error', 'No se pudo actualizar el perfil');
    }
  };

  if (cargando) {
    return (
      <View style={styles.centrado}>
        <Text style={{ color: '#9ca3af' }}>Cargando perfil...</Text>
      </View>
    );
  }

  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>Perfil del Explorador</Text>
      <Text style={styles.correo}>{auth.currentUser?.email}</Text>

      <View style={styles.resumen}>
        <View style={styles.cajaStat}>
          <Text style={styles.numeroStat}>{ganados}</Text>
          <Text style={styles.labelStat}>Aciertos</Text>
        </View>
        <View style={styles.cajaStat}>
          <Text style={[styles.numeroStat, { color: '#ef4444' }]}>{perdidos}</Text>
          <Text style={styles.labelStat}>Fallos</Text>
        </View>
      </View>

      <TextInput style={styles.input} placeholder="Nombre" placeholderTextColor="#6b7280" value={nombre} onChangeText={setNombre} />
      <TextInput
        style={styles.input}
        placeholder="Fecha de nacimiento (AAAA-MM-DD)"
        placeholderTextColor="#6b7280"
        value={fecha}
        onChangeText={setFecha}
      />
      <TextInput
        style={styles.input}
        placeholder="Teléfono"
        placeholderTextColor="#6b7280"
        value={telefono}
        onChangeText={setTelefono}
        keyboardType="phone-pad"
      />

      <TouchableOpacity style={styles.boton} onPress={actualizarDatos}>
        <Text style={styles.textoBoton}>Guardar cambios</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  centrado: { flex: 1, backgroundColor: '#0b0f19', justifyContent: 'center', alignItems: 'center' },
  contenedor: { padding: 24, paddingTop: 50, flex: 1, backgroundColor: '#0b0f19' },
  titulo: { fontSize: 24, fontWeight: 'bold', color: '#22c55e' },
  correo: { color: '#9ca3af', marginBottom: 20, marginTop: 4 },
  resumen: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  cajaStat: {
    flex: 1,
    backgroundColor: '#111827',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  numeroStat: { fontSize: 22, fontWeight: 'bold', color: '#22c55e' },
  labelStat: { color: '#9ca3af', fontSize: 12, marginTop: 2 },
  input: {
    backgroundColor: '#111827',
    color: '#fff',
    borderWidth: 1,
    borderColor: '#1f2937',
    padding: 13,
    marginBottom: 14,
    borderRadius: 10,
  },
  boton: { backgroundColor: '#22c55e', padding: 14, borderRadius: 10, alignItems: 'center', marginTop: 6 },
  textoBoton: { color: '#0b0f19', fontWeight: 'bold', fontSize: 16 },
});