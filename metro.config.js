const { getDefaultConfig } = require('expo/metro-config');
const extraNodeModules = require('node-libs-react-native');

// Adicione os polyfills específicos para o problema do TLS
extraNodeModules.tls = require.resolve('react-native-tcp');
extraNodeModules.net = require.resolve('react-native-tcp');
extraNodeModules.fs = require.resolve('react-native-level-fs');
extraNodeModules.https = require.resolve('https-browserify');
extraNodeModules.http = require.resolve('@tradle/react-native-http');
extraNodeModules.stream = require.resolve('stream-browserify');
extraNodeModules.path = require.resolve('path-browserify');
extraNodeModules.zlib = require.resolve('browserify-zlib');

const defaultConfig = getDefaultConfig(__dirname);

defaultConfig.resolver.assetExts.push('svg');
defaultConfig.transformer.babelTransformerPath = require.resolve('react-native-svg-transformer');

// Adicione a configuração para resolver os módulos do Node.js
defaultConfig.resolver.extraNodeModules = extraNodeModules;

// Adicione a configuração para processar arquivos SVG
const { assetExts, sourceExts } = defaultConfig.resolver;
defaultConfig.resolver.assetExts = assetExts.filter(ext => ext !== 'svg');
defaultConfig.resolver.sourceExts = [...sourceExts, 'svg'];

module.exports = defaultConfig;
