import "src/polyfills"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { AppNavigator } from "./src/navigation/AppNavigator"
import { AuthProvider } from "./src/context/AuthContext"
import { ThemeProvider } from "./src/context/ThemeContext"

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <AppNavigator />
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  )
}
