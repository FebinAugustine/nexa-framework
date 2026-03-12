
import { renderPage } from './framework.js';
import { DEFAULT_SECURITY_HEADERS, isSafePath } from './security.js';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { existsSync, statSync } from 'node:fs';
import jwt from 'jsonwebtoken';

// JWT configuration (should match auth service)
const JWT_SECRET = process.env.JWT_SECRET || 'nexa-framework-secret-key';

// Protected routes and their required roles
const protectedRoutes = {
    '/dashboard': ['user', 'admin'],
    '/admin': ['admin']
};

// Public routes that are accessible to everyone
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
        // 3. CORE ASSETS ROUTING: Serve framework files like signals.js
        if (path.startsWith("/core/")) {
            const corePath = join(process.cwd(), "core", path.replace("/core/", ""));
            
            if (existsSync(corePath)) {
                const content = await Bun.file(corePath).text();
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

        // 4. STATE ASSETS ROUTING: Serve state files like authState.js
        if (path.startsWith("/state/")) {
            const statePath = join(process.cwd(), "state", path.replace("/state/", ""));
            
            if (existsSync(statePath)) {
                const content = await Bun.file(statePath).text();
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

        // 4. API ROUTING
        if (path.startsWith("/api/")) {
            const apiPath = join(process.cwd(), "api", path.replace("/api/", "") + ".js");
            
            if (!existsSync(apiPath)) {
                const end = performance.now();
                const response = new Response("API Not Found", { status: 404 });
                console.log(`[Nexa] ${req.method} ${path} 404 ${Math.round(end - start)}ms`);
                return response;
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
            } 
            
            // Check for dynamic segment (e.g., [slug])
            const fsPromises = await import('node:fs/promises');
            const files = await fsPromises.readdir(pagePath);
            const dynamicFile = files.find(file => file.startsWith("[") && file.endsWith("].js"));
            
            if (dynamicFile) {
                const paramName = dynamicFile.slice(1, -4); // Remove [ and ].js
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
            // Check if there's an index.js in the current directory
            const indexPath = join(pagePath, "index.js");
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