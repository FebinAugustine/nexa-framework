# Nexa Framework

## License
Nexa Framework is released under the **Business Source License 1.1** (BSL 1.1). This license allows for:

- **Non-commercial use**: Personal projects, educational use, and evaluation
- **Commercial use**: For entities with annual gross revenue under $50,000 USD
- **Open Source transition**: On March 12, 2030 (or 4 years after initial release, whichever comes first), the framework will transition to the **Apache License 2.0**

For more details, see the [LICENSE.md](LICENSE.md) file.

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
nexa init my-project --template=static

# Dynamic web app template (with login/dashboard)
nexa init my-project --template=dynamic

# Blog template (with dynamic routing)
nexa init my-project --template=blog

# TypeScript template (with TypeScript support)
nexa init my-project --template=static --typescript
nexa init my-project --template=dynamic --typescript
nexa init my-project --template=blog --typescript

cd my-project
bun --hot server.ts  # or server.js for JavaScript
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

## Security

Nexa Framework is designed with security as a first-class concern. It provides built-in security protections that automatically safeguard your applications from common web vulnerabilities.

### Key Security Features
- **Default Security Headers**: X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
- **CORS Configuration**: Cross-origin resource sharing support
- **Path Traversal Protection**: Prevents directory traversal attacks
- **Authentication**: JWT-based authentication with HttpOnly, Secure, SameSite=Strict cookies
- **Authorization**: Role-based access control
- **Token Management**: Access and refresh token system with silent refresh
- **Zero-API Layer Security**: Automatic auth checks for proxy calls

For detailed information, see the [security.md](docs/security.md) document.

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

#### NexaStore: Signal-based State Orchestrator

For complex applications, Nexa provides a Redux-like state management system called NexaStore that works with signals. It provides structured state management with action dispatch and subscription capabilities.

```javascript
// state/userStore.js
import { createNexaStore } from '../core/store.js';

export const userStore = createNexaStore(
  { name: 'Guest', role: 'viewer', isAuth: false }, // Initial State
  {
    // Actions
    login(state, userData) {
      state.name.set(userData.name);
      state.role.set(userData.role);
      state.isAuth.set(true);
    },
    logout(state) {
      state.name.set('Guest');
      state.isAuth.set(false);
    }
  }
);
```

Using NexaStore in a page:
```javascript
// pages/profile.js
import { html } from '../core/framework.js';

export default function ProfilePage() {
  return {
    head: html`<title>Profile - Nexa Framework</title>`,
    body: html`
      <main class="h-screen flex items-center justify-center bg-gray-50">
        <div class="text-center">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">
            Welcome, <span id="username">Guest</span>
          </h1>
          <p class="text-gray-600 mb-6">Role: <span id="user-role">viewer</span></p>
          <button id="login-btn" class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Login
          </button>
          <button id="logout-btn" class="ml-4 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
            Logout
          </button>
        </div>
      </main>

      <script type="module">
        import { userStore } from '/state/userStore.js';
        
        const usernameEl = document.getElementById('username');
        const roleEl = document.getElementById('user-role');
        const loginBtn = document.getElementById('login-btn');
        const logoutBtn = document.getElementById('logout-btn');

        // Subscribe to state changes
        userStore.subscribe('name', (value) => {
          usernameEl.textContent = value;
        });

        userStore.subscribe('role', (value) => {
          roleEl.textContent = value;
        });

        // Action handlers
        loginBtn.addEventListener('click', () => {
          userStore.dispatch('login', {
            name: 'John Doe',
            role: 'admin'
          });
        });

        logoutBtn.addEventListener('click', () => {
          userStore.dispatch('logout');
        });
      </script>
    `
  };
}
```

#### Example Usage: Counter Implementation

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

## The Zero-API Layer (Distributed Execution)

### Philosophy
The network should be transparent. Calling a server function from the client should feel local.

### How it Works
Nexa introduces a `window.Nexa` global object that acts as a proxy to your server-side services. You can call backend functions directly from client-side script tags without writing any API routes or fetch wrappers.

### Example

**Server-side service in `lib/services/userService.js`:**
```javascript
// This is a standard server-side service
export async function updateProfile(userId, data) {
    // Database logic here...
    return { success: true };
}
```

**Client-side usage in any page:**
```javascript
export default function ProfilePage() {
    return html`
        <button id="saveBtn">Save Profile</button>

        <script type="module">
            document.getElementById('saveBtn').onclick = async () => {
                // NO FETCH, NO API ROUTE, NO BOILERPLATE
                const result = await Nexa.services.userService.updateProfile(123, { name: 'New Name' });
                alert(result.success ? "Saved!" : "Error");
            };
        </script>
    `;
}
```

### Key Features
- **Zero API Boilerplate**: No need to create API routes just to call server functions
- **Runtime Agnostic**: Works in any standard `<script>` tag (not tied to React/forms)
- **Automatic Security**: Proxy requests are subjected to the same Security Shield and Auth Gate as standard pages
- **Type Inference**: Uses JSDoc or TypeScript for autocomplete support
- **High Performance**: Uses Bun's native JSON serialization for maximum throughput

### Constraints
- Only functions exported from `lib/services/` are eligible for proxying
- Functions must be async or return promises for async operations
- Arguments and return values must be JSON-serializable

## TypeScript Support

Nexa supports TypeScript out of the box with Bun's built-in transpiler, providing a "no-build" TypeScript experience.

### Key Features
- **Native TypeScript Execution**: Bun treats `.ts` and `.tsx` files as first-class citizens without any configuration
- **Zero Build Step**: Run TypeScript files directly with `bun --hot server.ts`
- **Type-Safe Zero-API Layer**: Services in `lib/services/*.ts` provide type inference to client-side code
- **IDE Support**: Full autocompletion for backend functions in client-side script tags

### Getting Started with TypeScript
```typescript
// lib/services/db.ts
export async function getCount(): Promise<number> {
    return 42;
}
```

```typescript
// pages/index.ts
import { html } from '../core/framework.js';

export default function HomePage() {
    return {
        head: html`<title>Home - Nexa</title>`,
        body: html`
            <div class="p-10">
                <h1 class="text-4xl font-bold">Welcome to Nexa</h1>
                <p class="mt-4">Count: <span id="count">0</span></p>
            </div>

            <script type="module">
                // This will have type hints if your IDE is active
                const count = await Nexa.services.db.getCount();
                document.getElementById('count').textContent = count;
            </script>
        `
    };
}
```

### tsconfig.json
A basic tsconfig.json is automatically generated when using the `--typescript` flag:

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "jsx": "react-jsx",
    "jsxImportSource": "react",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true
  },
  "include": ["**/*"],
  "exclude": ["node_modules"]
}
```

## Governance & Contribution
- **Standardization**: All core framework changes must be benchmarked against the 12ms SSR baseline.
- **Extensibility**: Use the lib/ folder for "Plugins." If a feature is common (like Auth), it should be a template in the CLI, not a forced core dependency.
- **Documentation**: Every Service or Component must be documented via JSDoc to ensure AI agents can interpret the logic accurately.

## License
MIT
