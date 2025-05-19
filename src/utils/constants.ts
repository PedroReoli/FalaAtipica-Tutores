// Configurações gerais do aplicativo
export const APP_NAME = "FalaAtipica"
export const APP_VERSION = "1.0.0"

// Configurações de upload de imagens
export const allowsEditing = true
export const imageQuality = 0.7
export const maxImageSize = 5 * 1024 * 1024 // 5MB

// Configurações de categorias
export const DEFAULT_CATEGORIES = [
  "Alimentos",
  "Animais",
  "Brinquedos",
  "Família",
  "Lugares",
  "Ações",
  "Sentimentos",
  "Objetos",
]

// Configurações de progresso
export const PROGRESS_LEVELS = ["Iniciante", "Intermediário", "Avançado"]
export const POINTS_PER_LEVEL = 100

// Configurações de notificações
export const NOTIFICATION_TYPES = {
  ACHIEVEMENT: "achievement",
  REMINDER: "reminder",
  UPDATE: "update",
  TIP: "tip",
}

// Configurações de tempo
export const DEBOUNCE_TIME = 500 // ms
export const AUTO_SAVE_INTERVAL = 30000 // 30s

// Configurações de armazenamento
export const STORAGE_KEYS = {
  USER_DATA: "userData",
  CHILDREN: "children",
  SETTINGS: "settings",
  FAVORITES: "favorites",
  CATEGORIES: "categories",
  NOTIFICATIONS: "notifications",
}
