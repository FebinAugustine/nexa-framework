# Nexa Framework Security

## Overview

Nexa Framework is designed with security as a first-class concern. It provides **built-in security protections** that automatically safeguard your applications from common web vulnerabilities, while also allowing customization for specific requirements.

## Security by Default

Nexa implements several security measures automatically, without any configuration required from developers.

### 1. Default Security Headers

Every response from Nexa includes these security headers:

```javascript
// core/security.js
export const DEFAULT_SECURITY_HEADERS = {
    "X-Frame-Options": "DENY",           // Prevent clickjacking
    "X-Content-Type-Options": "nosniff", // Prevent MIME type sniffing
    "Referrer-Policy": "strict-origin-when-cross-origin", // Control referrer information
    "Permissions-Policy": "geolocation=(), microphone=(), camera=()" // Disable unnecessary permissions
};
```

#### What these headers do:

- **X-Frame-Options: DENY**: Prevents your pages from being embedded in iframes, protecting against clickjacking attacks.
- **X-Content-Type-Options: nosniff**: Prevents browsers from interpreting files as a different MIME type than what's specified in the Content-Type header, reducing the risk of cross-site scripting (XSS) attacks.
- **Referrer-Policy: strict-origin-when-cross-origin**: Controls how much referrer information is sent with requests, balancing privacy and functionality.
- **Permissions-Policy**: Disables access to geolocation, microphone, and camera by default, reducing the attack surface.

### 2. CORS Configuration

Nexa provides a built-in CORS (Cross-Origin Resource Sharing) configuration:

```javascript
// core/security.js
export function applyCORSHeaders(headers = {}) {
    return {
        ...headers,
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization"
    };
}
```

By default, CORS headers are applied to API routes and proxy calls.

### 3. Path Traversal Protection

Nexa prevents directory traversal attacks with path validation:

```javascript
// core/security.js
export function isSafePath(path) {
    // Prevent directory traversal
    return !path.includes("..") && !path.startsWith("/../") && !path.endsWith("/..");
}
```

This check ensures that users can't access files outside the intended directories.

## Authentication & Authorization

Nexa provides a built-in authentication system based on JWT (JSON Web Tokens).

### 1. Token Management

```javascript
// core/router.js
// Helper to extract token from cookies
function extractToken(req) {
    const cookieHeader = req.headers.get('Cookie');
    if (cookieHeader) {
        const cookies = cookieHeader.split(';');
        const accessTokenCookie = cookies.find(c => c.trim().startsWith('nexa_access='));
        if (accessTokenCookie) {
            return accessTokenCookie.split('=')[1];
        }
    }
    return null;
}

// Helper to verify and decode token
function verifyToken(token) {
    try {
        if (!jwt) return null; // Auth functionality disabled
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
}
```

### 2. Cookie Security

Nexa uses HttpOnly, Secure, and SameSite=Strict cookies:

```javascript
// Example of setting cookies
const response = new Response('Success');
response.headers.set('Set-Cookie', 'nexa_access=token; HttpOnly; Secure; SameSite=Strict; Path=/');
response.headers.set('Set-Cookie', 'nexa_refresh=token; HttpOnly; Secure; SameSite=Strict; Path=/');
```

#### Cookie Attributes:

- **HttpOnly**: Prevents JavaScript from accessing cookies, reducing the risk of XSS attacks
- **Secure**: Only sends cookies over HTTPS
- **SameSite=Strict**: Prevents cross-site requests from including cookies
- **Path=/**: Makes cookies available for all routes

### 3. Token Refresh Mechanism

Nexa supports silent token refresh:

```javascript
// core/router.js
// Silent refresh: If access token is expired but refresh token is valid, issue a new access token
if (accessTokenExpired && refreshTokenValid) {
    const newAccessToken = generateAccessToken(userData);
    response.headers.set('Set-Cookie', `nexa_access=${newAccessToken}; HttpOnly; Secure; SameSite=Strict; Path=/`);
}
```

### 4. Role-Based Authorization

Nexa has built-in support for role-based access control:

```javascript
// core/router.js
// Protected routes and their required roles (can be overridden by applications)
const protectedRoutes = {
    '/dashboard': ['user', 'admin'],
    '/admin': ['admin']
};

// Public routes that are accessible to everyone (can be overridden by applications)
const publicRoutes = ['/', '/login', '/register'];
```

## Zero-API Layer Security

The Zero-API Proxy has built-in security measures:

### 1. Service Whitelisting

Only functions exported from `lib/services/` are accessible via the proxy:

```javascript
// core/router.js
if (path === "/__nexa_proxy") {
    try {
        const { service, method, args } = await req.json();
        
        // 1. Resolve the service file
        const servicePath = join(process.cwd(), 'lib/services', `${service}.js`);
        if (!existsSync(servicePath)) throw new Error(`Service ${service} not found`);

        // 2. Dynamic import
        const ServiceModule = await import(pathToFileURL(servicePath).href);
        
        if (typeof ServiceModule[method] !== 'function') {
            throw new Error(`Method ${method} not found in ${service}`);
        }

        // 3. Execute with current context (Auth, etc.)
        const data = await ServiceModule[method](...args);
        const response = Response.json({ success: true, data });
        Object.entries(DEFAULT_SECURITY_HEADERS).forEach(([key, value]) => {
            response.headers.set(key, value);
        });
        return response;
    } catch (e) {
        const response = Response.json({ success: false, error: e.message }, { status: 500 });
        Object.entries(DEFAULT_SECURITY_HEADERS).forEach(([key, value]) => {
            response.headers.set(key, value);
        });
        return response;
    }
}
```

### 2. Automatic Auth Check

Proxy calls inherit the same authentication context as regular pages:

```javascript
// Proxy calls go through the same auth check
const user = getCurrentUser(req);
if (!user && !isPublicRoute(path)) {
    return Response.redirect('/login');
}
```

## Customization & Extensibility

Nexa's security system is designed to be customizable. Here's how you can modify it:

### 1. Modifying Security Headers

```javascript
// Modify DEFAULT_SECURITY_HEADERS in core/security.js
export const DEFAULT_SECURITY_HEADERS = {
    ...DEFAULT_SECURITY_HEADERS,
    "Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'",
    "X-XSS-Protection": "1; mode=block"
};
```

### 2. Custom CORS Configuration

```javascript
// Modify applyCORSHeaders in core/security.js
export function applyCORSHeaders(headers = {}) {
    return {
        ...headers,
        "Access-Control-Allow-Origin": "https://yourdomain.com", // Restrict to specific origin
        "Access-Control-Allow-Methods": "GET, POST", // Allow only specific methods
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Max-Age": "86400" // Cache preflight for 24 hours
    };
}
```

### 3. Custom Authentication

```javascript
// Override protectedRoutes and publicRoutes in your application
// In your custom router or server.js
import { router as nexaRouter } from './core/router.js';

// Modify protected routes
nexaRouter.protectedRoutes = {
    '/dashboard': ['user', 'admin'],
    '/admin': ['admin'],
    '/profile': ['user'] // Add custom protected route
};

// Modify public routes
nexaRouter.publicRoutes = ['/', '/login', '/register', '/about'];
```

### 4. Custom Auth Logic

```javascript
// Replace the default authentication mechanism
// In core/router.js or a custom module
function customExtractToken(req) {
    // Custom token extraction logic (e.g., from Authorization header)
    const authHeader = req.headers.get('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
        return authHeader.slice(7);
    }
    return null;
}

function customVerifyToken(token) {
    // Custom token verification logic
    // e.g., using a different JWT library or service
    return verifyTokenWithCustomService(token);
}
```

## Best Practices for Secure Development

### 1. Environment Variables

Never commit sensitive information:

```bash
# .env file (gitignored)
JWT_SECRET=your-super-secret-key
DATABASE_URL=postgres://user:password@localhost:5432/db
```

### 2. Input Validation

Always validate and sanitize user inputs:

```javascript
// lib/services/userService.js
export async function createUser(userData) {
    // Validate input
    if (!userData.name || userData.name.length < 2) {
        throw new Error('Name must be at least 2 characters');
    }
    
    if (!userData.email || !isValidEmail(userData.email)) {
        throw new Error('Invalid email format');
    }
    
    // Sanitize input
    const sanitizedData = {
        name: sanitize(userData.name),
        email: sanitize(userData.email)
    };
    
    // Database operation
    return db.query('INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *', 
        [sanitizedData.name, sanitizedData.email]);
}
```

### 3. Error Handling

Avoid leaking sensitive information in error messages:

```javascript
// lib/errors.js
export class ApiError extends Error {
    constructor(
        public readonly status: number,
        message: string
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

// Usage
try {
    const user = await getUserById(id);
    if (!user) {
        throw new ApiError(404, 'User not found');
    }
} catch (error) {
    if (error instanceof ApiError) {
        return Response.json({ error: error.message }, { status: error.status });
    }
    // Log the full error for debugging
    console.error('Internal error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
}
```

### 4. Secure Communication

Always use HTTPS in production:

```bash
# nginx.conf (example)
server {
    listen 443 ssl;
    server_name yourdomain.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Security Checklist

### Development

- [ ] Validate and sanitize all user inputs
- [ ] Use parameterized queries for database operations
- [ ] Implement proper error handling
- [ ] Store sensitive data in environment variables
- [ ] Use HTTPS in all environments

### Production

- [ ] Enable HTTPS with valid certificates
- [ ] Configure a reverse proxy (Nginx, Caddy)
- [ ] Set proper file permissions
- [ ] Enable logging and monitoring
- [ ] Regularly update dependencies
- [ ] Implement rate limiting
- [ ] Backup data regularly

## Security Vulnerability Reporting

If you find a security vulnerability in Nexa Framework, please report it to:

```
security@nexaframework.com
```

Please include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Any mitigating factors

## Summary

Nexa Framework provides comprehensive security features out of the box, designed to protect your applications from common web vulnerabilities. The security system is:

1. **Automatic**: Many protections are enabled by default
2. **Customizable**: You can modify or extend the security measures
3. **Best Practices**: Follows industry standards for secure development
4. **Transparent**: Security features are well-documented and understandable

By following the security guidelines and best practices, you can build robust, secure applications with Nexa Framework.
