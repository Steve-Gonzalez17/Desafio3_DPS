import React from "react";
import { ActivityIndicator, StyleSheet, Text,  View} from "react-native";

interface LoadingSpinnerProps {
    message?: string;
}

export default function LoadingSpinner({
    message = "Cargando libros...",
}: LoadingSpinnerProps) {
    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color="#4D869C" />
            <Text style={styles.message}>{message}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    message: {
        marginTop: 12,
        fontSize: 16,
        color: "#4D869C",
    },
});
