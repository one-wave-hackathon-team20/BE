# 🔧 Fix 403 "Invalid CORS request" Error

## 🚨 Problem

API returns **403 Forbidden** with error message:
```
Invalid CORS request
```

---

## 🔍 Root Cause

The issue occurs when `allow-credentials: true` is set in CORS configuration.

**CORS Security Rule:**
- When `allowCredentials = true`, you **cannot** use wildcard patterns
- Spring Security's CORS filter strictly enforces this
- Requests without matching origins are rejected with 403

---

## ✅ Solution

Set `CORS_ALLOW_CREDENTIALS` to `false` (unless you really need cookies).

### **Why `false` is better for your case:**

1. ✅ You're using **JWT in Authorization header** (not cookies)
2. ✅ No need for credentials (cookies/session)
3. ✅ More flexible CORS configuration
4. ✅ Avoids strict origin matching issues

---

## 📝 Steps to Fix

### 1. Update GitHub Secret

1. Go to GitHub repository
2. **Settings** > **Secrets and variables** > **Actions**
3. Find `CORS_ALLOW_CREDENTIALS`
4. Click **Update**
5. Change value to: `false`
6. Click **Update secret**

### 2. Verify Other Secrets

Make sure these are set correctly:

```
CORS_ALLOWED_ORIGINS = https://dongajul-fe.vercel.app,https://spring-app-177609243769.asia-northeast3.run.app
CORS_ALLOW_CREDENTIALS = false
```

### 3. Redeploy

Commit current changes and push to `feature/1-deploy` branch.

### 4. Test

After deployment:

**Test with curl (no Origin header):**
```bash
curl -X POST 'https://spring-app-177609243769.asia-northeast3.run.app/api/v1/auth/signup' \
  -H 'Content-Type: application/json' \
  -d '{
  "email": "test@example.com",
  "password": "password123",
  "nickname": "testuser"
}'
```

**Test with curl (with Origin header):**
```bash
curl -X POST 'https://spring-app-177609243769.asia-northeast3.run.app/api/v1/auth/signup' \
  -H 'Origin: https://dongajul-fe.vercel.app' \
  -H 'Content-Type: application/json' \
  -d '{
  "email": "test@example.com",
  "password": "password123",
  "nickname": "testuser"
}'
```

**Test from Swagger UI:**
Open: `https://spring-app-177609243769.asia-northeast3.run.app/swagger-ui/index.html`
Try signup endpoint - should work! ✅

---

## 🤔 When to Use `allow-credentials: true`?

Only use `true` if:
- ✅ You're using **cookies** for authentication
- ✅ You need to send **session credentials**
- ✅ You're using **HTTP-only cookies** for security

**Your current setup uses JWT in Authorization header → Don't need `true`!**

---

## 📊 Understanding the Error

### What happens with `allow-credentials: true`:

```
Request from Swagger UI:
  Origin: https://spring-app-177609243769.asia-northeast3.run.app
  ↓
Spring Security CORS Check:
  1. Check if credentials allowed? YES
  2. Check if origin exactly matches allowed list? 
  3. If pattern matching or wildcard → REJECT with 403
  ↓
Result: "Invalid CORS request"
```

### With `allow-credentials: false`:

```
Request from anywhere:
  ↓
Spring Security CORS Check:
  1. Check if credentials allowed? NO
  2. More flexible origin matching
  3. Pattern matching allowed
  ↓
Result: ✅ Request allowed
```

---

## 🔐 Security Notes

### Current Setup (Recommended):
```yaml
cors:
  allow-credentials: false
  allowed-origins: https://dongajul-fe.vercel.app,https://spring-app-...
```

**Security Level:** ✅ Good
- Specific origins listed
- No credentials needed (using JWT in header)
- Authorization header works fine

### If You Need Credentials Later:
```yaml
cors:
  allow-credentials: true
  allowed-origins: https://exact-domain.com  # Must be exact!
```

**Requirements:**
- ⚠️ Origins must be **exact matches** (no wildcards)
- ⚠️ More strict configuration needed
- ⚠️ Each domain must be explicitly listed

---

## ✅ Verification Checklist

After fixing:

- [ ] `CORS_ALLOW_CREDENTIALS` = `false` in GitHub Secrets
- [ ] Code committed and pushed to `feature/1-deploy`
- [ ] GitHub Actions deployment successful
- [ ] Swagger UI works without CORS errors
- [ ] Frontend can call API successfully
- [ ] JWT Authorization header works

---

## 🆘 Still Getting 403?

Check these:

1. **Verify GitHub Secret is updated:**
   - Settings > Secrets > Check `CORS_ALLOW_CREDENTIALS` = `false`

2. **Check deployment logs:**
   - GitHub Actions tab > Latest workflow
   - Verify environment variables were injected

3. **Test with OPTIONS request:**
   ```bash
   curl -X OPTIONS 'https://spring-app-177609243769.asia-northeast3.run.app/api/v1/auth/signup' \
     -H 'Origin: https://dongajul-fe.vercel.app' \
     -H 'Access-Control-Request-Method: POST' \
     -v
   ```
   
   Should return:
   ```
   Access-Control-Allow-Origin: https://dongajul-fe.vercel.app
   Access-Control-Allow-Methods: GET,POST,PUT,PATCH,DELETE,OPTIONS
   ```

4. **Check browser console:**
   - Open DevTools > Network tab
   - Look for OPTIONS preflight request
   - Check response headers

---

## 📚 Related Files

- `CorsConfig.java` - CORS configuration class
- `application-prod.yml` - Production CORS settings
- `CORS_CONFIGURATION.md` - Full CORS guide
- `GITHUB_SECRETS_CHECKLIST.md` - All required secrets

---

**Summary:** Change `CORS_ALLOW_CREDENTIALS` to `false` and redeploy! 🚀
