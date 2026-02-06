# ⚡ Quick Fix: 403 "Invalid CORS request"

## 🚨 Problem
```
Error: response status is 403
Response body: Invalid CORS request
```

## ✅ Solution (1 minute fix!)

### **Change GitHub Secret:**

```
CORS_ALLOW_CREDENTIALS = false
```

**How:**
1. GitHub repo → Settings → Secrets and variables → Actions
2. Find `CORS_ALLOW_CREDENTIALS`
3. Click **Update**
4. Change to: `false`
5. Click **Update secret**

### **Redeploy:**
Push this commit to `feature/1-deploy`

### **Done!** ✅

---

## 🤔 Why?

- You're using **JWT in Authorization header** (not cookies)
- `allow-credentials: true` is **too strict** for your use case
- Setting it to `false` allows **more flexible CORS matching**
- Your API will still work perfectly with JWT!

---

## 📋 Final Secrets Config

```
CORS_ALLOWED_ORIGINS = https://dongajul-fe.vercel.app,https://spring-app-177609243769.asia-northeast3.run.app
CORS_ALLOW_CREDENTIALS = false ← Changed this!
```

---

That's it! One secret change, one redeploy, problem solved. 🎉
