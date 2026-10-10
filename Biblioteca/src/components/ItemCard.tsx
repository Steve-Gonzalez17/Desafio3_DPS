import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Entity } from "../types/Entity";

interface ItemCardProps {
    item: Entity;
    onPress: () => void;
}

export default function ItemCard({
    item,
    onPress,
}: ItemCardProps) {
    const disponible = item.estado === 1;

    return (    
        <TouchableOpacity
            style={styles.card}
            onPress={onPress}
            activeOpacity={0.8}
        >
            <Image
                source={{ uri: item.portada }}
                style={styles.cover}
                resizeMode="cover"
            />

            <View style={styles.info}>
                <Text style={styles.title} numberOfLines={2}>
                    {item.titulo}
                </Text>

                <Text style={styles.author} numberOfLines={1}>
                    {item.autor}
                </Text>

                <Text style={styles.genre}>
                    {item.genero} · {item.year}
                </Text>

                <View
                    style={[
                        styles.badge,
                        disponible ? styles.available : styles.unavailable,
                    ]}
                >
                    <Text
                        style={[
                            styles.badgeText,
                            disponible
                                ? styles.availableText
                                : styles.unavailableText,
                        ]}
                    >
                        {disponible ? "Disponible" : "No disponible"}
                    </Text>
                </View>

                <Text style={styles.rating}>
                    {item.calificacion > 0
                        ? `⭐ ${item.calificacion}/5`
                        : "Sin calificación"}
                </Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        padding: 12,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: "#CDE8E5",
        elevation: 2,
    },
    cover: {
        width: 95,
        height: 135,
        borderRadius: 8,
        backgroundColor: "#EEF7FF",
    },
    info: {
        flex: 1,
        marginLeft: 14,
        justifyContent: "center",
    },
    title: {
        fontSize: 17,
        fontWeight: "bold",
        color: "#1C1C1C",
    },
    author: {
        fontSize: 14,
        color: "#4D869C",
        marginTop: 5,
    },
    genre: {
        fontSize: 13,
        color: "#555555",
        marginTop: 5,
    },
    badge: {
        alignSelf: "flex-start",
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginTop: 9,
    },
    available: {
        backgroundColor: "#DDF5E5",
    },
    unavailable: {
        backgroundColor: "#FBE4E4",
    },
    badgeText: {
        fontSize: 12,
        fontWeight: "bold",
    },
    availableText: {
        color: "#207245",
    },
    unavailableText: {
        color: "#A12B2B",
    },
    rating: {
        fontSize: 13,
        marginTop: 7,
        color: "#555555",
    },
});
