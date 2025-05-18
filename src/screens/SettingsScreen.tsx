import type React from "react"
import { View, Text } from "react-native"
import { globalStyles } from "@/styles/globals"

export const SettingsScreen: React.FC = () => {
  return (
    <View style={[globalStyles.container, globalStyles.centerContent]}>
      <Text style={globalStyles.title}>Configurações</Text>
      <Text style={globalStyles.subtitle}>Esta funcionalidade será implementada em breve.</Text>
    </View>
  )
}
