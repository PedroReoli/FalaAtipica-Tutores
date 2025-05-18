import type React from "react"
import { View, Text, StyleSheet, SafeAreaView, Image } from "react-native"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { Button } from "@/components"
import { COLORS, SPACING, BORDER_RADIUS } from "@/styles/variables"
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

        <View style={styles.borderContainer}>
          {/* Borda colorida */}
          <View style={styles.borderTop}>
            {Array.from({ length: 10 }).map((_, index) => (
              <View key={`top-${index}`} style={[styles.borderBlock, { backgroundColor: getBorderColor(index) }]} />
            ))}
          </View>
          <View style={styles.borderLeft}>
            {Array.from({ length: 10 }).map((_, index) => (
              <View
                key={`left-${index}`}
                style={[styles.borderBlock, styles.borderVertical, { backgroundColor: getBorderColor(index + 2) }]}
              />
            ))}
          </View>
          <View style={styles.borderRight}>
            {Array.from({ length: 10 }).map((_, index) => (
              <View
                key={`right-${index}`}
                style={[styles.borderBlock, styles.borderVertical, { backgroundColor: getBorderColor(index + 5) }]}
              />
            ))}
          </View>
          <View style={styles.borderBottom}>
            {Array.from({ length: 10 }).map((_, index) => (
              <View
                key={`bottom-${index}`}
                style={[styles.borderBlock, { backgroundColor: getBorderColor(index + 7) }]}
              />
            ))}
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}

// Função para alternar as cores da borda
const getBorderColor = (index: number) => {
  const colors = [
    COLORS.blue,
    COLORS.yellow,
    COLORS.red,
    COLORS.blue,
    COLORS.green,
    COLORS.yellow,
    COLORS.red,
    COLORS.blue,
  ]
  return colors[index % colors.length]
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
  borderContainer: {
    position: "absolute",
    top: "60%",
    left: SPACING.lg,
    right: SPACING.lg,
    bottom: SPACING.xl,
    borderRadius: BORDER_RADIUS.lg,
  },
  borderTop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
  },
  borderBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
  },
  borderLeft: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    flexDirection: "column",
  },
  borderRight: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    flexDirection: "column",
  },
  borderBlock: {
    width: 15,
    height: 15,
    margin: 1,
  },
  borderVertical: {
    width: 15,
    height: 15,
  },
})
