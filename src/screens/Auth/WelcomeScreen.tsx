import type React from "react"
import { View, Text, StyleSheet, SafeAreaView, Image } from "react-native"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { Button } from "@/components"
import { COLORS, SPACING } from "@/styles/variables"
import { globalStyles } from "@/styles/globals"
import type { RootStackParamList } from "@/navigation/types"

type WelcomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Welcome">

export const WelcomeScreen: React.FC = () => {
  const navigation = useNavigation<WelcomeScreenNavigationProp>()

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image source={require("@assets/images/logo.png")} style={styles.logo} resizeMode="contain" />
          <Text style={styles.title}>FalAtipica</Text>
          <Text style={styles.subtitle}>Aprender, expressar e celebrar</Text>
        </View>

        <View style={styles.buttonContainer}>
          <Button title="Entrar" onPress={() => navigation.navigate("Login")} style={styles.button} />
          <Button
            title="Solicitar Acesso"
            variant="secondary"
            onPress={() => navigation.navigate("AccessInfo")}
            style={styles.button}
          />
          <Text style={styles.link} onPress={() => navigation.navigate("AccessInfo")}>
            Entenda mais sobre "Solicitar Acesso"
          </Text>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundDark,
    padding: SPACING.lg,
    justifyContent: "space-between",
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.white,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.white,
    textAlign: "center",
  },
  buttonContainer: {
    width: "100%",
    marginBottom: SPACING.xl,
  },
  button: {
    marginBottom: SPACING.md,
  },
  link: {
    color: COLORS.white,
    textAlign: "center",
    marginTop: SPACING.sm,
    fontSize: 14,
  },
})
