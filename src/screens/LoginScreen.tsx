"use client"

import type React from "react"
import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from "@/styles/variables"
import { globalStyles } from "@/styles/globals"
import type { RootStackParamList } from "@/navigation/types"
import { useAuth } from "@/context/AuthContext"
import { Feather } from "@expo/vector-icons"

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Login">

export const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>()
  const { signIn } = useAuth()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erro", "Por favor, preencha todos os campos")
      return
    }

    setLoading(true)
    try {
      const { error } = await signIn(email, password)
      if (error) {
        Alert.alert("Erro ao fazer login", error.message)
      }
    } catch (error) {
      Alert.alert("Erro", "Ocorreu um erro ao fazer login")
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = () => {
    navigation.navigate("ResetPassword")
  }

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("Welcome" as never)}>
            <Feather name="arrow-left" size={24} color={COLORS.white} />
            <Text style={styles.backText}>Voltar</Text>
            <Text style={styles.backSubText}>Início</Text>
          </TouchableOpacity>

          <Image source={require("@assets/images/logo.png")} style={styles.logo} resizeMode="contain" />
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Login</Text>
          <Text style={styles.subtitle}>Coloque suas informações aqui</Text>

          <View style={styles.form}>
            <Text style={styles.inputLabel}>EMAIL</Text>
            <TextInput
              style={styles.input}
              placeholder="hello@reallygoosite.com"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <Text style={styles.inputLabel}>SENHA</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
              {loading ? (
                <ActivityIndicator color={COLORS.white} size="small" />
              ) : (
                <Text style={styles.loginButtonText}>Entrar</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={handleResetPassword}>
              <Text style={styles.forgotPassword}>
                Esqueceu a senha?{"\n"}
                Solicitar redefinição
              </Text>
            </TouchableOpacity>
          </View>
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
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.xl,
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
    width: 60,
    height: 60,
  },
  content: {
    flex: 1,
    paddingTop: SPACING.xl,
  },
  title: {
    fontSize: FONT_SIZE.xxxl,
    fontWeight: "bold",
    color: COLORS.white,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.white,
    marginBottom: SPACING.xl,
  },
  form: {
    width: "100%",
  },
  inputLabel: {
    color: COLORS.white,
    fontSize: FONT_SIZE.sm,
    marginBottom: SPACING.xs,
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    color: COLORS.white,
    marginBottom: SPACING.lg,
    fontSize: FONT_SIZE.md,
  },
  loginButton: {
    backgroundColor: COLORS.blue,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: "center",
    justifyContent: "center",
    marginTop: SPACING.md,
  },
  loginButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.md,
    fontWeight: "600",
  },
  forgotPassword: {
    color: COLORS.white,
    fontSize: FONT_SIZE.sm,
    textAlign: "center",
    marginTop: SPACING.lg,
    lineHeight: 20,
  },
})
