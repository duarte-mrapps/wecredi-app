#!/bin/bash

# Script para adicionar padding de 15% aos ícones do Android
# Isso evita que os ícones fiquem muito próximos das bordas quando o sistema aplica máscaras

echo "🔧 Ajustando ícones do Android com padding de 15%..."

ANDROID_RES_DIR="./android/app/src/main/res"
PADDING_PERCENT="15%"

# Verifica se o diretório existe
if [ ! -d "$ANDROID_RES_DIR" ]; then
  echo "❌ Erro: Diretório $ANDROID_RES_DIR não encontrado!"
  exit 1
fi

# Cria o diretório drawable se não existir
mkdir -p "$ANDROID_RES_DIR/drawable"

# Cria o arquivo XML com inset de 15% para o foreground
ICON_FOREGROUND_PADDED="$ANDROID_RES_DIR/drawable/ic_launcher_foreground_padded.xml"

cat > "$ICON_FOREGROUND_PADDED" << 'EOF'
<?xml version="1.0" encoding="utf-8"?>
<inset xmlns:android="http://schemas.android.com/apk/res/android"
    android:drawable="@mipmap/ic_launcher_foreground"
    android:inset="15%"/>
EOF

echo "  ✓ Criado: drawable/ic_launcher_foreground_padded.xml"

# Remove arquivos .bak antigos se existirem (para evitar erros do Gradle)
find "$ANDROID_RES_DIR" -name "*.bak" -type f -delete 2>/dev/null

# Atualiza ic_launcher.xml para usar o foreground com padding
ICON_LAUNCHER="$ANDROID_RES_DIR/mipmap-anydpi-v26/ic_launcher.xml"

if [ -f "$ICON_LAUNCHER" ]; then
  # Substitui o foreground para usar o drawable com padding
  sed -i '' 's|android:drawable="@mipmap/ic_launcher_foreground"|android:drawable="@drawable/ic_launcher_foreground_padded"|g' "$ICON_LAUNCHER"
  
  echo "  ✓ Atualizado: mipmap-anydpi-v26/ic_launcher.xml"
else
  echo "  ⚠️  Aviso: $ICON_LAUNCHER não encontrado"
fi

# Atualiza ic_launcher_round.xml para usar o foreground com padding
ICON_LAUNCHER_ROUND="$ANDROID_RES_DIR/mipmap-anydpi-v26/ic_launcher_round.xml"

if [ -f "$ICON_LAUNCHER_ROUND" ]; then
  # Substitui o foreground para usar o drawable com padding
  sed -i '' 's|android:drawable="@mipmap/ic_launcher_foreground"|android:drawable="@drawable/ic_launcher_foreground_padded"|g' "$ICON_LAUNCHER_ROUND"
  
  echo "  ✓ Atualizado: mipmap-anydpi-v26/ic_launcher_round.xml"
else
  echo "  ⚠️  Aviso: $ICON_LAUNCHER_ROUND não encontrado"
fi

echo ""
echo "✅ Ícones do Android ajustados com padding de 15%!"
echo ""
echo "Os arquivos foram atualizados:"
echo "  - drawable/ic_launcher_foreground_padded.xml (novo)"
echo "  - mipmap-anydpi-v26/ic_launcher.xml (atualizado)"
echo "  - mipmap-anydpi-v26/ic_launcher_round.xml (atualizado)"

