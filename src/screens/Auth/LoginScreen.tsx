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
import { useAuth } from "@/context/AuthContext"
import type { RootStackParamList } from "@/navigation/types"
import { Feather } from "@expo/vector-icons"

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Login">

export const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>()
  const { signIn } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Campos obrigatórios", "Por favor, preencha todos os campos")
      return
    }

    setLoading(true)
    try {
      const { error } = await signIn(email.trim(), password.trim())
      if (error) {
        Alert.alert("Erro de login", "Email ou senha incorretos. Verifique suas credenciais e tente novamente.")
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error)
      Alert.alert("Erro", "Ocorreu um erro inesperado. Tente novamente mais tarde.")
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = () => {
    navigation.navigate("ResetPassword")
  }

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={20} color={COLORS.white} />
            <Text style={styles.backText}>Voltar</Text>
          </TouchableOpacity>

          <Image source={require("@assets/images/logo.png")} style={styles.logo} resizeMode="contain" />
        </View>

        <View style={styles.content}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Login</Text>
            <Text style={styles.subtitle}>Acesse sua conta</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>EMAIL</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Digite seu email"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>SENHA</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Digite sua senha"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity style={styles.eyeButton} onPress={() => setShowPassword(!showPassword)}>
                  <Feather name={showPassword ? "eye-off" : "eye"} size={20} color="rgba(255, 255, 255, 0.7)" />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.loginButton, loading && styles.loginButtonDisabled]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={COLORS.white} size="small" />
              ) : (
                <Text style={styles.loginButtonText}>Entrar</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.forgotPasswordButton} onPress={handleForgotPassword}>
              <Text style={styles.forgotPasswordText}>Esqueceu sua senha?</Text>
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
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.xxl,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.blue,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.round,
  },
  backText: {
    color: COLORS.white,
    marginLeft: SPACING.xs,
    fontSize: FONT_SIZE.sm,
    fontWeight: "600" as const,
  },
  logo: {
    width: 50,
    height: 50,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingBottom: SPACING.xxl * 2,
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: SPACING.xxl,
  },
  title: {
    fontSize: FONT_SIZE.xxxl,
    fontWeight: "bold" as const,
    color: COLORS.white,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.gray,
  },
  form: {
    width: "100%",
  },
  inputContainer: {
    marginBottom: SPACING.lg,
  },
  inputLabel: {
    color: COLORS.white,
    fontSize: FONT_SIZE.xs,
    marginBottom: SPACING.xs,
    fontWeight: "600" as const,
    letterSpacing: 1,
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    color: COLORS.white,
    fontSize: FONT_SIZE.md,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  passwordContainer: {
    position: "relative",
  },
  passwordInput: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    paddingRight: 50, // Espaço para o ícone
    color: COLORS.white,
    fontSize: FONT_SIZE.md,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  eyeButton: {
    position: "absolute",
    right: SPACING.md,
    top: "50%",
    transform: [{ translateY: -10 }],
    padding: SPACING.xs,
  },
  loginButton: {
    backgroundColor: COLORS.blue,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.lg,
    alignItems: "center",
    justifyContent: "center",
    marginTop: SPACING.xl,
    shadowColor: COLORS.blue,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.md,
    fontWeight: "bold" as const,
  },
  forgotPasswordButton: {
    alignSelf: "center",
    marginTop: SPACING.xl,
    paddingVertical: SPACING.md,
  },
  forgotPasswordText: {
    color: COLORS.blue,
    fontSize: FONT_SIZE.sm,
    textDecorationLine: "underline",
  },
})
