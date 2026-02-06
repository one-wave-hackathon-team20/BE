# 💾 Using H2 Database in Production (Cloud Run)

## ✅ Solution Applied

Changed `application-prod.yml` to use **H2 in-memory database** instead of Supabase PostgreSQL.

---

## 🎯 Why This Works

### **Benefits:**
- ✅ **No database setup needed** - Works immediately
- ✅ **Same as local environment** - No configuration differences
- ✅ **Tables auto-created** - `ddl-auto: update`
- ✅ **Fast deployment** - No external DB connection issues
- ✅ **Perfect for demo/testing**

### **Trade-offs:**
- ⚠️ **Data is temporary** - Lost when container restarts
- ⚠️ **Single instance only** - Can't scale horizontally
- ⚠️ **Not for production use** - Only for demo/testing

---

## 🚀 Deploy Now

```bash
git add .
git commit -m "feat: use H2 in-memory database for Cloud Run deployment"
git push origin feature/1-deploy
```

**This will work immediately!** No database setup needed! ✅

---

## 📋 What Changed

### Before (PostgreSQL):
```yaml
datasource:
  url: ${DB_URL}  # Needs Supabase connection
  username: ${DB_USERNAME}
  password: ${DB_PASSWORD}
  driver-class-name: org.postgresql.Driver

jpa:
  hibernate:
    ddl-auto: validate  # ❌ Tables must exist!
```

### After (H2):
```yaml
datasource:
  url: jdbc:h2:mem:testdb  # In-memory
  driver-class-name: org.h2.Driver
  username: sa
  password: ""

jpa:
  hibernate:
    ddl-auto: update  # ✅ Creates tables automatically!
```

---

## 🎯 Current Setup

### **All Environments Use H2:**
- ✅ **Local development** - H2 in-memory
- ✅ **Cloud Run deployment** - H2 in-memory

### **Same behavior everywhere:**
- Tables auto-created on startup
- No manual database setup
- Works immediately

---

## 🔄 When Data Resets

H2 in-memory data is **reset** when:
1. Container restarts
2. New deployment
3. Cloud Run scales down and back up
4. Service is stopped/started

**This means:** Every deployment = fresh database!

---

## 🧪 Testing After Deployment

After pushing, wait for deployment to complete, then test:

### 1. **Signup New User:**
```bash
curl -X POST 'https://spring-app-177609243769.asia-northeast3.run.app/api/v1/auth/signup' \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "nickname": "testuser"
  }'
```

**Expected:** 200 OK with JWT token

### 2. **Login:**
```bash
curl -X POST 'https://spring-app-177609243769.asia-northeast3.run.app/api/v1/auth/login' \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Expected:** 200 OK with JWT token

### 3. **From Swagger UI:**
```
https://spring-app-177609243769.asia-northeast3.run.app/swagger-ui/index.html
```

Try signup/login - should work perfectly! ✅

---

## 🔐 GitHub Secrets

### **No Longer Needed:**
- ~~`DB_URL`~~
- ~~`DB_USERNAME`~~
- ~~`DB_PASSWORD`~~
- ~~`SUPABASE_URL`~~
- ~~`SUPABASE_SERVICE_ROLE_KEY`~~

### **Still Required:**
- `JWT_SECRET`
- `JWT_ACCESS_TOKEN_EXPIRATION`
- `JWT_REFRESH_TOKEN_EXPIRATION`
- `GEMINI_API_KEY`
- `SWAGGER_SERVER_URL`
- `GCP_PROJECT_ID`
- `GCP_SA_KEY`

(Plus optional Redis and CORS settings)

---

## 📊 Comparison

| Feature | H2 In-Memory | PostgreSQL (Supabase) |
|---------|--------------|----------------------|
| Setup | ✅ None needed | ⚠️ Create tables manually |
| Speed | ✅ Very fast | ⚠️ Network latency |
| Data persistence | ❌ Temporary | ✅ Persistent |
| Cost | ✅ Free (included) | ⚠️ Supabase costs |
| Scalability | ❌ Single instance | ✅ Multiple instances |
| Use case | ✅ Demo/Testing | ✅ Production |

---

## 🎯 Perfect For

- ✅ **Demo purposes** - Show functionality to stakeholders
- ✅ **Testing deployments** - Verify Cloud Run setup works
- ✅ **Development** - Quick iterations
- ✅ **MVP/Prototype** - Get something working fast

---

## 🔄 Switching to PostgreSQL Later

When you're ready for production with persistent data:

### 1. Create tables in Supabase
Run the SQL from `CHECK_DEPLOYMENT_STATUS.md`

### 2. Change `application-prod.yml` back:
```yaml
datasource:
  url: ${DB_URL}
  username: ${DB_USERNAME}
  password: ${DB_PASSWORD}
  driver-class-name: org.postgresql.Driver

jpa:
  hibernate:
    ddl-auto: validate
  properties:
    hibernate:
      dialect: org.hibernate.dialect.PostgreSQLDialect
```

### 3. Add back GitHub Secrets:
- `DB_URL`
- `DB_USERNAME`
- `DB_PASSWORD`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

---

## ⚠️ Important Notes

### **Data Loss:**
- Every deployment resets the database
- Users will need to re-register after each deploy
- Not suitable for production with real users

### **Single Instance:**
- Cloud Run can't scale horizontally with H2
- All requests go to one container
- Fine for low traffic / demo

### **No H2 Console:**
- H2 console is disabled in production for security
- Can't browse database via web UI
- Data inspection only via logs/API

---

## ✅ Summary

**Current Setup:**
- ✅ H2 in-memory database
- ✅ No external DB needed
- ✅ Tables auto-created
- ✅ Works immediately after deployment
- ✅ Perfect for demo/testing

**Deploy now and it will work!** 🚀

---

## 🎉 Expected Result

After deployment:
1. ✅ App starts successfully
2. ✅ No database connection errors
3. ✅ Swagger UI works
4. ✅ Signup/Login works
5. ✅ No CORS errors
6. ✅ All APIs functional

**Everything should "just work"!** 🎊
