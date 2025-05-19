"use client"

import type React from "react"
import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Image,
  Linking,
  Alert,
  TextInput,
  ActivityIndicator,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from "@/styles/variables"
import { Feather } from "@expo/vector-icons"
import { supabase } from "@/services/supabase"
import { useAuth } from "@/context/AuthContext"

interface ContactItem {
  id: string
  title: string
  value: string
  icon: string
  onPress: () => void
}

interface SupportButton {
  id: string
  title: string
  icon: string
  onPress: () => void
}

interface FaqItem {
  question: string
  answer: string
}

export const SupportScreen: React.FC = () => {
  const navigation = useNavigation()
  const { profile } = useAuth()
  const [feedbackMessage, setFeedbackMessage] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [showFaq, setShowFaq] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)

  const handleEmailPress = () => {
    Linking.openURL("mailto:contato@falaatipica.com?subject=Reporte de Falha - FalaAtipica")
      .then(() => console.log("Email app opened"))
      .catch(() => {
        Alert.alert("Erro", "Não foi possível abrir o aplicativo de email")
      })
  }

  const handleInstagramPress = () => {
    Linking.openURL("https://instagram.com/falaatipica")
      .then(() => console.log("Instagram opened"))
      .catch(() => {
        Alert.alert("Erro", "Não foi possível abrir o Instagram")
      })
  }

  const handleSubmitFeedback = async () => {
    if (!feedbackMessage.trim()) {
      Alert.alert("Erro", "Por favor, escreva sua mensagem antes de enviar")
      return
    }

    setSubmitting(true)
    try {
      const { error } = await supabase.from("feedback").insert([
        {
          user_id: profile?.id,
          message: feedbackMessage,
          status: "new",
        },
      ])

      if (error) throw error

      Alert.alert("Sucesso", "Seu feedback foi enviado com sucesso. Obrigado!")
      setFeedbackMessage("")
      setShowFeedback(false)
    } catch (error) {
      console.error("Erro ao enviar feedback:", error)
      Alert.alert("Erro", "Não foi possível enviar seu feedback. Tente novamente mais tarde.")
    } finally {
      setSubmitting(false)
    }
  }

  const contactItems: ContactItem[] = [
    {
      id: "email",
      title: "Contato",
      value: "contato@falaatipica.com",
      icon: "mail",
      onPress: handleEmailPress,
    },
    {
      id: "instagram",
      title: "Instagram",
      value: "@falaatipica",
      icon: "instagram",
      onPress: handleInstagramPress,
    },
  ]

  const supportButtons: SupportButton[] = [
    {
      id: "faq",
      title: "FAQ",
      icon: "help-circle",
      onPress: () => setShowFaq(true),
    },
    {
      id: "feedback",
      title: "Feedback",
      icon: "message-square",
      onPress: () => setShowFeedback(true),
    },
  ]

  const faqItems: FaqItem[] = [
    {
      question: "O que é o FalaAtipica?",
      answer:
        "O FalaAtipica é uma ferramenta de apoio à comunicação para crianças autistas não verbais, desenvolvida para potencializar interações significativas entre crianças e adultos responsáveis.",
    },
    {
      question: "O FalaAtipica substitui terapias clínicas?",
      answer:
        "Não. O FalaAtipica é um apoio educacional e comunicacional, não substituindo terapias clínicas ou tratamentos médicos.",
    },
    {
      question: "Como posso adicionar uma nova criança ao aplicativo?",
      answer: "Acesse seu perfil, role até a seção 'Crianças' e toque no botão '+' para adicionar uma nova criança.",
    },
    {
      question: "Como adicionar imagens personalizadas?",
      answer:
        "Na categoria 'Família', você pode adicionar imagens personalizadas tocando no botão '+' no canto inferior direito da tela.",
    },
    {
      question: "O aplicativo funciona offline?",
      answer:
        "Algumas funcionalidades básicas funcionam offline, mas para sincronizar dados e acessar todas as funcionalidades, é necessária conexão com a internet.",
    },
  ]

  const renderContactItem = (item: ContactItem) => (
    <View key={item.id} style={styles.contactSection}>
      <Text style={styles.contactTitle}>{item.title}</Text>
      <TouchableOpacity style={styles.contactItem} onPress={item.onPress}>
        <View style={styles.contactIconContainer}>
          <Feather name={item.icon as any} size={24} color="#FF9F43" />
        </View>
        <Text style={styles.contactValue}>{item.value}</Text>
      </TouchableOpacity>
    </View>
  )

  const renderFaqItem = (item: FaqItem, index: number) => (
    <View key={index} style={styles.faqItem}>
      <Text style={styles.faqQuestion}>{item.question}</Text>
      <Text style={styles.faqAnswer}>{item.answer}</Text>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Feather name="chevron-left" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Suporte</Text>
        <Image source={require("@assets/images/logo.svg")} style={styles.headerLogo} />
      </View>

      {/* Content */}
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Warning Message */}
        <View style={styles.warningContainer}>
          <Feather name="alert-triangle" size={20} color={COLORS.red} style={styles.warningIcon} />
          <Text style={styles.warningText}>
            Atenção: O contato deve ser utilizado apenas para reportar falhas no aplicativo.
          </Text>
        </View>

        {/* Contact Items */}
        {contactItems.map(renderContactItem)}

        {/* Support Buttons */}
        <View style={styles.supportButtonsSection}>
          <Text style={styles.sectionTitle}>Recursos de Suporte</Text>
          <View style={styles.supportButtonsContainer}>
            {supportButtons.map((button) => (
              <TouchableOpacity key={button.id} style={styles.supportButton} onPress={button.onPress}>
                <View style={styles.supportButtonIconContainer}>
                  <Feather name={button.icon as any} size={24} color="#FF9F43" />
                </View>
                <Text style={styles.supportButtonTitle}>{button.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* FAQ Section */}
        {showFaq && (
          <View style={styles.faqSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Perguntas Frequentes</Text>
              <TouchableOpacity onPress={() => setShowFaq(false)}>
                <Feather name="x" size={20} color={COLORS.gray} />
              </TouchableOpacity>
            </View>
            {faqItems.map(renderFaqItem)}
          </View>
        )}

        {/* Feedback Form */}
        {showFeedback && (
          <View style={styles.feedbackSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Enviar Feedback</Text>
              <TouchableOpacity onPress={() => setShowFeedback(false)}>
                <Feather name="x" size={20} color={COLORS.gray} />
              </TouchableOpacity>
            </View>
            <Text style={styles.feedbackInstructions}>
              Sua opinião é muito importante para nós! Compartilhe suas sugestões para melhorarmos o aplicativo.
            </Text>
            <TextInput
              style={styles.feedbackInput}
              placeholder="Escreva seu feedback aqui..."
              placeholderTextColor={COLORS.gray}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              value={feedbackMessage}
              onChangeText={setFeedbackMessage}
            />
            <TouchableOpacity
              style={[styles.feedbackButton, submitting && styles.feedbackButtonDisabled]}
              onPress={handleSubmitFeedback}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color={COLORS.white} size="small" />
              ) : (
                <Text style={styles.feedbackButtonText}>Enviar Feedback</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    backgroundColor: COLORS.blue,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  backButton: {
    padding: SPACING.xs,
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: FONT_SIZE.lg,
    fontWeight: "bold",
  },
  headerLogo: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: SPACING.md,
  },
  warningContainer: {
    backgroundColor: "rgba(229, 57, 53, 0.1)",
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    flexDirection: "row",
    alignItems: "center",
  },
  warningIcon: {
    marginRight: SPACING.sm,
  },
  warningText: {
    flex: 1,
    color: COLORS.red,
    fontSize: FONT_SIZE.sm,
  },
  contactSection: {
    marginBottom: SPACING.lg,
  },
  contactTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: "bold",
    color: COLORS.backgroundDark,
    marginBottom: SPACING.sm,
  },
  contactItem: {
    backgroundColor: "#FFF5EB",
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    flexDirection: "row",
    alignItems: "center",
  },
  contactIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 159, 67, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.md,
  },
  contactValue: {
    fontSize: FONT_SIZE.md,
    color: COLORS.backgroundDark,
  },
  supportButtonsSection: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: "bold",
    color: COLORS.backgroundDark,
    marginBottom: SPACING.sm,
  },
  supportButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  supportButton: {
    width: "48%",
    alignItems: "center",
  },
  supportButtonIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: "#FFF5EB",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  supportButtonTitle: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.backgroundDark,
    textAlign: "center",
  },
  faqSection: {
    marginTop: SPACING.lg,
    backgroundColor: COLORS.backgroundLight,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  faqItem: {
    marginBottom: SPACING.md,
    padding: SPACING.md,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
  },
  faqQuestion: {
    fontSize: FONT_SIZE.md,
    fontWeight: "bold",
    color: COLORS.backgroundDark,
    marginBottom: SPACING.xs,
  },
  faqAnswer: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.grayDark,
  },
  feedbackSection: {
    marginTop: SPACING.lg,
    backgroundColor: COLORS.backgroundLight,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
  },
  feedbackInstructions: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.grayDark,
    marginBottom: SPACING.md,
  },
  feedbackInput: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    height: 120,
    marginBottom: SPACING.md,
    color: COLORS.backgroundDark,
  },
  feedbackButton: {
    backgroundColor: COLORS.blue,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: "center",
  },
  feedbackButtonDisabled: {
    opacity: 0.7,
  },
  feedbackButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.md,
    fontWeight: "600",
  },
})
