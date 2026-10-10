import React, { useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { Entity } from "../types/Entity";
import { getBooks } from "../services/resourceService";
import ItemCard from "../components/ItemCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { Theme, Shadows } from "../constants/theme";

type FilterStatus = "all" | "available" | "unavailable";

export default function HomeScreen() {
  const [books, setBooks] = useState<Entity[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadBooks = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      }

      const data = await getBooks();
      setBooks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log("ERROR AL CARGAR LIBROS:", error);
      Alert.alert(
        "Error de conexión",
        "No se pudieron cargar los libros. Verifica tu conexión a internet o el servicio de MockAPI."
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

  const totalCount = books.length;
  const availableCount = useMemo(
    () => books.filter((b) => Number(b.estado) === 1).length,
    [books]
  );
  const unavailableCount = totalCount - availableCount;

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const text = search.toLowerCase().trim();
      const titulo = String(book.titulo ?? "").toLowerCase();
      const autor = String(book.autor ?? "").toLowerCase();
      const genero = String(book.genero ?? "").toLowerCase();

      const matchesSearch =
        text === "" ||
        titulo.includes(text) ||
        autor.includes(text) ||
        genero.includes(text);

      const isAvailable = Number(book.estado) === 1;
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "available" && isAvailable) ||
        (statusFilter === "unavailable" && !isAvailable);

      return matchesSearch && matchesStatus;
    });
  }, [books, search, statusFilter]);

  const openDetail = (item: Entity) => {
    if (
      item.id === undefined ||
      item.id === null ||
      String(item.id).trim() === ""
    ) {
      Alert.alert("Error", "Este libro no tiene un identificador válido.");
      return;
    }

    router.push({
      pathname: "/detail",
      params: {
        id: String(item.id),
      },
    });
  };

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("all");
  };

  if (loading) {
    return <LoadingSpinner message="Explorando biblioteca..." />;
  }

  return (
    <View style={styles.container}>
      {/* Encabezado Principal */}
      <View style={styles.header}>
        <View>
          <Text style={styles.heading}>Biblioteca Digital</Text>
          <Text style={styles.subtitle}>
            Administra y descubre tu catálogo de lectura
          </Text>
        </View>

        <TouchableOpacity
          style={styles.headerAddButton}
          onPress={() => router.push("/create")}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={22} color={Theme.white} />
        </TouchableOpacity>
      </View>

      {/* Tarjetas de Estadísticas Rápidas */}
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, styles.statCardTotal]}>
          <Ionicons name="book-outline" size={18} color={Theme.primary} />
          <Text style={styles.statNumber}>{totalCount}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>

        <View style={[styles.statCard, styles.statCardAvailable]}>
          <Ionicons
            name="checkmark-circle-outline"
            size={18}
            color={Theme.accentDark}
          />
          <Text style={[styles.statNumber, { color: Theme.accentDark }]}>
            {availableCount}
          </Text>
          <Text style={styles.statLabel}>Disponibles</Text>
        </View>

        <View style={[styles.statCard, styles.statCardUnavailable]}>
          <Ionicons
            name="alert-circle-outline"
            size={18}
            color={Theme.dangerDark}
          />
          <Text style={[styles.statNumber, { color: Theme.dangerDark }]}>
            {unavailableCount}
          </Text>
          <Text style={styles.statLabel}>Prestados</Text>
        </View>
      </View>

      {/* Barra de Búsqueda */}
      <View style={styles.searchWrapper}>
        <Ionicons
          name="search-outline"
          size={20}
          color={Theme.textMuted}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar título, autor o género..."
          placeholderTextColor={Theme.textMuted}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch("")} style={styles.clearIcon}>
            <Ionicons name="close-circle" size={18} color={Theme.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Chips de Filtro */}
      <View style={styles.filterChipsRow}>
        <TouchableOpacity
          style={[
            styles.chip,
            statusFilter === "all" && styles.chipActive,
          ]}
          onPress={() => setStatusFilter("all")}
        >
          <Text
            style={[
              styles.chipText,
              statusFilter === "all" && styles.chipTextActive,
            ]}
          >
            Todos ({totalCount})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.chip,
            statusFilter === "available" && styles.chipActiveAvailable,
          ]}
          onPress={() => setStatusFilter("available")}
        >
          <View
            style={[
              styles.chipDot,
              { backgroundColor: Theme.accent },
            ]}
          />
          <Text
            style={[
              styles.chipText,
              statusFilter === "available" && styles.chipTextActiveAvailable,
            ]}
          >
            Disponibles ({availableCount})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.chip,
            statusFilter === "unavailable" && styles.chipActiveUnavailable,
          ]}
          onPress={() => setStatusFilter("unavailable")}
        >
          <View
            style={[
              styles.chipDot,
              { backgroundColor: Theme.danger },
            ]}
          />
          <Text
            style={[
              styles.chipText,
              statusFilter === "unavailable" && styles.chipTextActiveUnavailable,
            ]}
          >
            Prestados ({unavailableCount})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Lista de Libros */}
      <FlatList
        data={filteredBooks}
        keyExtractor={(item, index) =>
          item.id !== undefined && item.id !== null
            ? String(item.id)
            : `book-${index}`
        }
        renderItem={({ item }) => (
          <ItemCard item={item} onPress={() => openDetail(item)} />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadBooks(true)}
            colors={[Theme.primary]}
            tintColor={Theme.primary}
          />
        }
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Ionicons
                name={search.trim() ? "search" : "library-outline"}
                size={42}
                color={Theme.primary}
              />
            </View>
            <Text style={styles.emptyTitle}>
              {search.trim() || statusFilter !== "all"
                ? "Sin resultados"
                : "Biblioteca vacía"}
            </Text>
            <Text style={styles.emptySubtitle}>
              {search.trim() || statusFilter !== "all"
                ? "No encontramos libros que coincidan con los criterios seleccionados."
                : "Aún no has registrado ningún libro en tu colección."}
            </Text>

            {search.trim() || statusFilter !== "all" ? (
              <TouchableOpacity
                style={styles.resetFilterButton}
                onPress={resetFilters}
              >
                <Text style={styles.resetFilterText}>Limpiar filtros</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.addBookEmptyButton}
                onPress={() => router.push("/create")}
              >
                <Ionicons name="add-circle-outline" size={18} color={Theme.white} />
                <Text style={styles.addBookEmptyText}>Registrar primer libro</Text>
              </TouchableOpacity>
            )}
          </View>
        }
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.background,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  heading: {
    fontSize: 26,
    fontWeight: "800",
    color: Theme.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: "500",
    color: Theme.textSecondary,
    marginTop: 2,
  },
  headerAddButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Theme.primary,
    justifyContent: "center",
    alignItems: "center",
    ...Shadows.sm,
  },
  statsContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: Theme.cardBackground,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Theme.border,
    ...Shadows.sm,
  },
  statCardTotal: {
    borderColor: Theme.border,
  },
  statCardAvailable: {
    borderColor: "#D1FAE5",
    backgroundColor: "#F0FDF4",
  },
  statCardUnavailable: {
    borderColor: "#FEE2E2",
    backgroundColor: "#FEF2F2",
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "800",
    color: Theme.primary,
    marginTop: 4,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: Theme.textSecondary,
    marginTop: 2,
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Theme.cardBackground,
    borderWidth: 1.5,
    borderColor: Theme.border,
    borderRadius: 14,
    paddingHorizontal: 12,
    marginBottom: 12,
    ...Shadows.sm,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 11,
    fontSize: 14,
    color: Theme.text,
  },
  clearIcon: {
    padding: 4,
  },
  filterChipsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: Theme.cardBackground,
    borderWidth: 1,
    borderColor: Theme.border,
  },
  chipActive: {
    backgroundColor: Theme.primary,
    borderColor: Theme.primary,
  },
  chipActiveAvailable: {
    backgroundColor: Theme.accent,
    borderColor: Theme.accent,
  },
  chipActiveUnavailable: {
    backgroundColor: Theme.danger,
    borderColor: Theme.danger,
  },
  chipDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  chipText: {
    fontSize: 12,
    fontWeight: "600",
    color: Theme.textSecondary,
  },
  chipTextActive: {
    color: Theme.white,
  },
  chipTextActiveAvailable: {
    color: Theme.white,
  },
  chipTextActiveUnavailable: {
    color: Theme.white,
  },
  list: {
    paddingBottom: 24,
    flexGrow: 1,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Theme.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: Theme.text,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Theme.textSecondary,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },
  resetFilterButton: {
    backgroundColor: Theme.surfaceSubtle,
    borderWidth: 1,
    borderColor: Theme.border,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },
  resetFilterText: {
    fontSize: 13,
    fontWeight: "700",
    color: Theme.primary,
  },
  addBookEmptyButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Theme.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    ...Shadows.sm,
  },
  addBookEmptyText: {
    color: Theme.white,
    fontSize: 14,
    fontWeight: "700",
  },
});