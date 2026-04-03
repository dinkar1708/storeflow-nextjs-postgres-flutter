#!/bin/bash

# Complete project rename (branding, npm metadata, env, Docker, docs, UI).
# Run from the monorepo root (parent of api-web), not from this folder.
#
# Usage:
#   ./how_to_use_this_repo/api-web/rename-project.sh <new-name> <new-description>
#   ./how_to_use_this_repo/api-web/rename-project.sh <new-name> <new-description> <from-display> <from-slug>
#
# With only 2 args, the script auto-detects "from" branding:
#   - StoreFlow template (npm name storeflow-nextjs-postgres-flutter) → StoreFlow / storeflow
#   - Any other npm name (e.g. checkrename) → display name from README H1 or root layout title, slug = package name
#
# Optional 4th/5th args override auto-detection explicitly.

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

TEMPLATE_PKG="storeflow-nextjs-postgres-flutter"

usage() {
    echo -e "${RED}Error: Invalid arguments${NC}"
    echo "Usage:"
    echo "  $0 <new-name> <new-description>"
    echo "  $0 <new-name> <new-description> <from-display-name> <from-slug>"
    echo ""
    echo "Examples:"
    echo "  $0 \"BookMart\" \"Bookstore Management\""
    echo "  $0 \"BookMart\" \"…\" \"CheckRename\" \"checkrename\""
    exit 1
}

if [ $# -lt 2 ]; then
    usage
fi
if [ $# -gt 2 ] && [ $# -lt 4 ]; then
    echo -e "${RED}Pass either 2 arguments or 4 (add both from-display and from-slug).${NC}"
    usage
fi
if [ $# -gt 4 ]; then
    usage
fi

NEW_NAME=$1
NEW_DESCRIPTION=$2

# Current npm package name (must be read before we infer branding)
CURRENT_PKG_NAME="$TEMPLATE_PKG"
if [ -f "api-web/package.json" ] && command -v node >/dev/null 2>&1; then
    CURRENT_PKG_NAME=$(node -e "console.log(JSON.parse(require('fs').readFileSync('api-web/package.json','utf8')).name)")
fi

if [ $# -ge 4 ]; then
    FROM_DISPLAY=$3
    FROM_SLUG=$4
else
    if [ "$CURRENT_PKG_NAME" = "$TEMPLATE_PKG" ]; then
        FROM_DISPLAY="StoreFlow"
        FROM_SLUG="storeflow"
    else
        FROM_SLUG="$CURRENT_PKG_NAME"
        FROM_DISPLAY=""
        if [ -f README.md ]; then
            FROM_DISPLAY=$(head -n 1 README.md | sed 's/^# *//' | sed 's/ - .*//')
        fi
        if [ -z "$FROM_DISPLAY" ] && [ -f api-web/app/layout.tsx ]; then
            FROM_DISPLAY=$(grep -m1 "title:" api-web/app/layout.tsx | sed -n "s/.*title:[[:space:]]*['\"]\([^'\"]*\)['\"].*/\1/p" | sed 's/ - .*//')
        fi
        if [ -z "$FROM_DISPLAY" ]; then
            FROM_DISPLAY="$FROM_SLUG"
            echo -e "${YELLOW}⚠ Could not read display name from README or layout; using slug \"${FROM_SLUG}\".${NC}"
            echo -e "${YELLOW}  If UI uses CamelCase (e.g. CheckRename), pass: $0 \"NewName\" \"…\" \"CheckRename\" \"checkrename\"${NC}"
        fi
    fi
fi

NEW_NAME_LOWER=$(echo "$NEW_NAME" | tr '[:upper:]' '[:lower:]')
NEW_NAME_UPPER=$(echo "$NEW_NAME" | tr '[:lower:]' '[:upper:]' | sed 's/ //g')
NEW_NAME_KEBAB=$(echo "$NEW_NAME_LOWER" | sed 's/ /-/g')
NEW_PACKAGE_NAME="$NEW_NAME_KEBAB"
NEW_DB_SLUG="$NEW_NAME_LOWER"
FROM_UPPER=$(echo "$FROM_DISPLAY" | tr '[:lower:]' '[:upper:]' | sed 's/ //g')

echo -e "${GREEN}=== Complete Project Renaming Tool ===${NC}"
echo -e "${BLUE}Strings in the repo → new branding${NC}"
echo ""
echo "  From (display / slug):  ${FROM_DISPLAY} / ${FROM_SLUG}"
echo "  From (npm name):        ${CURRENT_PKG_NAME}"
echo "  To (display / slug):    ${NEW_NAME} / ${NEW_DB_SLUG}"
echo "  To (npm name):          ${NEW_PACKAGE_NAME}"
echo "  Description:            ${NEW_DESCRIPTION}"
echo ""
echo -e "${YELLOW}⚠️  WARNING: Replaces the \"from\" tokens plus legacy template strings (StoreFlow, testshop, …)${NC}"
echo ""
read -p "Continue? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
fi

echo -e "${YELLOW}Starting rename...${NC}"
echo ""

# Order matters: longer tokens before shorter substrings.
# Never rewrite rename-project.sh or anything under how_to_use_this_repo/ (grep may still
# match StoreFlow there—that is intentional so the template script stays usable).
apply_template_seds() {
    local filtered=()
    local p
    for p in "$@"; do
        [ -f "$p" ] || continue
        case "$p" in
            *how_to_use_this_repo*) continue ;;
            *rename-project.sh) continue ;;
        esac
        filtered+=("$p")
    done
    [ "${#filtered[@]}" -eq 0 ] && return 0
    sed -i.bak \
        -e "s|storeflow-nextjs-postgres-flutter|${NEW_PACKAGE_NAME}|g" \
        -e "s|${CURRENT_PKG_NAME}|${NEW_PACKAGE_NAME}|g" \
        -e "s|${FROM_UPPER}|${NEW_NAME_UPPER}|g" \
        -e "s|STOREFLOW|${NEW_NAME_UPPER}|g" \
        -e "s|${FROM_DISPLAY}|${NEW_NAME}|g" \
        -e "s|StoreFlow|${NEW_NAME}|g" \
        -e "s|TestShop|${NEW_NAME}|g" \
        -e "s|${FROM_SLUG}|${NEW_NAME_LOWER}|g" \
        -e "s|storeflow|${NEW_NAME_LOWER}|g" \
        -e "s|testshop|${NEW_NAME_LOWER}|g" \
        "${filtered[@]}"
    local f
    for f in "${filtered[@]}"; do
        rm -f "${f}.bak"
    done
}

# --- PHASE 1: npm metadata (JSON-safe) ---
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}PHASE 1: package.json & package-lock.json${NC}"
echo -e "${BLUE}========================================${NC}"

if [ -f "api-web/package.json" ] && command -v node >/dev/null 2>&1; then
    echo "📦 Updating package.json and package-lock.json via node..."
    node - "$NEW_PACKAGE_NAME" "$NEW_DESCRIPTION" <<'NODE'
const fs = require("fs");
const name = process.argv[2];
const description = process.argv[3];
const pkgPath = "api-web/package.json";
const lockPath = "api-web/package-lock.json";

const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
pkg.name = name;
pkg.description = description;
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");

if (fs.existsSync(lockPath)) {
  const lock = JSON.parse(fs.readFileSync(lockPath, "utf8"));
  lock.name = name;
  if (lock.packages && typeof lock.packages[""] === "object" && lock.packages[""] !== null) {
    lock.packages[""].name = name;
  }
  fs.writeFileSync(lockPath, JSON.stringify(lock, null, 2) + "\n");
}
NODE
    echo -e "${GREEN}✓ npm package metadata updated${NC}"
elif [ -f "api-web/package.json" ]; then
    echo -e "${YELLOW}⚠ node not found; falling back to sed for package.json only${NC}"
    sed -i.bak \
        -e "s|\"name\": \"${CURRENT_PKG_NAME}\"|\"name\": \"${NEW_PACKAGE_NAME}\"|g" \
        -e "s|\"description\": \"Universal inventory and order management platform\"|\"description\": \"${NEW_DESCRIPTION}\"|g" \
        api-web/package.json
    rm -f api-web/package.json.bak
    echo -e "${GREEN}✓ package.json updated (lockfile untouched — install node or edit package-lock.json)${NC}"
else
    echo -e "${RED}✗ api-web/package.json not found${NC}"
fi

# --- PHASE 2: Env & Docker ---
echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}PHASE 2: .env & docker-compose${NC}"
echo -e "${BLUE}========================================${NC}"

echo "🔧 Patching env files..."
for envf in api-web/.env api-web/.env.example api-web/.env.development api-web/.env.local; do
    if [ -f "$envf" ]; then
        apply_template_seds "$envf"
        echo -e "${GREEN}✓ $(basename "$envf")${NC}"
    fi
done

echo "🐳 Patching docker-compose..."
for compose in docker-compose.yml api-web/docker-compose.yml; do
    if [ -f "$compose" ]; then
        apply_template_seds "$compose"
        echo -e "${GREEN}✓ ${compose}${NC}"
    fi
done

# --- PHASE 3: Docs (root + docs/) ---
echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}PHASE 3: Documentation${NC}"
echo -e "${BLUE}========================================${NC}"

if [ -f "README.md" ]; then
    echo "📄 README.md"
    apply_template_seds README.md
    sed -i.bak \
        -e "s|Universal Inventory & Order Management Platform|${NEW_DESCRIPTION}|g" \
        -e "s|Universal platform for inventory and order management|${NEW_DESCRIPTION}|g" \
        README.md
    rm -f README.md.bak
    echo -e "${GREEN}✓ README.md${NC}"
fi

if [ -d "docs" ]; then
    echo "📚 docs/*.md"
    while IFS= read -r -d '' doc; do
        apply_template_seds "$doc"
    done < <(find docs -type f -name "*.md" ! -path "*/how_to_use_this_repo/*" -print0)
    echo -e "${GREEN}✓ docs/${NC}"
fi

for md in api-web/TEST_LOGIN.md api-web/README.md api-web/QUICK_START.md flutter-app/README.md; do
    if [ -f "$md" ]; then
        apply_template_seds "$md"
        echo -e "${GREEN}✓ ${md}${NC}"
    fi
done

echo ""
echo -e "${YELLOW}ℹ️  Skipped how_to_use_this_repo/ (rename-project.sh is never edited). Delete that file or folder yourself when you no longer need it.${NC}"

# --- PHASE 4: All api-web source + configs (excluding deps / build output) ---
echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}PHASE 4: api-web source (ts/tsx/js/mjs/json configs)${NC}"
echo -e "${BLUE}========================================${NC}"

if [ -d "api-web" ]; then
    count=0
    while IFS= read -r -d '' f; do
        apply_template_seds "$f"
        count=$((count + 1))
    done < <(
        find api-web -type f \
            \( \
            -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.mjs" -o -name "*.jsx" -o \
            -name "*.json" \
            \) \
            ! -path "*/node_modules/*" \
            ! -path "*/.next/*" \
            ! -path "*/how_to_use_this_repo/*" \
            ! -name "package.json" \
            ! -name "package-lock.json" \
            ! -name "rename-project.sh" \
            -print0
    )
    echo -e "${GREEN}✓ Updated ${count} files under api-web/${NC}"
else
    echo -e "${RED}✗ api-web not found${NC}"
fi

# --- Summary ---
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✓ RENAMING COMPLETE${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${BLUE}Project branding updated to '${NEW_NAME}' (Postgres DB slug: ${NEW_DB_SLUG})${NC}"
echo ""
echo -e "${YELLOW}NEXT STEPS:${NC}"
echo "  1. ${GREEN}git diff${NC} — review changes"
echo "  2. Docker DB: ${GREEN}docker compose down -v && docker compose up -d${NC} (from api-web if compose lives there)"
echo "  3. ${GREEN}cd api-web && npm install${NC}"
echo "  4. ${GREEN}npx prisma generate && npx prisma migrate deploy && npm run db:seed${NC}"
echo "  5. ${GREEN}npm test${NC} and ${GREEN}npm run dev${NC}"
echo ""
echo -e "${GREEN}Happy coding with ${NEW_NAME}! 🚀${NC}"
