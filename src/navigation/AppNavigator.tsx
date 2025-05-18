"use client"

import type React from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { ActivityIndicator, View } from "react-native"
import { COLORS } from "@/styles/variables"
import { useAuth } from "@/context/AuthContext"
import type { RootStackParamList } from "./types"
import {
  WelcomeScreen,
  LoginScreen,
  ResetPasswordScreen,
  AccessInfoScreen,
  RequestAccessInfoScreen,
  ChildDetailsScreen,
  GameProgressScreen,
  AchievementsScreen,
  SettingsScreen,
  EditProfileScreen,
  EditChildProfileScreen,
  AddChildScreen,
  ImagesScreen,
  ProgressScreen,
  SupportScreen,
  TipsScreen,
  ResourcesScreen,
} from "@/screens"
import { CategoryDetailScreen } from "@/screens/CategoryDetailScreen"
import { AddCategoryItemScreen } from "@/screens/AddCategoryItemScreen"
import { MainTabNavigator } from "./MainTabNavigator"

const Stack = createNativeStackNavigator<RootStackParamList>()

export const AppNavigator: React.FC = () => {
  const { session, loading } = useAuth()

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: COLORS.backgroundDark }}>
        <ActivityIndicator size="large" color={COLORS.white} />
      </View>
    )
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: COLORS.backgroundDark },
        }}
      >
        {session ? (
          <>
            <Stack.Screen name="MainTabs" component={MainTabNavigator} />
            <Stack.Screen
              name="ChildDetails"
              component={ChildDetailsScreen}
              options={({ route }) => ({
                headerShown: false,
              })}
            />
            <Stack.Screen
              name="GameProgress"
              component={GameProgressScreen}
              options={({ route }) => ({
                headerShown: true,
                title: route.params.gameName,
                headerStyle: { backgroundColor: COLORS.backgroundDark },
                headerTintColor: COLORS.white,
              })}
            />
            <Stack.Screen
              name="Achievements"
              component={AchievementsScreen}
              options={({ route }) => ({
                headerShown: true,
                title: `Conquistas de ${route.params.childName}`,
                headerStyle: { backgroundColor: COLORS.backgroundDark },
                headerTintColor: COLORS.white,
              })}
            />
            <Stack.Screen
              name="Settings"
              component={SettingsScreen}
              options={{
                headerShown: true,
                title: "Configurações",
                headerStyle: { backgroundColor: COLORS.backgroundDark },
                headerTintColor: COLORS.white,
              }}
            />
            <Stack.Screen
              name="EditProfile"
              component={EditProfileScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="EditChildProfile"
              component={EditChildProfileScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="AddChild"
              component={AddChildScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="Images"
              component={ImagesScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="CategoryDetail"
              component={CategoryDetailScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="AddCategoryItem"
              component={AddCategoryItemScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="Progress"
              component={ProgressScreen}
              options={{
                headerShown: true,
                title: "Progresso",
                headerStyle: { backgroundColor: COLORS.backgroundDark },
                headerTintColor: COLORS.white,
              }}
            />
            <Stack.Screen
              name="Support"
              component={SupportScreen}
              options={{
                headerShown: true,
                title: "Suporte",
                headerStyle: { backgroundColor: COLORS.backgroundDark },
                headerTintColor: COLORS.white,
              }}
            />
            <Stack.Screen
              name="Tips"
              component={TipsScreen}
              options={{
                headerShown: true,
                title: "Dicas",
                headerStyle: { backgroundColor: COLORS.backgroundDark },
                headerTintColor: COLORS.white,
              }}
            />
            <Stack.Screen
              name="Resources"
              component={ResourcesScreen}
              options={{
                headerShown: false,
              }}
            />
          </>
        ) : (
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
            <Stack.Screen name="AccessInfo" component={AccessInfoScreen} />
            <Stack.Screen name="RequestAccessInfo" component={RequestAccessInfoScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}
