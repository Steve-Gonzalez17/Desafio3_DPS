import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";

import { Entity } from "../types/Entity";
import {
  getBookById,
  updateBook,
  deleteBook,
} from "../services/resourceService";
import LoadingSpinner from "../components/LoadingSpinner";
import { Theme, Shadows } from "../constants/theme";

export default function DetailScreen() {
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const bookId = Array.isArray(id) ? id[0] : id;

  const [book, setBook] = useState<Entity | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadBook = async () => {
      if (!bookId) {
        setBook(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getBookById(String(bookId));
        if (!cancelled) {
          setBook(data);
        }
      } catch (error) {
        console.log("ERROR AL CARGAR DETALLE:", error);
        if (!cancelled) {
          setBook(null);
          Alert.alert(
            "Error",
            "No se pudo cargar el libro. Verifica el identificador y la conexión con la API."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadBook();

    return () => {
      cancelled = true;
    };
  }, [bookId]);

  const toggleAvailability = async () => {
    if (!book || busy) return;

    const nuevoEstado = Number(book.estado) === 1 ? 0 : 1;

    try {
      setBusy(true);
      const updated = await updateBook(String(book.id), {
        estado: nuevoEstado,
      });

      setBook(updated);

      Alert.alert(
        nuevoEstado === 1 ? "¡Disponible!" : "Prestado",
        nuevoEstado === 1
          ? "El libro ahora está disponible en la biblioteca."
          : "El libro se ha marcado como no disponible (prestado)."
      );
    } catch (error) {
      console.log("ERROR AL ACTUALIZAR LIBRO:", error);
      Alert.alert("Error", "No se pudo actualizar la disponibilidad del libro.");
    } finally {
      setBusy(false);
    }
  };

  const confirmDelete = () => {
    if (!book || busy) return;

    Alert.alert(
      "Eliminar libro",
      `¿Estás seguro de que deseas eliminar permanentemente "${book.titulo}" del catálogo?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              setBusy(true);
              await deleteBook(String(book.id));
              Alert.alert("Éxito", "El libro se eliminó correctamente.", [
                {
                  text: "Aceptar",
                  onPress: () => router.back(),
                },
              ]);
            } catch (error) {
              console.log("ERROR AL ELIMINAR LIBRO:", error);
              Alert.alert("Error", "No se pudo eliminar el libro.");
            } finally {
              setBusy(false);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return <LoadingSpinner message="Cargando detalles del libro..." />;
  }

  if (!bookId || !book) {
    return (
      <View style={styles.centered}>
        <View style={styles.notFoundCard}>
          <Ionicons
            name="alert-circle-outline"
            size={54}
            color={Theme.danger}
          />
          <Text style={styles.notFoundTitle}>Libro no encontrado</Text>
          <Text style={styles.notFoundSubtitle}>
            {!bookId
              ? "No se recibió un identificador válido."
              : "El libro que buscas no existe o fue eliminado."}
          </Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={18} color={Theme.white} />
            <Text style={styles.backButtonText}>Volver al catálogo</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const isAvailable = Number(book.estado) === 1;
  const rating = Number(book.calificacion ?? 0);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Botón flotante para regresar */}
      <View style={styles.topNavRow}>
        <TouchableOpacity
          style={styles.navBackButton}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={20} color={Theme.text} />
          <Text style={styles.navBackText}>Volver</Text>
        </TouchableOpacity>
      </View>

      {/* Hero: Portada y sombreado */}
      <View style={styles.heroSection}>
        <View style={styles.coverShadowWrapper}>
          {book.portada && !imageError ? (
            <Image
              source={{ uri: String(book.portada) }}
              style={styles.cover}
              contentFit="cover"
              transition={300}
              onError={() => setImageError(true)}
            />
          ) : (
            <View style={styles.fallbackCover}>
              <Ionicons name="book" size={54} color={Theme.primary} />
              <Text style={styles.fallbackText}>Sin portada</Text>
            </View>
          )}
        </View>

        {/* Título y Autor */}
        <Text style={styles.title}>{String(book.titulo ?? "Sin título")}</Text>
        <View style={styles.authorRow}>
          <Ionicons name="person-outline" size={16} color={Theme.primary} />
          <Text style={styles.author}>
            {String(book.autor ?? "Autor desconocido")}
          </Text>
        </View>

        {/* Badge de Disponibilidad */}
        <View
          style={[
            styles.statusBadge,
            isAvailable
              ? styles.statusBadgeAvailable
              : styles.statusBadgeUnavailable,
          ]}
        >
          <View
            style={[
              styles.statusDot,
              { backgroundColor: isAvailable ? Theme.accent : Theme.danger },
            ]}
          />
          <Text
            style={[
              styles.statusBadgeText,
              { color: isAvailable ? Theme.accentDark : Theme.dangerDark },
            ]}
          >
            {isAvailable ? "Disponible en biblioteca" : "Prestado / No disponible"}
          </Text>
        </View>
      </View>

      {/* Grid de Fichas Técnicas */}
      <View style={styles.infoGrid}>
        <View style={styles.infoCard}>
          <View style={styles.infoCardIcon}>
            <Ionicons name="pricetag-outline" size={20} color={Theme.primary} />
          </View>
          <Text style={styles.infoCardLabel}>Género</Text>
          <Text style={styles.infoCardValue} numberOfLines={2}>
            {String(book.genero ?? "No especificado")}
          </Text>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoCardIcon}>
            <Ionicons name="calendar-outline" size={20} color={Theme.primary} />
          </View>
          <Text style={styles.infoCardLabel}>Año</Text>
          <Text style={styles.infoCardValue}>
            {String(book.year ?? "N/D")}
          </Text>
        </View>

        <View style={styles.infoCard}>
          <View style={[styles.infoCardIcon, { backgroundColor: Theme.warningLight }]}>
            <Ionicons name="star" size={20} color={Theme.warning} />
          </View>
          <Text style={styles.infoCardLabel}>Calificación</Text>
          <Text style={styles.infoCardValue}>
            {rating > 0 ? `${rating} / 5` : "Sin calificar"}
          </Text>
        </View>
      </View>

      {/* Acciones principales */}
      <View style={styles.actionsSection}>
        {/* Cambiar estado */}
        <TouchableOpacity
          style={[
            styles.primaryActionButton,
            isAvailable
              ? styles.actionMarkUnavailable
              : styles.actionMarkAvailable,
            busy && styles.disabled,
          ]}
          onPress={toggleAvailability}
          disabled={busy}
          activeOpacity={0.85}
        >
          {busy ? (
            <ActivityIndicator color={Theme.white} />
          ) : (
            <View style={styles.buttonContentRow}>
              <Ionicons
                name={
                  isAvailable ? "time-outline" : "checkmark-circle-outline"
                }
                size={20}
                color={Theme.white}
              />
              <Text style={styles.primaryActionButtonText}>
                {isAvailable
                  ? "Marcar como prestado"
                  : "Marcar como disponible"}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Eliminar libro */}
        <TouchableOpacity
          style={[styles.deleteButton, busy && styles.disabled]}
          onPress={confirmDelete}
          disabled={busy}
          activeOpacity={0.85}
        >
          <View style={styles.buttonContentRow}>
            <Ionicons name="trash-outline" size={19} color={Theme.danger} />
            <Text style={styles.deleteButtonText}>Eliminar del catálogo</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.background,
  },
  content: {
    padding: 18,
    paddingBottom: 40,
  },
  topNavRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  navBackButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: Theme.cardBackground,
    borderWidth: 1,
    borderColor: Theme.border,
    ...Shadows.sm,
  },
  navBackText: {
    fontSize: 14,
    fontWeight: "700",
    color: Theme.text,
  },
  heroSection: {
    alignItems: "center",
    marginVertical: 12,
  },
  coverShadowWrapper: {
    width: 175,
    height: 255,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: Theme.surfaceSubtle,
    borderWidth: 1,
    borderColor: Theme.border,
    ...Shadows.lg,
    marginBottom: 18,
  },
  cover: {
    width: "100%",
    height: "100%",
  },
  fallbackCover: {
    width: "100%",
    height: "100%",
    backgroundColor: Theme.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  fallbackText: {
    color: Theme.primary,
    fontSize: 14,
    fontWeight: "700",
    marginTop: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: Theme.text,
    textAlign: "center",
    letterSpacing: -0.3,
    paddingHorizontal: 12,
  },
  authorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 6,
    marginBottom: 12,
  },
  author: {
    fontSize: 15,
    fontWeight: "600",
    color: Theme.primary,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusBadgeAvailable: {
    backgroundColor: Theme.accentLight,
  },
  statusBadgeUnavailable: {
    backgroundColor: Theme.dangerLight,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: "700",
  },
  infoGrid: {
    flexDirection: "row",
    gap: 10,
    marginVertical: 20,
  },
  infoCard: {
    flex: 1,
    backgroundColor: Theme.cardBackground,
    borderRadius: 16,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Theme.border,
    ...Shadows.sm,
  },
  infoCardIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Theme.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  infoCardLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: Theme.textSecondary,
    marginBottom: 4,
  },
  infoCardValue: {
    fontSize: 13,
    fontWeight: "700",
    color: Theme.text,
    textAlign: "center",
  },
  actionsSection: {
    marginTop: 10,
    gap: 12,
  },
  primaryActionButton: {
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.sm,
  },
  actionMarkAvailable: {
    backgroundColor: Theme.accent,
  },
  actionMarkUnavailable: {
    backgroundColor: Theme.primary,
  },
  primaryActionButtonText: {
    color: Theme.white,
    fontSize: 15,
    fontWeight: "700",
  },
  deleteButton: {
    backgroundColor: Theme.cardBackground,
    borderWidth: 1.5,
    borderColor: Theme.danger,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteButtonText: {
    color: Theme.danger,
    fontSize: 15,
    fontWeight: "700",
  },
  buttonContentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  disabled: {
    opacity: 0.6,
  },
  centered: {
    flex: 1,
    backgroundColor: Theme.background,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  notFoundCard: {
    backgroundColor: Theme.cardBackground,
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Theme.border,
    width: "100%",
    ...Shadows.md,
  },
  notFoundTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: Theme.text,
    marginTop: 12,
    marginBottom: 6,
  },
  notFoundSubtitle: {
    fontSize: 13,
    color: Theme.textSecondary,
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 18,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Theme.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  backButtonText: {
    color: Theme.white,
    fontWeight: "700",
    fontSize: 14,
  },
});