// src/componentes/Original.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { doc, getDoc, updateDoc, addDoc, collection, increment } from 'firebase/firestore';
import { auth, db } from '../../firebase/firebaseConfig';

export default function Original() {
  const [correcto, setCorrecto] = useState(null);
  const [opciones, setOpciones] = useState([]);
  const [seleccionado, setSeleccionado] = useState(null);
  const [ganados, setGanados] = useState(0);
  const [perdidos, setPerdidos] = useState(0);
  const [racha, setRacha] = useState(0);
  const [cargando, setCargando] = useState(true);

  const uid = auth.currentUser?.uid;

  useEffect(() => {
    if (!uid) return;
    const cargarEstadisticas = async () => {
      const snap = await getDoc(doc(db, 'usuarios', uid));
      if (snap.exists()) {
        setGanados(snap.data().ganados || 0);
        setPerdidos(snap.data().perdidos || 0);
      }
    };
    cargarEstadisticas();
    nuevaRonda();
  }, [uid]);

  const nuevaRonda = async () => {
    setCargando(true);
    setSeleccionado(null);
    try {
      const pagina = Math.floor(Math.random() * 42) + 1;
      const res = await fetch(`https://rickandmortyapi.com/api/character?page=${pagina}`);
      const data = await res.json();
      const mezclados = [...(data.results || [])].sort(() => Math.random() - 0.5);
      const cuatro = mezclados.slice(0, 4);
      const objetivo = cuatro[0];
      const opcionesMezcladas = [...cuatro].sort(() => Math.random() - 0.5);

      setCorrecto(objetivo);
      setOpciones(opcionesMezcladas);
    } catch (error) {
      console.error('Error cargando ronda:', error);
    } finally {
      setCargando(false);
    }
  };

  const responder = async (opcion) => {
    if (seleccionado || !correcto || !uid) return;
    setSeleccionado(opcion);
    const acerto = opcion.id === correcto.id;

    if (acerto) {
      setGanados((g) => g + 1);
      setRacha((r) => r + 1);
    } else {
      setPerdidos((p) => p + 1);
      setRacha(0);
    }

    try {
      const refUsuario = doc(db, 'usuarios', uid);
      await updateDoc(
        refUsuario,
        acerto ? { ganados: increment(1) } : { perdidos: increment(1) }
      );

      await addDoc(collection(db, 'resultados'), {
        uid,
        personaje: correcto.name,
        gano: acerto,
        fecha: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error guardando resultado:', error);
    }
  };

  if (cargando || !correcto) {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" color="#22c55e" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.contenedor}>
      <Text style={styles.titulo}>Trivia del Multiverso</Text>
      <Text style={styles.subtitulo}>¿Quién es este personaje?</Text>

      <View style={styles.marcador}>
        <Text style={styles.datoMarcador}>Aciertos: {ganados}</Text>
        <Text style={styles.datoMarcador}>Fallos: {perdidos}</Text>
        <Text style={styles.datoRacha}>Racha: {racha}</Text>
      </View>

      <View style={styles.tarjeta}>
        <Image source={{ uri: correcto.image }} style={styles.imagen} />
        <Text style={styles.pista}>Origen: {correcto.origin?.name || 'Desconocido'}</Text>
        <Text style={styles.pista}>Especie: {correcto.species}</Text>
      </View>

      <View style={styles.listaOpciones}>
        {opciones.map((op) => {
          let estiloBoton = styles.opcion;
          if (seleccionado) {
            if (op.id === correcto.id) estiloBoton = [styles.opcion, styles.opcionCorrecta];
            else if (op.id === seleccionado.id) estiloBoton = [styles.opcion, styles.opcionIncorrecta];
          }

          return (
            <TouchableOpacity
              key={op.id}
              style={estiloBoton}
              disabled={!!seleccionado}
              onPress={() => responder(op)}
            >
              <Text style={styles.textoOpcion}>{op.name}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {seleccionado && (
        <View style={styles.resultadoCaja}>
          <Text style={seleccionado.id === correcto.id ? styles.textoGano : styles.textoPerdio}>
            {seleccionado.id === correcto.id
              ? '¡Correcto! Portal estabilizado'
              : `Incorrecto. Era ${correcto.name}`}
          </Text>
          <TouchableOpacity style={styles.botonSiguiente} onPress={nuevaRonda}>
            <Text style={styles.textoSiguiente}>Siguiente personaje</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centrado: { flex: 1, backgroundColor: '#0b0f19', justifyContent: 'center', alignItems: 'center' },
  contenedor: { flexGrow: 1, backgroundColor: '#0b0f19', padding: 20, paddingTop: 45, alignItems: 'center' },
  titulo: { fontSize: 24, fontWeight: 'bold', color: '#22c55e' },
  subtitulo: { fontSize: 14, color: '#9ca3af', marginBottom: 14 },
  marcador: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    backgroundColor: '#111827',
    padding: 12,
    borderRadius: 10,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  datoMarcador: { color: '#f9fafb', fontWeight: '600' },
  datoRacha: { color: '#22c55e', fontWeight: 'bold' },
  tarjeta: {
    alignItems: 'center',
    backgroundColor: '#111827',
    padding: 16,
    borderRadius: 16,
    width: '100%',
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  imagen: { width: 170, height: 170, borderRadius: 85, marginBottom: 10, borderWidth: 2, borderColor: '#22c55e' },
  pista: { color: '#d1d5db', fontSize: 13, marginTop: 2 },
  listaOpciones: { width: '100%' },
  opcion: {
    backgroundColor: '#111827',
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#374151',
    alignItems: 'center',
  },
  opcionCorrecta: { backgroundColor: '#14532d', borderColor: '#22c55e' },
  opcionIncorrecta: { backgroundColor: '#7f1d1d', borderColor: '#ef4444' },
  textoOpcion: { color: '#f9fafb', fontSize: 15, fontWeight: '600' },
  resultadoCaja: { alignItems: 'center', marginTop: 10, width: '100%' },
  textoGano: { color: '#22c55e', fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  textoPerdio: { color: '#ef4444', fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  botonSiguiente: {
    backgroundColor: '#22c55e',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  textoSiguiente: { color: '#0b0f19', fontWeight: 'bold', fontSize: 15 },
});