# 🔧 Fix Swagger UI CORS Error

## 🚨 Problem

When accessing Swagger UI at:
```
https://spring-app-177609243769.asia-northeast3.run.app/swagger-ui/index.html
```

You get a **CORS error** when trying to make API requests.

---

## 🤔 Why Does This Happen?

Even though Swagger UI and the API are on the **same domain**, CORS is still needed because:

1. Browser loads Swagger UI HTML from `https://spring-app-177609243769.asia-northeast3.run.app`
2. Swagger UI is a **JavaScript application** running in your browser
3. JavaScript makes API calls to `/api/v1/auth/signup`
4. Spring Security CORS filter checks the `Origin` header
5. ❌ **Origin not in allowed list → CORS error**

**Key Point:** The browser treats the JavaScript request as a cross-origin request, even though it's the same domain!

---

## ✅ Solution

Update your GitHub Secret `CORS_ALLOWED_ORIGINS` to include **your own backend domain**:

### **Before:**
```
CORS_ALLOWED_ORIGINS = https://dongajul-fe.vercel.app
```

### **After:**
```
CORS_ALLOWED_ORIGINS = https://dongajul-fe.vercel.app,https://spring-app-177609243769.asia-northeast3.run.app
```

---

## 📝 Steps to Fix

### 1. Update GitHub Secret

1. Go to your GitHub repository
2. Navigate to **Settings** > **Secrets and variables** > **Actions**
3. Find `CORS_ALLOWED_ORIGINS`
4. Click **Update**
5. Change value to:
   ```
   https://dongajul-fe.vercel.app,https://spring-app-177609243769.asia-northeast3.run.app
   ```
6. Click **Update secret**

### 2. Redeploy

Push a commit to `feature/1-deploy` branch or manually trigger the GitHub Action.

### 3. Verify

After deployment completes:
1. Open Swagger UI: `https://spring-app-177609243769.asia-northeast3.run.app/swagger-ui/index.html`
2. Try the signup endpoint
3. ✅ Should work without CORS errors!

---

## 🔍 Understanding CORS in This Context

### Why Same-Origin Still Needs CORS?

```
Origin: https://spring-app-177609243769.asia-northeast3.run.app
       ↓ (JavaScript in browser makes request)
Target: https://spring-app-177609243769.asia-northeast3.run.app/api/v1/auth/signup
```

Even though both are the same domain, **Spring Security's CORS filter** requires the origin to be explicitly allowed in the configuration.

### CORS Flow:

1. **Browser** sends `Origin` header with request
2. **Spring Security** checks `CorsConfig.java`
3. **CorsConfig** checks if origin is in `CORS_ALLOWED_ORIGINS`
4. If **NOT** in list → ❌ CORS error
5. If **IN** list → ✅ Add CORS headers to response

---

## 🎯 Final Configuration

Your `CORS_ALLOWED_ORIGINS` should include:

- ✅ `https://dongajul-fe.vercel.app` - Your Vercel frontend
- ✅ `https://spring-app-177609243769.asia-northeast3.run.app` - Your Cloud Run backend (for Swagger)
- ✅ Any other frontend domains you need

---

## 🚀 Quick Test

After updating and redeploying, test with curl:

```bash
curl -X OPTIONS 'https://spring-app-177609243769.asia-northeast3.run.app/api/v1/auth/signup' \
  -H 'Origin: https://spring-app-177609243769.asia-northeast3.run.app' \
  -H 'Access-Control-Request-Method: POST' \
  -v
```

**Expected response headers:**
```
Access-Control-Allow-Origin: https://spring-app-177609243769.asia-northeast3.run.app
Access-Control-Allow-Methods: GET,POST,PUT,PATCH,DELETE,OPTIONS
Access-Control-Allow-Headers: *
```

---

## 📚 Related Documentation

- `CORS_CONFIGURATION.md` - Full CORS setup guide
- `GITHUB_SECRETS_CHECKLIST.md` - All required secrets
- `DEPLOYMENT.md` - Deployment process

---

## ✅ Checklist

- [ ] Update `CORS_ALLOWED_ORIGINS` in GitHub Secrets
- [ ] Redeploy application
- [ ] Test Swagger UI
- [ ] Verify CORS headers in browser DevTools

Done! 🎉
