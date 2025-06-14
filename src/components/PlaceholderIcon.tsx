import React from 'react';
import { View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../styles/variables';

export const PlaceholderIcon = ({ size = 64, color = COLORS.grayDark }) => (
  <View style={{ alignItems: 'center', justifyContent: 'center' }}>
    <MaterialIcons name="person" size={size} color={color} />
  </View>
); 