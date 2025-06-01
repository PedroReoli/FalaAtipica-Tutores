import type { NativeStackScreenProps } from "@react-navigation/native-stack"

export type RootStackParamList = {
  Welcome: undefined
  Login: undefined
  ResetPassword: undefined
  AccessInfo: undefined
  RequestAccessInfo: undefined
  MainTabs: undefined
  ChildDetails: { childId: string }
  GameProgress: { gameId: string; gameName: string }
  Achievements: { childId: string; childName: string }
  Settings: undefined
  EditProfile: undefined
  EditChildProfile: { childId: string }
  AddChild: undefined
  Images: { childId: string }
  CategoryDetail: { categoryId: string; categoryName: string }
  AddCategoryItem: { categoryId: string; categoryName: string }
  Progress: undefined
  Support: undefined
  Tips: undefined
  Resources: undefined
}

export type RootStackScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<RootStackParamList, T>
