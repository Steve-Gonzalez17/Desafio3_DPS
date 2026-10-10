import React from "react";
import { StyleSheet, Text, TextInput, View,TextInputProps } from "react-native";

interface CustomInputProps extends TextInputProps {
    label: string;
}

export default function CustomInput({
    label,
    style,
    ...props
}: CustomInputProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>

            <TextInput
                {...props}
                style={[styles.input, style]}
                placeholderTextColor="#7A8A91"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 15,
    },
    label: {
        fontSize: 15,
        fontWeight: "600",
        color: "#1C1C1C",
        marginBottom: 6,
    },
    input: {
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#CDE8E5",
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 11,
        fontSize: 15,
        color: "#1C1C1C",
    },
});