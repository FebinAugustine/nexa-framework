import { renderPage } from './framework.js';
import { DEFAULT_SECURITY_HEADERS, isSafePath } from './security.js';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { existsSync, statSync } from 'node:fs';

// Make jsonwebtoken optional (for static templates)
let jwt;
try {
    jwt = await import('jsonwebtoken');
} catch (error) {
    // jsonwebtoken not available - auth functionality disabled
    jwt = null;
}

// JWT configuration (should match auth service)
const JWT_SECRET = process.env.JWT_SECRET || 'nexa-framework-secret-key';

// Protected routes and their required roles (can be overridden by applications)
const protectedRoutes = {
    '/dashboard': ['user', 'admin'],
    '/admin': ['admin']
};

// Public routes that are accessible to everyone (can be overridden by applications)
const publicRoutes = ['/', '/login', '/register'];

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

export async function handleRequest(req) {
    const start = performance.now();
    const url = new URL(req.url);
    const path = url.pathname;

    // 1. SYSTEM SHIELD: Ignore common browser noise (DevTools, Favicons, Map files)
    if (path.includes(".json") || path.includes(".ico") || path.includes(".map") || path.includes(".well-known")) {
        const end = performance.now();
        const response = new Response(null, { status: 404 });
        console.log(`[Nexa] ${req.method} ${path} 404 ${Math.round(end - start)}ms`);
        return response;
    }

    // 2. SECURITY CHECK: Prevent directory traversal
    if (!isSafePath(path)) {
        const end = performance.now();
        const response = new Response("Forbidden", { status: 403 });
        console.log(`[Nexa] ${req.method} ${path} 403 ${Math.round(end - start)}ms`);
        return response;
    }

    // 3. ROUTE PROTECTION: Check if route requires authentication
    const isPublicRoute = publicRoutes.includes(path);
    const requiresAuth = !isPublicRoute && Object.keys(protectedRoutes).some(route => 
        path.startsWith(route)
    );

    let user = null;
    const token = extractToken(req);
    if (token) {
        const decoded = verifyToken(token);
        if (decoded) {
            user = decoded;
        }
    }

    // Redirect authenticated users from login/register to dashboard
    if (user && (path === '/login' || path === '/register')) {
        const end = performance.now();
        const response = new Response(null, { 
            status: 302, 
            headers: { 'Location': '/dashboard' }
        });
        console.log(`[Nexa] ${req.method} ${path} 302 ${Math.round(end - start)}ms`);
        return response;
    }

    if (requiresAuth) {
        if (!token) {
            const end = performance.now();
            const response = new Response(null, { 
                status: 302, 
                headers: { 'Location': '/login' }
            });
            console.log(`[Nexa] ${req.method} ${path} 302 ${Math.round(end - start)}ms`);
            return response;
        }

        if (!user) {
            const end = performance.now();
            const response = new Response(null, { 
                status: 302, 
                headers: { 'Location': '/login' }
            });
            console.log(`[Nexa] ${req.method} ${path} 302 ${Math.round(end - start)}ms`);
            return response;
        }

        // Check if user has required role for the route
        const routeRoles = Object.keys(protectedRoutes).find(route => path.startsWith(route));
        if (routeRoles && !protectedRoutes[routeRoles].includes(user.role)) {
            const end = performance.now();
            const response = new Response("Forbidden", { status: 403 });
            console.log(`[Nexa] ${req.method} ${path} 403 ${Math.round(end - start)}ms`);
            return response;
        }
    }

    try {
        // 3. NEXA PROXY ROUTING: Handle zero-API service calls
        if (path === "/__nexa_proxy") {
            try {
                const { service, method, args } = await req.json();
                
                // 1. Resolve the service file (check for .js, .ts, .tsx)
                let servicePath = join(process.cwd(), 'lib/services', `${service}.js`);
                if (!existsSync(servicePath)) {
                    servicePath = join(process.cwd(), 'lib/services', `${service}.ts`);
                    if (!existsSync(servicePath)) {
                        servicePath = join(process.cwd(), 'lib/services', `${service}.tsx`);
                        if (!existsSync(servicePath)) {
                            throw new Error(`Service ${service} not found`);
                        }
                    }
                }

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
                const end = performance.now();
                console.log(`[Nexa] ${req.method} ${path} 200 ${Math.round(end - start)}ms`);
                return response;

            } catch (e) {
                const response = Response.json({ success: false, error: e.message }, { status: 500 });
                Object.entries(DEFAULT_SECURITY_HEADERS).forEach(([key, value]) => {
                    response.headers.set(key, value);
                });
                const end = performance.now();
                console.log(`[Nexa] ${req.method} ${path} 500 ${Math.round(end - start)}ms`);
                return response;
            }
        }

        // 4. CORE ASSETS ROUTING: Serve framework files like signals.js or signals.ts
        if (path.startsWith("/core/")) {
            let corePath = join(process.cwd(), "core", path.replace("/core/", ""));
            
            // Check if file exists with different extensions
            if (!existsSync(corePath)) {
                if (existsSync(corePath + ".ts")) corePath += ".ts";
                else if (existsSync(corePath + ".js")) corePath += ".js";
                else if (existsSync(corePath + ".tsx")) corePath += ".tsx";
            }
            
            if (existsSync(corePath)) {
                let content = await Bun.file(corePath).text();
                
                // Transpile TypeScript to JavaScript if needed
                if (corePath.endsWith(".ts") || corePath.endsWith(".tsx")) {
                    try {
                        const result = await Bun.build({
                            entrypoints: [corePath],
                            target: "browser",
                            format: "esm",
                            minify: true
                        });
                        
                        if (result.success && result.outputs.length > 0) {
                            content = await result.outputs[0].text();
                        }
                    } catch (error) {
                        console.error("TypeScript transpilation error for", corePath, error);
                    }
                }
                
                const response = new Response(content, { 
                    headers: { 
                        "Content-Type": "application/javascript",
                        ...DEFAULT_SECURITY_HEADERS
                    } 
                });
                const end = performance.now();
                console.log(`[Nexa] ${req.method} ${path} 200 ${Math.round(end - start)}ms`);
                return response;
            }
        }

        // 4. STATE ASSETS ROUTING: Serve state files like authState.js or authState.ts
        if (path.startsWith("/state/")) {
            let statePath = join(process.cwd(), "state", path.replace("/state/", ""));
            
            // Check if file exists with different extensions
            if (!existsSync(statePath)) {
                if (existsSync(statePath + ".ts")) statePath += ".ts";
                else if (existsSync(statePath + ".js")) statePath += ".js";
                else if (existsSync(statePath + ".tsx")) statePath += ".tsx";
            }
            
            if (existsSync(statePath)) {
                let content = await Bun.file(statePath).text();
                
                // Transpile TypeScript to JavaScript if needed
                if (statePath.endsWith(".ts") || statePath.endsWith(".tsx")) {
                    try {
                        const result = await Bun.build({
                            entrypoints: [statePath],
                            target: "browser",
                            format: "esm",
                            minify: true
                        });
                        
                        if (result.success && result.outputs.length > 0) {
                            content = await result.outputs[0].text();
                        }
                    } catch (error) {
                        console.error("TypeScript transpilation error for", statePath, error);
                    }
                }
                
                const response = new Response(content, { 
                    headers: { 
                        "Content-Type": "application/javascript",
                        ...DEFAULT_SECURITY_HEADERS
                    } 
                });
                const end = performance.now();
                console.log(`[Nexa] ${req.method} ${path} 200 ${Math.round(end - start)}ms`);
                return response;
            }
        }

        // 5. API ROUTING
        if (path.startsWith("/api/")) {
            let apiPath = join(process.cwd(), "api", path.replace("/api/", "") + ".js");
            
            if (!existsSync(apiPath)) {
                apiPath = join(process.cwd(), "api", path.replace("/api/", "") + ".ts");
                if (!existsSync(apiPath)) {
                    apiPath = join(process.cwd(), "api", path.replace("/api/", "") + ".tsx");
                    if (!existsSync(apiPath)) {
                        const end = performance.now();
                        const response = new Response("API Not Found", { status: 404 });
                        console.log(`[Nexa] ${req.method} ${path} 404 ${Math.round(end - start)}ms`);
                        return response;
                    }
                }
            }

            const module = await import(pathToFileURL(apiPath).href);
            const method = req.method; // e.g., GET, POST
            
            if (module[method]) {
                const response = await module[method](req);
                // Apply security headers to API responses
                Object.entries(DEFAULT_SECURITY_HEADERS).forEach(([key, value]) => {
                    response.headers.set(key, value);
                });
                
                const end = performance.now();
                console.log(`[Nexa] ${req.method} ${path} ${response.status} ${Math.round(end - start)}ms`);
                return response;
            }
            const end = performance.now();
            const response = new Response("Method Not Allowed", { status: 405 });
            console.log(`[Nexa] ${req.method} ${path} 405 ${Math.round(end - start)}ms`);
            return response;
        }

        // 4. PAGE ROUTING
        const segments = path === "/" ? ["index"] : path.slice(1).split("/");
        let pagePath = join(process.cwd(), "pages");
        let params = {};
        let found = false;

        // Build path and check for dynamic segments
        for (let i = 0; i < segments.length; i++) {
            const segment = segments[i];
            const staticPath = join(pagePath, segment);
            
            if (existsSync(staticPath + ".js")) {
                pagePath = staticPath + ".js";
                found = true;
                break;
            } else if (existsSync(staticPath + ".ts")) {
                pagePath = staticPath + ".ts";
                found = true;
                break;
            } else if (existsSync(staticPath + ".tsx")) {
                pagePath = staticPath + ".tsx";
                found = true;
                break;
            }
            
            // Check for dynamic segment (e.g., [slug])
            const fsPromises = await import('node:fs/promises');
            const files = await fsPromises.readdir(pagePath);
            let dynamicFile = files.find(file => file.startsWith("[") && file.endsWith("].js"));
            if (!dynamicFile) {
                dynamicFile = files.find(file => file.startsWith("[") && file.endsWith("].ts"));
                if (!dynamicFile) {
                    dynamicFile = files.find(file => file.startsWith("[") && file.endsWith("].tsx"));
                }
            }
            
            if (dynamicFile) {
                let paramName;
                if (dynamicFile.endsWith(".js")) {
                    paramName = dynamicFile.slice(1, -4); // Remove [ and ].js
                } else if (dynamicFile.endsWith(".ts")) {
                    paramName = dynamicFile.slice(1, -3); // Remove [ and ].ts
                } else if (dynamicFile.endsWith(".tsx")) {
                    paramName = dynamicFile.slice(1, -5); // Remove [ and ].tsx
                }
                params[paramName] = segment;
                pagePath = join(pagePath, dynamicFile);
                found = true;
                
                // Skip remaining segments as they will be matched by higher-level dynamic segments
                break;
            } 
            
            // Continue to next directory
            const dirPath = join(pagePath, segment);
            if (existsSync(dirPath) && statSync(dirPath).isDirectory()) {
                pagePath = dirPath;
                continue;
            }
            
            // No matching file or directory found
            const end = performance.now();
            const response = new Response("404 - Page Not Found", { status: 404 });
            console.log(`[Nexa] ${req.method} ${path} 404 ${Math.round(end - start)}ms`);
            return response;
        }

        // If we reached the end of segments without finding a file
        if (!found) {
            // Check if there's an index.js, index.ts, or index.tsx in the current directory
            let indexPath = join(pagePath, "index.js");
            if (existsSync(indexPath)) {
                pagePath = indexPath;
                found = true;
            } else {
                indexPath = join(pagePath, "index.ts");
                if (existsSync(indexPath)) {
                    pagePath = indexPath;
                    found = true;
                } else {
                    indexPath = join(pagePath, "index.tsx");
                    if (existsSync(indexPath)) {
                        pagePath = indexPath;
                        found = true;
                    } else {
                        const end = performance.now();
                        const response = new Response("404 - Page Not Found", { status: 404 });
                        console.log(`[Nexa] ${req.method} ${path} 404 ${Math.round(end - start)}ms`);
                        return response;
                    }
                }
            }
        }

        const { default: Page } = await import(pathToFileURL(pagePath).href);
        const content = typeof Page === 'function' ? await Page(params, user) : Page;
        
        const response = new Response(await renderPage(content), { 
            headers: { 
                "Content-Type": "text/html",
                ...DEFAULT_SECURITY_HEADERS
            } 
        });
        
        const end = performance.now();
        console.log(`[Nexa] ${req.method} ${path} ${response.status} ${Math.round(end - start)}ms`);
        return response;

    } catch (e) { 
        const end = performance.now();
        console.error(`[Nexa Router Error]: ${e.message}`);
        console.log(`[Nexa] ${req.method} ${path} 500 ${Math.round(end - start)}ms`);
        return new Response("Internal Server Error", { status: 500 }); 
    }
}