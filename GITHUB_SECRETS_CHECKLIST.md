# ✅ GitHub Secrets Checklist

## 📋 Total: 17 Secrets Required

Copy and paste these values into your GitHub repository secrets.

---

## 🔑 How to Add Secrets

1. Go to your GitHub repository
2. Click **Settings** tab
3. Click **Secrets and variables** > **Actions**
4. Click **New repository secret**
5. Copy the **Name** and **Value** from below
6. Click **Add secret**
7. Repeat for all 17 secrets

---

## 📝 Secrets to Add

### 1. GCP_PROJECT_ID
```
Name: GCP_PROJECT_ID
Value: your-gcp-project-id
```
**Where to find**: GCP Console > Select Project > Project ID

---

### 2. GCP_SA_KEY
```
Name: GCP_SA_KEY
Value: {
  "type": "service_account",
  "project_id": "your-project",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  ...
}
```
**Where to find**: GCP Console > IAM & Admin > Service Accounts > Create Key > JSON

---

### 3. SUPABASE_URL
```
Name: SUPABASE_URL
Value: https://wzchbdlcnycaimiowcei.supabase.co
```

---

### 4. SUPABASE_SERVICE_ROLE_KEY
```
Name: SUPABASE_SERVICE_ROLE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6Y2hiZGxjbnljYWltaW93Y2VpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDM5NjE1MCwiZXhwIjoyMDg1OTcyMTUwfQ.PNBe5t5eomhcXcsEZP84k0p4s026y65itdAV2ZWOIl4
```

---

### 5. DB_URL
```
Name: DB_URL
Value: jdbc:postgresql://db.wzchbdlcnycaimiowcei.supabase.co:5432/postgres?sslmode=require&connectTimeout=30&socketTimeout=30&loginTimeout=30
```

---

### 6. DB_USERNAME
```
Name: DB_USERNAME
Value: postgres
```

---

### 7. DB_PASSWORD
```
Name: DB_PASSWORD
Value: WSQ4E$sGfEksB$h
```

---

### 8. JWT_SECRET ⚠️ CHANGE THIS!
```
Name: JWT_SECRET
Value: [GENERATE A STRONG RANDOM STRING - MIN 32 CHARACTERS]
```

**⚠️ IMPORTANT**: Do NOT use the test value in production!

**Generate a secure secret:**
```bash
# Linux/Mac
openssl rand -base64 32

# Result example:
xK7mP9nQ2wR5tY8uI3oE6vB1cA4fD7gH9jL2mN5qS8w=
```

Or use: https://randomkeygen.com/

---

### 9. JWT_ACCESS_TOKEN_EXPIRATION
```
Name: JWT_ACCESS_TOKEN_EXPIRATION
Value: 3600000
```
(1 hour in milliseconds)

---

### 10. JWT_REFRESH_TOKEN_EXPIRATION
```
Name: JWT_REFRESH_TOKEN_EXPIRATION
Value: 604800000
```
(7 days in milliseconds)

---

### 11. GEMINI_API_KEY
```
Name: GEMINI_API_KEY
Value: AIzaSyAe9NqeX5L7ACk7mcXPolRej-YpIZF3MIY
```
✅ Already have this key!

---

### 12. REDIS_HOST
```
Name: REDIS_HOST
Value: localhost
```
(Change to your Redis server address if you have one)

---

### 13. REDIS_PORT
```
Name: REDIS_PORT
Value: 6379
```

---

### 14. REDIS_PASSWORD
```
Name: REDIS_PASSWORD
Value: 
```
(Leave empty if Redis has no password)

---

### 15. CORS_ALLOWED_ORIGINS ⭐ IMPORTANT!
```
Name: CORS_ALLOWED_ORIGINS
Value: https://dongajul-fe.vercel.app,https://spring-app-177609243769.asia-northeast3.run.app
```

**Explanation:**
- `https://dongajul-fe.vercel.app` - Your Vercel frontend
- `https://spring-app-177609243769.asia-northeast3.run.app` - Your Cloud Run backend (for Swagger UI)

**For multiple domains:**
```
Value: https://dongajul-fe.vercel.app,https://spring-app-177609243769.asia-northeast3.run.app,https://custom-domain.com
```

---

### 16. CORS_ALLOW_CREDENTIALS
```
Name: CORS_ALLOW_CREDENTIALS
Value: false
```

**Important:** Set to `false` for public APIs. Only set to `true` if you need to send cookies.

**Note:** When `true`, you MUST use specific domains in `CORS_ALLOWED_ORIGINS` (cannot use "*")

---

### 17. SWAGGER_SERVER_URL
```
Name: SWAGGER_SERVER_URL
Value: https://spring-app-177609243769.asia-northeast3.run.app
```

**Important:** This tells Swagger UI to use HTTPS instead of HTTP for API requests.
Without this, Swagger will auto-detect as HTTP and fail with CORS errors.

---

## 🚨 Critical Items to Change

Before deploying to production, **MUST CHANGE**:

1. ✅ **JWT_SECRET** - Generate a strong random string (minimum 32 characters)
   ```bash
   openssl rand -base64 32
   ```

2. ✅ **CORS_ALLOWED_ORIGINS** - Already set to your Vercel frontend URL

3. ✅ **GCP_PROJECT_ID** and **GCP_SA_KEY** - Get from your GCP project

---

## ✅ Ready to Use (No Changes Needed)

These secrets already have correct values:

- ✅ SUPABASE_URL
- ✅ SUPABASE_SERVICE_ROLE_KEY
- ✅ DB_URL
- ✅ DB_USERNAME
- ✅ DB_PASSWORD
- ✅ GEMINI_API_KEY
- ✅ JWT_ACCESS_TOKEN_EXPIRATION
- ✅ JWT_REFRESH_TOKEN_EXPIRATION
- ✅ REDIS_HOST
- ✅ REDIS_PORT
- ✅ REDIS_PASSWORD
- ✅ CORS_ALLOWED_ORIGINS (set to your Vercel URL)
- ✅ CORS_ALLOW_CREDENTIALS

---

## 📋 Quick Copy-Paste Format

```
1. GCP_PROJECT_ID = [YOUR_GCP_PROJECT_ID]
2. GCP_SA_KEY = [YOUR_SERVICE_ACCOUNT_JSON]
3. SUPABASE_URL = https://wzchbdlcnycaimiowcei.supabase.co
4. SUPABASE_SERVICE_ROLE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6Y2hiZGxjbnljYWltaW93Y2VpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDM5NjE1MCwiZXhwIjoyMDg1OTcyMTUwfQ.PNBe5t5eomhcXcsEZP84k0p4s026y65itdAV2ZWOIl4
5. DB_URL = jdbc:postgresql://db.wzchbdlcnycaimiowcei.supabase.co:5432/postgres?sslmode=require&connectTimeout=30&socketTimeout=30&loginTimeout=30
6. DB_USERNAME = postgres
7. DB_PASSWORD = WSQ4E$sGfEksB$h
8. JWT_SECRET = [GENERATE_NEW_RANDOM_STRING_32_CHARS]
9. JWT_ACCESS_TOKEN_EXPIRATION = 3600000
10. JWT_REFRESH_TOKEN_EXPIRATION = 604800000
11. GEMINI_API_KEY = AIzaSyAe9NqeX5L7ACk7mcXPolRej-YpIZF3MIY
12. REDIS_HOST = localhost
13. REDIS_PORT = 6379
14. REDIS_PASSWORD = 
15. CORS_ALLOWED_ORIGINS = https://dongajul-fe.vercel.app,https://spring-app-177609243769.asia-northeast3.run.app
16. CORS_ALLOW_CREDENTIALS = false
17. SWAGGER_SERVER_URL = https://spring-app-177609243769.asia-northeast3.run.app
```

---

## 🧪 After Adding Secrets

1. Push to `feature/1-deploy` branch
2. Check GitHub Actions tab
3. Verify deployment succeeds
4. Test your API from frontend
5. Check Cloud Run logs for any errors

---

## 🆘 Troubleshooting

### If deployment fails:
1. Check GitHub Actions logs
2. Verify all 17 secrets are added
3. Ensure no typos in secret names (case-sensitive!)
4. Check GCP Service Account has proper permissions

### If CORS errors occur:
1. Verify `CORS_ALLOWED_ORIGINS` includes your frontend URL
2. Check that URL has correct protocol (https://)
3. No trailing slash in the URL

---

## 📞 Need Help?

Check these files for more details:
- `GITHUB_SECRETS_SETUP.md` - Detailed setup guide
- `CORS_CONFIGURATION.md` - CORS troubleshooting
- `DEPLOYMENT.md` - Deployment process

Good luck! 🚀
