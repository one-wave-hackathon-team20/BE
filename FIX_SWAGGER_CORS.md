# 🔧 Fix Swagger UI CORS Error

## 🚨 Problem

When accessing Swagger UI at:
```
https://spring-app-177609243769.asia-northeast3.run.app/swagger-ui/index.html
```

You get a **CORS error** when trying to make API requests:
```
Failed to fetch.
Possible Reasons:
- CORS
- Network Failure
- URL scheme must be "http" or "https" for CORS request.
```

**Root Cause:** Swagger UI is generating requests to `http://` instead of `https://`

---

## 🤔 Why Does This Happen?

1. Cloud Run provides **HTTPS** automatically
2. But internally, Cloud Run forwards traffic as **HTTP** to your container
3. Swagger UI auto-detects the protocol from the incoming request
4. ❌ **Swagger thinks it's HTTP, generates HTTP URLs**
5. Browser blocks mixed content (HTTPS page → HTTP request)

---

## ✅ Solution

Configure Swagger to use the correct **HTTPS** URL explicitly.

### **Changes Made:**

1. ✅ Updated `SwaggerConfig.java` to accept server URL configuration
2. ✅ Added `swagger.server-url` to `application-prod.yml`
3. ✅ New GitHub Secret: `SWAGGER_SERVER_URL`

---

## 📝 Steps to Fix

### 1. Update GitHub Secret

Add a **new secret**:

1. Go to your GitHub repository
2. Navigate to **Settings** > **Secrets and variables** > **Actions**
3. Click **New repository secret**
4. Add:
   ```
   Name: SWAGGER_SERVER_URL
   Value: https://spring-app-177609243769.asia-northeast3.run.app
   ```
5. Click **Add secret**

### 2. Update CORS_ALLOWED_ORIGINS

Also update the existing `CORS_ALLOWED_ORIGINS` to include backend URL:

```
Name: CORS_ALLOWED_ORIGINS
Value: https://dongajul-fe.vercel.app,https://spring-app-177609243769.asia-northeast3.run.app
```

### 3. Redeploy

Push this commit to `feature/1-deploy` branch to trigger deployment.

### 4. Verify

After deployment completes:
1. Open Swagger UI: `https://spring-app-177609243769.asia-northeast3.run.app/swagger-ui/index.html`
2. Check the "Servers" dropdown at the top
3. Should show: `https://spring-app-177609243769.asia-northeast3.run.app`
4. Try the signup endpoint
5. ✅ Should work without CORS errors!

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
