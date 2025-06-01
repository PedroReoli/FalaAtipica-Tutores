export type RootStackParamList = {
  Welcome: undefined
  Login: undefined
  ResetPassword: { token?: string }
  Home: undefined
  Profile: undefined
  AddChild: undefined
  ChildDetails: { childId: string; childName: string }
  EditChildProfile: { childId: string }
  Achievements: { childId: string; childName: string }
  Progress: undefined
  GameProgress: { gameId: string; gameName: string; childId?: string }
  CategoryDetail: { categoryId: string; categoryTitle: string }
  AddCategoryItem: { categoryId: string; categoryTitle: string }
  Images: undefined
  Search: undefined
  Favorites: undefined
  Notifications: undefined
  Support: undefined
  Tips: undefined
  Resources: undefined
  Settings: undefined
  EditProfile: undefined
  AccessInfo: undefined
  RequestAccessInfo: undefined
}

export type TabParamList = {
  Home: undefined
  Progress: undefined
  Favorites: undefined
  Profile: undefined
}
