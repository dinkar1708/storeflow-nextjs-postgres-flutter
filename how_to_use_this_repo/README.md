# How to Use This Repository

Welcome! This folder contains guides and tools to help you customize and deploy this project.

## 📁 Folder Structure

```
how_to_use_this_repo/
├── README.md                    # You are here
├── api-web/                     # Web App (Next.js) guides
│   ├── RENAME_GUIDE.md          # How to rename the project
│   ├── rename-project.sh        # Quick rename script (config only)
│   └── rename-project-complete.sh  # Complete rename (includes UI)
└── flutter-app/                 # Mobile App (Flutter) - Coming Soon
    └── README.md
```

---

## 🚀 Quick Start Guides

### For Web App (Next.js + PostgreSQL)

📖 **Setup Instructions**: See main project `/docs` folder
- [Setup with Docker](../docs/SETUP_WITH_DOCKER.md) (Recommended)
- [Setup without Docker](../docs/SETUP_MANUAL.md)

🎨 **Rename & Rebrand**: See `api-web/RENAME_GUIDE.md`

---

## 🛠️ Common Tasks

### 1. Rename the Project

```bash
cd how_to_use_this_repo/api-web
./rename-project-complete.sh "YourAppName" "Your Description"
```

See full guide: [api-web/RENAME_GUIDE.md](api-web/RENAME_GUIDE.md)

### 2. Setup Development Environment

```bash
# 1. Start database
docker-compose up -d

# 2. Install dependencies
cd api-web
npm install

# 3. Run migrations
npx prisma generate
npx prisma migrate deploy
npm run db:seed

# 4. Start dev server
npm run dev
```

### 3. Run Tests

```bash
cd api-web
npm test
```

### 4. Deploy to Production

See [Production Deployment Guide](../docs/PROD_DEPLOYMENT.md)

---

## 📱 Mobile App (Flutter)

Coming soon! Check [flutter-app/README.md](flutter-app/README.md) for updates.

---

## 📚 Additional Resources

- **Main README**: [../README.md](../README.md)
- **Database Setup**: [../docs/DATABASE_SETUP.md](../docs/DATABASE_SETUP.md)
- **Testing Guide**: [../docs/TESTING.md](../docs/TESTING.md)
- **Test Credentials**: [../api-web/TEST_LOGIN.md](../api-web/TEST_LOGIN.md)

---

## ❓ Need Help?

1. Check the `/docs` folder for detailed guides
2. Review `api-web/RENAME_GUIDE.md` for customization
3. Open an issue on GitHub

---

**Happy Coding! 🚀**
