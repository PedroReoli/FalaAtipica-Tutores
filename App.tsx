import { StatusBar } from "expo-status-bar"
import { AuthProvider } from "@/context/AuthContext"
import { AppNavigator } from "@/navigation/AppNavigator"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { ThemeProvider } from "@/context/ThemeContext"

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <StatusBar style="light" />
          <AppNavigator />
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  )
}
