import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Image } from 'react-native';

export default function Home() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1025');
        const json = await res.json();
        setData(json.results || []);
      } catch (error) {
        console.error('Error al cargar Pokémon:', error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    obtenerDatos();
  }, []);

  return (
    <ScrollView>
      <View style={styles.lista}>
        {loading ? (
          <Text>Cargando Pokémon...</Text>
        ) : (
          data.map((pokemon) => {
            const urlParts = pokemon.url.split('/').filter(Boolean);
            const id = urlParts[urlParts.length - 1];

            return (
              <View key={pokemon.name} style={styles.item}>
                <Text>{id} - {pokemon.name}</Text>
                <Image
                  source={{
                    uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
                  }}
                  style={styles.imagen}
                />
              </View>
            );
          })
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  lista: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 10,
  },
  item: {
    backgroundColor: 'aliceblue',
    width: '48%',
    padding: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  imagen: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  buscador: {
    margin: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
  },
});