import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { Entity } from "../types/Entity";
import { Theme, Shadows } from "../constants/theme";

interface ItemCardProps {
  item: Entity;
  onPress: () => void;
}

export default function ItemCard({ item, onPress }: ItemCardProps) {
  const [imageError, setImageError] = useState(false);
  const isAvailable = Number(item.estado) === 1;
  const rating = Number(item.calificacion ?? 0);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.75}
    >
      {/* Portada del libro con fallback elegante */}
      <View style={styles.coverWrapper}>
        {item.portada && !imageError ? (
          <Image
            source={{ uri: item.portada }}
            style={styles.cover}
            contentFit="cover"
            transition={300}
            onError={() => setImageError(true)}
          />
        ) : (
          <View style={styles.fallbackCover}>
            <Ionicons name="book" size={32} color={Theme.primary} />
            <Text style={styles.fallbackText}>Libro</Text>
          </View>
        )}
      </View>

      {/* Información del libro */}
      <View style={styles.info}>
        <View style={styles.headerRow}>
          <Text style={styles.title} numberOfLines={2}>
            {item.titulo}
          </Text>
        </View>

        <View style={styles.authorRow}>
          <Ionicons name="person-outline" size={13} color={Theme.textSecondary} />
          <Text style={styles.author} numberOfLines={1}>
            {item.autor}
          </Text>
        </View>

        {/* Chips de Categoría y Año */}
        <View style={styles.tagsRow}>
          {item.genero ? (
            <View style={styles.genreTag}>
              <Text style={styles.genreTagText} numberOfLines={1}>
                {item.genero}
              </Text>
            </View>
          ) : null}

          {item.year ? (
            <View style={styles.yearTag}>
              <Ionicons name="calendar-outline" size={11} color={Theme.textSecondary} />
              <Text style={styles.yearTagText}>{item.year}</Text>
            </View>
          ) : null}
        </View>

        {/* Fila Inferior: Estado y Calificación */}
        <View style={styles.bottomRow}>
          {/* Badge de Disponibilidad */}
          <View
            style={[
              styles.badge,
              isAvailable ? styles.availableBadge : styles.unavailableBadge,
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
                styles.badgeText,
                isAvailable ? styles.availableText : styles.unavailableText,
              ]}
            >
              {isAvailable ? "Disponible" : "Prestado"}
            </Text>
          </View>

          {/* Calificación con estrellas */}
          <View style={styles.ratingContainer}>
            {rating > 0 ? (
              <View style={styles.ratingContent}>
                <Ionicons name="star" size={14} color={Theme.warning} />
                <Text style={styles.ratingNumber}>{rating}</Text>
                <Text style={styles.ratingTotal}>/5</Text>
              </View>
            ) : (
              <Text style={styles.unratedText}>Sin calif.</Text>
            )}
          </View>
        </View>
      </View>

      {/* Flecha indicadora */}
      <View style={styles.actionArrow}>
        <Ionicons name="chevron-forward" size={18} color={Theme.textMuted} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: Theme.cardBackground,
    borderRadius: 18,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Theme.border,
    alignItems: "center",
    ...Shadows.sm,
  },
  coverWrapper: {
    width: 86,
    height: 124,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: Theme.surfaceSubtle,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
    padding: 8,
  },
  fallbackText: {
    fontSize: 10,
    fontWeight: "700",
    color: Theme.primary,
    marginTop: 4,
  },
  info: {
    flex: 1,
    marginLeft: 14,
    justifyContent: "center",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: Theme.text,
    lineHeight: 22,
    flexShrink: 1,
  },
  authorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 3,
  },
  author: {
    fontSize: 13,
    fontWeight: "500",
    color: Theme.textSecondary,
    flexShrink: 1,
  },
  tagsRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 8,
  },
  genreTag: {
    backgroundColor: Theme.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  genreTagText: {
    fontSize: 11,
    fontWeight: "600",
    color: Theme.primary,
  },
  yearTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: Theme.surfaceSubtle,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
  },
  yearTagText: {
    fontSize: 11,
    fontWeight: "600",
    color: Theme.textSecondary,
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },
  availableBadge: {
    backgroundColor: Theme.accentLight,
  },
  unavailableBadge: {
    backgroundColor: Theme.dangerLight,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
  },
  availableText: {
    color: Theme.accentDark,
  },
  unavailableText: {
    color: Theme.dangerDark,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingContent: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Theme.warningLight,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 12,
    gap: 3,
  },
  ratingNumber: {
    fontSize: 11,
    fontWeight: "700",
    color: "#B45309",
  },
  ratingTotal: {
    fontSize: 10,
    color: "#D97706",
  },
  unratedText: {
    fontSize: 11,
    color: Theme.textMuted,
    fontStyle: "italic",
  },
  actionArrow: {
    marginLeft: 6,
    paddingRight: 2,
  },
});
