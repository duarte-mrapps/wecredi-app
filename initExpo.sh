#!/bin/bash
set -euo pipefail

GREEN='\033[32m'
RED='\033[31m'
YELLOW='\033[33m'
CYAN='\033[36m'
RESET='\033[0m'
BOLD='\033[1m'
CURRENT_PID=""

kill_tree() {
  local root="$1"
  [[ -z "$root" ]] && return 0
  local children
  children=$(pgrep -P "$root" 2>/dev/null || true)
  for c in $children; do
    kill_tree "$c"
  done
  kill -TERM "$root" 2>/dev/null || true
  sleep 0.2
  kill -KILL "$root" 2>/dev/null || true
}

on_interrupt() {
  printf "\r${RED}✗${RESET} Operação cancelada pelo usuário\n"
  kill_tree "$CURRENT_PID"
  exit 130
}

trap on_interrupt SIGINT SIGTERM
section() {
  local title="$1"
  printf "\n${CYAN}────────────────────────────────────────${RESET}\n"
  printf "${BOLD}%s${RESET}\n" "$title"
  printf "${CYAN}────────────────────────────────────────${RESET}\n\n"
}
clear
section "Setup projeto App da Loja"

show_spinner() {
  local pid="$1"
  local text="$2"
  local spin='|/-\\'
  local i=0
  while kill -0 "$pid" 2>/dev/null; do
    i=$(( (i+1) % 4 ))
    printf "\r${YELLOW}%s${RESET} %s\033[K" "${spin:$i:1}" "$text"
    sleep 0.1
  done
  printf "\r\033[K"
}

run_step() {
  local label="$1"
  shift
  local cmd="$*"
  bash -c "$cmd" &
  local pid=$!
  CURRENT_PID="$pid"
  show_spinner "$pid" "→ $label"
  wait "$pid"
  local status=$?
  CURRENT_PID=""
  if [ "$status" -eq 0 ]; then
    printf "\r\033[K${GREEN}✓${RESET} %s\n" "$label"
    return 0
  else
    printf "\r\033[K${RED}✗${RESET} %s\n" "$label"
    return "$status"
  fi
}

read_folder() {
  local prompt="$1"
  local value=""
  while true; do
    read -r -p "$prompt: " value
    value=$(echo "$value" | xargs)
    value=${value#\"}
    value=${value%\"}
    value=${value#\'}
    value=${value%\'}
    [[ -n "$value" ]] && break
    printf "\033[31m%s\033[0m\n" "Este campo é obrigatório."
  done
  echo "$value"
}

folder=$(read_folder "Arraste e solte a pasta que contém os arquivos (GoogleService-Info.plist, google-services.json, icon.png)")

validate_hex() {
  local input="$1"
  local hex="$input"
  if [[ "$hex" =~ ^[0-9A-Fa-f]{6}$ ]]; then
    hex="#${hex}"
  fi
  if [[ "$hex" =~ ^#([0-9A-Fa-f]{6})$ ]]; then
    hex=$(echo "$hex" | tr '[:lower:]' '[:upper:]')
    echo "$hex"
    return 0
  fi
  printf "\033[31m%s\033[0m\n" "Cor hexadecimal inválida"
  return 1
}

read_color() {
  local prompt="$1"
  local value=""
  while true; do
    read -r -p "$prompt: " value
    value=$(echo "$value" | xargs)
    if [[ -z "$value" ]]; then
      printf "\033[31m%s\033[0m\n" "Este campo é obrigatório."
      continue
    fi
    local normalized
    normalized=$(validate_hex "$value") || { continue; }
    echo "$normalized"
    break
  done
}

color=$(read_color "Informe a cor de fundo do ícone em hexadecimal (ex: #FF0000)")

find_file() {
  local base="$1"
  local name="$2"
  local path
  path=$(find "$base" -type f -name "$name" -print -quit 2>/dev/null || true)
  echo "$path"
}

validate_files() {
  local base="$1"
  plist_path=$(find_file "$base" "GoogleService-Info.plist")
  json_path=$(find_file "$base" "google-services.json")
  icon_path=$(find_file "$base" "icon.png")

  [[ -n "$plist_path" && "$(basename "$plist_path")" != "GoogleService-Info.plist" ]] && plist_path=""
  [[ -n "$json_path" && "$(basename "$json_path")" != "google-services.json" ]] && json_path=""
  [[ -n "$icon_path" && "$(basename "$icon_path")" != "icon.png" ]] && icon_path=""

  local ok=true
  if [[ -z "$plist_path" ]]; then ok=false; printf "${RED}✗${RESET} GoogleService-Info.plist não encontrado\n"; fi
  if [[ -z "$json_path" ]]; then ok=false; printf "${RED}✗${RESET} google-services.json não encontrado\n"; fi
  if [[ -z "$icon_path" ]]; then ok=false; printf "${RED}✗${RESET} icon.png não encontrado\n"; fi

  $ok && return 0 || return 1
}

while true; do
  if [[ ! -d "$folder" ]]; then
    printf "${RED}%s${RESET}\n" "Pasta inválida: $folder"
    printf "\n"
    folder=$(read_folder "Arraste e solte a pasta que contém os arquivos (GoogleService-Info.plist, google-services.json, icon.png)")
    printf "\n"
    continue
  fi
  validate_files "$folder" && break
  printf "${YELLOW}%s${RESET}\n" "Esperados: GoogleService-Info.plist, google-services.json, icon.png"
  printf "\n"
  folder=$(read_folder "Arraste e solte a pasta correta que contém os arquivos")
  printf "\n"
done

if [ -d "$folder/.git" ]; then
  printf "${YELLOW}⚠${RESET} A pasta de origem possui .git, mas apenas arquivos serão copiados\n"
fi

section "Resumo"
printf "%-26s %s\n" "GoogleService-Info.plist:" "$plist_path"
printf "%-26s %s\n" "google-services.json:" "$json_path"
printf "%-26s %s\n" "icon.png:" "$icon_path"
printf "%-26s %s\n" "Cor de fundo:" "$color"
read -r -p "Todos os dados estão corretos? [S/N]: " ok
[[ "$ok" =~ ^[Ss]$ ]] || { printf "\033[31m%s\033[0m\n" "Configuração cancelada"; exit 0; }

cp -f "$plist_path" "./GoogleService-Info.plist"
cp -f "$json_path" "./google-services.json"
mkdir -p "./assets/images"
cp -f "$icon_path" "./assets/images/icon.png"
printf "${GREEN}✓${RESET} Arquivos copiados para o projeto\n"

if grep -q "{{COLOR}}" "./app.json"; then
  sed -i '' "s/{{COLOR}}/$color/g" "./app.json"
  printf "${GREEN}✓${RESET} Cor aplicada em app.json\n"
else
  printf "${YELLOW}⚠${RESET} Placeholder {{COLOR}} não encontrado em app.json\n"
fi

section "Git"
if [ -d ".git" ]; then
  origin_url=$(git remote get-url origin 2>/dev/null || true)
  if [[ -n "$origin_url" ]] && echo "$origin_url" | grep -qi "appdaloja-v2"; then
    printf "${RED}✗${RESET} Este diretório parece ser o TEMPLATE (origin: %s)\n" "$origin_url"
    printf "${YELLOW}ℹ${RESET} Execute este script dentro do repositório do seu projeto para manter o histórico intacto\n"
    exit 1
  else
    printf "${GREEN}✓${RESET} Repositório do projeto detectado. Histórico preservado\n"
  fi
else
  printf "${YELLOW}⚠${RESET} Nenhum repositório Git encontrado aqui. O template não deve trazer .git\n"
  printf "${YELLOW}ℹ${RESET} Se isto é seu projeto, inicialize Git manualmente depois para manter o histórico\n"
fi

section "Instalação"
run_step "Instalando dependências" "yarn" || exit 1

if command -v pod >/dev/null 2>&1; then
  run_step "Instalando pods" "cd ios && pod install" || exit 1
else
  printf "${RED}✗${RESET} CocoaPods não encontrado. Instale com: sudo gem install cocoapods\n"
  exit 1
fi

section "Build iOS"
run_step "Build iOS (prebuild)" "yarn ios:build" || exit 1

section "Build Android"
run_step "Build Android (AAB)" "yarn android:build" || exit 1
if [ -d "./android/app/build/outputs/bundle/release" ]; then
  run_step "Abrir pasta do AAB" "open ./android/app/build/outputs/bundle/release" || exit 1
else
  printf "${YELLOW}⚠${RESET} Pasta do AAB não encontrada: ./android/app/build/outputs/bundle/release\n"
fi

section "Xcode"
run_step "Abrindo Xcode" 'w="ios/appdaloja.xcworkspace"; if [ -e "$w" ]; then open "$w"; else exit 1; fi' || exit 1

section "Prints iOS"
run_step "iPhone" "yarn prints:iphone" || exit 1
run_step "iPad" "yarn prints:ipad" || exit 1

section "Prints Android"
run_step "Android Phone" "yarn prints:phone" || exit 1
run_step "Android Tablet" "yarn prints:tablet" || exit 1

printf "${GREEN}%s${RESET}\n" "Concluído"
