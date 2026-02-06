# 🔧 Swagger HTTPS Fix - Quick Summary

## 🚨 The Problem

Swagger UI shows this error:
```
Failed to fetch.
URL scheme must be "http" or "https" for CORS request.
```

**Why?** Swagger is making requests to `http://` instead of `https://`

---

## 🎯 The Solution

Tell Swagger to use **HTTPS** explicitly by adding a new environment variable.

---

## ✅ What to Do

### **Add 1 New GitHub Secret:**

```
Name: SWAGGER_SERVER_URL
Value: https://spring-app-177609243769.asia-northeast3.run.app
```

### **How to Add:**
1. GitHub repo → **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Enter name and value above
4. Click **Add secret**

### **Total Secrets Now: 17** (was 16)

---

## 🔄 After Adding Secret

1. Commit and push this code to `feature/1-deploy`
2. Wait for GitHub Actions to deploy
3. Open Swagger UI
4. Check "Servers" dropdown shows: `https://spring-app-...`
5. Test API endpoints - should work! ✅

---

## 📋 Complete Secrets List

You should now have these **17 secrets**:

1. GCP_PROJECT_ID
2. GCP_SA_KEY
3. SUPABASE_URL
4. SUPABASE_SERVICE_ROLE_KEY
5. DB_URL
6. DB_USERNAME
7. DB_PASSWORD
8. JWT_SECRET
9. JWT_ACCESS_TOKEN_EXPIRATION
10. JWT_REFRESH_TOKEN_EXPIRATION
11. GEMINI_API_KEY
12. REDIS_HOST
13. REDIS_PORT
14. REDIS_PASSWORD
15. CORS_ALLOWED_ORIGINS
16. CORS_ALLOW_CREDENTIALS
17. **SWAGGER_SERVER_URL** ⭐ NEW!

---

## 🧪 How to Verify It Works

After deployment:

1. Open: `https://spring-app-177609243769.asia-northeast3.run.app/swagger-ui/index.html`
2. Look at the **Servers** dropdown at the top
3. Should show: `Production Server - https://spring-app-...`
4. Try POST `/api/v1/auth/signup`
5. Should work without CORS errors! ✅

---

## 🔍 Technical Explanation

**Problem:**
- Cloud Run uses HTTPS externally
- But forwards HTTP internally to your container
- Swagger auto-detects protocol from incoming request
- Sees HTTP → generates HTTP URLs
- Browser blocks: HTTPS page can't call HTTP API (mixed content)

**Solution:**
- Explicitly configure Swagger with HTTPS URL
- Swagger uses configured URL instead of auto-detection
- All requests use HTTPS ✅

---

## 📚 Files Modified

- ✅ `SwaggerConfig.java` - Added server URL configuration
- ✅ `application.yml` - Added swagger.server-url (empty for local)
- ✅ `application-prod.yml` - Added swagger.server-url with HTTPS URL
- ✅ `.env` - Added SWAGGER_SERVER_URL for local dev
- ✅ `deploy.yml` - Added SWAGGER_SERVER_URL to env_vars
- ✅ `GITHUB_SECRETS_CHECKLIST.md` - Added secret #17

---

## ⚡ Quick Reference

**Local Development:**
```yaml
swagger:
  server-url: http://localhost:8080  # or empty for auto-detect
```

**Production (Cloud Run):**
```yaml
swagger:
  server-url: https://spring-app-177609243769.asia-northeast3.run.app
```

---

That's it! Add the secret and deploy. 🚀
