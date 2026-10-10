import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { Theme } from "../constants/theme";

interface LoadingSpinnerProps {
  message?: string;
}

export default function LoadingSpinner({
  message = "Cargando biblioteca...",
}: LoadingSpinnerProps) {
  return (
    <View style={styles.container}>
      <View style={styles.spinnerCard}>
        <ActivityIndicator size="large" color={Theme.primary} />
        <Text style={styles.message}>{message}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Theme.background,
    padding: 24,
  },
  spinnerCard: {
    backgroundColor: Theme.cardBackground,
    paddingVertical: 28,
    paddingHorizontal: 32,
    borderRadius: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Theme.border,
    shadowColor: Theme.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  message: {
    marginTop: 16,
    fontSize: 15,
    fontWeight: "600",
    color: Theme.textSecondary,
    textAlign: "center",
  },
});
