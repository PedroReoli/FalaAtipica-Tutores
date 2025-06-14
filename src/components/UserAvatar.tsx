import React from 'react';
import { Image } from 'react-native';
import { PlaceholderIcon } from './PlaceholderIcon';

export const UserAvatar = ({ uri, size = 64 }) => {
  if (!uri) return <PlaceholderIcon size={size} />;
  return <Image source={{ uri }} style={{ width: size, height: size, borderRadius: size / 2 }} />;
}; 