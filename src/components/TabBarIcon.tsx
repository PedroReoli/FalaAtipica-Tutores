import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../styles/variables';

export const TabBarIcon = ({ name, color = COLORS.blue, size = 28 }) => (
  <MaterialIcons name={name} size={size} color={color} />
); 