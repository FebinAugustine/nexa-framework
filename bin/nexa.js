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
    const templates = ["static", "dynamic", "fullstack-mongodb", "fullstack-postgres"];
    const tsTemplates = ["static-ts", "dynamic-ts", "fullstack-mongodb-ts", "fullstack-postgres-ts"];
    const allTemplates = [...templates, ...tsTemplates];
    console.log("\n📋 Available Templates:");
    allTemplates.forEach((template, index) => {
        console.log(`   ${index + 1}. ${template.charAt(0).toUpperCase() + template.slice(1)}`);
    });

    // Interactive template selection
     // Check if template is specified via command line --template option
     let selectedTemplate = "static";
     const templateIndex = args.findIndex(arg => arg.startsWith("--template"));
     if (templateIndex !== -1) {
         let templateOption;
         if (args[templateIndex].includes("=")) {
             templateOption = args[templateIndex].split("=")[1];
         } else {
             templateOption = args[templateIndex + 1];
         }
         
         if (templateOption && allTemplates.includes(templateOption)) {
             selectedTemplate = templateOption;
             console.log(`\n📦 Using ${selectedTemplate.charAt(0).toUpperCase() + selectedTemplate.slice(1)} template (from command line)...`);
         } else {
             console.log(`\n⚠️  Template "${templateOption}" not found. Available templates: ${allTemplates.join(", ")}`);
             console.log("\n📦 Using Static template by default...");
             selectedTemplate = "static";
         }
     } else {
         // Interactive template selection
         const readline = require("node:readline").createInterface({
             input: process.stdin,
             output: process.stdout
         });

         const answer = await new Promise((resolve) => {
                readline.question(`\n🔧 Choose a template (1-${allTemplates.length}) or press Enter for Static: `, resolve);
         });
         readline.close();

         if (answer) {
             const choice = parseInt(answer.trim());
             if (choice >= 1 && choice <= allTemplates.length) {
                 selectedTemplate = allTemplates[choice - 1];
             } else {
                 console.log("\n⚠️  Invalid choice. Using Static template...");
                 selectedTemplate = "static";
             }
         }
     }

    console.log(`\n📦 Using ${selectedTemplate.charAt(0).toUpperCase() + selectedTemplate.slice(1)} template...`);

    // Check if TypeScript flag is specified or TypeScript template is selected
    const isTypeScript = args.includes("--typescript") || args.includes("--ts") || selectedTemplate.includes("-ts");

    // Create folders based on template type
     let folders;
     if (selectedTemplate === "static") {
         folders = ["core", "components", "pages", "state", "public"]; // Static templates don't need API, lib, or config folders
     } else {
         folders = ["core", "config", "lib", "api", "components", "pages", "state", "public"]; // Full templates have all folders
     }
    
    for (const folder of folders) {
        await mkdir(join(projectName, folder), { recursive: true });
    }

     // 1. Write the Blueprint
     // Use TypeScript template if --typescript flag is specified and template exists
    let finalTemplate = selectedTemplate;
    if (isTypeScript && !selectedTemplate.includes("-ts") && (selectedTemplate === "static" || selectedTemplate === "dynamic" || selectedTemplate === "fullstack-mongodb" || selectedTemplate === "fullstack-postgres")) {
        finalTemplate = `${selectedTemplate}-ts`;
        console.log(`🔧 Using TypeScript version of ${selectedTemplate} template...`);
    } else if (isTypeScript && !selectedTemplate.includes("-ts")) {
        console.log(`⚠️ TypeScript template not available for ${selectedTemplate}. Using JavaScript template with TypeScript core files...`);
    }
    
    const templateDir = join(__dirname, "..", "src", "templates", finalTemplate);
    console.log("DEBUG: Full template directory path:", templateDir);
    
    // Write default core files (required for all templates)
    const frameworkFileName = isTypeScript ? "framework.ts" : "framework.js";
    const routerFileName = isTypeScript ? "router.ts" : "router.js";
    const tailwindFileName = isTypeScript ? "tailwind.ts" : "tailwind.js";
    const securityFileName = isTypeScript ? "security.ts" : "security.js";
    
    await writeFile(join(projectName, "core", frameworkFileName), getFrameworkTemplate(isTypeScript));
    await writeFile(join(projectName, "core", routerFileName), await getRouterTemplate(selectedTemplate, isTypeScript));
    await writeFile(join(projectName, "core", tailwindFileName), getTailwindTemplate(isTypeScript));
    await writeFile(join(projectName, "core/tailwind.css"), getTailwindCSSTemplate());
    await writeFile(join(projectName, "core", securityFileName), getSecurityTemplate(isTypeScript));
    
    // Copy template-specific core files (if any)
    if (await directoryExists(join(templateDir, "core"))) {
        const coreFiles = await readdir(join(templateDir, "core"));
        for (const file of coreFiles) {
            const content = await readFile(join(templateDir, "core", file), "utf-8");
            let destFileName = file;
            // If using TypeScript but template files are still .js, rename them
            if (isTypeScript && file.endsWith(".js") && !file.endsWith(".d.ts")) {
                destFileName = file.replace(".js", ".ts");
            }
            await writeFile(join(projectName, "core", destFileName), content);
        }
    }
    
    // Copy template-specific state files (if any)
    if (await directoryExists(join(templateDir, "state"))) {
        const stateFiles = await readdir(join(templateDir, "state"));
        for (const file of stateFiles) {
            const content = await readFile(join(templateDir, "state", file), "utf-8");
            let destFileName = file;
            if (isTypeScript && file.endsWith(".js") && !file.endsWith(".d.ts")) {
                destFileName = file.replace(".js", ".ts");
            }
            await writeFile(join(projectName, "state", destFileName), content);
        }
    }
    
     // Copy template-specific config files (if any and not static template)
     if (selectedTemplate !== "static" && await directoryExists(join(templateDir, "config"))) {
         const configFiles = await readdir(join(templateDir, "config"));
         for (const file of configFiles) {
             const content = await readFile(join(templateDir, "config", file), "utf-8");
             let destFileName = file;
             if (isTypeScript && file.endsWith(".js") && !file.endsWith(".d.ts")) {
                 destFileName = file.replace(".js", ".ts");
             }
             await writeFile(join(projectName, "config", destFileName), content);
         }
     }
    
    // Copy template-specific components (if any)
    if (await directoryExists(join(templateDir, "components"))) {
        const componentsFiles = await readdir(join(templateDir, "components"));
        for (const file of componentsFiles) {
            const content = await readFile(join(templateDir, "components", file), "utf-8");
            let destFileName = file;
            if (isTypeScript && file.endsWith(".js") && !file.endsWith(".d.ts")) {
                destFileName = file.replace(".js", ".ts");
            }
            await writeFile(join(projectName, "components", destFileName), content);
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
                    let destFileName = file;
                    if (isTypeScript && file.endsWith(".js") && !file.endsWith(".d.ts")) {
                        destFileName = file.replace(".js", ".ts");
                    }
                    await writeFile(join(destDir, destFileName), content);
                }
            } else {
                // Copy file directly
                const content = await readFile(join(templateDir, "lib", entry.name), "utf-8");
                let destFileName = entry.name;
                if (isTypeScript && entry.name.endsWith(".js") && !entry.name.endsWith(".d.ts")) {
                    destFileName = entry.name.replace(".js", ".ts");
                }
                await writeFile(join(projectName, "lib", destFileName), content);
            }
        }
    }
    
    // Copy template-specific API files (if any)
    if (selectedTemplate !== "static" && await directoryExists(join(templateDir, "api"))) {
        const apiFiles = await readdir(join(templateDir, "api"));
        for (const file of apiFiles) {
            const content = await readFile(join(templateDir, "api", file), "utf-8");
            let destFileName = file;
            if (isTypeScript && file.endsWith(".js") && !file.endsWith(".d.ts")) {
                destFileName = file.replace(".js", ".ts");
            }
            await writeFile(join(projectName, "api", destFileName), content);
        }
    }
    
    // Copy template-specific pages files (if any)
    if (await directoryExists(join(templateDir, "pages"))) {
        const pagesEntries = await readdir(join(templateDir, "pages"), { withFileTypes: true });
        for (const entry of pagesEntries) {
            if (entry.isDirectory()) {
                // Recursively copy subdirectories (e.g., pages/blog)
                const srcDir = join(templateDir, "pages", entry.name);
                const destDir = join(projectName, "pages", entry.name);
                await mkdir(destDir, { recursive: true });
                
                const files = await readdir(srcDir);
                for (const file of files) {
                    const content = await readFile(join(srcDir, file), "utf-8");
                    let destFileName = file;
                    if (isTypeScript && file.endsWith(".js") && !file.endsWith(".d.ts")) {
                        destFileName = file.replace(".js", ".ts");
                    }
                    await writeFile(join(destDir, destFileName), content);
                }
            } else {
                // Copy file directly
                const content = await readFile(join(templateDir, "pages", entry.name), "utf-8");
                let destFileName = entry.name;
                if (isTypeScript && entry.name.endsWith(".js") && !entry.name.endsWith(".d.ts")) {
                    destFileName = entry.name.replace(".js", ".ts");
                }
                await writeFile(join(projectName, "pages", destFileName), content);
            }
        }
    }
    
    // Copy public files (if any) - these should remain unchanged
    if (await directoryExists(join(templateDir, "public"))) {
        const publicEntries = await readdir(join(templateDir, "public"), { withFileTypes: true });
        for (const entry of publicEntries) {
            if (entry.isDirectory()) {
                const srcDir = join(templateDir, "public", entry.name);
                const destDir = join(projectName, "public", entry.name);
                await mkdir(destDir, { recursive: true });
                
                const files = await readdir(srcDir);
                for (const file of files) {
                    const content = await readFile(join(srcDir, file), "utf-8");
                    await writeFile(join(destDir, file), content);
                }
            } else {
                const content = await readFile(join(templateDir, "public", entry.name), "utf-8");
                await writeFile(join(projectName, "public", entry.name), content);
            }
        }
    }
    
    // Copy other files
    const serverFileName = isTypeScript ? "server.ts" : "server.js";
    await writeFile(join(projectName, serverFileName), getServerTemplate(isTypeScript));
    
    // Write tsconfig.json if TypeScript project
    if (isTypeScript) {
        await writeFile(join(projectName, "tsconfig.json"), getTsConfigTemplate());
        console.log("📝 Created tsconfig.json for TypeScript support");
    }
    await writeFile(join(projectName, "NEXA_MANIFESTO.md"), getManifestoTemplate());
    // Write package.json - use template-specific if available
     const templatePackageJson = join(templateDir, "package.json");
     if (await fileExists(templatePackageJson)) {
         const content = await readFile(templatePackageJson, "utf-8");
         const pkg = JSON.parse(content);
         pkg.name = projectName;
         // For static template, remove jsonwebtoken dependency if present
         if (selectedTemplate === "static" && pkg.dependencies && pkg.dependencies["jsonwebtoken"]) {
             delete pkg.dependencies["jsonwebtoken"];
         }
         // Ensure jsonwebtoken is included for non-static templates if not already present
         if (selectedTemplate !== "static") {
             if (!pkg.dependencies) pkg.dependencies = {};
             if (!pkg.dependencies["jsonwebtoken"]) {
                 pkg.dependencies["jsonwebtoken"] = "latest";
             }
         }
         await writeFile(join(projectName, "package.json"), JSON.stringify(pkg, null, 2));
     } else {
         const dependencies = { 
             "tailwindcss": "latest", 
             "@tailwindcss/node": "latest"
         };
         // Only add jsonwebtoken for non-static templates
         if (selectedTemplate !== "static") {
             dependencies["jsonwebtoken"] = "latest";
         }
         await writeFile(join(projectName, "package.json"), JSON.stringify({
             name: projectName,
             version: "1.0.0",
             type: "module",
             dependencies: dependencies
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
    console.log(`   bun --hot ${serverFileName}\n`);
}

// --- TEMPLATES (Optimized for Server-Side Rendering) ---

function getFrameworkTemplate(isTypeScript = false) {
    if (isTypeScript) {
        return `import { getDynamicCSS } from './tailwind.js';
export const html = (strings: TemplateStringsArray, ...values: any[]) => strings.reduce((acc, str, i) => acc + str + (values[i] || ""), "");
export async function renderPage(pageResult: any) {
    const { head = "", body } = typeof pageResult === 'object' && pageResult !== null && 'body' in pageResult 
        ? pageResult 
        : { body: pageResult };
    
    const css = await getDynamicCSS(body);
    const nexaProxyScript = \`
    <script>
    // Nexa Zero-API Layer - Client-Side Proxy
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
    </script>\`;
    
    return \`<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><style>\${css}</style>\${head}\${nexaProxyScript}</head><body>\${body}</body></html>\`;
}`;
    }
    
    return `import { getDynamicCSS } from './tailwind.js';
export const html = (strings, ...values) => strings.reduce((acc, str, i) => acc + str + (values[i] || ""), "");
export async function renderPage(pageResult) {
    const { head = "", body } = typeof pageResult === 'object' && pageResult !== null && 'body' in pageResult 
        ? pageResult 
        : { body: pageResult };
    
    const css = await getDynamicCSS(body);
    const nexaProxyScript = \`
    <script>
    // Nexa Zero-API Layer - Client-Side Proxy
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
    </script>\`;
    
    return \`<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><style>\${css}</style>\${head}\${nexaProxyScript}</head><body>\${body}</body></html>\`;
}`;
}

function getServerTemplate(isTypeScript = false) {
    if (isTypeScript) {
        return `import { serve } from "bun";
import { router } from "./core/router";

const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || "0.0.0.0";

console.log(\`🚀 Nexa Framework v1.0.0 - \${new Date().toLocaleString()}\`);
console.log(\`📡 Listening on http://\${HOST}:\${PORT}\`);
console.log(\`🎯 Mode: \${process.env.NODE_ENV || "development"}\`);
console.log(\`🤖 Type: TypeScript\\n\`);

serve({
    port: PORT,
    hostname: HOST,
    fetch: router
});

// Keep the server alive
process.on("SIGINT", () => {
    console.log("\n👋 Goodbye!");
    process.exit(0);
});

process.on("SIGTERM", () => {
    console.log("\n👋 Goodbye!");
    process.exit(0);
});`;
    }
    
    return `import { serve } from "bun";
import { router } from "./core/router.js";

const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || "0.0.0.0";

console.log(\`🚀 Nexa Framework v1.0.0 - \${new Date().toLocaleString()}\`);
console.log(\`📡 Listening on http://\${HOST}:\${PORT}\`);
console.log(\`🎯 Mode: \${process.env.NODE_ENV || "development"}\`);
console.log(\`🤖 Type: JavaScript\\n\`);

serve({
    port: PORT,
    hostname: HOST,
    fetch: router
});

// Keep the server alive
process.on("SIGINT", () => {
    console.log("\n👋 Goodbye!");
    process.exit(0);
});

process.on("SIGTERM", () => {
    console.log("\n👋 Goodbye!");
    process.exit(0);
});`;
}

function getTsConfigTemplate() {
    return `{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "allowJs": false,
    "checkJs": false,
    "declaration": false,
    "sourceMap": false,
    "noEmit": true,
    "incremental": false
  },
  "include": ["**/*"],
  "exclude": ["node_modules"]
}`;
}

async function getRouterTemplate(selectedTemplate, isTypeScript = false) {
      const routerPath = join(__dirname, "..", "src", "core", "router.js");
      let routerContent = await readFile(routerPath, "utf-8");
      
      if (isTypeScript) {
          // Fix imports
          routerContent = routerContent
            .replace(/from '\.\/framework\.js'/, "from './framework'")
            .replace(/from '\.\/security\.js'/, "from './security'")
            .replace(/let jwt;/, "let jwt: any;")
            .replace(/function extractToken\(req\)/, "function extractToken(req: any)")
            .replace(/function verifyToken\(token\)/, "function verifyToken(token: string)")
            .replace(/export async function handleRequest\(req\)/, "export async function handleRequest(req: any)")
            .replace(/catch \(error\)/g, "catch (error: any)")
            .replace(/catch \(e\)/g, "catch (e: any)")
            .replace(/const segments = path === "\/" ? \["index"\] : path.slice\(1\)\.split\("\/"\)/, "const segments: string[] = path === '/' ? ['index'] : path.slice(1).split('/')")
            .replace(/let params = {}/, "let params: Record<string, string> = {}")
            .replace(/const protectedRoutes = {/, "const protectedRoutes: Record<string, string[]> = {")
            .replace(/const publicRoutes = \['\/', '\/login', '\/register'\]/, "const publicRoutes: string[] = ['/', '/login', '/register']")
            .replace(/cookies.find\(c => c.trim\(\).startsWith\('nexa_access='\)\)/, "cookies.find((c: string) => c.trim().startsWith('nexa_access='))")
            .replace(/let paramName;/, "let paramName: string = '';")
            .replace(/function verifyToken\(token: string\)/, "function verifyToken(token: string): { role: string } | null")
            .replace(/return jwt\.verify\(token, JWT_SECRET\);/, "return jwt.verify(token, JWT_SECRET) as { role: string };")
            ;
      }
      
      // For non-static templates, use direct import instead of optional import
      if (selectedTemplate !== "static") {
          const optionalImportPattern = /\/\/ Make jsonwebtoken optional.*?jwt = null;\s*}/s;
          routerContent = routerContent.replace(optionalImportPattern, isTypeScript ? `import jwt from 'jsonwebtoken';` : `import jwt from 'jsonwebtoken';`);
      }
      
      return routerContent;
  }

  function getTailwindTemplate(isTypeScript = false) {
      if (isTypeScript) {
          return `
import { compile } from 'tailwindcss';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export async function getDynamicCSS(htmlContent: string): Promise<string> {
    try {
        // Use the full default Tailwind CSS from the package
        const cssPath = join(process.cwd(), 'node_modules', 'tailwindcss', 'index.css');
        const content = await readFile(cssPath, 'utf-8');
        const compiler = await compile(content);
        
        const candidates = Array.from(htmlContent.matchAll(/class=["']([^"']+)["']/g), (m: any) => m[1].split(/\\s+/)).flat().filter(Boolean);
        
        // Build CSS with the identified candidates
        const cssResult = compiler.build(candidates);
        
        if (typeof cssResult === 'string') {
            return cssResult;
        } else if (typeof cssResult === 'object' && cssResult !== null && 'css' in cssResult) {
            return cssResult.css;
        } else {
            console.warn("Unexpected CSS result format:", cssResult);
            return "";
        }
    } catch (e: any) { 
        console.error("Tailwind CSS Error:", e);
        console.error("Stack trace:", e?.stack);
        return ""; 
    }
}
`;
      }
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

function getSecurityTemplate(isTypeScript = false) {
      if (isTypeScript) {
          return `// Security and CORS configuration
  export const DEFAULT_SECURITY_HEADERS: Record<string, string> = {
      "X-Frame-Options": "DENY",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "Permissions-Policy": "geolocation=(), microphone=(), camera=()"
  };
  
  export function applyCORSHeaders(headers: Record<string, string> = {}): Record<string, string> {
      return {
          ...headers,
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization"
      };
  }
  
  export function isSafePath(path: string): boolean {
      // Prevent directory traversal
      return !path.includes("..") && !path.startsWith("/../") && !path.endsWith("/..");
  }`;
      }
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

14. Native Type Safety
First-Class TS: Nexa supports TypeScript out of the box. No build step required.

End-to-End Safety: By using JSDoc or .ts files in lib/services, the Nexa.proxy provides full type inference to the UI.

Zero Overhead: TypeScript is used for developer sanity, but it never adds a "Compile Step" that slows down the deployment pipeline.

15. Production & Deployment
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
