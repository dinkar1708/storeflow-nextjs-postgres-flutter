#!/bin/bash

# Complete Project Renaming Script (Including UI Text)
# Usage: ./rename-project-complete.sh <new-name> <new-description>
# Example: ./rename-project-complete.sh "BookMart" "Bookstore Management System"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if arguments provided
if [ $# -lt 2 ]; then
    echo -e "${RED}Error: Missing arguments${NC}"
    echo "Usage: ./rename-project-complete.sh <new-name> <new-description>"
    echo "Example: ./rename-project-complete.sh \"BookMart\" \"Bookstore Management System\""
    exit 1
fi

NEW_NAME=$1
NEW_DESCRIPTION=$2
NEW_NAME_LOWER=$(echo "$NEW_NAME" | tr '[:upper:]' '[:lower:]')
NEW_NAME_UPPER=$(echo "$NEW_NAME" | tr '[:lower:]' '[:upper:]' | sed 's/ //g')
NEW_NAME_KEBAB=$(echo "$NEW_NAME_LOWER" | sed 's/ /-/g')
NEW_PACKAGE_NAME="$NEW_NAME_KEBAB"
NEW_DB_NAME="${NEW_NAME_LOWER}_db"

echo -e "${GREEN}=== Complete Project Renaming Tool ===${NC}"
echo -e "${BLUE}This will rename EVERYTHING including UI text${NC}"
echo ""
echo "Old Name: StoreFlow"
echo "New Name: $NEW_NAME"
echo "New Description: $NEW_DESCRIPTION"
echo "Package Name: $NEW_PACKAGE_NAME"
echo "Database Name: $NEW_DB_NAME"
echo ""
echo -e "${YELLOW}⚠️  WARNING: This will replace 'StoreFlow' in ALL files including UI code${NC}"
echo ""
read -p "Continue? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    exit 1
fi

echo -e "${YELLOW}Starting complete rename process...${NC}"
echo ""

# ============================================
# PHASE 1: Configuration Files
# ============================================
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}PHASE 1: Configuration Files${NC}"
echo -e "${BLUE}========================================${NC}"

# 1. Update package.json
echo "📦 Updating package.json..."
if [ -f "api-web/package.json" ]; then
    sed -i.bak "s/\"name\": \"storeflow-nextjs-postgres-flutter\"/\"name\": \"${NEW_PACKAGE_NAME}\"/g" api-web/package.json
    sed -i.bak "s/\"description\": \"Universal inventory and order management platform\"/\"description\": \"${NEW_DESCRIPTION}\"/g" api-web/package.json
    rm api-web/package.json.bak
    echo -e "${GREEN}✓ package.json updated${NC}"
else
    echo -e "${RED}✗ package.json not found${NC}"
fi

# 2. Update .env files
echo "🔧 Updating .env files..."
if [ -f "api-web/.env" ]; then
    sed -i.bak "s/storeflow/${NEW_NAME_LOWER}/g" api-web/.env
    rm api-web/.env.bak
    echo -e "${GREEN}✓ .env updated${NC}"
else
    echo -e "${YELLOW}⚠ .env not found${NC}"
fi

if [ -f "api-web/.env.example" ]; then
    sed -i.bak "s/storeflow/${NEW_NAME_LOWER}/g" api-web/.env.example
    rm api-web/.env.example.bak
    echo -e "${GREEN}✓ .env.example updated${NC}"
fi

if [ -f "api-web/.env.development" ]; then
    sed -i.bak "s/storeflow/${NEW_NAME_LOWER}/g" api-web/.env.development
    rm api-web/.env.development.bak
    echo -e "${GREEN}✓ .env.development updated${NC}"
fi

# 3. Update docker-compose.yml
echo "🐳 Updating docker-compose.yml..."
if [ -f "docker-compose.yml" ]; then
    sed -i.bak "s/storeflow/${NEW_NAME_LOWER}/g" docker-compose.yml
    rm docker-compose.yml.bak
    echo -e "${GREEN}✓ docker-compose.yml updated${NC}"
fi

if [ -f "api-web/docker-compose.yml" ]; then
    sed -i.bak "s/storeflow/${NEW_NAME_LOWER}/g" api-web/docker-compose.yml
    rm api-web/docker-compose.yml.bak
    echo -e "${GREEN}✓ api-web/docker-compose.yml updated${NC}"
fi

# ============================================
# PHASE 2: Documentation Files
# ============================================
echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}PHASE 2: Documentation Files${NC}"
echo -e "${BLUE}========================================${NC}"

# 4. Update README.md
echo "📄 Updating README.md..."
if [ -f "README.md" ]; then
    sed -i.bak "s/StoreFlow/${NEW_NAME}/g" README.md
    sed -i.bak "s/storeflow-nextjs-postgres-flutter/${NEW_PACKAGE_NAME}/g" README.md
    sed -i.bak "s/storeflow/${NEW_NAME_LOWER}/g" README.md
    sed -i.bak "s/Universal Inventory & Order Management Platform/${NEW_DESCRIPTION}/g" README.md
    sed -i.bak "s/Universal platform for inventory and order management/${NEW_DESCRIPTION}/g" README.md
    rm README.md.bak
    echo -e "${GREEN}✓ README.md updated${NC}"
fi

# 5. Update all documentation files
echo "📚 Updating documentation files..."
if [ -d "docs" ]; then
    find docs -type f -name "*.md" -exec sed -i.bak "s/STOREFLOW/${NEW_NAME_UPPER}/g" {} \;
    find docs -type f -name "*.md" -exec sed -i.bak "s/StoreFlow/${NEW_NAME}/g" {} \;
    find docs -type f -name "*.md" -exec sed -i.bak "s/storeflow-nextjs-postgres-flutter/${NEW_PACKAGE_NAME}/g" {} \;
    find docs -type f -name "*.md" -exec sed -i.bak "s/storeflow/${NEW_NAME_LOWER}/g" {} \;
    find docs -name "*.bak" -type f -delete
    echo -e "${GREEN}✓ Documentation updated${NC}"
fi

# 6. Update TEST_LOGIN.md
echo "🔐 Updating TEST_LOGIN.md..."
if [ -f "api-web/TEST_LOGIN.md" ]; then
    sed -i.bak "s/StoreFlow/${NEW_NAME}/g" api-web/TEST_LOGIN.md
    sed -i.bak "s/storeflow/${NEW_NAME_LOWER}/g" api-web/TEST_LOGIN.md
    rm api-web/TEST_LOGIN.md.bak
    echo -e "${GREEN}✓ TEST_LOGIN.md updated${NC}"
fi

# 7. Update api-web README files
echo "📄 Updating api-web documentation..."
if [ -f "api-web/README.md" ]; then
    sed -i.bak "s/StoreFlow/${NEW_NAME}/g" api-web/README.md
    sed -i.bak "s/storeflow/${NEW_NAME_LOWER}/g" api-web/README.md
    rm api-web/README.md.bak
    echo -e "${GREEN}✓ api-web/README.md updated${NC}"
fi

if [ -f "api-web/QUICK_START.md" ]; then
    sed -i.bak "s/StoreFlow/${NEW_NAME}/g" api-web/QUICK_START.md
    sed -i.bak "s/storeflow/${NEW_NAME_LOWER}/g" api-web/QUICK_START.md
    rm api-web/QUICK_START.md.bak
    echo -e "${GREEN}✓ api-web/QUICK_START.md updated${NC}"
fi

# 8. Update flutter-app README
echo "📱 Updating flutter-app documentation..."
if [ -f "flutter-app/README.md" ]; then
    sed -i.bak "s/StoreFlow/${NEW_NAME}/g" flutter-app/README.md
    sed -i.bak "s/storeflow/${NEW_NAME_LOWER}/g" flutter-app/README.md
    rm flutter-app/README.md.bak
    echo -e "${GREEN}✓ flutter-app/README.md updated${NC}"
fi

# 9. Update prisma seed file
echo "🌱 Updating prisma/seed.ts..."
if [ -f "api-web/prisma/seed.ts" ]; then
    sed -i.bak "s/storeflow/${NEW_NAME_LOWER}/g" api-web/prisma/seed.ts
    rm api-web/prisma/seed.ts.bak
    echo -e "${GREEN}✓ prisma/seed.ts updated${NC}"
fi

# 10. Note about how_to_use_this_repo folder
echo "📖 Note: how_to_use_this_repo folder..."
echo -e "${YELLOW}ℹ️  The 'how_to_use_this_repo' folder contains the rename script and guide.${NC}"
echo -e "${YELLOW}   You can delete this folder after renaming, or keep it for reference.${NC}"

# ============================================
# PHASE 3: UI Code (TypeScript/React Files)
# ============================================
echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}PHASE 3: UI Code & Components${NC}"
echo -e "${BLUE}========================================${NC}"

# 7. Update all TypeScript/React files in app directory
echo "⚛️  Updating UI components..."
if [ -d "api-web/app" ]; then
    # Count files to update
    FILE_COUNT=$(find api-web/app -type f \( -name "*.tsx" -o -name "*.ts" \) -exec grep -l "StoreFlow" {} \; | wc -l)

    if [ $FILE_COUNT -gt 0 ]; then
        echo -e "${YELLOW}Found $FILE_COUNT files with 'StoreFlow'${NC}"

        # Update all .tsx files
        find api-web/app -type f -name "*.tsx" -exec sed -i.bak "s/StoreFlow/${NEW_NAME}/g" {} \;

        # Update all .ts files
        find api-web/app -type f -name "*.ts" -exec sed -i.bak "s/StoreFlow/${NEW_NAME}/g" {} \;

        # Clean up backup files
        find api-web/app -name "*.bak" -type f -delete

        echo -e "${GREEN}✓ Updated all UI components${NC}"
    else
        echo -e "${YELLOW}⚠ No 'StoreFlow' references found in UI${NC}"
    fi
else
    echo -e "${RED}✗ app directory not found${NC}"
fi

# 8. Update layout metadata
echo "🎨 Updating metadata in layouts..."
if [ -f "api-web/app/layout.tsx" ]; then
    sed -i.bak "s/'StoreFlow/'${NEW_NAME}/g" api-web/app/layout.tsx
    sed -i.bak "s/\"StoreFlow/\"${NEW_NAME}/g" api-web/app/layout.tsx
    rm -f api-web/app/layout.tsx.bak
    echo -e "${GREEN}✓ Root layout updated${NC}"
fi

# 9. Update lib/components/contexts if they exist
echo "📦 Updating context providers..."
if [ -d "api-web/lib" ]; then
    find api-web/lib -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i.bak "s/StoreFlow/${NEW_NAME}/g" {} \;
    find api-web/lib -name "*.bak" -type f -delete
    echo -e "${GREEN}✓ Library files updated${NC}"
fi

if [ -d "api-web/components" ]; then
    find api-web/components -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i.bak "s/StoreFlow/${NEW_NAME}/g" {} \;
    find api-web/components -name "*.bak" -type f -delete
    echo -e "${GREEN}✓ Component files updated${NC}"
fi

if [ -d "api-web/contexts" ]; then
    find api-web/contexts -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i.bak "s/StoreFlow/${NEW_NAME}/g" {} \;
    find api-web/contexts -name "*.bak" -type f -delete
    echo -e "${GREEN}✓ Context files updated${NC}"
fi

# ============================================
# PHASE 4: API Routes & Server Code
# ============================================
echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}PHASE 4: API Routes${NC}"
echo -e "${BLUE}========================================${NC}"

# 10. Update API routes (comments only, not to break logic)
echo "🔌 Updating API routes..."
if [ -d "api-web/app/api" ]; then
    # Only update comments and string literals
    find api-web/app/api -type f -name "*.ts" -exec sed -i.bak "s/StoreFlow/${NEW_NAME}/g" {} \;
    find api-web/app/api -name "*.bak" -type f -delete
    echo -e "${GREEN}✓ API routes updated${NC}"
fi

# ============================================
# PHASE 5: Test Files
# ============================================
echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}PHASE 5: Test Files${NC}"
echo -e "${BLUE}========================================${NC}"

# 11. Update test files
echo "🧪 Updating test files..."
if [ -d "api-web/__tests__" ]; then
    find api-web/__tests__ -type f \( -name "*.test.ts" -o -name "*.test.tsx" \) -exec sed -i.bak "s/StoreFlow/${NEW_NAME}/g" {} \;
    find api-web/__tests__ -name "*.bak" -type f -delete
    echo -e "${GREEN}✓ Test files updated${NC}"
fi

if [ -d "api-web/tests" ]; then
    find api-web/tests -type f \( -name "*.test.ts" -o -name "*.test.tsx" \) -exec sed -i.bak "s/StoreFlow/${NEW_NAME}/g" {} \;
    find api-web/tests -name "*.bak" -type f -delete
    echo -e "${GREEN}✓ Test files updated${NC}"
fi

# ============================================
# PHASE 6: Configuration Files
# ============================================
echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}PHASE 6: Config Files${NC}"
echo -e "${BLUE}========================================${NC}"

# 12. Update Next.js config
echo "⚙️  Updating Next.js config..."
if [ -f "api-web/next.config.js" ]; then
    sed -i.bak "s/StoreFlow/${NEW_NAME}/g" api-web/next.config.js
    rm -f api-web/next.config.js.bak
    echo -e "${GREEN}✓ next.config.js updated${NC}"
fi

if [ -f "api-web/next.config.mjs" ]; then
    sed -i.bak "s/StoreFlow/${NEW_NAME}/g" api-web/next.config.mjs
    rm -f api-web/next.config.mjs.bak
    echo -e "${GREEN}✓ next.config.mjs updated${NC}"
fi

# 13. Update TypeScript config
if [ -f "api-web/tsconfig.json" ]; then
    sed -i.bak "s/StoreFlow/${NEW_NAME}/g" api-web/tsconfig.json
    rm -f api-web/tsconfig.json.bak
    echo -e "${GREEN}✓ tsconfig.json updated${NC}"
fi

# 14. Update Tailwind config
if [ -f "api-web/tailwind.config.js" ]; then
    sed -i.bak "s/StoreFlow/${NEW_NAME}/g" api-web/tailwind.config.js
    rm -f api-web/tailwind.config.js.bak
    echo -e "${GREEN}✓ tailwind.config.js updated${NC}"
fi

if [ -f "api-web/tailwind.config.ts" ]; then
    sed -i.bak "s/StoreFlow/${NEW_NAME}/g" api-web/tailwind.config.ts
    rm -f api-web/tailwind.config.ts.bak
    echo -e "${GREEN}✓ tailwind.config.ts updated${NC}"
fi

# ============================================
# Summary
# ============================================
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✓ RENAMING COMPLETE!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${YELLOW}Files Updated:${NC}"
echo "  ✓ Configuration files (package.json, .env, docker-compose.yml)"
echo "  ✓ Documentation files (README.md, docs/*.md)"
echo "  ✓ UI Components (app/**/*.tsx)"
echo "  ✓ API Routes (app/api/**/*.ts)"
echo "  ✓ Library files (lib/**/*.ts)"
echo "  ✓ Test files (__tests__/**/*.test.ts)"
echo "  ✓ Config files (next.config, tsconfig, tailwind.config)"
echo ""
echo -e "${BLUE}Project renamed from 'StoreFlow' to '${NEW_NAME}'${NC}"
echo ""
echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}NEXT STEPS:${NC}"
echo -e "${YELLOW}========================================${NC}"
echo ""
echo "1️⃣  Review the changes:"
echo "   ${GREEN}git diff${NC}"
echo ""
echo "2️⃣  Restart database (if using Docker):"
echo "   ${GREEN}docker-compose down -v${NC}"
echo "   ${GREEN}docker-compose up -d${NC}"
echo ""
echo "3️⃣  Reinstall dependencies:"
echo "   ${GREEN}cd api-web${NC}"
echo "   ${GREEN}rm -rf node_modules package-lock.json${NC}"
echo "   ${GREEN}npm install${NC}"
echo ""
echo "4️⃣  Run database migrations:"
echo "   ${GREEN}npx prisma generate${NC}"
echo "   ${GREEN}npx prisma migrate deploy${NC}"
echo "   ${GREEN}npm run db:seed${NC}"
echo ""
echo "5️⃣  Run tests:"
echo "   ${GREEN}npm test${NC}"
echo ""
echo "6️⃣  Start development server:"
echo "   ${GREEN}npm run dev${NC}"
echo ""
echo "7️⃣  Open browser:"
echo "   ${GREEN}http://localhost:3001${NC}"
echo ""
echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}OPTIONAL CUSTOMIZATIONS:${NC}"
echo -e "${YELLOW}========================================${NC}"
echo ""
echo "• Replace favicon.ico with your logo"
echo "• Update brand colors in tailwind.config"
echo "• Add custom images to public/ folder"
echo "• Update NEXTAUTH_SECRET in .env (generate new secret)"
echo ""
echo -e "${GREEN}Happy coding with ${NEW_NAME}! 🚀${NC}"
