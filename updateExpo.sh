#!/usr/bin/env bash
set -euo pipefail

if [ -z "${BASH_VERSION:-}" ]; then exec bash "$0" "$@"; fi

# -------------------------
# helpers / logging
# -------------------------
log() { echo "[update] $*"; }
die() { echo "[error] $*" >&2; exit 1; }

escape_for_sed() { # escapa / & e backslashes
  printf '%s' "$1" | sed -e 's/[\/&]/\\&/g' -e 's/\\/\\\\/g'
}

# -------------------------
# config
# -------------------------
TEMPLATE_REPO="https://github.com/MobiAppsByMobiGestor/appdaloja-v2"
BACKUP_BRANCH="appdaloja-v1"

PRESERVE_FILES=(
  "assets/images/icon.png"
  "google-services.json"
  "GoogleService-Info.plist"
  "session.json"
)

# -------------------------
# start
# -------------------------
log "Iniciando migração RN CLI -> Expo"

START_BRANCH="$(git rev-parse --abbrev-ref HEAD)"
log "Branch atual: $START_BRANCH"

# guarda: não executar dentro do repositório do template
ORIGIN_URL=$(git remote get-url origin 2>/dev/null || true)
if [[ -n "$ORIGIN_URL" ]] && echo "$ORIGIN_URL" | grep -qi "appdaloja-v2"; then
  die "Este diretório parece ser o TEMPLATE (origin: $ORIGIN_URL). Execute no repositório do seu projeto para preservar o histórico"
fi

# create backup branch from current
if git show-ref --verify --quiet "refs/heads/$BACKUP_BRANCH"; then
  log "Branch $BACKUP_BRANCH já existe, criando com sufixo timestamp"
  BACKUP_BRANCH="${BACKUP_BRANCH}-$(date +%s)"
fi

git checkout -b "$BACKUP_BRANCH"
log "Branch de backup criada: $BACKUP_BRANCH"

# voltar para branch principal antes de aplicar alterações
git checkout main 2>/dev/null || git checkout "$START_BRANCH"
log "Voltando para a branch principal"

# tmp dir
TMP_DIR="$(mktemp -d -t expo-migrate-XXXXXX)"
log "TMP_DIR: $TMP_DIR"

mkdir -p "$TMP_DIR/data"

# -------------------------
# collect APP_NAME
# -------------------------
log "Coletando APP_NAME (iOS então Android)"

PBXPROJ=$(find ios -name "project.pbxproj" -print -quit || true)
IOS_NAME=""

if [ -n "$PBXPROJ" ] && [ -f "$PBXPROJ" ]; then
  IOS_NAME=$(
    grep -m1 "INFOPLIST_KEY_CFBundleDisplayName" "$PBXPROJ" |
      grep -v "OneSignalNotificationServiceExtension" || true
  )
  if [ -n "$IOS_NAME" ]; then
    IOS_NAME=$(printf '%s' "$IOS_NAME" |
      awk -F'= ' '{print $2}' |
      sed 's/;//' |
      sed 's/^ *"//' |
      sed 's/" *$//' |
      xargs)
  fi
fi

ANDROID_STRINGS="./android/app/src/main/res/values/strings.xml"
ANDROID_NAME=""

if [ -f "$ANDROID_STRINGS" ]; then
  ANDROID_NAME=$(sed -n 's/.*<string name="app_name">\([^<]*\)<.*/\1/p' "$ANDROID_STRINGS" | head -n1 || true)
fi

APP_NAME="${IOS_NAME:-$ANDROID_NAME}"

if [ -z "$APP_NAME" ]; then
  die "APP_NAME não encontrado (iOS nem Android)"
fi

log "APP_NAME coletado: $APP_NAME"
printf '%s' "$APP_NAME" > "$TMP_DIR/data/APP_NAME"

# -------------------------
# collect APPLICATION_ID
# -------------------------
log "Coletando APPLICATION_ID (Android)"

GRADLE="./android/app/build.gradle"
APPLICATION_ID=""

if [ -f "$GRADLE" ]; then
  APPLICATION_ID=$(sed -n 's/.*applicationId "\(.*\)".*/\1/p' "$GRADLE" | head -n1 || true)
fi

if [ -z "$APPLICATION_ID" ]; then
  MANIFEST="./android/app/src/main/AndroidManifest.xml"
  if [ -f "$MANIFEST" ]; then
    APPLICATION_ID=$(sed -n 's/.*package="\([^"]*\)".*/\1/p' "$MANIFEST" | head -n1 || true)
  fi
fi

if [ -z "$APPLICATION_ID" ]; then
  die "APPLICATION_ID não encontrado"
fi

log "APPLICATION_ID coletado: $APPLICATION_ID"
printf '%s' "$APPLICATION_ID" > "$TMP_DIR/data/APPLICATION_ID"

# -------------------------
# collect BUNDLE_ID (iOS)
# -------------------------
log "Coletando BUNDLE_ID (iOS)"

PBXPROJ_PATH="$PBXPROJ"
BUNDLE_ID=""

if [ -n "$PBXPROJ_PATH" ] && [ -f "$PBXPROJ_PATH" ]; then
  BUNDLE_ID=$(grep "PRODUCT_BUNDLE_IDENTIFIER" "$PBXPROJ_PATH" |
    awk -F'= ' '{print $2}' |
    tr -d ' ;"' |
    grep '^com\.' |
    grep -v '\$' |
    grep -v 'example' |
    head -n1 || true)
fi

if [ -z "$BUNDLE_ID" ]; then
  INFO_PLIST=$(find ios -type f -name Info.plist ! -path "*/Pods/*" -print -quit || true)
  if [ -n "$INFO_PLIST" ] && [ -f "$INFO_PLIST" ]; then
    if command -v /usr/libexec/PlistBuddy >/dev/null 2>&1; then
      BUNDLE_ID=$(/usr/libexec/PlistBuddy -c 'Print :CFBundleIdentifier' "$INFO_PLIST" 2>/dev/null || true)
    fi
  fi
fi

if [ -z "$BUNDLE_ID" ]; then
  die "BUNDLE_ID não encontrado ou inválido"
fi

log "BUNDLE_ID coletado: $BUNDLE_ID"
printf '%s' "$BUNDLE_ID" > "$TMP_DIR/data/BUNDLE_ID"

# -------------------------
# collect COLOR
# -------------------------
log "Coletando COLOR do android (ic_launcher_background)"

COLOR=""

IC_BG_FILE="./android/app/src/main/res/values/ic_launcher_background.xml"
if [ -f "$IC_BG_FILE" ]; then
  CANDIDATE=$(sed -n 's/.*<color[[:space:]]*name="ic_launcher_background"[[:space:]]*>[[:space:]]*\([^<[:space:]]*\).*/\1/p' "$IC_BG_FILE" | head -n1 | tr -d ' ' || true)
  if [ -z "$CANDIDATE" ]; then
    CANDIDATE=$(awk '/<color[[:space:]]*name="ic_launcher_background"/{getline; gsub(/^\s+|\s+$/, ""); print; exit}' "$IC_BG_FILE" | tr -d ' ' || true)
  fi
  if echo "$CANDIDATE" | grep -Eq '^#[0-9A-Fa-f]{6}([0-9A-Fa-f]{2})?$'; then
    COLOR="$CANDIDATE"
  fi
fi

if [ -z "$COLOR" ]; then
  COLOR_MATCH=$(grep -R -n "<color[[:space:]]*name=\"ic_launcher_background\"" android/app/src/main/res 2>/dev/null | head -n1 || true)
  if [ -n "$COLOR_MATCH" ]; then
    COLOR_FILE=$(printf '%s' "$COLOR_MATCH" | cut -d: -f1)
    CANDIDATE=$(printf '%s' "$COLOR_MATCH" | sed 's/.*>//; s/<.*//; s/ //g' || true)
    if ! echo "$CANDIDATE" | grep -Eq '^#[0-9A-Fa-f]{6}([0-9A-Fa-f]{2})?$'; then
      CANDIDATE=$(awk '/<color[[:space:]]*name="ic_launcher_background"/{getline; gsub(/^\s+|\s+$/, ""); print; exit}' "$COLOR_FILE" | tr -d ' ' || true)
    fi
    if echo "$CANDIDATE" | grep -Eq '^#[0-9A-Fa-f]{6}([0-9A-Fa-f]{2})?$'; then
      COLOR="$CANDIDATE"
    fi
  fi
fi

if [ -z "$COLOR" ]; then
  FOUND=$(find android/app/src/main/res -type f -name "*ic_launcher_background*.xml" -print -quit || true)
  if [ -n "$FOUND" ]; then
    CANDIDATE=$(sed -n 's/.*<color[^>]*>\([^<]*\)<.*/\1/p' "$FOUND" | head -n1 || true)
    if [ -z "$CANDIDATE" ]; then
      CANDIDATE=$(awk '/<color[[:space:]]*name="ic_launcher_background"/{getline; gsub(/^\s+|\s+$/, ""); print; exit}' "$FOUND" | tr -d ' ' || true)
    fi
    if echo "$CANDIDATE" | grep -Eq '^#[0-9A-Fa-f]{6}([0-9A-Fa-f]{2})?$'; then
      COLOR="$CANDIDATE"
    fi
  fi
fi

if [ -z "$COLOR" ]; then
  :
fi

log "COLOR coletado: $COLOR"
printf '%s' "$COLOR" > "$TMP_DIR/data/COLOR"

# -------------------------
# save preserved files
# -------------------------
log "Salvando arquivos preservados em TMP"

mkdir -p "$TMP_DIR/files"

for f in "${PRESERVE_FILES[@]}"; do
  if [ -f "$f" ]; then
    mkdir -p "$TMP_DIR/files/$(dirname "$f")"
    cp -R "$f" "$TMP_DIR/files/$f"
    log "Preservado: $f"
  else
    log "Não encontrado (pular): $f"
  fi
done

if [ ! -f "$TMP_DIR/files/assets/images/icon.png" ]; then
  POSSIBLE_ANDROID_ICON="./android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_foreground.png"
  if [ -f "$POSSIBLE_ANDROID_ICON" ]; then
    mkdir -p "$TMP_DIR/files/assets/images"
    cp "$POSSIBLE_ANDROID_ICON" "$TMP_DIR/files/assets/images/icon.png"
    log "Ícone Android preservado de mipmap-xxxhdpi"
  fi
fi

# tenta usar ícone 1024.png prioritariamente, senão usa o marketing, e redimensiona para 512x512
IOS_ICON_1024=$(find ios -type f -name "1024.png" -print -quit || true)
IOS_MARKETING_ICON=$(find ios -type f -path "*/Images.xcassets/AppIcon.appiconset/AppIcon~ios-marketing.png" -print -quit || true)

ICON_SRC=""
ICON_SRC_LABEL=""
if [ -n "$IOS_ICON_1024" ] && [ -f "$IOS_ICON_1024" ]; then
  ICON_SRC="$IOS_ICON_1024"
  ICON_SRC_LABEL="iOS 1024.png"
elif [ -n "$IOS_MARKETING_ICON" ] && [ -f "$IOS_MARKETING_ICON" ]; then
  ICON_SRC="$IOS_MARKETING_ICON"
  ICON_SRC_LABEL="iOS marketing"
fi

if [ -n "$ICON_SRC" ]; then
  mkdir -p "$TMP_DIR/files/assets/images"
  if command -v sips >/dev/null 2>&1; then
    sips -Z 512 "$ICON_SRC" --out "$TMP_DIR/files/assets/images/icon.png" >/dev/null
    log "Ícone ($ICON_SRC_LABEL) redimensionado para 512x512 via sips"
  elif command -v magick >/dev/null 2>&1; then
    magick "$ICON_SRC" -resize 512x512 "$TMP_DIR/files/assets/images/icon.png"
    log "Ícone ($ICON_SRC_LABEL) redimensionado para 512x512 via ImageMagick (magick)"
  elif command -v convert >/dev/null 2>&1; then
    convert "$ICON_SRC" -resize 512x512 "$TMP_DIR/files/assets/images/icon.png"
    log "Ícone ($ICON_SRC_LABEL) redimensionado para 512x512 via ImageMagick (convert)"
  else
    cp "$ICON_SRC" "$TMP_DIR/files/assets/images/icon.png"
    log "sips/ImageMagick não encontrados, copiado ícone ($ICON_SRC_LABEL) sem redimensionar"
  fi
fi

log "Verificando keystore Android"
OLD_KEYSTORE="./android/app/cardealer.keystore"
mkdir -p "$TMP_DIR/files/android/app"
if [ -f "$OLD_KEYSTORE" ]; then
  cp "$OLD_KEYSTORE" "$TMP_DIR/files/android/app/cardealer.keystore"
  log "Keystore preservado: android/app/cardealer.keystore"
else
  if git show "$BACKUP_BRANCH:android/app/cardealer.keystore" > "$TMP_DIR/files/android/app/cardealer.keystore" 2>/dev/null; then
    log "Keystore preservado via $BACKUP_BRANCH"
  elif git show "$START_BRANCH:android/app/cardealer.keystore" > "$TMP_DIR/files/android/app/cardealer.keystore" 2>/dev/null; then
    log "Keystore preservado via $START_BRANCH"
  else
    log "Keystore cardealer.keystore não encontrado, pulando preservação"
  fi
fi

# extrair variáveis de gradle.properties do projeto antigo (local ou via branch de backup)
MYAPP_RELEASE_STORE_FILE=""
MYAPP_RELEASE_KEY_ALIAS=""
MYAPP_RELEASE_STORE_PASSWORD=""
MYAPP_RELEASE_KEY_PASSWORD=""

OLD_GRADLE_PROPS="./android/gradle.properties"
GRADLE_SOURCE=""
if [ -f "$OLD_GRADLE_PROPS" ]; then
  GRADLE_SOURCE="$OLD_GRADLE_PROPS"
else
  if git show "$BACKUP_BRANCH:android/gradle.properties" > "$TMP_DIR/data/OLD_android_gradle.properties" 2>/dev/null; then
    GRADLE_SOURCE="$TMP_DIR/data/OLD_android_gradle.properties"
  elif git show "$START_BRANCH:android/gradle.properties" > "$TMP_DIR/data/OLD_android_gradle.properties" 2>/dev/null; then
    GRADLE_SOURCE="$TMP_DIR/data/OLD_android_gradle.properties"
  elif git show "$BACKUP_BRANCH:gradle.properties" > "$TMP_DIR/data/OLD_root_gradle.properties" 2>/dev/null; then
    GRADLE_SOURCE="$TMP_DIR/data/OLD_root_gradle.properties"
  elif git show "$START_BRANCH:gradle.properties" > "$TMP_DIR/data/OLD_root_gradle.properties" 2>/dev/null; then
    GRADLE_SOURCE="$TMP_DIR/data/OLD_root_gradle.properties"
  elif git show "$BACKUP_BRANCH:android/app/gradle.properties" > "$TMP_DIR/data/OLD_app_gradle.properties" 2>/dev/null; then
    GRADLE_SOURCE="$TMP_DIR/data/OLD_app_gradle.properties"
  elif git show "$START_BRANCH:android/app/gradle.properties" > "$TMP_DIR/data/OLD_app_gradle.properties" 2>/dev/null; then
    GRADLE_SOURCE="$TMP_DIR/data/OLD_app_gradle.properties"
  fi
fi

if [ -n "$GRADLE_SOURCE" ] && [ -f "$GRADLE_SOURCE" ]; then
  MYAPP_RELEASE_STORE_FILE=$(sed -n 's/^MYAPP_RELEASE_STORE_FILE[[:space:]]*=[[:space:]]*\(.*\)$/\1/p' "$GRADLE_SOURCE" | head -n1 | tr -d '\r')
  MYAPP_RELEASE_KEY_ALIAS=$(sed -n 's/^MYAPP_RELEASE_KEY_ALIAS[[:space:]]*=[[:space:]]*\(.*\)$/\1/p' "$GRADLE_SOURCE" | head -n1 | tr -d '\r')
  MYAPP_RELEASE_STORE_PASSWORD=$(sed -n 's/^MYAPP_RELEASE_STORE_PASSWORD[[:space:]]*=[[:space:]]*\(.*\)$/\1/p' "$GRADLE_SOURCE" | head -n1 | tr -d '\r')
  MYAPP_RELEASE_KEY_PASSWORD=$(sed -n 's/^MYAPP_RELEASE_KEY_PASSWORD[[:space:]]*=[[:space:]]*\(.*\)$/\1/p' "$GRADLE_SOURCE" | head -n1 | tr -d '\r')
fi

[ -z "${MYAPP_RELEASE_STORE_FILE:-}" ] && MYAPP_RELEASE_STORE_FILE="cardealer.keystore"
[ -z "${MYAPP_RELEASE_KEY_ALIAS:-}" ] && MYAPP_RELEASE_KEY_ALIAS="cardealer-alias"
[ -z "${MYAPP_RELEASE_STORE_PASSWORD:-}" ] && MYAPP_RELEASE_STORE_PASSWORD="cardealer"
[ -z "${MYAPP_RELEASE_KEY_PASSWORD:-}" ] && MYAPP_RELEASE_KEY_PASSWORD="cardealer"
{
  printf 'MYAPP_RELEASE_STORE_FILE=%s\n' "$MYAPP_RELEASE_STORE_FILE"
  printf 'MYAPP_RELEASE_KEY_ALIAS=%s\n' "$MYAPP_RELEASE_KEY_ALIAS"
  printf 'MYAPP_RELEASE_STORE_PASSWORD=%s\n' "$MYAPP_RELEASE_STORE_PASSWORD"
  printf 'MYAPP_RELEASE_KEY_PASSWORD=%s\n' "$MYAPP_RELEASE_KEY_PASSWORD"
} > "$TMP_DIR/data/ANDROID_KEYSTORE_VARS"

# -------------------------
# clone template
# -------------------------
log "Clonando template: $TEMPLATE_REPO"

git clone --depth 1 "$TEMPLATE_REPO" "$TMP_DIR/template" || die "falha ao clonar template"

log "Template clonado para $TMP_DIR/template"

TEMPLATE_ROOT="$TMP_DIR/template"

# remove .git do template para evitar contaminação do repositório do projeto
rm -rf "$TEMPLATE_ROOT/.git"

if [ -f "$TEMPLATE_ROOT/app.json" ]; then
  TARGET_DIR="$TEMPLATE_ROOT"
elif [ -f "$TEMPLATE_ROOT/app/app.json" ]; then
  TARGET_DIR="$TEMPLATE_ROOT/app"
else
  TARGET_DIR="$TEMPLATE_ROOT"
fi

log "TARGET_DIR do template: $TARGET_DIR"

# garantia extra: remover eventual .git dentro do diretório alvo
rm -rf "$TARGET_DIR/.git" 2>/dev/null || true

# -------------------------
# replace placeholders
# -------------------------
log "Aplicando placeholders no template"

APP_NAME_ESC=$(escape_for_sed "$APP_NAME")
APPLICATION_ID_ESC=$(escape_for_sed "$APPLICATION_ID")
BUNDLE_ID_ESC=$(escape_for_sed "$BUNDLE_ID")
COLOR_ESC=$(escape_for_sed "$COLOR")

# coleta ACCOUNT_ID e ONESIGNAL_APP_ID
ACCOUNT_ID="${ACCOUNT_ID:-}"
ONESIGNAL_APP_ID="${ONESIGNAL_APP_ID:-}"

# tenta extrair do session.json preservado se não vier por env
SESSION_JSON_TMP="$TMP_DIR/files/session.json"
if [ -z "$ACCOUNT_ID" ] || [ -z "$ONESIGNAL_APP_ID" ]; then
  if [ -f "$SESSION_JSON_TMP" ]; then
    # tenta várias chaves possíveis
    if [ -z "$ACCOUNT_ID" ]; then
      ACCOUNT_ID=$(sed -n 's/.*"ACCOUNT_ID"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' "$SESSION_JSON_TMP" | head -n1)
      [ -z "$ACCOUNT_ID" ] && ACCOUNT_ID=$(sed -n 's/.*"account_id"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' "$SESSION_JSON_TMP" | head -n1)
      [ -z "$ACCOUNT_ID" ] && ACCOUNT_ID=$(sed -n 's/.*"accountId"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' "$SESSION_JSON_TMP" | head -n1)
    fi
    if [ -z "$ONESIGNAL_APP_ID" ]; then
      ONESIGNAL_APP_ID=$(sed -n 's/.*"ONESIGNAL_APP_ID"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' "$SESSION_JSON_TMP" | head -n1)
      [ -z "$ONESIGNAL_APP_ID" ] && ONESIGNAL_APP_ID=$(sed -n 's/.*"onesignal_app_id"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' "$SESSION_JSON_TMP" | head -n1)
      [ -z "$ONESIGNAL_APP_ID" ] && ONESIGNAL_APP_ID=$(sed -n 's/.*"oneSignalAppId"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' "$SESSION_JSON_TMP" | head -n1)
    fi
  fi
fi

# tenta extrair de src/libs/session.js caso ainda não tenha
SESSION_JS="./src/libs/session.js"
if [ -z "$ACCOUNT_ID" ] || [ -z "$ONESIGNAL_APP_ID" ]; then
  if [ -f "$SESSION_JS" ]; then
    if [ -z "$ACCOUNT_ID" ]; then
      ACCOUNT_ID=$(sed -n "s/.*ACCOUNT_ID:[[:space:]]*'\([^']*\)'.*/\1/p" "$SESSION_JS" | head -n1 || true)
    fi
    if [ -z "$ONESIGNAL_APP_ID" ]; then
      ONESIGNAL_APP_ID=$(sed -n "s/.*ONESIGNAL_APP_ID:[[:space:]]*'\([^']*\)'.*/\1/p" "$SESSION_JS" | head -n1 || true)
    fi
  fi
fi

if [ -z "$ACCOUNT_ID" ]; then
  log "ACCOUNT_ID não definido. Exporte a variável de ambiente ACCOUNT_ID para preencher o template"
fi
if [ -z "$ONESIGNAL_APP_ID" ]; then
  log "ONESIGNAL_APP_ID não definido. Exporte a variável de ambiente ONESIGNAL_APP_ID para preencher o template"
fi

ACCOUNT_ID_ESC=$(escape_for_sed "$ACCOUNT_ID")
ONESIGNAL_APP_ID_ESC=$(escape_for_sed "$ONESIGNAL_APP_ID")

if [ -f "$TARGET_DIR/app.json" ]; then
  sed -i '' "s@{{APP_NAME}}@${APP_NAME_ESC}@g" "$TARGET_DIR/app.json"
  sed -i '' "s@{{APPLICATION_ID}}@${APPLICATION_ID_ESC}@g" "$TARGET_DIR/app.json"
  sed -i '' "s@{{BUNDLE_ID}}@${BUNDLE_ID_ESC}@g" "$TARGET_DIR/app.json"
  [ -n "$COLOR" ] && sed -i '' "s@{{COLOR}}@${COLOR_ESC}@g" "$TARGET_DIR/app.json"
  [ -n "$ACCOUNT_ID_ESC" ] && sed -i '' "s@{{ACCOUNT_ID}}@${ACCOUNT_ID_ESC}@g" "$TARGET_DIR/app.json"
  [ -n "$ONESIGNAL_APP_ID_ESC" ] && sed -i '' "s@{{ONESIGNAL_APP_ID}}@${ONESIGNAL_APP_ID_ESC}@g" "$TARGET_DIR/app.json"
  node -e "const fs=require('fs')
const args=process.argv.slice(1)
const [pathArg,name,pkg,bundle,color=''] = args
const data=JSON.parse(fs.readFileSync(pathArg,'utf8'))
const expo=data.expo||data
data.expo=expo
if(name) expo.name=name
if(pkg){expo.android=expo.android||{};expo.android.package=pkg}
if(bundle){expo.ios=expo.ios||{};expo.ios.bundleIdentifier=bundle}
if(color){expo.android=expo.android||{};expo.android.adaptiveIcon=expo.android.adaptiveIcon||{};expo.android.adaptiveIcon.backgroundColor=color
  if(expo.plugins){expo.plugins=expo.plugins.map(plugin=>{
    if(Array.isArray(plugin)&&plugin[0]==='expo-splash-screen'){
      plugin[1]={...plugin[1],backgroundColor:color,dark:{backgroundColor:color},ios:{backgroundColor:color}}
    }
    if(Array.isArray(plugin)&&plugin[0]==='expo-notifications'){
      plugin[1]={...plugin[1],color:color}
    }
    return plugin
  })}
}
fs.writeFileSync(pathArg,JSON.stringify(data,null,2))" "$TARGET_DIR/app.json" "$APP_NAME" "$APPLICATION_ID" "$BUNDLE_ID" "$COLOR"
fi

# aplica diretamente em src/libs/session.js do template, se existir
TARGET_SESSION_JS="$TARGET_DIR/src/libs/session.js"
if [ -f "$TARGET_SESSION_JS" ]; then
  [ -n "$ACCOUNT_ID_ESC" ] && sed -i '' "s@{{ACCOUNT_ID}}@${ACCOUNT_ID_ESC}@g" "$TARGET_SESSION_JS"
  [ -n "$ONESIGNAL_APP_ID_ESC" ] && sed -i '' "s@{{ONESIGNAL_APP_ID}}@${ONESIGNAL_APP_ID_ESC}@g" "$TARGET_SESSION_JS"
fi

grep -Erl "{{COLOR|{{APP_NAME|{{APPLICATION_ID|{{BUNDLE_ID|{{ACCOUNT_ID|{{ONESIGNAL_APP_ID" "$TARGET_DIR" 2>/dev/null |
  while read -r file; do
    sed -i '' "s@{{APP_NAME}}@${APP_NAME_ESC}@g" "$file"
    sed -i '' "s@{{APPLICATION_ID}}@${APPLICATION_ID_ESC}@g" "$file"
    sed -i '' "s@{{BUNDLE_ID}}@${BUNDLE_ID_ESC}@g" "$file"
    [ -n "$COLOR" ] && sed -i '' "s@{{COLOR}}@${COLOR_ESC}@g" "$file"
    [ -n "$ACCOUNT_ID_ESC" ] && sed -i '' "s@{{ACCOUNT_ID}}@${ACCOUNT_ID_ESC}@g" "$file"
    [ -n "$ONESIGNAL_APP_ID_ESC" ] && sed -i '' "s@{{ONESIGNAL_APP_ID}}@${ONESIGNAL_APP_ID_ESC}@g" "$file"
  done

# também aplicar substituições fora de $TARGET_DIR quando o template
# usa estrutura com app/app.json e plugins na raiz do template
if [ "$TARGET_DIR" != "$TEMPLATE_ROOT" ]; then
  grep -Erl "{{COLOR|{{APP_NAME|{{APPLICATION_ID|{{BUNDLE_ID|{{ACCOUNT_ID|{{ONESIGNAL_APP_ID" "$TEMPLATE_ROOT" 2>/dev/null |
    while read -r file; do
      sed -i '' "s@{{APP_NAME}}@${APP_NAME_ESC}@g" "$file"
      sed -i '' "s@{{APPLICATION_ID}}@${APPLICATION_ID_ESC}@g" "$file"
      sed -i '' "s@{{BUNDLE_ID}}@${BUNDLE_ID_ESC}@g" "$file"
      [ -n "$COLOR" ] && sed -i '' "s@{{COLOR}}@${COLOR_ESC}@g" "$file"
      [ -n "$ACCOUNT_ID_ESC" ] && sed -i '' "s@{{ACCOUNT_ID}}@${ACCOUNT_ID_ESC}@g" "$file"
      [ -n "$ONESIGNAL_APP_ID_ESC" ] && sed -i '' "s@{{ONESIGNAL_APP_ID}}@${ONESIGNAL_APP_ID_ESC}@g" "$file"
    done
fi

if [ -f "$TARGET_DIR/app.json" ]; then
  node -e "const fs=require('fs')
const path=process.argv[1]
const data=JSON.parse(fs.readFileSync(path,'utf8'))
const expo=data.expo||data
data.expo=expo
expo.name='appdaloja'
fs.writeFileSync(path,JSON.stringify(data,null,2))" "$TARGET_DIR/app.json"
fi

# -------------------------
# restore preserved
# -------------------------
log "Restaurando arquivos preservados no template"

for f in "${PRESERVE_FILES[@]}"; do
  SRC="$TMP_DIR/files/$f"
  if [ -f "$SRC" ]; then
    DST_DIR="$(dirname "$TARGET_DIR/$f")"
    mkdir -p "$DST_DIR"
    cp -R "$SRC" "$TARGET_DIR/$f"
    log "Restaurado: $f -> $TARGET_DIR/$f"
  fi
done

if [ -f "$TMP_DIR/files/assets/images/icon.png" ]; then
  mkdir -p "$TARGET_DIR/assets/images"
  cp "$TMP_DIR/files/assets/images/icon.png" "$TARGET_DIR/assets/images/icon.png"
  log "Ícone garantido em $TARGET_DIR/assets/images/icon.png"
fi

if [ -f "$TMP_DIR/files/android/app/cardealer.keystore" ]; then
  mkdir -p "$TARGET_DIR/android/app"
  cp "$TMP_DIR/files/android/app/cardealer.keystore" "$TARGET_DIR/android/app/cardealer.keystore"
  log "Keystore garantido em $TARGET_DIR/android/app/cardealer.keystore"
  TARGET_GRADLE_PROPS="$TARGET_DIR/android/gradle.properties"
  touch "$TARGET_GRADLE_PROPS"
  if [ -f "$TMP_DIR/data/ANDROID_KEYSTORE_VARS" ]; then
    . "$TMP_DIR/data/ANDROID_KEYSTORE_VARS"
  fi
  v1=$(escape_for_sed "${MYAPP_RELEASE_STORE_FILE:-cardealer.keystore}")
  v2=$(escape_for_sed "${MYAPP_RELEASE_KEY_ALIAS:-cardealer-alias}")
  v3=$(escape_for_sed "${MYAPP_RELEASE_STORE_PASSWORD:-cardealer}")
  v4=$(escape_for_sed "${MYAPP_RELEASE_KEY_PASSWORD:-cardealer}")
  if grep -q '^MYAPP_RELEASE_STORE_FILE[[:space:]]*=' "$TARGET_GRADLE_PROPS"; then
    sed -i '' "s@^MYAPP_RELEASE_STORE_FILE[[:space:]]*=.*@MYAPP_RELEASE_STORE_FILE=${v1}@g" "$TARGET_GRADLE_PROPS"
  else
    printf 'MYAPP_RELEASE_STORE_FILE=%s\n' "${MYAPP_RELEASE_STORE_FILE:-cardealer.keystore}" >> "$TARGET_GRADLE_PROPS"
  fi
  if grep -q '^MYAPP_RELEASE_KEY_ALIAS[[:space:]]*=' "$TARGET_GRADLE_PROPS"; then
    sed -i '' "s@^MYAPP_RELEASE_KEY_ALIAS[[:space:]]*=.*@MYAPP_RELEASE_KEY_ALIAS=${v2}@g" "$TARGET_GRADLE_PROPS"
  else
    printf 'MYAPP_RELEASE_KEY_ALIAS=%s\n' "${MYAPP_RELEASE_KEY_ALIAS:-cardealer-alias}" >> "$TARGET_GRADLE_PROPS"
  fi
  if grep -q '^MYAPP_RELEASE_STORE_PASSWORD[[:space:]]*=' "$TARGET_GRADLE_PROPS"; then
    sed -i '' "s@^MYAPP_RELEASE_STORE_PASSWORD[[:space:]]*=.*@MYAPP_RELEASE_STORE_PASSWORD=${v3}@g" "$TARGET_GRADLE_PROPS"
  else
    printf 'MYAPP_RELEASE_STORE_PASSWORD=%s\n' "${MYAPP_RELEASE_STORE_PASSWORD:-cardealer}" >> "$TARGET_GRADLE_PROPS"
  fi
  if grep -q '^MYAPP_RELEASE_KEY_PASSWORD[[:space:]]*=' "$TARGET_GRADLE_PROPS"; then
    sed -i '' "s@^MYAPP_RELEASE_KEY_PASSWORD[[:space:]]*=.*@MYAPP_RELEASE_KEY_PASSWORD=${v4}@g" "$TARGET_GRADLE_PROPS"
  else
    printf 'MYAPP_RELEASE_KEY_PASSWORD=%s\n' "${MYAPP_RELEASE_KEY_PASSWORD:-cardealer}" >> "$TARGET_GRADLE_PROPS"
  fi
  log "Variáveis do gradle.properties gravadas no template"
fi

ANDROID_GSERV="./android/app/google-services.json"
if [ -f "$ANDROID_GSERV" ]; then
  cp "$ANDROID_GSERV" "$TARGET_DIR/google-services.json"
  log "Copiado android/app/google-services.json -> $TARGET_DIR/google-services.json"
else
  log "Não encontrado: android/app/google-services.json (pular)"
fi

IOS_GPLIST="./ios/GoogleService-Info.plist"
if [ -f "$IOS_GPLIST" ]; then
  cp "$IOS_GPLIST" "$TARGET_DIR/GoogleService-Info.plist"
  log "Copiado ios/GoogleService-Info.plist -> $TARGET_DIR/GoogleService-Info.plist"
else
  log "Não encontrado: ios/GoogleService-Info.plist (pular)"
fi

# -------------------------
# replace project with template
# -------------------------
log "Substituindo projeto atual pelo template preenchido"

CURRENT_TMP_BASENAME="$(basename "$TMP_DIR")"

find . -mindepth 1 -maxdepth 1 ! -name ".git" ! -name "$CURRENT_TMP_BASENAME" -exec rm -rf {} \;

cp -R "$TARGET_DIR/." .

log "Cópia do template para workspace concluída"

# -------------------------
# expo prebuild & pod install
# -------------------------
log "Instalando dependências com yarn"
command -v yarn >/dev/null 2>&1 || die "yarn não encontrado"
yarn install || die "yarn install falhou"

log "Executando npx expo prebuild"
command -v npx >/dev/null 2>&1 || die "npx não encontrado"
npx expo prebuild || die "expo prebuild falhou"

log "Instalando pods iOS"
[ -d ios ] || die "pasta ios não encontrada"
command -v pod >/dev/null 2>&1 || die "pod não encontrado"
(cd ios && pod install) || die "pod install falhou"

if [ -f "$TMP_DIR/files/android/app/cardealer.keystore" ]; then
  log "Restaurando keystore para novo projeto"
  mkdir -p "./android/app"
  cp "$TMP_DIR/files/android/app/cardealer.keystore" "./android/app/cardealer.keystore"
  NEW_GRADLE_PROPS="./android/gradle.properties"
  touch "$NEW_GRADLE_PROPS"
  if [ -f "$TMP_DIR/data/ANDROID_KEYSTORE_VARS" ]; then
    . "$TMP_DIR/data/ANDROID_KEYSTORE_VARS"
  fi
  v1=$(escape_for_sed "${MYAPP_RELEASE_STORE_FILE:-cardealer.keystore}")
  v2=$(escape_for_sed "${MYAPP_RELEASE_KEY_ALIAS:-cardealer-alias}")
  v3=$(escape_for_sed "${MYAPP_RELEASE_STORE_PASSWORD:-cardealer}")
  v4=$(escape_for_sed "${MYAPP_RELEASE_KEY_PASSWORD:-cardealer}")
  if grep -q '^MYAPP_RELEASE_STORE_FILE[[:space:]]*=' "$NEW_GRADLE_PROPS"; then
    sed -i '' "s@^MYAPP_RELEASE_STORE_FILE[[:space:]]*=.*@MYAPP_RELEASE_STORE_FILE=${v1}@g" "$NEW_GRADLE_PROPS"
  else
    printf 'MYAPP_RELEASE_STORE_FILE=%s\n' "${MYAPP_RELEASE_STORE_FILE:-cardealer.keystore}" >> "$NEW_GRADLE_PROPS"
  fi
  if grep -q '^MYAPP_RELEASE_KEY_ALIAS[[:space:]]*=' "$NEW_GRADLE_PROPS"; then
    sed -i '' "s@^MYAPP_RELEASE_KEY_ALIAS[[:space:]]*=.*@MYAPP_RELEASE_KEY_ALIAS=${v2}@g" "$NEW_GRADLE_PROPS"
  else
    printf 'MYAPP_RELEASE_KEY_ALIAS=%s\n' "${MYAPP_RELEASE_KEY_ALIAS:-cardealer-alias}" >> "$NEW_GRADLE_PROPS"
  fi
  if grep -q '^MYAPP_RELEASE_STORE_PASSWORD[[:space:]]*=' "$NEW_GRADLE_PROPS"; then
    sed -i '' "s@^MYAPP_RELEASE_STORE_PASSWORD[[:space:]]*=.*@MYAPP_RELEASE_STORE_PASSWORD=${v3}@g" "$NEW_GRADLE_PROPS"
  else
    printf 'MYAPP_RELEASE_STORE_PASSWORD=%s\n' "${MYAPP_RELEASE_STORE_PASSWORD:-cardealer}" >> "$NEW_GRADLE_PROPS"
  fi
  if grep -q '^MYAPP_RELEASE_KEY_PASSWORD[[:space:]]*=' "$NEW_GRADLE_PROPS"; then
    sed -i '' "s@^MYAPP_RELEASE_KEY_PASSWORD[[:space:]]*=.*@MYAPP_RELEASE_KEY_PASSWORD=${v4}@g" "$NEW_GRADLE_PROPS"
  else
    printf 'MYAPP_RELEASE_KEY_PASSWORD=%s\n' "${MYAPP_RELEASE_KEY_PASSWORD:-cardealer}" >> "$NEW_GRADLE_PROPS"
  fi
  log "Keystore e gradle.properties configurados"
else
  log "Keystore não presente, pulando configuração do gradle.properties"
fi

# -------------------------
# final commit
# -------------------------
log "Preparando commit final"

git add .
git commit -m "migrate: RN CLI -> Expo (template appdaloja-v2)" || log "Nada novo para commitar ou commit falhou"

# push para main
git push origin main || log "Push para main falhou ou sem alterações"

log "Migração finalizada com sucesso"
log "Backup branch: $BACKUP_BRANCH"

log "Valores coletados:"
log " - APP_NAME: $(cat "$TMP_DIR/data/APP_NAME")"
log " - APPLICATION_ID: $(cat "$TMP_DIR/data/APPLICATION_ID")"
log " - BUNDLE_ID: $(cat "$TMP_DIR/data/BUNDLE_ID")"
log " - COLOR: $(cat "$TMP_DIR/data/COLOR")"

log "TMP_DIR mantido em: $TMP_DIR (remover manualmente quando quiser)"

log "Build Android (AAB)"
command -v yarn >/dev/null 2>&1 || die "yarn não encontrado"
yarn android:build || die "yarn android:build falhou"
if [ -d "./android/app/build/outputs/bundle/release" ]; then
  log "Abrindo pasta do AAB"
  open ./android/app/build/outputs/bundle/release || log "Falha ao abrir pasta do AAB"
else
  log "Pasta do AAB não encontrada: ./android/app/build/outputs/bundle/release"
fi