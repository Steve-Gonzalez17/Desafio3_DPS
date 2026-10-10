import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View, TextInputProps } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Theme } from "../constants/theme";

interface CustomInputProps extends TextInputProps {
  label: string;
  iconName?: keyof typeof Ionicons.glyphMap;
  required?: boolean;
  error?: string;
}

export default function CustomInput({
  label,
  iconName,
  required,
  error,
  style,
  onFocus,
  onBlur,
  ...props
}: CustomInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        {required && <Text style={styles.requiredAsterisk}>*</Text>}
      </View>

      <View
        style={[
          styles.inputWrapper,
          isFocused && styles.inputFocused,
          Boolean(error) && styles.inputError,
        ]}
      >
        {iconName && (
          <Ionicons
            name={iconName}
            size={19}
            color={isFocused ? Theme.primary : Theme.textMuted}
            style={styles.inputIcon}
          />
        )}

        <TextInput
          {...props}
          style={[styles.input, style]}
          placeholderTextColor={Theme.textMuted}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
        />
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 7,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: Theme.text,
    letterSpacing: 0.1,
  },
  requiredAsterisk: {
    color: Theme.danger,
    marginLeft: 4,
    fontWeight: "700",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Theme.cardBackground,
    borderWidth: 1.5,
    borderColor: Theme.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  inputFocused: {
    borderColor: Theme.primary,
    backgroundColor: Theme.cardBackground,
    shadowColor: Theme.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 2,
  },
  inputError: {
    borderColor: Theme.danger,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 13,
    fontSize: 15,
    color: Theme.text,
  },
  errorText: {
    marginTop: 4,
    fontSize: 12,
    color: Theme.danger,
    fontWeight: "500",
  },
});