#!/usr/bin/env bash
set -euo pipefail

PRESET="${1:-}"
FORCE="${2:-}"

usage() {
  echo "Usage: npm run theme:update -- <preset-code-or-name> [-y]"
  echo ""
  echo "Examples:"
  echo "  npm run theme:update -- a64LKtAe"
  echo "  npm run theme:update -- maia -y"
  exit 1
}

if [[ -z "$PRESET" || "$PRESET" == "-h" || "$PRESET" == "--help" ]]; then
  usage
fi

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

UI_COMPONENTS=(
  alert-dialog
  breadcrumb
  button
  collapsible
  input
  select
  separator
  sheet
  sidebar
  skeleton
  sonner
  switch
  table
  tooltip
)

if [[ -d .git ]] && [[ -n "$(git status --porcelain)" ]]; then
  if [[ "$FORCE" != "-y" && "$FORCE" != "--yes" ]]; then
    echo "Working tree has uncommitted changes. Commit or stash before continuing."
    echo "shadcn-vue apply will overwrite UI components and globals.css."
    read -r -p "Continue anyway? [y/N] " answer
    if [[ "${answer,,}" != "y" ]]; then
      exit 1
    fi
  fi
fi

echo "Applying preset: $PRESET"
npx shadcn-vue@latest apply --preset "$PRESET" -y

echo "Setting icon library to remixicon"
node scripts/ensure-remixicon.mjs

echo "Installing icon packages"
npm install @lucide/vue @remixicon/vue

echo "Reinstalling UI components with remixicon icons"
npx shadcn-vue@latest add -y -o "${UI_COMPONENTS[@]}"

echo "Fixing Sonner toast icons"
node scripts/fix-sonner-icons.mjs

echo "Verifying build"
npm run build

echo "Theme updated. Run: npm run serve"
