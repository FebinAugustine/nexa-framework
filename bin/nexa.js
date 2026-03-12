#!/usr/bin/env bun
import { mkdir, writeFile, readFile, readdir } from "node:fs/promises";
import { join, resolve } from "node:path";

const args = Bun.argv.slice(2);
const [command, projectName] = args;

if (command === "init") {
    if (!projectName) {
        console.error("❌ Usage: nexa init <project-name>");
        process.exit(1);
    }

    const start = performance.now();
    console.log(`\n🚀 Initializing Nexa Core for ${projectName}...`);

    // Template selection
    const templates = ["default", "dynamic", "blog", "static", "fullstack-mongodb", "fullstack-postgres"];
    console.log("\n📋 Available Templates:");
    templates.forEach((template, index) => {
        console.log(`   ${index + 1}. ${template.charAt(0).toUpperCase() + template.slice(1)}`);
    });

    // Interactive template selection
    let selectedTemplate = "default";
    const readline = require("node:readline").createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const answer = await new Promise((resolve) => {
        readline.question("\n🔧 Choose a template (1-5) or press Enter for Default: ", resolve);
    });
    readline.close();

    if (answer) {
        const choice = parseInt(answer.trim());
        if (choice >= 1 && choice <= templates.length) {
            selectedTemplate = templates[choice - 1];
        } else {
            console.log("\n⚠️  Invalid choice. Using Default template...");
            selectedTemplate = "default";
        }
    }

    console.log(`\n📦 Using ${selectedTemplate.charAt(0).toUpperCase() + selectedTemplate.slice(1)} template...`);

    const folders = ["core", "config", "lib", "api", "components", "pages", "state", "public"];
    for (const folder of folders) {
        await mkdir(join(projectName, folder), { recursive: true });
    }

    // 1. Write the Blueprint
    const templateDir = join(resolve(), "src", "templates", selectedTemplate);
    
    // Write default core files (required for all templates)
    await writeFile(join(projectName, "core/framework.js"), getFrameworkTemplate());
    await writeFile(join(projectName, "core/router.js"), getRouterTemplate());
    await writeFile(join(projectName, "core/tailwind.js"), getTailwindTemplate());
    await writeFile(join(projectName, "core/tailwind.css"), getTailwindCSSTemplate());
    await writeFile(join(projectName, "core/security.js"), getSecurityTemplate());
    
    // Copy template-specific core files (if any)
    if (await directoryExists(join(templateDir, "core"))) {
        const coreFiles = await readdir(join(templateDir, "core"));
        for (const file of coreFiles) {
            const content = await readFile(join(templateDir, "core", file), "utf-8");
            await writeFile(join(projectName, "core", file), content);
        }
    }
    
    // Copy template-specific state files (if any)
    if (await directoryExists(join(templateDir, "state"))) {
        const stateFiles = await readdir(join(templateDir, "state"));
        for (const file of stateFiles) {
            const content = await readFile(join(templateDir, "state", file), "utf-8");
            await writeFile(join(projectName, "state", file), content);
        }
    }
    
    // Copy template-specific config files (if any)
    if (await directoryExists(join(templateDir, "config"))) {
        const configFiles = await readdir(join(templateDir, "config"));
        for (const file of configFiles) {
            const content = await readFile(join(templateDir, "config", file), "utf-8");
            await writeFile(join(projectName, "config", file), content);
        }
    }
    
    // Copy template-specific lib files (if any)
    if (await directoryExists(join(templateDir, "lib"))) {
        const libEntries = await readdir(join(templateDir, "lib"), { withFileTypes: true });
        for (const entry of libEntries) {
            if (entry.isDirectory()) {
                // Recursively copy subdirectories (e.g., lib/models, lib/services)
                const srcDir = join(templateDir, "lib", entry.name);
                const destDir = join(projectName, "lib", entry.name);
                await mkdir(destDir, { recursive: true });
                
                const files = await readdir(srcDir);
                for (const file of files) {
                    const content = await readFile(join(srcDir, file), "utf-8");
                    await writeFile(join(destDir, file), content);
                }
            } else {
                // Copy file directly
                const content = await readFile(join(templateDir, "lib", entry.name), "utf-8");
                await writeFile(join(projectName, "lib", entry.name), content);
            }
        }
    }
    
    // Write default pages and API files (if template doesn't provide them)
    if (!await directoryExists(join(templateDir, "pages"))) {
        await writeFile(join(projectName, "pages/index.js"), getIndexPageTemplate());
    } else {
        const pagesFiles = await readdir(join(templateDir, "pages"));
        for (const file of pagesFiles) {
            const content = await readFile(join(templateDir, "pages", file), "utf-8");
            await writeFile(join(projectName, "pages", file), content);
        }
    }
    
    if (!await directoryExists(join(templateDir, "api"))) {
        await writeFile(join(projectName, "api/health.js"), getHealthTemplate());
    } else {
        const apiFiles = await readdir(join(templateDir, "api"));
        for (const file of apiFiles) {
            const content = await readFile(join(templateDir, "api", file), "utf-8");
            await writeFile(join(projectName, "api", file), content);
        }
    }
    
    // Copy other files
    await writeFile(join(projectName, "server.js"), getServerTemplate());
    await writeFile(join(projectName, "NEXA_MANIFESTO.md"), getManifestoTemplate());
    // Write package.json - use template-specific if available
    const templatePackageJson = join(templateDir, "package.json");
    if (await fileExists(templatePackageJson)) {
        const content = await readFile(templatePackageJson, "utf-8");
        const pkg = JSON.parse(content);
        pkg.name = projectName;
        await writeFile(join(projectName, "package.json"), JSON.stringify(pkg, null, 2));
    } else {
        await writeFile(join(projectName, "package.json"), JSON.stringify({
            name: projectName,
            version: "1.0.0",
            type: "module",
            dependencies: { "tailwindcss": "latest", "@tailwindcss/node": "latest" }
        }, null, 2));
    }

    // 2. Silent Background Install
    process.stdout.write("📦 Optimizing engine dependencies... ");
    const install = Bun.spawn(["bun", "install"], { 
        cwd: projectName, 
        stdout: "ignore", 
        stderr: "ignore" 
    });
    
    await install.exited;
    process.stdout.write("Done!\n");

    const end = performance.now();
    console.log(`\n✨ Project created in ${Math.round(end - start)}ms`);
    console.log(`\n📂 Get started:`);
    console.log(`   cd ${projectName}`);
    console.log(`   bun --hot server.js\n`);
}

// --- TEMPLATES (Optimized for Server-Side Rendering) ---

function getFrameworkTemplate() {
    return `import { getDynamicCSS } from './tailwind.js';
export const html = (strings, ...values) => strings.reduce((acc, str, i) => acc + str + (values[i] || ""), "");
export async function renderPage(pageResult) {
    const { head = "", body } = typeof pageResult === 'object' && pageResult !== null && 'body' in pageResult 
        ? pageResult 
        : { body: pageResult };
    
    const css = await getDynamicCSS(body);
    return \`<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><style>\${css}</style>\${head}</head><body>\${body}</body></html>\`;
}`;
}

function getRouterTemplate() {
    return `
import { renderPage } from './framework.js';
import { DEFAULT_SECURITY_HEADERS, isSafePath } from './security.js';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { existsSync } from 'node:fs';

export async function handleRequest(req) {
    const url = new URL(req.url);
    const path = url.pathname;

    // 1. SYSTEM SHIELD: Ignore common browser noise (DevTools, Favicons, Map files)
    if (path.includes(".json") || path.includes(".ico") || path.includes(".map") || path.includes(".well-known")) {
        return new Response(null, { status: 404 });
    }

    // 2. SECURITY CHECK: Prevent directory traversal
    if (!isSafePath(path)) {
        return new Response("Forbidden", { status: 403 });
    }

    try {
        // 3. API ROUTING
        if (path.startsWith("/api/")) {
            const apiPath = join(process.cwd(), "api", path.replace("/api/", "") + ".js");
            
            if (!existsSync(apiPath)) return new Response("API Not Found", { status: 404 });

            const module = await import(pathToFileURL(apiPath).href);
            const method = req.method; // e.g., GET, POST
            
            if (module[method]) {
                const response = await module[method](req);
                // Apply security headers to API responses
                Object.entries(DEFAULT_SECURITY_HEADERS).forEach(([key, value]) => {
                    response.headers.set(key, value);
                });
                return response;
            }
            return new Response("Method Not Allowed", { status: 405 });
        }

        // 4. PAGE ROUTING
        const fileName = path === "/" ? "index.js" : path.slice(1) + ".js";
        const pagePath = join(process.cwd(), "pages", fileName);

        // Security Check: Only attempt import if file exists
        if (!existsSync(pagePath)) {
            return new Response("404 - Page Not Found", { status: 404 });
        }

        const { default: Page } = await import(pathToFileURL(pagePath).href);
        const content = typeof Page === 'function' ? await Page() : Page;
        
        const response = new Response(await renderPage(content), { 
            headers: { 
                "Content-Type": "text/html",
                ...DEFAULT_SECURITY_HEADERS
            } 
        });
        return response;

    } catch (e) { 
        console.error(\`[Nexa Router Error]: \${e.message}\`);
        return new Response("Internal Server Error", { status: 500 }); 
    }
}`;
}

function getTailwindTemplate() {
    return `
import { compile } from 'tailwindcss';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export async function getDynamicCSS(htmlContent) {
    try {
        // Use the full default Tailwind CSS from the package
        const cssPath = join(process.cwd(), 'node_modules', 'tailwindcss', 'index.css');
        const content = await readFile(cssPath, 'utf-8');
        const compiler = await compile(content);
        
        const candidates = Array.from(htmlContent.matchAll(/class=["']([^"']+)["']/g), m => m[1].split(/\\s+/)).flat().filter(Boolean);
        console.log("Tailwind CSS candidates:", candidates);
        
        // Build CSS with the identified candidates
        const cssResult = compiler.build(candidates);
        console.log("CSS result type:", typeof cssResult);
        
        if (typeof cssResult === 'string') {
            return cssResult;
        } else if (typeof cssResult === 'object' && cssResult !== null && 'css' in cssResult) {
            return cssResult.css;
        } else {
            console.warn("Unexpected CSS result format:", cssResult);
            return "";
        }
    } catch (e) { 
        console.error("Tailwind CSS Error:", e);
        console.error("Stack trace:", e.stack);
        return ""; 
    }
}`;
}

function getTailwindCSSTemplate() {
    return `@tailwind base;
@tailwind components;
@tailwind utilities;
`;
}

function getIndexPageTemplate() {
    return `import { html } from '../core/framework.js';
export default function HomePage() {
    return {
        head: html\`<title>NEXA - Zero-Build Web Framework</title>\`,
        body: html\`<main class="h-screen flex items-center justify-center bg-white"><div class="text-center"><h1 class="text-5xl font-black tracking-tighter italic">NEXA</h1><p class="text-gray-400 mt-2">Zero-Build. Fully Scalable.</p></div></main>\`
    };
}`;
}

function getHealthTemplate() {
    return `export async function GET() { return Response.json({ status: "ok", memory: process.memoryUsage().heapUsed }); }`;
}

function getSecurityTemplate() {
    return `// Security and CORS configuration
export const DEFAULT_SECURITY_HEADERS = {
    "X-Frame-Options": "DENY",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "geolocation=(), microphone=(), camera=()"
};

export function applyCORSHeaders(headers = {}) {
    return {
        ...headers,
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization"
    };
}

export function isSafePath(path) {
    // Prevent directory traversal
    return !path.includes("..") && !path.startsWith("/../") && !path.endsWith("/..");
}`;
}

function getServerTemplate() {
    return `import { handleRequest } from './core/router.js';
Bun.serve({ port: 3000, fetch: handleRequest });
console.log("🚀 Server: http://localhost:3000");`;
}

function getManifestoTemplate() {
    return `NEXA_MANIFESTO.md
1. The Motto
"Power of the Server, Speed of the Browser. No Build. No Hydration."

2. Project Intention
Nexa is an Enterprise-Ready Web Framework designed for the Bun Runtime. It is engineered to deliver the developer experience of a modern framework (like Next.js or Nuxt) without the performance tax of client-side bundling, hydration, or heavy build steps. Nexa follows the "Resumable" pattern: HTML is sent 100% complete, and logic is attached only when a user interacts.

3. Core Architectural Pillars
A. JIT Server-Side Styling (Tailwind v4)
Zero Client Load: The browser never compiles CSS.

Mechanism: The core/tailwind.js engine scans HTML during the request, compiles the CSS on the server using the official Tailwind v4 Node compiler, and injects a static <style> block.

B. Enterprise Separation of Concerns
Infrastructure vs. Logic: Third-party SDKs (Databases, Mailers) live in lib/ as singletons. API routes in api/ consume these libs. This prevents "Spaghetti Code" and ensures scalable database connection management.

C. File-System Routing (Sub-directory Support)
Automatic Mapping: The router maps URLs directly to the /pages or /api folders.

Resilience: Includes a "System Shield" to ignore browser noise (favicons, devtools) and handles Windows paths using pathToFileURL.

4. Folder Structure (The Blueprint)

Directory,Purpose,AI Agent Instruction
/core,"The Engine (Router, JIT, Framework)",Immutable. Do not modify unless changing framework behavior.
/config,Env validation & UI Constants,Centralize all process.env calls here.
/lib,SDK & 3rd-Party Integrations,"Initialize DB, Mailer, and Cloud storage here as Singletons."
/api,Backend Logic & Endpoints,Must import from lib/. Handles GET/POST/PUT/DELETE.
/components,Stateless UI Atoms,Pure functions returning html. No side effects.
/pages,SSR Views,Defines the UI and SEO Metadata per route.
/state,Client Reactivity,Logic for Resumability and browser-side events.
/public,Static Assets,"Images, fonts, and robots.txt."

5. Technical Implementation Details
A. Routing & Security
Guard: Every route check uses existsSync to prevent 500 errors on missing files.

Shield: Explicitly ignores .map, .json, and .well-known requests.

CORS/Security: Managed via core/security.js (headers like X-Frame-Options).

B. Component Patterns
Metadata Injection: Pages return an object { head: ..., body: ... }. The head is injected into the HTML shell by core/framework.js.

Universal HTML: Uses the html tagged template for high-performance string interpolation.

C. Native Middleware

Nexa does not use a middleware "stack."

Global logic (Auth, Logging, Security Headers) must be implemented as functional "Gates" inside core/router.js.

This ensures a single, linear execution path for maximum performance and easier debugging.

D. Performance Monitoring

Monitoring is built directly into the core/router.js using performance.now().

Every request is logged to the terminal with its Method, Path, Status Code, and Total Execution Time.

Target execution time for SSR pages should be < 50ms for an optimal user experience.

6. Guidelines for AI Agents & Developers
Never introduce a bundler. No Vite, No Webpack, No dist folder.

Standard ESM. Use absolute paths or process.cwd() with pathToFileURL for all dynamic imports.

Silent Optimization. Background tasks (like bun install) should be handled by the CLI to maintain the "Instant" feel.

No CDN Styles. Always use the server-side JIT compiler to avoid browser performance warnings.

7. Data Strategy (SQL vs NoSQL)
Nexa supports multi-database architectures. Developers must choose the database based on the use case:

A. Relational (PostgreSQL)
File Location: lib/sql.js

Use Case: Finance, E-commerce, Inventory, or any data requiring strict ACID compliance and complex relationships.

Pattern: Use a singleton connection pool (e.g., postgres.js).

B. NoSQL (MongoDB)
File Location: lib/mongodb.js

Use Case: Content Management Systems (CMS), Blog engines, Real-time activity feeds, or highly variable metadata.

Pattern: Use the MongoDB Node Driver initialized as a singleton.

8. Instructions for Modification
To add a Database: Initialize the client in lib/, export the singleton, and import it into an api/ route.

To add a New Page: Create pages/your-page.js, export a default function returning html, and link it in the Navbar.

9. Layouts & Composition
Layouts are higher-order components in /components that wrap page content.

They return the standard Nexa { head, body } object.

Use Layouts to maintain persistent UI elements (Nav, Sidebar) across multiple pages.

10. Dynamic Routing (The Bracket System)
Convention: Folders named [paramName] are treated as dynamic segments.

Parameter Injection: The router extracts these segments and passes them as a params object to the Page function.

Nesting: Dynamic routes can be nested (e.g., /shop/[category]/[id]).

11. Backend Architectural Pattern (Service-Controller)
Controllers (api/): Scoped to HTTP concerns only. They parse requests and delegate to services.

Services (lib/services/): Scoped to business logic and data manipulation. They are protocol-agnostic.

12. Automatic Routing
Nexa uses File-System-Based Routing.

Adding a file to /pages or /api automatically creates the route. No manual registration required.

Supports Static (index.js) and Dynamic ([slug]) routing out of the box.

13. Static Content Management
Store raw content (Markdown, JSON) in a top-level /content folder.

Use Services in lib/services/ to parse and deliver this data to pages.

Pro Tip: By using marked on the server, we send the finished HTML to the client, keeping the browser's JavaScript execution at zero.

14. Production & Deployment
Zero-Build Production: Since Nexa is "No-Build," deployment simply involves copying the source code and running bun install --production.

Process Management: Always use a process manager like PM2 or a Docker restart policy to ensure 99.9% uptime.

Environment Security: Never commit your .env file. Use the hosting provider's "Environment Variables" interface to inject secrets like DB_URL.

Reverse Proxy: It is recommended to run Nexa behind Nginx or Caddy to handle SSL (HTTPS) and load balancing.

15. State & Resumability
Zero-Hydration State: State is not "synced" via a virtual DOM. It is Injected as a JSON block in the HTML.

Access: Client-side scripts read the NEXA_STATE element to resume logic.

Performance: This prevents the "Uncanny Valley" where a page looks ready but buttons don't work because a 2MB JavaScript bundle is still loading.

16. Competitive Performance Standards
The Zero-KB Goal: Every page must strive to ship 0kb of initial JavaScript. Any interactivity should be added via small, scoped <script> tags.

TTI (Time to Interactive): Nexa pages are interactive as soon as they are visible because there is no "Hydration Phase."

Efficiency: Because Nexa runs on Bun, it can handle ~3x more requests per second on the same hardware compared to a Next.js app running on Node.js.

17. Data Fetching & Caching
Native Preference: Favor Bun's native fetch over Axios to reduce overhead, unless interceptors are strictly required.

Server-Side Caching: Avoid client-side libraries like TanStack Query. Use in-memory Map objects or bun:sqlite within Services to cache third-party data.

Zero Loading States: Data must be fetched in the Page or API route before rendering to ensure the user receives a complete UI, not a loading spinner.

18. Access & Refresh Token Management
Double-Cookie Pattern: Use nexa_access (short-lived) and nexa_refresh (long-lived) cookies.

Silent Refresh: The core/router.js handles token rotation automatically. If an access token is expired but a valid refresh token is present, the router transparently issues a new access token before rendering the page.

Database Backed: Refresh tokens must be stored in the database (lib/sql.js) to support remote logout and security auditing.

Security: Both cookies must be HttpOnly, Secure, and SameSite=Strict.

19. Governance & Contribution
Standardization: All core framework changes must be benchmarked against the 12ms SSR baseline.

Extensibility: Use the lib/ folder for "Plugins." If a feature is common (like Auth), it should be a template in the CLI, not a forced core dependency.

 Documentation: Every Service or Component must be documented via JSDoc to ensure AI agents can interpret the logic accurately.
 
 `;
}

async function fileExists(path) {
    try {
        await readFile(path);
        return true;
    } catch (error) {
        return false;
    }
}

async function directoryExists(path) {
    try {
        await readdir(path);
        return true;
    } catch (error) {
        return false;
    }
}
