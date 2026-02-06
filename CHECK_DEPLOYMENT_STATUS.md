# 🔍 Check Deployment Status

## 🚨 Why Local Works But Deployment Doesn't

**Key Difference Found:**

| Environment | DDL Auto | What Happens |
|-------------|----------|--------------|
| **Local** | `update` | ✅ Creates tables automatically |
| **Production** | `validate` | ❌ Requires tables to exist! |

---

## 🎯 Most Likely Issue: App Not Starting

If Supabase database doesn't have tables, the app **won't start at all**.

---

## 📋 How to Check

### 1. **Check Cloud Run Logs** (Most Important!)

1. Go to: [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to: **Cloud Run** > `spring-app` service
3. Click: **LOGS** tab
4. Look for errors like:

**If app is not starting:**
```
Schema-validation: missing table [users]
Schema-validation: missing table [user_details]
```

**Or:**
```
HikariPool-1 - Exception during pool initialization
Connection refused
```

### 2. **Check GitHub Actions**

1. Go to: GitHub repo > **Actions** tab
2. Check latest workflow
3. Did deployment succeed? (Green checkmark?)

### 3. **Check Cloud Run Service Status**

```bash
curl https://spring-app-177609243769.asia-northeast3.run.app/actuator/health
```

**If app is running:**
```json
{"status":"UP"}
```

**If app is NOT running:**
```
503 Service Unavailable
```

---

## ✅ Solutions

### **Solution 1: Create Tables in Supabase** (Recommended for Production)

You need to create tables manually in Supabase:

#### A. Connect to Supabase

1. Go to: [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: `wzchbdlcnycaimiowcei`
3. Go to: **SQL Editor**

#### B. Run This SQL to Create Tables:

```sql
-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    nickname VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Details table (for analysis)
CREATE TABLE IF NOT EXISTS user_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    job VARCHAR(100),
    background VARCHAR(100),
    skills TEXT,
    projects INTEGER DEFAULT 0,
    intern BOOLEAN DEFAULT FALSE,
    bootcamp BOOLEAN DEFAULT FALSE,
    awards BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- Routes table (success stories)
CREATE TABLE IF NOT EXISTS routes (
    id BIGSERIAL PRIMARY KEY,
    job VARCHAR(100),
    background VARCHAR(100),
    skills TEXT,
    projects INTEGER DEFAULT 0,
    intern BOOLEAN DEFAULT FALSE,
    bootcamp BOOLEAN DEFAULT FALSE,
    awards BOOLEAN DEFAULT FALSE,
    final_company_size VARCHAR(50),
    summary TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_user_details_user_id ON user_details(user_id);
CREATE INDEX IF NOT EXISTS idx_routes_job ON routes(job);
```

#### C. Verify Tables Created

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

Should see:
- `users`
- `user_details`
- `routes`

---

### **Solution 2: Change DDL Auto to Update** (Quick Fix, Not Recommended)

⚠️ **Warning:** Not recommended for production!

Change `application-prod.yml`:
```yaml
jpa:
  hibernate:
    ddl-auto: update  # ⚠️ Use only for testing!
```

**Why not recommended:**
- Can accidentally modify/delete data
- Production best practice is `validate`
- Tables should be managed via migrations

---

### **Solution 3: Temporary Fix - Use Create**

For **first deployment only**, use `create`:

```yaml
jpa:
  hibernate:
    ddl-auto: create  # Creates tables on startup
```

Then **after first successful deployment**, change back to:
```yaml
jpa:
  hibernate:
    ddl-auto: validate
```

---

## 🔍 How to Tell Which Issue You Have

### **Issue 1: App Not Starting** (Most Likely)
- Cloud Run logs show: "Schema validation failed"
- `/actuator/health` returns 503
- **Fix:** Create tables in Supabase

### **Issue 2: App Started, But CORS Issues**
- Cloud Run logs show: "Started ServerApplication"
- `/actuator/health` returns 200
- **Fix:** Already fixed with @CrossOrigin annotation

### **Issue 3: Redis Connection Failed**
- Cloud Run logs show: "Cannot connect to Redis"
- **Fix:** Redis is optional, should work without it

---

## 🚀 Recommended Action Plan

### **Step 1: Check Cloud Run Logs**
Look for the exact error message.

### **Step 2A: If "Schema validation failed"**
→ Create tables in Supabase (Solution 1)

### **Step 2B: If "Cannot connect to Redis"**
→ Ignore it (Redis is optional)

### **Step 2C: If app started successfully**
→ Already fixed CORS with @CrossOrigin

### **Step 3: Redeploy**
After creating tables, redeploy the app.

---

## 📊 Quick Diagnosis Checklist

Run these commands:

```bash
# 1. Check if app is responding
curl https://spring-app-177609243769.asia-northeast3.run.app/actuator/health

# 2. Check if CORS works (if app is running)
curl -X OPTIONS 'https://spring-app-177609243769.asia-northeast3.run.app/api/v1/auth/signup' \
  -H 'Origin: https://test.com' \
  -v

# 3. Try actual signup (if app is running)
curl -X POST 'https://spring-app-177609243769.asia-northeast3.run.app/api/v1/auth/signup' \
  -H 'Content-Type: application/json' \
  -d '{"email":"test@test.com","password":"test123","nickname":"tester"}'
```

---

## 💡 My Guess

**Most likely:** Supabase database has no tables → App won't start → 403 errors

**Solution:** Create tables in Supabase SQL Editor (see Solution 1 above)

---

## 📝 Next Steps

1. ✅ Check Cloud Run logs
2. ✅ Create tables in Supabase if missing
3. ✅ Redeploy
4. ✅ Test!

Let me know what you find in the logs! 🔍
