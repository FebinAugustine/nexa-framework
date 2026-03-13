# Nexa Framework Philosophy: Architecturally Opinionated, Tool Agnostic

## Overview

Nexa Framework occupies a unique position in the web development ecosystem. It is **heavily opinionated about architecture and performance** but **completely non-opinionated about the tools you use** to implement your business logic.

Think of Nexa like a high-end kitchen:
- It gives you a strict layout of where the stove and fridge must go (architecture)
- But it doesn't care which brand of pans you use (tools)

This unique approach prevents decision fatigue while ensuring optimal performance.

## 1. The "Nexa Way": Where We're Opinionated

Nexa has strong opinions on how web applications should be built to stay fast. These opinions are non-negotiable and form the framework's core identity.

### A. The Four Commandments of Nexa

These are the fundamental rules that define the Nexa architecture:

#### 1. Thou Shalt Not Build
- No bundlers (Vite, Webpack)
- No compilation pipelines (other than the built-in JIT core)
- No `dist/` folders
- Code runs directly from source files

#### 2. Thou Shalt Not Hydrate
- Interactivity must be "resumed," not "re-rendered"
- Ship complete HTML to the browser
- Bind data to the DOM directly
- No virtual DOM to the client

#### 3. Isolation is Law
- **Services (`lib/services/`):** Business logic only (never know about HTTP)
- **Controllers (`api/` or `pages/`):** HTTP concerns only (never know about raw SQL or file-system paths)
- **Components (`components/`):** Stateless UI atoms (pure functions)
- **State (`state/`):** Signal-based reactivity for client-side logic

#### 4. Reactivity is Fine-Grained
- No DOM diffing
- Use **Signals** to bind data directly to DOM elements
- If data hasn't changed, the DOM shouldn't move
- Target: < 5ms scripting overhead per state change

### B. Non-Negotiable Architectural Decisions

Nexa enforces specific patterns to ensure consistency and performance:

#### File-System Routing
```
/pages/          → Browser routes (e.g., /about.js maps to /about)
/api/            → API endpoints (e.g., /api/health.js maps to /api/health)
/lib/services/   → Business logic (callable via Zero-API Proxy)
/components/     → Stateless UI components
/state/          → Client-side reactivity (signals and stores)
```

#### Security by Default
- HttpOnly, Secure, SameSite=Strict cookies for authentication
- Automatic security headers (CSP, X-Frame-Options, X-XSS-Protection)
- Silent refresh token management
- Database-backed refresh tokens

#### Performance Guarantees
- SSR pages should render in < 50ms
- Scripting overhead < 5ms per state change
- Zero initial JavaScript
- JIT Tailwind CSS injection

## 2. The Freedom: Where We're Non-Opinionated

Despite the strict architectural rules, Nexa gives you complete freedom over:

### A. Databases
Use any database you want:
- `bun:sqlite` (built-in)
- PostgreSQL (with `postgres` npm package)
- MongoDB (with `mongodb` npm package)
- Prisma (ORM)
- Redis (cache)

```javascript
// lib/sql.js (PostgreSQL)
import postgres from 'postgres';
const sql = postgres(process.env.DATABASE_URL);
export { sql };

// lib/mongodb.js
import { MongoClient } from 'mongodb';
const client = new MongoClient(process.env.MONGODB_URL);
export { client };
```

### B. HTTP Clients
Choose any HTTP client:
- Native `fetch` (recommended for minimal overhead)
- `axios` (for interceptors)
- `got` (for advanced features)

### C. UI Libraries
Use any UI approach:
- Raw HTML with Nexa components
- Web Components
- Any framework that works with plain HTML

### D. Styling
- Tailwind v4 JIT (optimized)
- Plain CSS files in `public/`
- CSS-in-JS (though not recommended for performance)

## 3. Why This Approach Works

### A. The "Pit of Success"

Nexa is designed to put developers in a "Pit of Success." By following the framework's opinions, you're accidentally forced into building a site that scores 100/100 on Google Lighthouse. To build a slow site in Nexa, you have to actively fight the framework's architecture.

### B. Preventing Decision Fatigue

Modern web development is overwhelming with choices. Nexa eliminates decision fatigue by making architectural decisions for you, so you can focus on your business logic.

### C. Scalability

The strict directory structure and separation of concerns make it easy to:
- Onboard new developers
- Maintain large codebases
- Refactor features
- Add new functionality

## 4. Comparison with Other Frameworks

| Framework | Level of Opinion | Key Characteristics |
|-----------|------------------|---------------------|
| **Angular** | High | Dictates everything: TypeScript, RxJS, Dependency Injection, Modules |
| **Next.js** | Medium-High | Dictates routing, data fetching, and deployment |
| **Express.js** | Low | Gives you nothing; you decide everything |
| **Nexa** | Medium-High | **Dictates the "Engine" and "Performance Pattern," but leaves the "Tools" to you** |

## 5. Common Questions & Answers

### Q: Can I use Vite for asset handling?
**A:** No. Nexa has its own JIT core for CSS and asset handling. Using Vite would break the "no-build" philosophy.

### Q: Can I use Redux for state management?
**A:** No. Nexa's built-in signal-based state management is more lightweight and performs better. It's designed specifically for Nexa's architecture.

### Q: Can I use React components?
**A:** Yes, but with limitations. You'd need to pre-render React components to HTML on the server. React's hydration model conflicts with Nexa's resumability philosophy.

### Q: Can I use a different CSS framework than Tailwind?
**A:** Yes. You can write plain CSS files in the `public/` directory and link to them. However, Tailwind v4 JIT is optimized for Nexa's architecture.

## 6. The Nexa Manifesto Philosophy

This philosophy is captured in the **NEXA_MANIFESTO.md** as:

> ### 4. The Nexa Philosophy: Architecturally Opinionated, Tool Agnostic
> 
> Nexa is not a "do whatever you want" library; it is a framework with a strong perspective on how high-performance web applications must be built. It is designed to prevent "Architectural Drift" by enforcing specific patterns.
> 
> **The Opinion (Strict):** You *must* use File-System Routing. You *must* use the Service-Controller pattern. You *must* use HttpOnly cookies for Auth.
> 
> **The Freedom (Flexible):** You can use any Database (Postgres, Mongo, SQLite). You can use any HTTP Client (Fetch, Axios). You can use any UI logic (Web Components, raw HTML, Templates).

## 7. Applying the Philosophy to Development

### A. Project Structure

```
my-nexa-app/
├── core/             → Framework engine (immutable)
├── config/           → Env validation & constants
├── lib/              → SDK & 3rd-party integrations
│   └── services/     → Business logic
├── api/              → Backend endpoints
├── components/       → Stateless UI atoms
├── pages/            → SSR views
├── state/            → Client reactivity
├── public/           → Static assets (css, images)
└── server.js         → Entry point
```

### B. Component Development

```javascript
// components/Button.js (stateless)
import { html } from '../core/framework.js';

export function Button({ text, onClick, className = '' }) {
    return html`<button onclick="${onClick}" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ${className}">
        ${text}
    </button>`;
}
```

### C. Service Implementation

```javascript
// lib/services/userService.js (business logic)
export async function getUsers() {
    // Database query here...
    return [
        { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
    ];
}

export async function createUser(userData) {
    // Validate and create user...
    return { id: 3, ...userData };
}
```

## Summary

Nexa Framework's unique philosophy of being **architecturally opinionated but tool agnostic** strikes the perfect balance between structure and freedom. By making non-negotiable decisions about performance and architecture, Nexa ensures your application will be fast and maintainable. At the same time, it gives you complete freedom over the tools you use to implement your business logic.

This approach eliminates decision fatigue, prevents architectural drift, and allows developers to focus on what matters most—building great products.
