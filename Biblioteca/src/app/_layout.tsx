import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function RootLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: true,
                tabBarActiveTintColor: "#4D8799",
                tabBarInactiveTintColor: "#888888",
                tabBarStyle: {
                    backgroundColor: "#FFFFFF",
                    height: 65,
                    paddingBottom: 8,
                    paddingTop: 8,
                },
                headerTitleStyle: {
                    fontWeight: "bold",
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Biblioteca Digital",
                    tabBarLabel: "Inicio",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons
                            name="home-outline"
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="create"
                options={{
                    title: "Registrar libro",
                    tabBarLabel: "Registrar",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons
                            name="add-circle-outline"
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />

          

            <Tabs.Screen
                name="detail"
                options={{
                    href: null,
                    title: "Detalle del libro",
                }}
            />
        </Tabs>
    );
}