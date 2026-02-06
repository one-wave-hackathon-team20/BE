# 🌐 CORS Configuration Guide

## 📋 Overview

This project uses a centralized CORS (Cross-Origin Resource Sharing) configuration that can be customized via environment variables.

## 🔧 Configuration Files

### 1. **CorsConfig.java**
Location: `src/main/java/com/onewave/server/global/config/CorsConfig.java`

This is the main CORS configuration class that reads settings from `application.yml`.

### 2. **application.yml** (Development)
```yaml
cors:
  allowed-origins: "*"  # Allow all origins for development
  allowed-methods: GET,POST,PUT,PATCH,DELETE,OPTIONS
  allowed-headers: "*"
  exposed-headers: Authorization
  allow-credentials: false
  max-age: 3600
```

### 3. **application-prod.yml** (Production)
```yaml
cors:
  allowed-origins: ${CORS_ALLOWED_ORIGINS:https://yourdomain.com}
  allowed-methods: GET,POST,PUT,PATCH,DELETE,OPTIONS
  allowed-headers: "*"
  exposed-headers: Authorization
  allow-credentials: ${CORS_ALLOW_CREDENTIALS:true}
  max-age: 3600
```

## 🎯 Configuration Options

### `allowed-origins`
**What it does**: Specifies which frontend domains can access your API  
**Development**: `*` (allow all origins)  
**Production**: Specific domains only (e.g., `https://yourdomain.com,https://app.yourdomain.com`)

⚠️ **Security Warning**: Never use `*` in production! Always specify exact frontend URLs.

### `allowed-methods`
**What it does**: HTTP methods that are allowed  
**Default**: `GET,POST,PUT,PATCH,DELETE,OPTIONS`

### `allowed-headers`
**What it does**: Request headers that frontend can send  
**Default**: `*` (all headers allowed)  
**Common headers**: `Content-Type`, `Authorization`, `X-Requested-With`

### `exposed-headers`
**What it does**: Response headers that frontend can read  
**Default**: `Authorization`  
**Why**: Allows frontend to read JWT tokens from response headers

### `allow-credentials`
**What it does**: Whether to allow cookies and authorization headers  
**Default**: `false`  
**Set to `true` when**:
- Using cookies for authentication
- Need to send `withCredentials: true` from frontend

⚠️ **Important**: When `allow-credentials: true`, `allowed-origins` cannot be `*`. You must specify exact domains.

### `max-age`
**What it does**: How long (in seconds) browsers cache preflight requests  
**Default**: `3600` (1 hour)

## 🚀 Usage Examples

### Development Environment
```yaml
# .env or application.yml
cors:
  allowed-origins: "*"
  allow-credentials: false
```

### Production Environment with Single Domain
```yaml
cors:
  allowed-origins: "https://myapp.com"
  allow-credentials: true
```

### Production Environment with Multiple Domains
```yaml
cors:
  allowed-origins: "https://dongajul-fe.vercel.app,https://myapp.com,https://www.myapp.com"
  allow-credentials: true
```

**Real Example for this project:**
```yaml
cors:
  allowed-origins: "https://dongajul-fe.vercel.app"
  allow-credentials: true
```

### Frontend Setup (React/Vue/Angular)

#### Axios Example
```javascript
// When allow-credentials is true
axios.defaults.withCredentials = true;

axios.get('https://api.yourdomain.com/api/v1/users', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

#### Fetch API Example
```javascript
fetch('https://api.yourdomain.com/api/v1/users', {
  method: 'GET',
  credentials: 'include', // When allow-credentials is true
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

## 🔒 Security Best Practices

### ✅ DO:
- Specify exact frontend domains in production
- Use HTTPS for all production domains
- Set `allow-credentials: true` only when necessary
- Keep `max-age` reasonable (1 hour default is good)

### ❌ DON'T:
- Use `allowed-origins: "*"` in production
- Use `allowed-origins: "*"` with `allow-credentials: true` (this won't work anyway)
- Allow unnecessary HTTP methods
- Expose sensitive headers unnecessarily

## 🐛 Troubleshooting

### Issue: CORS error in browser console
```
Access to fetch at 'https://api.example.com' from origin 'https://app.example.com' 
has been blocked by CORS policy
```

**Solution**:
1. Check if frontend domain is in `allowed-origins`
2. Verify `allowed-methods` includes your HTTP method
3. If using credentials, ensure `allow-credentials: true`
4. Clear browser cache and restart backend

### Issue: Preflight request fails
**Solution**:
1. Ensure `OPTIONS` is in `allowed-methods`
2. Check `allowed-headers` includes all headers you're sending
3. Verify backend is running and accessible

### Issue: Can't read Authorization header in frontend
**Solution**:
Add `Authorization` to `exposed-headers`:
```yaml
cors:
  exposed-headers: Authorization
```

## 📝 Environment Variables for Deployment

Add these to your GitHub Secrets:

```
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
CORS_ALLOW_CREDENTIALS=true
```

See `GITHUB_SECRETS_SETUP.md` for complete deployment configuration.

## 🔄 Testing CORS Configuration

### Using curl
```bash
# Test preflight request
curl -X OPTIONS http://localhost:8080/api/v1/users \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: GET" \
  -v

# Test actual request
curl -X GET http://localhost:8080/api/v1/users \
  -H "Origin: http://localhost:3000" \
  -H "Authorization: Bearer your-token" \
  -v
```

### Expected Response Headers
```
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: GET,POST,PUT,PATCH,DELETE,OPTIONS
Access-Control-Allow-Headers: *
Access-Control-Expose-Headers: Authorization
Access-Control-Max-Age: 3600
```

## 📚 References

- [MDN CORS Documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Spring Security CORS](https://docs.spring.io/spring-security/reference/servlet/integrations/cors.html)
