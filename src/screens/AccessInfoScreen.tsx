import type React from "react"
import { View, Text, StyleSheet, SafeAreaView, Image, TouchableOpacity } from "react-native"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from "@/styles/variables"
import { globalStyles } from "@/styles/globals"
import type { RootStackParamList } from "@/navigation/types"
import { Feather } from "@expo/vector-icons"

type AccessInfoScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "AccessInfo">

export const AccessInfoScreen: React.FC = () => {
  const navigation = useNavigation<AccessInfoScreenNavigationProp>()

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("Welcome")}>
            <Feather name="arrow-left" size={24} color={COLORS.white} />
            <Text style={styles.backText}>Voltar</Text>
            <Text style={styles.backSubText}>Início</Text>
          </TouchableOpacity>

          <Image source={require("@assets/images/logo.png")} style={styles.logo} resizeMode="contain" />
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Solicite seu Acesso ao FalaAtipica</Text>

          <Text style={styles.subtitle}>Informativo</Text>

          <View style={styles.ceoCard}>
            <Image source={require("@assets/images/ceo.png")} style={styles.ceoImage} />
            <View style={styles.ceoInfo}>
              <Text style={styles.ceoTitle}>CEO</Text>
              <Text style={styles.ceoName}>Pedro Lucas Reis</Text>
            </View>
          </View>

          <Text style={styles.infoText}>
            O Fala Atípica é uma ferramenta criada com muito cuidado para apoiar a comunicação de crianças autistas não
            verbais.
            {"\n\n"}
            Nossa missão é potencializar interações significativas entre crianças e adultos responsáveis, respeitando os
            diferentes ritmos, repertórios e necessidades.
          </Text>
        </View>

        <TouchableOpacity style={styles.nextButton} onPress={() => navigation.navigate("RequestAccessInfo")}>
          <Feather name="chevron-right" size={30} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundDark,
    padding: SPACING.lg,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.xl,
    paddingTop: SPACING.md,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.blue,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.round,
  },
  backText: {
    color: COLORS.white,
    marginLeft: SPACING.sm,
    fontSize: FONT_SIZE.md,
    fontWeight: "bold",
  },
  backSubText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.md,
    marginLeft: SPACING.xs,
  },
  logo: {
    width: 80,
    height: 80,
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: "bold",
    color: COLORS.white,
    textAlign: "center",
    marginBottom: SPACING.xl,
  },
  subtitle: {
    fontSize: FONT_SIZE.lg,
    color: COLORS.white,
    marginBottom: SPACING.md,
  },
  ceoCard: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.xl,
  },
  ceoImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: SPACING.md,
  },
  ceoInfo: {
    flex: 1,
  },
  ceoTitle: {
    color: COLORS.white,
    fontSize: FONT_SIZE.sm,
    opacity: 0.8,
  },
  ceoName: {
    color: COLORS.white,
    fontSize: FONT_SIZE.md,
    fontWeight: "500",
  },
  infoText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.md,
    lineHeight: 24,
    textAlign: "center",
  },
  nextButton: {
    position: "absolute",
    bottom: SPACING.xl,
    right: SPACING.xl,
    backgroundColor: COLORS.blue,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
})
