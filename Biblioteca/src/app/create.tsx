import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import CustomInput from "../components/CustomInput";
import { createBook } from "../services/resourceService";
import { CreateEntity } from "../types/Entity";
import { Theme, Shadows } from "../constants/theme";

export default function CreateScreen() {
  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");
  const [genero, setGenero] = useState("");
  const [anio, setAnio] = useState("");
  const [portada, setPortada] = useState("");
  const [calificacion, setCalificacion] = useState<number>(0);
  const [estado, setEstado] = useState<0 | 1>(1);
  const [saving, setSaving] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(true);

  const handleStarPress = (ratingValue: number) => {
    // Si presiona la misma estrella ya seleccionada, la deselecciona (0)
    if (calificacion === ratingValue) {
      setCalificacion(0);
    } else {
      setCalificacion(ratingValue);
    }
  };

  const handleCreate = async () => {
    if (
      !titulo.trim() ||
      !autor.trim() ||
      !genero.trim() ||
      !anio.trim() ||
      !portada.trim()
    ) {
      Alert.alert(
        "Campos incompletos",
        "Por favor completa todos los campos requeridos marcados con (*)."
      );
      return;
    }

    const currentYear = new Date().getFullYear();
    const year = Number(anio.trim());

    if (!Number.isInteger(year) || year < 1 || year > currentYear + 1) {
      Alert.alert(
        "Año inválido",
        `Ingresa un año válido (entre 1 y ${currentYear + 1}).`
      );
      return;
    }

    if (!/^https?:\/\//i.test(portada.trim())) {
      Alert.alert(
        "URL de portada inválida",
        "La URL de la portada debe comenzar con http:// o https://."
      );
      return;
    }

    const newBook: CreateEntity = {
      titulo: titulo.trim(),
      autor: autor.trim(),
      genero: genero.trim(),
      year: String(year),
      portada: portada.trim(),
      estado,
      calificacion,
    };

    try {
      setSaving(true);
      await createBook(newBook);

      // Limpiar formulario tras éxito
      setTitulo("");
      setAutor("");
      setGenero("");
      setAnio("");
      setPortada("");
      setCalificacion(0);
      setEstado(1);

      Alert.alert(
        "¡Libro Registrado!",
        `"${newBook.titulo}" se ha agregado con éxito a la biblioteca.`
      );
    } catch (error) {
      console.error("ERROR AL REGISTRAR LIBRO:", error);
      Alert.alert(
        "Error",
        "No se pudo registrar el libro. Verifica la conexión con el servidor."
      );
    } finally {
      setSaving(false);
    }
  };

  const getRatingLabel = (stars: number) => {
    switch (stars) {
      case 5:
        return "Obra maestra (5/5)";
      case 4:
        return "Muy bueno (4/5)";
      case 3:
        return "Bueno (3/5)";
      case 2:
        return "Regular (2/5)";
      case 1:
        return "Malo (1/5)";
      default:
        return "Sin calificar (0/5)";
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.heading}>Registrar Libro</Text>
        <Text style={styles.subtitle}>
          Añade una nueva obra al catálogo completando los siguientes datos
        </Text>
      </View>

      {/* Tarjeta de Vista Previa en Vivo */}
      <View style={styles.previewCard}>
        <TouchableOpacity
          style={styles.previewHeader}
          onPress={() => setPreviewOpen(!previewOpen)}
          activeOpacity={0.8}
        >
          <View style={styles.previewTitleRow}>
            <Ionicons name="eye-outline" size={18} color={Theme.primary} />
            <Text style={styles.previewTitle}>Vista previa en vivo</Text>
          </View>
          <Ionicons
            name={previewOpen ? "chevron-up" : "chevron-down"}
            size={18}
            color={Theme.textSecondary}
          />
        </TouchableOpacity>

        {previewOpen && (
          <View style={styles.previewContent}>
            <View style={styles.previewCoverWrapper}>
              {portada.trim() ? (
                <Image
                  source={{ uri: portada.trim() }}
                  style={styles.previewCover}
                  contentFit="cover"
                />
              ) : (
                <View style={styles.previewFallbackCover}>
                  <Ionicons name="book" size={30} color={Theme.primary} />
                  <Text style={styles.previewFallbackText}>Sin portada</Text>
                </View>
              )}
            </View>

            <View style={styles.previewDetails}>
              <Text style={styles.previewBookTitle} numberOfLines={2}>
                {titulo.trim() || "Título del libro"}
              </Text>
              <Text style={styles.previewAuthor} numberOfLines={1}>
                {autor.trim() || "Nombre del autor"}
              </Text>
              <Text style={styles.previewGenre}>
                {genero.trim() || "Género"} · {anio.trim() || "Año"}
              </Text>

              <View style={styles.previewBadgeRow}>
                <View
                  style={[
                    styles.previewBadge,
                    estado === 1
                      ? styles.previewBadgeAvailable
                      : styles.previewBadgeUnavailable,
                  ]}
                >
                  <Text
                    style={[
                      styles.previewBadgeText,
                      {
                        color:
                          estado === 1 ? Theme.accentDark : Theme.dangerDark,
                      },
                    ]}
                  >
                    {estado === 1 ? "Disponible" : "Prestado"}
                  </Text>
                </View>

                {calificacion > 0 && (
                  <View style={styles.previewRating}>
                    <Ionicons name="star" size={13} color={Theme.warning} />
                    <Text style={styles.previewRatingText}>
                      {calificacion}/5
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        )}
      </View>

      {/* Formulario Principal */}
      <View style={styles.formCard}>
        <CustomInput
          label="Título"
          iconName="book-outline"
          placeholder="Ej. Cien años de soledad"
          value={titulo}
          onChangeText={setTitulo}
          required
        />

        <CustomInput
          label="Autor"
          iconName="person-outline"
          placeholder="Ej. Gabriel García Márquez"
          value={autor}
          onChangeText={setAutor}
          required
        />

        <CustomInput
          label="Género literario"
          iconName="pricetag-outline"
          placeholder="Ej. Realismo Mágico, Ficción, Novela"
          value={genero}
          onChangeText={setGenero}
          required
        />

        <CustomInput
          label="Año de publicación"
          iconName="calendar-outline"
          placeholder="Ej. 1967"
          value={anio}
          onChangeText={setAnio}
          keyboardType="numeric"
          maxLength={4}
          required
        />

        <CustomInput
          label="URL de la portada"
          iconName="image-outline"
          placeholder="https://images.unsplash.com/..."
          value={portada}
          onChangeText={setPortada}
          autoCapitalize="none"
          keyboardType="url"
          required
        />

        {/* Selector Visual de Calificación */}
        <View style={styles.ratingSection}>
          <View style={styles.ratingLabelRow}>
            <Text style={styles.ratingSectionLabel}>Calificación</Text>
            <Text style={styles.ratingValueText}>
              {getRatingLabel(calificacion)}
            </Text>
          </View>

          <View style={styles.starsPickerRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => handleStarPress(star)}
                style={styles.starTouchArea}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={star <= calificacion ? "star" : "star-outline"}
                  size={32}
                  color={star <= calificacion ? Theme.warning : Theme.textMuted}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Selector de Disponibilidad */}
        <View style={styles.statusSection}>
          <Text style={styles.statusSectionLabel}>Disponibilidad inicial</Text>
          <View style={styles.statusContainer}>
            <TouchableOpacity
              style={[
                styles.statusButton,
                estado === 1 && styles.selectedAvailable,
              ]}
              onPress={() => setEstado(1)}
              activeOpacity={0.8}
            >
              <Ionicons
                name="checkmark-circle"
                size={18}
                color={estado === 1 ? Theme.white : Theme.accent}
              />
              <Text
                style={[
                  styles.statusText,
                  estado === 1 && styles.selectedText,
                ]}
              >
                Disponible
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.statusButton,
                estado === 0 && styles.selectedUnavailable,
              ]}
              onPress={() => setEstado(0)}
              activeOpacity={0.8}
            >
              <Ionicons
                name="time"
                size={18}
                color={estado === 0 ? Theme.white : Theme.danger}
              />
              <Text
                style={[
                  styles.statusText,
                  estado === 0 && styles.selectedText,
                ]}
              >
                Prestado
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Botón de Enviar */}
        <TouchableOpacity
          style={[styles.saveButton, saving && styles.disabledButton]}
          onPress={handleCreate}
          disabled={saving}
          activeOpacity={0.85}
        >
          {saving ? (
            <ActivityIndicator color={Theme.white} />
          ) : (
            <View style={styles.buttonInner}>
              <Ionicons name="cloud-upload-outline" size={20} color={Theme.white} />
              <Text style={styles.saveButtonText}>Guardar libro</Text>
            </View>
          )}
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
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: "800",
    color: Theme.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    color: Theme.textSecondary,
    marginTop: 4,
    lineHeight: 18,
  },
  previewCard: {
    backgroundColor: Theme.cardBackground,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Theme.border,
    padding: 14,
    marginBottom: 16,
    ...Shadows.sm,
  },
  previewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  previewTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  previewTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: Theme.primary,
  },
  previewContent: {
    flexDirection: "row",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Theme.border,
  },
  previewCoverWrapper: {
    width: 65,
    height: 95,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: Theme.surfaceSubtle,
  },
  previewCover: {
    width: "100%",
    height: "100%",
  },
  previewFallbackCover: {
    width: "100%",
    height: "100%",
    backgroundColor: Theme.primaryLight,
    justifyContent: "center",
    alignItems: "center",
  },
  previewFallbackText: {
    fontSize: 9,
    color: Theme.primary,
    fontWeight: "600",
    marginTop: 3,
  },
  previewDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },
  previewBookTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: Theme.text,
  },
  previewAuthor: {
    fontSize: 13,
    color: Theme.textSecondary,
    marginTop: 2,
  },
  previewGenre: {
    fontSize: 12,
    color: Theme.textMuted,
    marginTop: 2,
  },
  previewBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 6,
  },
  previewBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  previewBadgeAvailable: {
    backgroundColor: Theme.accentLight,
  },
  previewBadgeUnavailable: {
    backgroundColor: Theme.dangerLight,
  },
  previewBadgeText: {
    fontSize: 11,
    fontWeight: "700",
  },
  previewRating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  previewRatingText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#B45309",
  },
  formCard: {
    backgroundColor: Theme.cardBackground,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: Theme.border,
    ...Shadows.sm,
  },
  ratingSection: {
    marginBottom: 18,
  },
  ratingLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  ratingSectionLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: Theme.text,
  },
  ratingValueText: {
    fontSize: 12,
    fontWeight: "600",
    color: Theme.primary,
  },
  starsPickerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: Theme.surfaceSubtle,
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  starTouchArea: {
    padding: 6,
  },
  statusSection: {
    marginBottom: 22,
  },
  statusSectionLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: Theme.text,
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: "row",
    gap: 12,
  },
  statusButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Theme.border,
    backgroundColor: Theme.surfaceSubtle,
  },
  selectedAvailable: {
    backgroundColor: Theme.accent,
    borderColor: Theme.accent,
  },
  selectedUnavailable: {
    backgroundColor: Theme.danger,
    borderColor: Theme.danger,
  },
  statusText: {
    fontWeight: "700",
    fontSize: 13,
    color: Theme.textSecondary,
  },
  selectedText: {
    color: Theme.white,
  },
  saveButton: {
    backgroundColor: Theme.primary,
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.md,
  },
  buttonInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  disabledButton: {
    opacity: 0.65,
  },
  saveButtonText: {
    color: Theme.white,
    fontSize: 15,
    fontWeight: "700",
  },
});
