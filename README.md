# Nexa Framework

## The Motto
"Power of the Server, Speed of the Browser. No Build. No Hydration."

## Project Intention
Nexa is an Enterprise-Ready Web Framework designed for the Bun Runtime. It is engineered to deliver the developer experience of a modern framework (like Next.js or Nuxt) without the performance tax of client-side bundling, hydration, or heavy build steps. Nexa follows the "Resumable" pattern: HTML is sent 100% complete, and logic is attached only when a user interacts.

## Core Architectural Pillars

### A. JIT Server-Side Styling (Tailwind v4)
- **Zero Client Load**: The browser never compiles CSS.
- **Mechanism**: The core/tailwind.js engine scans HTML during the request, compiles the CSS on the server using the official Tailwind v4 Node compiler, and injects a static <style> block.

### B. Enterprise Separation of Concerns
- **Infrastructure vs. Logic**: Third-party SDKs (Databases, Mailers) live in lib/ as singletons. API routes in api/ consume these libs. This prevents "Spaghetti Code" and ensures scalable database connection management.

### C. File-System Routing (Sub-directory Support)
- **Automatic Mapping**: The router maps URLs directly to the /pages or /api folders.
- **Resilience**: Includes a "System Shield" to ignore browser noise (favicons, devtools) and handles Windows paths using pathToFileURL.

## Installation

```bash
bun add -g nexa-framework
```

## Creating a New Project

```bash
# Default template (basic)
nexa init my-project

# Static website template
nexa init my-project --type=static

# Dynamic web app template (with login/dashboard)
nexa init my-project --type=dynamic

# Blog template (with dynamic routing)
nexa init my-project --type=blog

cd my-project
bun --hot server.js
```

## Project Structure (The Blueprint)

| Directory | Purpose | AI Agent Instruction |
|-----------|---------|---------------------|
| /core | "The Engine (Router, JIT, Framework)" | Immutable. Do not modify unless changing framework behavior. |
| /config | Env validation & UI Constants | Centralize all process.env calls here. |
| /lib | SDK & 3rd-Party Integrations | "Initialize DB, Mailer, and Cloud storage here as Singletons." |
| /api | Backend Logic & Endpoints | Must import from lib/. Handles GET/POST/PUT/DELETE. |
| /components | Stateless UI Atoms | Pure functions returning html. No side effects. |
| /pages | SSR Views | Defines the UI and SEO Metadata per route. |
| /state | Client Reactivity | Logic for Resumability and browser-side events. |
| /public | Static Assets | "Images, fonts, and robots.txt." |

## Usage

### Creating Pages

Create a new file in the `pages/` directory:

```javascript
// pages/about.js
import { html } from '../core/framework.js';

export default function AboutPage() {
    return {
        head: html`<title>About - Nexa Framework</title>`,
        body: html`<main class="h-screen flex items-center justify-center bg-gray-50">
            <div class="text-center">
                <h1 class="text-4xl font-bold text-gray-900">About Nexa</h1>
                <p class="mt-4 text-gray-600">A modern web framework for the Bun runtime</p>
            </div>
        </main>`
    };
}
```

### Creating API Endpoints

Create a new file in the `api/` directory:

```javascript
// api/health.js
export async function GET() {
    return Response.json({ 
        status: "ok", 
        memory: process.memoryUsage().heapUsed,
        timestamp: Date.now()
    });
}
```

### Building for Production

```bash
nexa build
```

This pre-compiles all CSS for production.

## Technical Implementation Details

### A. Routing & Security
- **Guard**: Every route check uses existsSync to prevent 500 errors on missing files.
- **Shield**: Explicitly ignores .map, .json, and .well-known requests.
- **CORS/Security**: Managed via core/security.js (headers like X-Frame-Options).

### B. Component Patterns
- **Metadata Injection**: Pages return an object { head: ..., body: ... }. The head is injected into the HTML shell by core/framework.js.
- **Universal HTML**: Uses the html tagged template for high-performance string interpolation.

### C. Native Middleware
Nexa does not use a middleware "stack." Global logic (Auth, Logging, Security Headers) must be implemented as functional "Gates" inside core/router.js.

### D. Performance Monitoring
Monitoring is built directly into the core/router.js using performance.now(). Every request is logged to the terminal with its Method, Path, Status Code, and Total Execution Time. Target execution time for SSR pages should be < 50ms.

## Guidelines for AI Agents & Developers
1. **Never introduce a bundler**: No Vite, No Webpack, No dist folder.
2. **Standard ESM**: Use absolute paths or process.cwd() with pathToFileURL for all dynamic imports.
3. **Silent Optimization**: Background tasks (like bun install) should be handled by the CLI to maintain the "Instant" feel.
4. **No CDN Styles**: Always use the server-side JIT compiler to avoid browser performance warnings.

## Data Strategy (SQL vs NoSQL)

### Relational (PostgreSQL)
- **File Location**: lib/sql.js
- **Use Case**: Finance, E-commerce, Inventory, or any data requiring strict ACID compliance and complex relationships.
- **Pattern**: Use a singleton connection pool (e.g., postgres.js).

### NoSQL (MongoDB)
- **File Location**: lib/mongodb.js
- **Use Case**: Content Management Systems (CMS), Blog engines, Real-time activity feeds, or highly variable metadata.
- **Pattern**: Use the MongoDB Node Driver initialized as a singleton.

## Instructions for Modification
- **To add a Database**: Initialize the client in lib/, export the singleton, and import it into an api/ route.
- **To add a New Page**: Create pages/your-page.js, export a default function returning html, and link it in the Navbar.

## Layouts & Composition
Layouts are higher-order components in /components that wrap page content. They return the standard Nexa { head, body } object. Use Layouts to maintain persistent UI elements (Nav, Sidebar) across multiple pages.

## Dynamic Routing (The Bracket System)
Convention: Folders named [paramName] are treated as dynamic segments. Parameter Injection: The router extracts these segments and passes them as a params object to the Page function. Nesting: Dynamic routes can be nested (e.g., /shop/[category]/[id]).

## Backend Architectural Pattern (Service-Controller)
Controllers (api/): Scoped to HTTP concerns only. They parse requests and delegate to services. Services (lib/services/): Scoped to business logic and data manipulation. They are protocol-agnostic.

## Automatic Routing
Nexa uses File-System-Based Routing. Adding a file to /pages or /api automatically creates the route. No manual registration required. Supports Static (index.js) and Dynamic ([slug]) routing out of the box.

## Static Content Management
Store raw content (Markdown, JSON) in a top-level /content folder. Use Services in lib/services/ to parse and deliver this data to pages. Pro Tip: By using marked on the server, we send the finished HTML to the client, keeping the browser's JavaScript execution at zero.

## Production & Deployment
- **Zero-Build Production**: Deployment simply involves copying the source code and running bun install --production.
- **Process Management**: Always use a process manager like PM2 or a Docker restart policy to ensure 99.9% uptime.
- **Environment Security**: Never commit your .env file. Use the hosting provider's "Environment Variables" interface to inject secrets like DB_URL.
- **Reverse Proxy**: It is recommended to run Nexa behind Nginx or Caddy to handle SSL (HTTPS) and load balancing.

## State & Resumability

### Zero-Hydration State
State is not "synced" via a virtual DOM. It is Injected as a JSON block in the HTML. Client-side scripts read the NEXA_STATE element to resume logic.

This prevents the "Uncanny Valley" where a page looks ready but buttons don't work because a 2MB JavaScript bundle is still loading.

### Fine-Grained Reactivity (Signals)
Nexa utilizes a Signals pattern for client-side interactivity:

- **Direct Binding**: Signals update the DOM directly without a Virtual DOM or a "diffing" process
- **State Resumption**: Server-rendered values are passed into client-side signals during the "Interaction Phase" to maintain continuity
- **Performance Goal**: Keep the scripting overhead below 5ms even for complex state changes

Nexa provides a built-in signals implementation in `core/signals.js` that follows this pattern.

#### The Store Pattern

Global or shared state must reside in the state/ directory. This acts as a single source of truth that multiple components or pages can subscribe to.

```javascript
// state/cart.js
import { signal } from '../core/signals.js';

export const cartItems = signal([]);
export const cartTotal = signal(0);

export function addToCart(item) {
    cartItems.set([...cartItems.get(), item]);
    cartTotal.set(cartTotal.get() + item.price);
}
```

#### Implementation Example (Resumable Signal)

```javascript
// pages/product.js
import { html } from '../core/framework.js';

export default function ProductPage({ product }) {
    return html`
        <div class="p-10">
            <h1 id="price-tag" class="text-2xl">${product.price}</h1>
            <button id="buy-btn">Add to Cart</button>
        </div>

        <script type="module">
            import { signal } from '/core/signals.js';
            import { addToCart } from '/state/cart.js';

            // 1. Initialize from Server Data
            const price = signal(${product.price});

            // 2. Reactive Binding (Declarative)
            price.subscribe(() => {
                document.getElementById('price-tag').innerText = `$${price.get()}`;
            });

            // 3. Action Logic
            document.getElementById('buy-btn').onclick = () => {
                addToCart({ name: '${product.name}', price: price.get() });
            };
        </script>
    `;
}
```

#### Example Usage:

The generated project includes a ready-to-use counter implementation:

```javascript
// state/counter.js - Generated automatically
import { signal } from '../core/signals.js';

export function createCounter(initialValue = 0) {
  const count = signal(initialValue);
  
  return {
    get count() { return count.get(); },
    increment: () => count.set(count.get() + 1),
    decrement: () => count.set(count.get() - 1),
    reset: () => count.set(0),
    setValue: (newValue) => count.set(newValue)
  };
}
```

Using it in a page:
```javascript
// pages/counter.js
import { html } from '../core/framework.js';

export default function CounterPage() {
  return {
    head: html`<title>Counter - Nexa Framework</title>`,
    body: html`
      <main class="h-screen flex items-center justify-center bg-gray-900">
        <div class="bg-gray-700 rounded-lg shadow-xl p-8">
          <h1 class="text-2xl font-bold text-gray-200 mb-6">
            Counter: <span id="counter-value">0</span>
          </h1>
          <div class="flex gap-4">
            <button id="decrement-btn" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              Decrement
            </button>
            <button id="increment-btn" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              Increment
            </button>
          </div>
        </div>
      </main>
      <script type="module">
        import { signal } from '/core/signals.js';
        
        const count = signal(0);
        const counterValue = document.getElementById('counter-value');
        const incrementBtn = document.getElementById('increment-btn');
        const decrementBtn = document.getElementById('decrement-btn');

        count.subscribe(() => {
          counterValue.textContent = count.get();
        });

        incrementBtn.addEventListener('click', () => {
          count.set(count.get() + 1);
        });

        decrementBtn.addEventListener('click', () => {
          count.set(count.get() - 1);
        });
      </script>
    `
  };
}
```

## Competitive Performance Standards

### The Zero-KB Goal
Every page must strive to ship 0kb of initial JavaScript. Any interactivity should be added via small, scoped <script> tags.

### TTI (Time to Interactive)
Nexa pages are interactive as soon as they are visible because there is no "Hydration Phase."

### Efficiency
Because Nexa runs on Bun, it can handle ~3x more requests per second on the same hardware compared to a Next.js app running on Node.js.

## Data Fetching & Caching
- **Native Preference**: Favor Bun's native fetch over Axios to reduce overhead, unless interceptors are strictly required.
- **Server-Side Caching**: Avoid client-side libraries like TanStack Query. Use in-memory Map objects or bun:sqlite within Services to cache third-party data.
- **Zero Loading States**: Data must be fetched in the Page or API route before rendering to ensure the user receives a complete UI, not a loading spinner.

## Access & Refresh Token Management
- **Double-Cookie Pattern**: Use nexa_access (short-lived) and nexa_refresh (long-lived) cookies.
- **Silent Refresh**: The core/router.js handles token rotation automatically. If an access token is expired but a valid refresh token is present, the router transparently issues a new access token before rendering the page.
- **Database Backed**: Refresh tokens must be stored in the database (lib/sql.js) to support remote logout and security auditing.
- **Security**: Both cookies must be HttpOnly, Secure, and SameSite=Strict.

## Governance & Contribution
- **Standardization**: All core framework changes must be benchmarked against the 12ms SSR baseline.
- **Extensibility**: Use the lib/ folder for "Plugins." If a feature is common (like Auth), it should be a template in the CLI, not a forced core dependency.
- **Documentation**: Every Service or Component must be documented via JSDoc to ensure AI agents can interpret the logic accurately.

## License
MIT
