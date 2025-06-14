import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from '../screens/HomeScreen';
import { ProgressScreen } from '../screens/ProgressScreen';
import { TipsScreen } from '../screens/TipsScreen';
import { SupportScreen } from '../screens/SupportScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { TabBarIcon } from '../components/TabBarIcon';

const Tab = createBottomTabNavigator();

export function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#1e88e5',
        tabBarInactiveTintColor: '#054776',
        tabBarStyle: { backgroundColor: '#f4f6ff', borderTopWidth: 0 },
        tabBarLabelStyle: { fontWeight: '600', fontSize: 12 },
      }}
    >
      <Tab.Screen name="Início" component={HomeScreen} options={{ tabBarIcon: ({ color, size }) => <TabBarIcon name="home" color={color} size={size} /> }} />
      <Tab.Screen name="Progresso" component={ProgressScreen} options={{ tabBarIcon: ({ color, size }) => <TabBarIcon name="bar-chart" color={color} size={size} /> }} />
      <Tab.Screen name="Dicas" component={TipsScreen} options={{ tabBarIcon: ({ color, size }) => <TabBarIcon name="lightbulb" color={color} size={size} /> }} />
      <Tab.Screen name="Suporte" component={SupportScreen} options={{ tabBarIcon: ({ color, size }) => <TabBarIcon name="support-agent" color={color} size={size} /> }} />
      <Tab.Screen name="Perfil" component={ProfileScreen} options={{ tabBarIcon: ({ color, size }) => <TabBarIcon name="person" color={color} size={size} /> }} />
    </Tab.Navigator>
  );
} 