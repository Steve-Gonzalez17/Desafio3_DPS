import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Platform } from "react-native";
import { Theme } from "../constants/theme";

export default function RootLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: Theme.cardBackground,
        },
        headerTitleStyle: {
          fontWeight: "800",
          fontSize: 18,
          color: Theme.text,
        },
        headerTitleAlign: "center",
        headerShadowVisible: false,
        tabBarActiveTintColor: Theme.primary,
        tabBarInactiveTintColor: Theme.textMuted,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "700",
          marginBottom: Platform.OS === "android" ? 4 : 0,
        },
        tabBarStyle: {
          backgroundColor: Theme.cardBackground,
          borderTopColor: Theme.border,
          borderTopWidth: 1,
          height: Platform.OS === "android" ? 64 : 84,
          paddingTop: 8,
          paddingBottom: Platform.OS === "android" ? 8 : 24,
          elevation: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Biblioteca Digital",
          tabBarLabel: "Catálogo",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "library" : "library-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="create"
        options={{
          title: "Registrar Libro",
          tabBarLabel: "Nuevo",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "add-circle" : "add-circle-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="detail"
        options={{
          href: null,
          title: "Detalle del Libro",
        }}
      />
    </Tabs>
  );
}