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
  ScrollView,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from "@/styles/variables"
import { globalStyles } from "@/styles/globals"
import type { RootStackParamList } from "@/navigation/types"
import { supabaseService } from "@/services/supabase"
import { Feather } from "@expo/vector-icons"

type RequestAccessInfoScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "RequestAccessInfo">

export const RequestAccessInfoScreen: React.FC = () => {
  const navigation = useNavigation<RequestAccessInfoScreenNavigationProp>()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [reason, setReason] = useState("")
  const [loading, setLoading] = useState(false)

  const handleRequestAccess = async () => {
    if (!name.trim() || !email.trim() || !reason.trim()) {
      Alert.alert("Campos obrigatórios", "Por favor, preencha todos os campos")
      return
    }

    setLoading(true)
    try {
      await supabaseService.createAccessRequest(email, name, reason)
      Alert.alert(
        "Solicitação enviada",
        "Sua solicitação de acesso foi enviada com sucesso. Entraremos em contato em breve.",
        [{ text: "OK", onPress: () => navigation.navigate("Welcome") }],
      )
    } catch (error) {
      console.error("Erro ao solicitar acesso:", error)
      Alert.alert("Erro", "Ocorreu um erro ao enviar sua solicitação. Tente novamente mais tarde.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("AccessInfo")}>
            <Feather name="arrow-left" size={24} color={COLORS.white} />
            <Text style={styles.backText}>Voltar</Text>
            <Text style={styles.backSubText}>Info</Text>
          </TouchableOpacity>

          <Image source={require("@assets/images/logo.png")} style={styles.logo} resizeMode="contain" />
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Solicite seu Acesso ao FalaAtipica</Text>

          <Text style={styles.infoText}>
            Sabemos da importância e da sensibilidade envolvidas nesse processo, por isso, o acesso à área de tutores
            não é liberado automaticamente. Essa etapa garante que o aplicativo seja utilizado de forma segura,
            consciente e alinhada ao seu propósito original:
          </Text>

          <View style={styles.bulletPoints}>
            <View style={styles.bulletPoint}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>Não substituímos terapias clínicas.</Text>
            </View>
            <View style={styles.bulletPoint}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>Não somos um tratamento médico.</Text>
            </View>
            <View style={styles.bulletPoint}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>Somos um apoio educacional e comunicacional.</Text>
            </View>
          </View>

          <Text style={styles.instructionText}>
            Para solicitar acesso, preencha o formulário abaixo explicando brevemente como pretende usar o Fala Atípica.
          </Text>

          <View style={styles.form}>
            <Text style={styles.label}>Nome completo</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Seu nome completo"
              placeholderTextColor={COLORS.gray}
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="seu.email@exemplo.com"
              placeholderTextColor={COLORS.gray}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.label}>Como pretende usar o FalaAtipica?</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={reason}
              onChangeText={setReason}
              placeholder="Descreva brevemente como pretende utilizar o aplicativo..."
              placeholderTextColor={COLORS.gray}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />

            <TouchableOpacity
              style={[styles.submitButton, loading && styles.submitButtonDisabled]}
              onPress={handleRequestAccess}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={COLORS.white} size="small" />
              ) : (
                <Text style={styles.submitButtonText}>Enviar Solicitação</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundDark,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: SPACING.lg,
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
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  title: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: "bold",
    color: COLORS.white,
    textAlign: "center",
    marginBottom: SPACING.xl,
  },
  infoText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.md,
    lineHeight: 24,
    marginBottom: SPACING.lg,
  },
  bulletPoints: {
    marginBottom: SPACING.lg,
  },
  bulletPoint: {
    flexDirection: "row",
    marginBottom: SPACING.sm,
  },
  bullet: {
    color: COLORS.white,
    fontSize: FONT_SIZE.lg,
    marginRight: SPACING.sm,
    lineHeight: 24,
  },
  bulletText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.md,
    lineHeight: 24,
    flex: 1,
  },
  instructionText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.md,
    lineHeight: 24,
    marginBottom: SPACING.xl,
  },
  form: {
    width: "100%",
  },
  label: {
    color: COLORS.white,
    fontSize: FONT_SIZE.sm,
    marginBottom: SPACING.xs,
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 8,
    padding: SPACING.md,
    color: COLORS.white,
    marginBottom: SPACING.lg,
  },
  textArea: {
    height: 100,
  },
  submitButton: {
    backgroundColor: COLORS.blue,
    borderRadius: 8,
    paddingVertical: SPACING.md,
    alignItems: "center",
    justifyContent: "center",
    marginTop: SPACING.md,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.md,
    fontWeight: "600",
  },
})
