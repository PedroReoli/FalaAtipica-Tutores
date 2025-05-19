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
import { useNavigation, useRoute } from "@react-navigation/native"
import type { NativeStackNavigationProp, RouteProp } from "@react-navigation/native-stack"
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from "@/styles/variables"
import { globalStyles } from "@/styles/globals"
import type { RootStackParamList } from "@/navigation/types"
import { useAuth } from "@/context/AuthContext"
import { Feather } from "@expo/vector-icons"

type ResetPasswordScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "ResetPassword">
type ResetPasswordScreenRouteProp = RouteProp<RootStackParamList, "ResetPassword">

export const ResetPasswordScreen: React.FC = () => {
  const navigation = useNavigation<ResetPasswordScreenNavigationProp>()
  const route = useRoute<ResetPasswordScreenRouteProp>()
  const { resetPassword, completePasswordReset } = useAuth()

  const [email, setEmail] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<"request" | "reset">(route.params?.token ? "reset" : "request")

  const handleRequestReset = async () => {
    if (!email) {
      Alert.alert("Email necessário", "Por favor, informe seu email para redefinir a senha")
      return
    }

    setLoading(true)
    try {
      const { error } = await resetPassword(email)
      if (error) {
        Alert.alert("Erro", error.message)
      } else {
        Alert.alert(
          "Email enviado",
          "Verifique seu email para redefinir sua senha. Após clicar no link, retorne a este app para definir sua nova senha.",
          [{ text: "OK" }],
        )
      }
    } catch (error) {
      Alert.alert("Erro", "Ocorreu um erro ao solicitar redefinição de senha")
    } finally {
      setLoading(false)
    }
  }

  const handleCompleteReset = async () => {
    if (!newPassword) {
      Alert.alert("Senha necessária", "Por favor, informe sua nova senha")
      return
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Senhas diferentes", "As senhas não coincidem")
      return
    }

    if (newPassword.length < 6) {
      Alert.alert("Senha fraca", "A senha deve ter pelo menos 6 caracteres")
      return
    }

    setLoading(true)
    try {
      const { error } = await completePasswordReset(newPassword)
      if (error) {
        Alert.alert("Erro", error.message)
      } else {
        Alert.alert("Senha redefinida", "Sua senha foi redefinida com sucesso", [
          { text: "OK", onPress: () => navigation.navigate("Login") },
        ])
      }
    } catch (error) {
      Alert.alert("Erro", "Ocorreu um erro ao redefinir sua senha")
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("Login")}>
            <Feather name="arrow-left" size={24} color={COLORS.white} />
            <Text style={styles.backText}>Voltar</Text>
            <Text style={styles.backSubText}>Login</Text>
          </TouchableOpacity>

          <Image source={require("@assets/images/logo.svg")} style={styles.logo} resizeMode="contain" />
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Redefinir{"\n"}Senha</Text>

          {step === "request" ? (
            <View style={styles.form}>
              <Text style={styles.inputLabel}>EMAIL</Text>
              <TextInput
                style={styles.input}
                placeholder="seu.email@exemplo.com"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />

              <TouchableOpacity style={styles.resetButton} onPress={handleRequestReset} disabled={loading}>
                {loading ? (
                  <ActivityIndicator color={COLORS.white} size="small" />
                ) : (
                  <Text style={styles.resetButtonText}>Enviar Email</Text>
                )}
              </TouchableOpacity>

              <Text style={styles.instructionText}>Enviaremos um email com instruções para redefinir sua senha.</Text>
            </View>
          ) : (
            <View style={styles.form}>
              <Text style={styles.inputLabel}>NOVA SENHA</Text>
              <TextInput
                style={styles.input}
                placeholder="••••••"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
              />

              <Text style={styles.inputLabel}>CONFIRMAR SENHA</Text>
              <TextInput
                style={styles.input}
                placeholder="••••••"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />

              <TouchableOpacity style={styles.resetButton} onPress={handleCompleteReset} disabled={loading}>
                {loading ? (
                  <ActivityIndicator color={COLORS.white} size="small" />
                ) : (
                  <Text style={styles.resetButtonText}>Redefinir Senha</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
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
    marginBottom: SPACING.xl * 2,
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
  resetButton: {
    backgroundColor: COLORS.blue,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: "center",
    justifyContent: "center",
    marginTop: SPACING.md,
  },
  resetButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.md,
    fontWeight: "600",
  },
  instructionText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.sm,
    textAlign: "center",
    marginTop: SPACING.lg,
  },
})
