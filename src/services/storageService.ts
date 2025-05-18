import * as ImagePicker from "expo-image-picker"
import { supabase } from "./supabase"
import { Platform } from "react-native"
import { decode } from "base64-arraybuffer"
import * as FileSystem from "expo-file-system"

export interface ImageUploadResult {
  url: string | null
  error: string | null
}

export interface ImagePickerOptions {
  allowsEditing?: boolean
  aspect?: [number, number]
  quality?: number
  mediaTypes?: ImagePicker.MediaTypeOptions
}

export const storageService = {
  // Solicitar permissões de câmera e galeria
  async requestPermissions(): Promise<boolean> {
    if (Platform.OS !== "web") {
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync()
      const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync()

      if (cameraStatus !== "granted" || libraryStatus !== "granted") {
        console.log("Permissões não concedidas: câmera:", cameraStatus, "galeria:", libraryStatus)
        return false
      }
      return true
    }
    return true
  },

  // Validar imagem antes do upload
  validateImage(fileSize: number, fileType?: string): { valid: boolean; error?: string } {
    // Verificar tamanho do arquivo (limite de 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (fileSize > maxSize) {
      return { valid: false, error: "A imagem é muito grande. O tamanho máximo é 5MB." }
    }

    // Verificar tipo de arquivo se disponível
    if (fileType) {
      const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif"]
      if (!validTypes.includes(fileType.toLowerCase())) {
        return { valid: false, error: "Formato de imagem inválido. Use JPG, PNG ou GIF." }
      }
    }

    return { valid: true }
  },

  // Selecionar imagem da galeria
  async pickImage(options: ImagePickerOptions = {}): Promise<ImagePicker.ImagePickerResult> {
    await this.requestPermissions()

    const defaultOptions = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
      base64: true,
    }

    return await ImagePicker.launchImageLibraryAsync({
      ...defaultOptions,
      ...options,
    })
  },

  // Tirar foto com a câmera
  async takePhoto(options: ImagePickerOptions = {}): Promise<ImagePicker.ImagePickerResult> {
    await this.requestPermissions()

    const defaultOptions = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
      base64: true,
    }

    return await ImagePicker.launchCameraAsync({
      ...defaultOptions,
      ...options,
    })
  },

  // Comprimir imagem se necessário
  async compressImageIfNeeded(uri: string, quality = 0.7): Promise<string> {
    try {
      // Verificar tamanho do arquivo
      const fileInfo = await FileSystem.getInfoAsync(uri)

      // Se o arquivo for maior que 1MB, comprimir
      if (fileInfo.size && fileInfo.size > 1024 * 1024) {
        const compressedUri = await FileSystem.manipulateAsync(
          uri,
          [], // sem operações de manipulação
          { compress: quality, format: FileSystem.SaveFormat.JPEG },
        )
        return compressedUri.uri
      }

      return uri
    } catch (error) {
      console.error("Erro ao comprimir imagem:", error)
      return uri // retorna a URI original em caso de erro
    }
  },

  // Upload de imagem para o Supabase Storage
  async uploadImage(
    imageUri: string,
    bucket: string,
    path: string,
    fileType = "jpg",
    progressCallback?: (progress: number) => void,
  ): Promise<ImageUploadResult> {
    try {
      if (!imageUri) {
        return { url: null, error: "Imagem não fornecida" }
      }

      // Comprimir imagem se necessário
      const compressedUri = await this.compressImageIfNeeded(imageUri)

      // Obter informações do arquivo
      const fileInfo = await FileSystem.getInfoAsync(compressedUri)

      // Validar imagem
      const validation = this.validateImage(fileInfo.size || 0)
      if (!validation.valid) {
        return { url: null, error: validation.error }
      }

      // Gerar nome de arquivo único
      const fileName = `${path}_${new Date().getTime()}.${fileType}`
      const filePath = `${path}/${fileName}`

      // Ler arquivo como base64
      const base64 = await FileSystem.readAsStringAsync(compressedUri, {
        encoding: FileSystem.EncodingType.Base64,
      })

      // Converter base64 para ArrayBuffer
      const arrayBuffer = decode(base64)

      // Upload para o Supabase Storage
      const { data, error } = await supabase.storage.from(bucket).upload(filePath, arrayBuffer, {
        contentType: `image/${fileType}`,
        upsert: true,
        duplex: "half",
      })

      if (error) {
        console.error("Erro no upload:", error)
        return { url: null, error: error.message }
      }

      // Obter URL pública da imagem
      const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(filePath)

      return { url: urlData.publicUrl, error: null }
    } catch (error) {
      console.error("Erro no upload:", error)
      return { url: null, error: "Falha ao fazer upload da imagem" }
    }
  },

  // Atualizar foto de perfil do usuário
  async updateProfilePhoto(userId: string, imageUri: string): Promise<ImageUploadResult> {
    const result = await this.uploadImage(imageUri, "profile_photos", `user_${userId}`)

    if (result.url) {
      // Atualizar o registro do usuário no banco de dados
      const { error } = await supabase.from("profiles").update({ avatar_url: result.url }).eq("id", userId)

      if (error) {
        return { url: null, error: "Falha ao atualizar perfil" }
      }
    }

    return result
  },

  // Atualizar foto de perfil da criança
  async updateChildPhoto(childId: string, imageUri: string): Promise<ImageUploadResult> {
    const result = await this.uploadImage(imageUri, "profile_photos", `child_${childId}`)

    if (result.url) {
      // Atualizar o registro da criança no banco de dados
      const { error } = await supabase.from("profiles").update({ avatar_url: result.url }).eq("id", childId)

      if (error) {
        return { url: null, error: "Falha ao atualizar perfil da criança" }
      }
    }

    return result
  },

  // Upload de imagem para uma categoria
  async uploadCategoryImage(categoryId: string, itemName: string, imageUri: string): Promise<ImageUploadResult> {
    // Normalizar o nome do item para usar no caminho do arquivo
    const normalizedName = itemName.toLowerCase().replace(/\s+/g, "_")

    const result = await this.uploadImage(imageUri, "category_images", `category_${categoryId}/${normalizedName}`)

    return result
  },

  // Excluir imagem do Storage
  async deleteImage(bucket: string, path: string): Promise<{ success: boolean; error: string | null }> {
    try {
      const { error } = await supabase.storage.from(bucket).remove([path])

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, error: null }
    } catch (error) {
      console.error("Erro ao excluir imagem:", error)
      return { success: false, error: "Falha ao excluir a imagem" }
    }
  },
}
