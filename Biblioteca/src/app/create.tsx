import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import CustomInput from "../components/CustomInput";
import { createBook } from "../services/resourceService";
import { CreateEntity } from "../types/Entity";

export default function CreateScreen() {
    const [titulo, setTitulo] = useState("");
    const [autor, setAutor] = useState("");
    const [genero, setGenero] = useState("");
    const [anio, setAnio] = useState("");
    const [portada, setPortada] = useState("");
    const [calificacion, setCalificacion] = useState("");
    const [estado, setEstado] = useState<0 | 1>(1);
    const [saving, setSaving] = useState(false);

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
                "Completa todos los campos obligatorios."
            );
            return;
        }

        const year = Number(anio);
        const rating = calificacion.trim() === ""
            ? 0
            : Number(calificacion);

        if (
            !Number.isInteger(year) ||
            year < 1 ||
            year > new Date().getFullYear()
        ) {
            Alert.alert(
                "Año inválido",
                "Ingresa un año válido."
            );
            return;
        }

        if (
            !Number.isInteger(rating) ||
            rating < 0 ||
            rating > 5
        ) {
            Alert.alert(
                "Calificación inválida",
                "Usa un número del 0 al 5."
            );
            return;
        }

        if (!/^https:\/\//i.test(portada.trim())) {
            Alert.alert(
                "Portada inválida",
                "La URL debe comenzar con https://."
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
            calificacion: rating,
        };

        try {
            setSaving(true);

            await createBook(newBook);

            // Limpiar todos los campos después de guardar
            setTitulo("");
            setAutor("");
            setGenero("");
            setAnio("");
            setPortada("");
            setCalificacion("");

            // Restablecer la disponibilidad predeterminada
            setEstado(1);

            Alert.alert(
                "Éxito",
                "El libro se registró correctamente."
            );
        } catch (error) {
            console.error("ERROR AL REGISTRAR LIBRO:", error);

            Alert.alert(
                "Error",
                "No se pudo registrar el libro."
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
        >
            <Text style={styles.heading}>
                Registrar libro
            </Text>

            <Text style={styles.subtitle}>
                Ingresa la información del nuevo libro.
            </Text>

            <CustomInput
                label="Título"
                placeholder="Ej. El principito"
                value={titulo}
                onChangeText={setTitulo}
            />

            <CustomInput
                label="Autor"
                placeholder="Nombre del autor"
                value={autor}
                onChangeText={setAutor}
            />

            <CustomInput
                label="Género"
                placeholder="Ej. Fábula"
                value={genero}
                onChangeText={setGenero}
            />

            <CustomInput
                label="Año de publicación"
                placeholder="Ej. 1943"
                value={anio}
                onChangeText={setAnio}
                keyboardType="numeric"
            />

            <CustomInput
                label="URL de la portada"
                placeholder="https://..."
                value={portada}
                onChangeText={setPortada}
                autoCapitalize="none"
                keyboardType="url"
            />

            <CustomInput
                label="Calificación (0 a 5; 0 = sin calificar)"
                placeholder="0"
                value={calificacion}
                onChangeText={setCalificacion}
                keyboardType="numeric"
            />

            <Text style={styles.label}>
                Disponibilidad
            </Text>

            <View style={styles.statusContainer}>
                <TouchableOpacity
                    style={[
                        styles.statusButton,
                        estado === 1 && styles.selectedAvailable,
                    ]}
                    onPress={() => setEstado(1)}
                >
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
                >
                    <Text
                        style={[
                            styles.statusText,
                            estado === 0 && styles.selectedText,
                        ]}
                    >
                        No disponible
                    </Text>
                </TouchableOpacity>
            </View>
            

            <TouchableOpacity
                style={[
                    styles.saveButton,
                    saving && styles.disabledButton,
                ]}
                onPress={handleCreate}
                disabled={saving}
            >
                <Text style={styles.saveButtonText}>
                    {saving ? "Registrando..." : "Guardar libro"}
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#EEF7FF",
    },
    content: {
        padding: 18,
        paddingBottom: 35,
    },
    heading: {
        fontSize: 25,
        fontWeight: "bold",
        color: "#1C1C1C",
    },
    subtitle: {
        color: "#4D869C",
        marginTop: 5,
        marginBottom: 20,
    },
    label: {
        fontSize: 15,
        fontWeight: "600",
        color: "#1C1C1C",
        marginBottom: 8,
    },
    statusContainer: {
        flexDirection: "row",
        gap: 10,
        marginBottom: 22,
    },
    statusButton: {
        flex: 1,
        alignItems: "center",
        padding: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#CDE8E5",
        backgroundColor: "#FFFFFF",
    },
    selectedAvailable: {
        backgroundColor: "#207245",
        borderColor: "#207245",
    },
    selectedUnavailable: {
        backgroundColor: "#A12B2B",
        borderColor: "#A12B2B",
    },
    statusText: {
        fontWeight: "600",
        color: "#333333",
    },
    selectedText: {
        color: "#FFFFFF",
    },
    saveButton: {
        backgroundColor: "#4D869C",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
    },
    disabledButton: {
        opacity: 0.6,
    },
    saveButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
    },
});
