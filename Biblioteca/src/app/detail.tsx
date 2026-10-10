import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Alert, ActivityIndicator,} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Entity } from "../types/Entity";
import {
    getBookById,
    updateBook,
    deleteBook,
} from "../services/resourceService";
import LoadingSpinner from "../components/LoadingSpinner";

export default function DetailScreen() {
    const { id } = useLocalSearchParams<{ id?: string | string[] }>();

    const bookId = Array.isArray(id) ? id[0] : id;

    const [book, setBook] = useState<Entity | null>(null);
    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState(false);

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

                console.log("ID RECIBIDO EN DETALLE:", bookId);

                const data = await getBookById(String(bookId));

                console.log("LIBRO RECIBIDO:", data);

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
        if (!book || busy) {
            return;
        }

        const nuevoEstado = Number(book.estado) === 1 ? 0 : 1;

        try {
            setBusy(true);

            const updated = await updateBook(String(book.id), {
                estado: nuevoEstado,
            });

            setBook(updated);

            Alert.alert(
                "Disponibilidad actualizada",
                nuevoEstado === 1
                    ? "El libro ahora está disponible."
                    : "El libro ahora no está disponible."
            );
        } catch (error) {
            console.log("ERROR AL ACTUALIZAR LIBRO:", error);

            Alert.alert(
                "Error",
                "No se pudo actualizar la disponibilidad del libro."
            );
        } finally {
            setBusy(false);
        }
    };

    const confirmDelete = () => {
        if (!book || busy) {
            return;
        }

        Alert.alert(
            "Eliminar libro",
            `¿Seguro que quieres eliminar "${book.titulo}"?`,
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

                            Alert.alert(
                                "Libro eliminado",
                                "El libro se eliminó correctamente.",
                                [
                                    {
                                        text: "Aceptar",
                                        onPress: () => router.back(),
                                    },
                                ]
                            );
                        } catch (error) {
                            console.log("ERROR AL ELIMINAR LIBRO:", error);

                            Alert.alert(
                                "Error",
                                "No se pudo eliminar el libro."
                            );
                        } finally {
                            setBusy(false);
                        }
                    },
                },
            ]
        );
    };

    if (loading) {
        return <LoadingSpinner message="Cargando detalle..." />;
    }

    if (!bookId || !book) {
        return (
            <View style={styles.centered}>
                <Text style={styles.emptyText}>
                    {!bookId
                        ? "No se recibió el identificador del libro."
                        : "No se pudo encontrar el libro solicitado."}
                </Text>

                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Text style={styles.backButtonText}>Volver</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const disponible = Number(book.estado) === 1;
    const rating = Number(book.calificacion ?? 0);

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
        >
            {book.portada ? (
                <Image
                    source={{ uri: String(book.portada) }}
                    style={styles.cover}
                    resizeMode="cover"
                />
            ) : (
                <View style={[styles.cover, styles.noCover]}>
                    <Text style={styles.noCoverText}>
                        Sin portada disponible
                    </Text>
                </View>
            )}

            <Text style={styles.title}>
                {String(book.titulo ?? "Sin título")}
            </Text>

            <Text style={styles.author}>
                {String(book.autor ?? "Autor desconocido")}
            </Text>

            <View
                style={[
                    styles.badge,
                    {
                        backgroundColor: disponible
                            ? "#207245"
                            : "#A12B2B",
                    },
                ]}
            >
                <Text style={styles.badgeText}>
                    {disponible ? "Disponible" : "No disponible"}
                </Text>
            </View>

            <View style={styles.infoBox}>
                <InfoRow
                    label="Género"
                    value={String(book.genero ?? "-")}
                />

                <InfoRow
                    label="Año de publicación"
                    value={String(book.year ?? "-")}
                />

                <InfoRow
                    label="Calificación"
                    value={
                        rating > 0
                            ? `${rating} / 5`
                            : "Sin calificar"
                    }
                />
            </View>

            <TouchableOpacity
                style={[
                    styles.primaryButton,
                    busy && styles.disabled,
                ]}
                onPress={toggleAvailability}
                disabled={busy}
            >
                {busy ? (
                    <ActivityIndicator color="#FFFFFF" />
                ) : (
                    <Text style={styles.primaryButtonText}>
                        {disponible
                            ? "Marcar como no disponible"
                            : "Marcar como disponible"}
                    </Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity
                style={[
                    styles.deleteButton,
                    busy && styles.disabled,
                ]}
                onPress={confirmDelete}
                disabled={busy}
            >
                <Text style={styles.deleteButtonText}>
                    Eliminar libro
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}
                disabled={busy}
            >
                <Text style={styles.backButtonText}>
                    Volver a la biblioteca
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

function InfoRow({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{label}</Text>
            <Text style={styles.infoValue}>{value}</Text>
        </View>
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
        alignItems: "center",
    },
    centered: {
        flex: 1,
        backgroundColor: "#EEF7FF",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    emptyText: {
        color: "#4D869C",
        fontSize: 16,
        textAlign: "center",
        marginBottom: 16,
    },
    cover: {
        width: 180,
        height: 260,
        borderRadius: 12,
        backgroundColor: "#CDE8E5",
        marginBottom: 18,
    },
    noCover: {
        justifyContent: "center",
        alignItems: "center",
        padding: 15,
    },
    noCoverText: {
        color: "#4D869C",
        textAlign: "center",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#1C1C1C",
        textAlign: "center",
    },
    author: {
        fontSize: 16,
        color: "#4D869C",
        marginTop: 4,
        marginBottom: 12,
        textAlign: "center",
    },
    badge: {
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 20,
        marginBottom: 20,
    },
    badgeText: {
        color: "#FFFFFF",
        fontWeight: "600",
    },
    infoBox: {
        width: "100%",
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#CDE8E5",
        borderRadius: 12,
        padding: 14,
        marginBottom: 22,
    },
    infoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 8,
    },
    infoLabel: {
        color: "#666666",
        fontWeight: "600",
    },
    infoValue: {
        color: "#1C1C1C",
        flexShrink: 1,
        textAlign: "right",
        marginLeft: 12,
    },
    primaryButton: {
        width: "100%",
        backgroundColor: "#4D869C",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 12,
        minHeight: 52,
    },
    primaryButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
    },
    deleteButton: {
        width: "100%",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#A12B2B",
        backgroundColor: "#FFFFFF",
        marginBottom: 12,
    },
    deleteButtonText: {
        color: "#A12B2B",
        fontSize: 16,
        fontWeight: "bold",
    },
    backButton: {
        backgroundColor: "#4D869C",
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: "center",
    },
    backButtonText: {
        color: "#FFFFFF",
        fontWeight: "bold",
    },
    disabled: {
        opacity: 0.6,
    },
});