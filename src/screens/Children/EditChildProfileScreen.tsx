"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
  ActivityIndicator,
} from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import type { RouteProp } from "@react-navigation/native"
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from "@/styles/variables"
import type { RootStackParamList } from "@/navigation/types"
import { Feather } from "@expo/vector-icons"
import { storageService } from "@/services/storageService"
import { ImageUploader } from "@/components/ImageUploader"

type EditChildProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "EditChildProfile">
type EditChildProfileScreenRouteProp = RouteProp<RootStackParamList, "EditChildProfile">

interface DeviceItem {
  id: string
  name: string
  diagnosis?: string
  avatar_url?: string | null
}

interface MenuOption {
  id: string
  title: string
  icon: string
  onPress: () => void
}

export const EditChildProfileScreen: React.FC = () => {
  const navigation = useNavigation<EditChildProfileScreenNavigationProp>()
  const route = useRoute<EditChildProfileScreenRouteProp>()
  const { childId } = route.params
  const [loading, setLoading] = useState(false)

  const [childData, setChildData] = useState({
    id: childId,
    name: "[NOME CRIANÇA]",
    diagnosis: "NEUROATIPICIDADE",
    avatar_url: null as string | null,
  })

  const [devices, setDevices] = useState<DeviceItem[]>([
    {
      id: "1",
      name: "Dispositivo 01",
    },
    {
      id: "2",
      name: "Dispositivo 02",
      diagnosis: "NEUROATIPICIDADE",
    },
  ])

  useEffect(() => {
    // Aqui você faria uma chamada para o Supabase para buscar os dados da criança
    // Por enquanto, vamos usar dados mockados
    // fetchChildData(childId)
  }, [childId])

  const handleUpdateChildPhoto = async (base64Image: string) => {
    setLoading(true)
    try {
      const result = await storageService.updateChildPhoto(childId, base64Image)

      if (result.error) {
        Alert.alert("Erro", result.error)
      } else if (result.url) {
        // Atualizar o estado local com a nova URL da imagem
        setChildData((prev) => ({
          ...prev,
          avatar_url: result.url,
        }))
      }
    } catch (error) {
      console.error("Erro ao atualizar foto:", error)
      Alert.alert("Erro", "Não foi possível atualizar a foto da criança")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteDevice = (deviceId: string) => {
    Alert.alert(
      "Remover Dispositivo",
      "Tem certeza que deseja remover este dispositivo?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Remover",
          style: "destructive",
          onPress: () => {
            setDevices(devices.filter((device) => device.id !== deviceId))
          },
        },
      ],
      { cancelable: true },
    )
  }

  const generalOptions: MenuOption[] = [
    {
      id: "request_deletion",
      title: "Solicitar Exclusão",
      icon: "trash-2",
      onPress: () =>
        Alert.alert(
          "Solicitar Exclusão",
          "Tem certeza que deseja solicitar a exclusão deste perfil?",
          [
            {
              text: "Cancelar",
              style: "cancel",
            },
            {
              text: "Confirmar",
              style: "destructive",
              onPress: () => {
                // Implementar lógica de exclusão
                Alert.alert("Solicitação enviada", "Sua solicitação foi enviada para análise.")
              },
            },
          ],
          { cancelable: true },
        ),
    },
  ]

  const renderMenuOption = (option: MenuOption) => (
    <TouchableOpacity key={option.id} style={styles.menuOption} onPress={option.onPress}>
      <View style={styles.menuOptionContent}>
        <Feather name={option.icon as any} size={20} color={COLORS.backgroundDark} style={styles.menuOptionIcon} />
        <Text style={styles.menuOptionText}>{option.title}</Text>
      </View>
      <Feather name="chevron-right" size={20} color={COLORS.gray} />
    </TouchableOpacity>
  )

  const renderDeviceItem = (device: DeviceItem) => (
    <View key={device.id} style={styles.deviceItem}>
      <View style={styles.deviceInfo}>
        <Image
          source={device.avatar_url ? { uri: device.avatar_url } : require("@assets/images/child-placeholder.svg")}
          style={styles.deviceAvatar}
        />
        <View style={styles.deviceTextInfo}>
          <Text style={styles.deviceName}>{device.name}</Text>
          {device.diagnosis && <Text style={styles.deviceDiagnosis}>{device.diagnosis}</Text>}
        </View>
      </View>
      <TouchableOpacity onPress={() => handleDeleteDevice(device.id)}>
        <Feather name="trash-2" size={24} color={COLORS.gray} />
      </TouchableOpacity>
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
        <Text style={styles.headerTitle}>Perfil da Criança</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        {/* Child Profile Info */}
        <View style={styles.profileSection}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.blue} />
            </View>
          ) : (
            <ImageUploader
              imageUrl={childData.avatar_url}
              onImageSelected={handleUpdateChildPhoto}
              size={80}
              showOptions={true}
            />
          )}
          <Text style={styles.profileName}>{childData.name}</Text>
          <Text style={styles.profileDiagnosis}>{childData.diagnosis}</Text>
        </View>

        {/* General Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Configurações Gerais</Text>
          <View style={styles.menuContainer}>{generalOptions.map(renderMenuOption)}</View>
        </View>

        {/* Connected Devices */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dispositivos Conectados</Text>
          <View style={styles.devicesContainer}>{devices.map(renderDeviceItem)}</View>
        </View>
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
  headerRight: {
    width: 24, // Para manter o título centralizado
  },
  content: {
    flex: 1,
  },
  profileSection: {
    alignItems: "center",
    paddingVertical: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayLight,
  },
  loadingContainer: {
    height: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  profileName: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "bold",
    color: COLORS.backgroundDark,
    marginTop: SPACING.md,
    marginBottom: SPACING.xs,
  },
  profileDiagnosis: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.gray,
  },
  section: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayLight,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.gray,
    marginBottom: SPACING.md,
  },
  menuContainer: {
    backgroundColor: COLORS.backgroundLight,
    borderRadius: BORDER_RADIUS.md,
    overflow: "hidden",
  },
  menuOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayLight,
  },
  menuOptionContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuOptionIcon: {
    marginRight: SPACING.md,
  },
  menuOptionText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.backgroundDark,
  },
  devicesContainer: {
    backgroundColor: COLORS.backgroundLight,
    borderRadius: BORDER_RADIUS.md,
    overflow: "hidden",
  },
  deviceItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayLight,
  },
  deviceInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  deviceAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: SPACING.md,
  },
  deviceTextInfo: {
    flex: 1,
  },
  deviceName: {
    fontSize: FONT_SIZE.md,
    fontWeight: "500",
    color: COLORS.backgroundDark,
  },
  deviceDiagnosis: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.gray,
  },
})
