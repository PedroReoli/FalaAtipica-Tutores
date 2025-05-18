import type React from "react"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { COLORS } from "@/styles/variables"
import type { MainTabParamList } from "./types"
import { HomeScreen, SearchScreen, FavoritesScreen, NotificationsScreen, ProfileScreen } from "@/screens"
import { Feather } from "@expo/vector-icons"
import { NotificationIcon } from "@/components/NotificationIcon"

const Tab = createBottomTabNavigator<MainTabParamList>()

export const MainTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.backgroundDark,
          borderTopColor: "rgba(255, 255, 255, 0.1)",
        },
        tabBarActiveTintColor: COLORS.blue,
        tabBarInactiveTintColor: "rgba(255, 255, 255, 0.6)",
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: "Início",
          tabBarIcon: ({ color, size }) => <Feather name="home" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarLabel: "Buscar",
          tabBarIcon: ({ color, size }) => <Feather name="search" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          tabBarLabel: "Favoritos",
          tabBarIcon: ({ color, size }) => <Feather name="heart" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          tabBarLabel: "Notificações",
          tabBarIcon: ({ focused }) => <NotificationIcon color={focused ? COLORS.blue : "rgba(255, 255, 255, 0.6)"} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: "Perfil",
          tabBarIcon: ({ color, size }) => <Feather name="user" size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  )
}
