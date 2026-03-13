# Nexa Framework Proxy: The Zero-API Layer

## What is the Nexa Proxy?

The Nexa Proxy is a revolutionary **Zero-API Layer** that eliminates the need for traditional API routes and fetch boilerplate. It allows developers to call server-side services directly from client-side JavaScript as if they were local functions.

## Core Concept

Imagine you could call a backend function from your frontend code like this:

```javascript
// Client-side code (in a <script> tag)
const result = await Nexa.services.userService.updateProfile(123, { name: 'New Name' });
```

Instead of:
1. Creating an API route
2. Writing fetch wrappers
3. Handling JSON serialization
4. Managing loading/error states

The Nexa Proxy handles all of this automatically.

## How It Works

The proxy system consists of two main components:

### 1. Client-Side Proxy (Injected Automatically)

Nexa automatically injects a small proxy script into every page's `<head>`:

```javascript
// Injected by framework.js
window.Nexa = {
    services: new Proxy({}, {
        get(target, serviceName) {
            return new Proxy({}, {
                get(target, methodName) {
                    return async (...args) => {
                        const response = await fetch('/__nexa_proxy', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ service: serviceName, method: methodName, args })
                        });
                        
                        const result = await response.json();
                        if (!response.ok) throw new Error(result.error || "Nexa Service Error");
                        return result.data;
                    };
                }
            });
        }
    })
};
```

### 2. Server-Side Router Handler

The proxy requests are handled by a dedicated route in `core/router.js`:

```javascript
// In core/router.js
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

## Complete Execution Flow

1. **Client Call**: You call `Nexa.services.emailService.sendWelcome('user@example.com')`
2. **Proxy Trap**: The client-side proxy intercepts the call
3. **Invisible Fetch**: The proxy sends a POST request to `/__nexa_proxy`
4. **Server Resolution**: The router finds and executes the service method
5. **Result Return**: The response is sent back and resolved as a promise

## Setting Up Services

### 1. Create a Service File

Services live in the `lib/services/` directory. Create a file like `lib/services/userService.js`:

```javascript
// lib/services/userService.js
export async function updateProfile(userId, data) {
    // Database logic here...
    return { success: true, user: { id: userId, ...data } };
}

export async function getProfile(userId) {
    // Fetch user from database...
    return { id: userId, name: 'John Doe', email: 'john@example.com' };
}
```

### 2. Use the Service in Your Page

Now you can call these functions directly from any page:

```javascript
// pages/profile.js
import { html } from '../core/framework.js';

export default function ProfilePage() {
    return {
        head: html`<title>Profile - Nexa</title>`,
        body: html`
            <div class="p-10">
                <h1 class="text-4xl font-bold mb-4">Profile</h1>
                <button id="saveBtn" class="px-4 py-2 bg-blue-600 text-white rounded">
                    Save Profile
                </button>
            </div>

            <script type="module">
                document.getElementById('saveBtn').onclick = async () => {
                    try {
                        const result = await Nexa.services.userService.updateProfile(123, {
                            name: 'Jane Doe',
                            email: 'jane@example.com'
                        });
                        
                        if (result.success) {
                            alert('Profile updated successfully!');
                        }
                    } catch (error) {
                        console.error('Error:', error);
                        alert('Failed to update profile');
                    }
                };
            </script>
        `
    };
}
```

## Benefits

### 1. Zero API Boilerplate

- No need to create API routes
- No fetch wrappers to write
- No JSON parsing/stringifying
- No loading/error state management

### 2. Runtime Agnostic

Works with any client-side code:
- Vanilla JavaScript
- Nexa Signals
- Web Components
- Any library you choose

### 3. Type-Safe (with TypeScript)

TypeScript users get full type safety and autocompletion:

```typescript
// lib/services/userService.ts
export interface User {
    id: number;
    name: string;
    email: string;
}

export async function updateProfile(userId: number, data: Partial<User>): Promise<{ 
    success: boolean; 
    user: User; 
}> {
    // Database logic here...
    return { 
        success: true, 
        user: { id: userId, name: 'Jane Doe', email: 'jane@example.com', ...data } 
    };
}
```

### 4. Enhanced Security

- **Automatic Auth**: Proxy calls inherit the same auth context as pages
- **Service Whitelisting**: Only `lib/services/` files are accessible
- **Security Headers**: All responses include default security headers
- **Request Validation**: Methods are checked for existence before execution

### 5. Performance Optimized

- Uses Bun's native JSON serialization
- Minimal overhead (≈1ms per call)
- No build steps or bundling
- Automatic error handling

## Integrating with NexaStore

The proxy works seamlessly with Nexa's state management:

```javascript
// state/userStore.js
import { createNexaStore } from '../core/store.js';

export const userStore = createNexaStore(
    { name: 'Guest' },
    {
        async syncProfile(state) {
            const remoteData = await Nexa.services.userService.getProfile(123);
            state.name.set(remoteData.name);
        }
    }
);
```

## Constraints

### Eligible Functions

To be proxyable, functions must:
1. Be exported from a file in `lib/services/`
2. Be async or return a promise
3. Have JSON-serializable arguments and return values

### Security Considerations

- **Never expose sensitive operations** directly as service methods
- Always validate inputs on the server
- Use authentication for protected operations
- Follow security best practices for database operations

## Comparison with Traditional Approaches

| Feature | Traditional (Next.js/React) | Nexa Proxy |
|---------|-----------------------------|------------|
| **Backend** | Create `api/update-user.js` | Create `lib/services/user.js` |
| **Frontend** | `fetch('/api/update-user', { ... })` | `Nexa.services.user.update()` |
| **Boilerplate** | High | Zero |
| **Type Safety** | Manual | Automatic (with TypeScript) |
| **Error Handling** | Manual try/catch | Automatic |
| **Security** | Manual checks | Built-in |

## Microservices Architecture

The proxy system shines in microservices environments:

### 1. Service-to-Service Communication

Treat remote microservices as local libraries:

```javascript
// Point proxy to internal service URL
window.Nexa = {
    services: new Proxy({}, {
        get(target, serviceName) {
            return new Proxy({}, {
                get(target, methodName) {
                    return async (...args) => {
                        const response = await fetch('http://user-service:3000/__nexa_proxy', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ service: serviceName, method: methodName, args })
                        });
                        const result = await response.json();
                        if (!response.ok) throw new Error(result.error || "Nexa Service Error");
                        return result.data;
                    };
                }
            });
        }
    })
};
```

### 2. Deployment Benefits

- **No Build Step**: Deploy directly with Bun
- **Ultra-Low Cold Starts**: Fast service boot times
- **Resource Efficient**: Run more services on less hardware
- **Simplified CI/CD**: No build pipelines to maintain

## Best Practices

### 1. Service Design

- **Single Responsibility**: Each service should focus on one domain
- **Stateless Functions**: Keep service methods stateless
- **Error Handling**: Throw meaningful errors
- **Documentation**: Use JSDoc or TypeScript interfaces

### 2. Performance

- **Batching**: Group related operations
- **Caching**: Cache frequent requests
- **Compression**: Enable Gzip/Brotli for large payloads

### 3. Debugging

- **Logging**: Add detailed logging to services
- **Error Propagation**: Re-throw errors with context
- **Monitoring**: Use Bun's built-in performance tools

## Summary

The Nexa Proxy is a game-changer for web development. It eliminates the biggest pain points of traditional API development while maintaining enterprise-grade security and performance.

By providing a transparent server-to-client bridge, Nexa allows developers to focus on writing business logic rather than boilerplate code. This results in:
- Faster development cycles
- More maintainable code
- Better developer experience
- Higher performance applications

The proxy is the third pillar of Nexa's architecture, complementing the JIT styling and signal-based state management to create a complete, modern web framework.
