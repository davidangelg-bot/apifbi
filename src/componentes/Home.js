// src/componentes/Home.js
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

export default function Home() {
  const [personajes, setPersonajes] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const paginas = [1, 2, 3, 4, 5];
        const respuestas = await Promise.all(
          paginas.map((p) => fetch(`https://rickandmortyapi.com/api/character?page=${p}`))
        );
        const jsons = await Promise.all(respuestas.map((r) => r.json()));
        const listaCompleta = jsons.flatMap((j) => j.results || []);
        setPersonajes(listaCompleta);
      } catch (error) {
        console.error('Error al cargar personajes:', error);
        setPersonajes([]);
      } finally {
        setLoading(false);
      }
    };

    obtenerDatos();
  }, []);

  const filtrados = personajes.filter((item) => {
    const coincideNombre = item.name.toLowerCase().includes(busqueda.toLowerCase());
    const coincideEstado =
      filtroEstado === 'Todos' || item.status.toLowerCase() === filtroEstado.toLowerCase();
    return coincideNombre && coincideEstado;
  });

  const colorEstado = (status) => {
    if (status === 'Alive') return '#22c55e';
    if (status === 'Dead') return '#ef4444';
    return '#eab308';
  };

  if (loading) {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" color="#22c55e" />
        <Text style={styles.textoSecundario}>Abriendo portal interdimensional...</Text>
      </View>
    );
  }

  return (
    <View style={styles.contenedor}>
      <Text style={styles.encabezado}>Explorador del Multiverso</Text>

      <TextInput
        style={styles.buscador}
        placeholder="Buscar personaje (ej. Rick, Morty, Summer)..."
        placeholderTextColor="#6b7280"
        value={busqueda}
        onChangeText={setBusqueda}
      />

      <View style={styles.filtros}>
        {[
          { etiqueta: 'Todos', valor: 'Todos' },
          { etiqueta: 'Vivos', valor: 'Alive' },
          { etiqueta: 'Muertos', valor: 'Dead' },
          { etiqueta: 'Desconocido', valor: 'unknown' },
        ].map((f) => (
          <TouchableOpacity
            key={f.valor}
            onPress={() => setFiltroEstado(f.valor)}
            style={[styles.chip, filtroEstado === f.valor && styles.chipActivo]}
          >
            <Text style={[styles.chipTexto, filtroEstado === f.valor && styles.chipTextoActivo]}>
              {f.etiqueta}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtrados}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <View style={styles.tarjeta}>
            <Image source={{ uri: item.image }} style={styles.imagen} />
            <Text style={styles.nombre} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.especie} numberOfLines={1}>
              {item.species}
            </Text>
            <View style={styles.filaEstado}>
              <View style={[styles.punto, { backgroundColor: colorEstado(item.status) }]} />
              <Text style={styles.estadoTexto}>{item.status}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: '#0b0f19', paddingTop: 40, paddingHorizontal: 10 },
  centrado: { flex: 1, backgroundColor: '#0b0f19', justifyContent: 'center', alignItems: 'center' },
  encabezado: { fontSize: 22, fontWeight: 'bold', color: '#22c55e', textAlign: 'center', marginBottom: 12 },
  textoSecundario: { color: '#9ca3af', marginTop: 10 },
  buscador: {
    backgroundColor: '#111827',
    color: '#fff',
    borderWidth: 1,
    borderColor: '#1f2937',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  filtros: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  chipActivo: { backgroundColor: '#22c55e', borderColor: '#22c55e' },
  chipTexto: { color: '#9ca3af', fontSize: 12, fontWeight: '600' },
  chipTextoActivo: { color: '#0b0f19' },
  tarjeta: {
    flex: 1,
    margin: 5,
    padding: 10,
    backgroundColor: '#111827',
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  imagen: { width: 110, height: 110, borderRadius: 55, marginBottom: 8 },
  nombre: { color: '#f9fafb', fontWeight: 'bold', fontSize: 14, textAlign: 'center' },
  especie: { color: '#9ca3af', fontSize: 12, marginTop: 2 },
  filaEstado: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  punto: { width: 8, height: 8, borderRadius: 4, marginRight: 5 },
  estadoTexto: { color: '#d1d5db', fontSize: 11 },
});