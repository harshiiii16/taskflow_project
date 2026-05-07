# 🚀 TaskFlow — Deployment Guide (GitHub + Railway)

---

## PART 1 — Push to GitHub

### Step 1: Create a GitHub repository

1. Go to https://github.com/new
2. Repository name: `taskflow`
3. Set to **Public** (Railway free tier works with public repos) or Private
4. Do NOT initialize with README (you already have one)
5. Click **Create repository**

### Step 2: Push your code

Open your terminal in the `taskflow/` folder and run:

```bash
git init
git add .
git commit -m "feat: initial TaskFlow full-stack app"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/taskflow.git
git push -u origin main
```

> Replace `YOUR_USERNAME` with your actual GitHub username.

✅ Your code is now on GitHub!

---

## PART 2 — Deploy Backend on Railway

### Step 1: Create Railway account & project

1. Go to https://railway.app → **Login with GitHub**
2. Click **New Project**
3. Select **Deploy from GitHub repo**
4. Select your `taskflow` repository
5. When asked for the root directory → type `backend`
6. Railway will auto-detect the `Dockerfile`

### Step 2: Add MySQL database

1. In your Railway project, click **+ New**
2. Select **Database → MySQL**
3. Railway automatically sets env vars: `MYSQLHOST`, `MYSQLPORT`, `MYSQLDATABASE`, `MYSQLUSER`, `MYSQLPASSWORD`

### Step 3: Set backend environment variables

In your backend Railway service → **Variables** tab, add:

| Key | Value |
|-----|-------|
| `SPRING_PROFILES_ACTIVE` | `prod` |
| `JWT_SECRET` | _(run `openssl rand -hex 64` to generate)_ |
| `JWT_EXPIRATION_MS` | `86400000` |
| `FRONTEND_URL` | _(leave blank for now, update after frontend deploy)_ |

### Step 4: Initialize the database

After the backend deploys:

1. Go to your MySQL service in Railway
2. Click **Connect → MySQL CLI** (or use a GUI like TablePlus with the credentials shown)
3. Run the schema:

```sql
-- Paste contents of database/schema.sql
-- Then optionally paste database/seed.sql
```

### Step 5: Get your backend URL

In the backend service → **Settings** → **Networking** → **Generate Domain**

Copy the URL — it looks like: `https://taskflow-backend-production-xxxx.up.railway.app`

✅ Backend is live!

---

## PART 3 — Deploy Frontend on Railway

### Step 1: Add another service

1. In the same Railway project → **+ New → GitHub Repo**
2. Same `taskflow` repo
3. Root directory: `frontend`
4. Railway detects `Dockerfile` automatically

### Step 2: Update the frontend API URL

Before deploying, update your production environment file:

**`frontend/src/environments/environment.prod.ts`**
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://YOUR_BACKEND_RAILWAY_URL/api'   // ← paste your backend URL here
};
```

Commit and push:
```bash
git add frontend/src/environments/environment.prod.ts
git commit -m "fix: update production API URL"
git push
```

### Step 3: Generate frontend domain

Frontend service → **Settings** → **Networking** → **Generate Domain**

### Step 4: Update backend CORS

Go back to backend service → **Variables** → update:

| Key | Value |
|-----|-------|
| `FRONTEND_URL` | `https://YOUR_FRONTEND_RAILWAY_URL` |

Railway will redeploy automatically.

✅ Frontend is live!

---

## PART 4 — Verify Everything Works

1. Open your frontend URL in browser
2. Login with demo credentials:
   - Admin: `admin@demo.com` / `admin123`
   - Member: `member@demo.com` / `member123`
3. Test backend health: `https://YOUR_BACKEND_URL/api/health`

---

## 🔧 Troubleshooting

| Problem | Solution |
|---------|----------|
| Backend won't start | Check Railway logs → Variables tab (all MySQL vars must be set) |
| CORS error in browser | Make sure `FRONTEND_URL` env var matches your exact frontend URL |
| 404 on page refresh | nginx.conf handles this — ensure frontend deployed with provided Dockerfile |
| DB connection refused | Make sure MySQL service is running and linked to backend service |
| JWT errors | Ensure `JWT_SECRET` is set and at least 32 characters |

---

## 📁 Files Added for Deployment

```
taskflow/
├── railway.toml                          ← Railway project config
├── .env.railway.example                  ← Env var reference
├── backend/
│   ├── Dockerfile                        ← Multi-stage Java build
│   └── src/main/resources/
│       └── application-prod.properties   ← Production config (uses env vars)
│   └── src/main/java/com/taskflow/
│       └── controller/HealthController.java  ← /api/health endpoint
└── frontend/
    ├── Dockerfile                        ← Node build + nginx serve
    └── nginx.conf                        ← SPA routing fix
```

---

## 💡 Tips

- **Free tier**: Railway gives $5/month credit free — enough for small projects
- **Auto-deploy**: Every `git push` to `main` triggers a Railway redeploy automatically
- **Logs**: Railway dashboard → your service → **Logs** tab for debugging
- **Scale**: You can upgrade Railway plans as your app grows
