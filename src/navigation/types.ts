export type RootStackParamList = {
  Welcome: undefined
  Login: undefined
  ResetPassword: { token?: string }
  RequestAccess: undefined
  AccessInfo: undefined
  RequestAccessInfo: undefined
  MainTabs: undefined
  Home: undefined
  ChildDetails: { childId: string; childName: string }
  GameProgress: { gameId: string; gameName: string; childId: string }
  Achievements: { childId: string; childName: string }
  Settings: undefined
  Profile: undefined
  EditProfile: undefined
  EditChildProfile: { childId: string }
  AddChild: undefined
  Images: undefined
  CategoryDetail: { categoryId: string; categoryTitle: string }
  AddCategoryItem: { categoryId: string; categoryTitle: string }
  Progress: undefined
  Support: undefined
  Tips: undefined
  Search: undefined
  Favorites: undefined
  Notifications: undefined
  Resources: undefined
  Terms: undefined
  Subscription: undefined
}

export type MainTabParamList = {
  Home: undefined
  Search: undefined
  Favorites: undefined
  Notifications: undefined
  Profile: undefined
}
