#!/bin/bash

# Script para limpar arquivos .cxx corrompidos do CMake
# Isso resolve problemas de build relacionados ao react-native-gesture-handler e outros módulos nativos

echo "🧹 Limpando cache CMake (.cxx)..."

# Remove .cxx do react-native-gesture-handler
if [ -d "node_modules/react-native-gesture-handler/android/.cxx" ]; then
  rm -rf node_modules/react-native-gesture-handler/android/.cxx
  echo "  ✓ Removido: react-native-gesture-handler/.cxx"
fi

# Remove todos os .cxx do android/app
if [ -d "android/app/.cxx" ]; then
  rm -rf android/app/.cxx
  echo "  ✓ Removido: android/app/.cxx"
fi

# Remove todos os .cxx do android
if [ -d "android/.cxx" ]; then
  rm -rf android/.cxx
  echo "  ✓ Removido: android/.cxx"
fi

# Remove todos os .cxx dos node_modules (pode haver vários)
find node_modules -type d -name ".cxx" -exec rm -rf {} + 2>/dev/null
if [ $? -eq 0 ]; then
  echo "  ✓ Removidos todos os .cxx dos node_modules"
fi

echo "✅ Limpeza do cache CMake concluída!"

