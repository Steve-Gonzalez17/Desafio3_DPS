import React, { useCallback, useState } from "react";
import { View, Text, FlatList, TextInput, StyleSheet, TouchableOpacity, RefreshControl, Alert } from "react-native";
import { router, useFocusEffect } from "expo-router";

import { Entity } from "../types/Entity";
import { getBooks } from "../services/resourceService";
import ItemCard from "../components/ItemCard";
import LoadingSpinner from "../components/LoadingSpinner";

export default function HomeScreen() {
  const [books, setBooks] = useState<Entity[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadBooks = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      }

      const data = await getBooks();

      console.log("LIBROS RECIBIDOS:", data);

      setBooks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log("ERROR AL CARGAR LIBROS:", error);

      Alert.alert(
        "Error",
        "No se pudieron cargar los libros. Verifica la conexión con MockAPI."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadBooks();
    }, [loadBooks])
  );

  const filteredBooks = books.filter((book) => {
    const text = search.toLowerCase().trim();
    const titulo = String(book.titulo ?? "");
    const autor = String(book.autor ?? "");

    return (
      titulo.toLowerCase().includes(text) ||
      autor.toLowerCase().includes(text)
    );
  });

  const openDetail = (item: Entity) => {
    console.log("LIBRO SELECCIONADO:", item);
    console.log("ID DEL LIBRO:", item.id);

    if (
      item.id === undefined ||
      item.id === null ||
      String(item.id).trim() === ""
    ) {
      Alert.alert(
        "Error",
        "Este libro no tiene un identificador válido."
      );
      return;
    }

    router.push({
      pathname: "/detail",
      params: {
        id: String(item.id),
      },
    });
  };

  if (loading) {
    return <LoadingSpinner message="Cargando biblioteca..." />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Biblioteca Digital</Text>

      <Text style={styles.subtitle}>
        Explora nuestro catálogo de libros
      </Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Buscar por título o autor..."
        placeholderTextColor="#888888"
        value={search}
        onChangeText={setSearch}
      />

      <View style={styles.summary}>
        <Text style={styles.summaryText}>
          Total: {books.length}
        </Text>

        <Text style={styles.summaryText}>
          Disponibles: {
            books.filter(
              (book) => Number(book.estado) === 1
            ).length
          }
        </Text>
      </View>

      <FlatList
        data={filteredBooks}
        keyExtractor={(item, index) =>
          item.id !== undefined && item.id !== null
            ? String(item.id)
            : `book-${index}`
        }
        renderItem={({ item }) => (
          <ItemCard
            item={item}
            onPress={() => openDetail(item)}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadBooks(true)}
            colors={["#4D869C"]}
            tintColor="#4D869C"
          />
        }
        ListEmptyComponent={
          <Text style={styles.empty}>
            {search.trim()
              ? "No se encontraron libros."
              : "No hay libros registrados."}
          </Text>
        }
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EEF7FF",
    padding: 16,
  },
  heading: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1C1C1C",
  },
  subtitle: {
    fontSize: 14,
    color: "#4D869C",
    marginTop: 4,
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CDE8E5",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    color: "#1C1C1C",
  },
  summary: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  summaryText: {
    color: "#4D869C",
    fontWeight: "600",
  },
  list: {
    paddingBottom: 90,
    flexGrow: 1,
  },
  empty: {
    textAlign: "center",
    color: "#666666",
    padding: 20,
  },
  addButton: {
    position: "absolute",
    bottom: 16,
    right: 16,
    left: 16,
    backgroundColor: "#4D869C",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});