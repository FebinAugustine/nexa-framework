# Nexa Framework TypeScript Support

## Overview

Nexa Framework provides **native TypeScript support** out of the box, thanks to Bun's built-in TypeScript transpiler. You get all the benefits of type safety and autocompletion without any of the build tool configuration or performance overhead.

## Why TypeScript with Nexa?

### 1. No Build Step Required

Unlike traditional TypeScript setups, you don't need to:
- Configure `tsc` (TypeScript compiler)
- Use Webpack or Babel
- Create a `dist/` folder
- Wait for compilation

Bun treats `.ts` and `.tsx` files as first-class citizens and executes them directly.

### 2. Native Performance

Bun's TypeScript transpiler is incredibly fast, maintaining Nexa's **12ms SSR baseline** even for large applications.

### 3. End-to-End Type Safety

Type safety extends across the entire application:
- Server-side code (pages, API routes, services)
- Client-side scripts in `<script>` tags
- Zero-API Proxy calls

## Getting Started with TypeScript

### 1. Create a TypeScript Project

Use the `--typescript` flag when initializing a new project:

```bash
nexa init my-ts-project --template=dynamic --typescript
# or for static sites
nexa init my-ts-project --template=static --typescript
```

This creates:
- A TypeScript project structure
- `.ts` files for all core components
- A basic `tsconfig.json`
- Type-safe templates

### 2. Basic tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "rootDir": ".",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "lib": ["ES2020", "DOM"],
    "types": ["node"]
  },
  "include": [
    "**/*.ts",
    "**/*.d.ts"
  ],
  "exclude": [
    "node_modules"
  ]
}
```

### 3. Running TypeScript Files

Execute TypeScript files directly with Bun:

```bash
bun --hot server.ts
```

The `--hot` flag enables hot reload for development.

## Type-Safe Development

### 1. Type-Safe Pages

```typescript
// pages/index.ts
import { html } from '../core/framework.js';

interface PageProps {
  title: string;
  content: string;
}

export default function HomePage({ title, content }: PageProps) {
  return {
    head: html`<title>${title}</title>`,
    body: html`
      <main class="p-10">
        <h1 class="text-4xl font-bold mb-4">${title}</h1>
        <p class="text-gray-600">${content}</p>
      </main>
    `
  };
}
```

### 2. Type-Safe Services

```typescript
// lib/services/userService.ts
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'viewer' | 'admin' | 'editor';
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  role?: 'viewer' | 'admin' | 'editor';
}

export async function getUsers(): Promise<User[]> {
  // Database query here...
  return [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'viewer' }
  ];
}

export async function updateUser(userId: number, data: UpdateUserRequest): Promise<User> {
  // Database update here...
  return { id: userId, name: 'Updated Name', email: 'updated@example.com', role: 'editor' };
}
```

### 3. Type-Safe Zero-API Layer

The Zero-API Proxy becomes exponentially more powerful with TypeScript:

```typescript
// pages/userList.ts
import { html } from '../core/framework.js';

export default function UserListPage() {
  return {
    head: html`<title>User List - Nexa</title>`,
    body: html`
      <main class="p-10">
        <h1 class="text-4xl font-bold mb-4">User List</h1>
        <div id="userList" class="space-y-4"></div>
      </main>

      <script type="module">
        // This gets type hints if your IDE supports it
        const users = await Nexa.services.userService.getUsers();
        
        const userList = document.getElementById('userList');
        userList.innerHTML = users.map(user => `
          <div class="p-4 border rounded">
            <h3 class="font-bold">${user.name}</h3>
            <p class="text-gray-600">${user.email}</p>
            <p class="text-sm text-gray-500">Role: ${user.role}</p>
          </div>
        `).join('');
      </script>
    `
  };
}
```

## Type-Safe State Management

### Type-Safe Signals

```typescript
// core/signals.ts
export function signal<T>(initialValue: T) {
  let value: T = initialValue;
  const subscribers = new Set<(value: T) => void>();

  function get(): T {
    return value;
  }

  function set(newValue: T): T {
    if (value !== newValue) {
      value = newValue;
      subscribers.forEach(cb => cb(value));
    }
    return value;
  }

  function subscribe(callback: (value: T) => void): () => void {
    subscribers.add(callback);
    return () => subscribers.delete(callback);
  }

  return { get, set, subscribe };
}

// Helper for creating derived signals
export function derived<T>(
  sources: Array<ReturnType<typeof signal>>, 
  compute: (sources: Array<ReturnType<typeof signal>>) => T
) {
  const result = signal(compute(sources));
  
  // Subscribe to all source signals
  sources.forEach(source => {
    source.subscribe(() => {
      result.set(compute(sources));
    });
  });

  return result;
}
```

### Type-Safe Stores

```typescript
// state/userStore.ts
import { createNexaStore } from '../core/store.js';

interface UserState {
  name: string;
  role: 'viewer' | 'admin' | 'editor';
  isAuth: boolean;
}

interface UserActions {
  login: (
    state: { [K in keyof UserState]: { get(): UserState[K]; set(v: UserState[K]): void } }, 
    userData: { name: string; role: 'viewer' | 'admin' | 'editor' }
  ) => void;
  logout: (
    state: { [K in keyof UserState]: { get(): UserState[K]; set(v: UserState[K]): void } }
  ) => void;
  updateProfile: (
    state: { [K in keyof UserState]: { get(): UserState[K]; set(v: UserState[K]): void } },
    profileData: Partial<UserState>
  ) => void;
}

export const userStore = createNexaStore<UserState, UserActions>(
  { 
    name: 'Guest', 
    role: 'viewer', 
    isAuth: false 
  },
  {
    login(state, userData) {
      state.name.set(userData.name);
      state.role.set(userData.role);
      state.isAuth.set(true);
    },
    logout(state) {
      state.name.set('Guest');
      state.isAuth.set(false);
    },
    updateProfile(state, profileData) {
      Object.entries(profileData).forEach(([key, value]) => {
        if (state[key]) {
          state[key].set(value as UserState[keyof UserState]);
        }
      });
    }
  }
);
```

## Advanced TypeScript Features

### 1. Type Definitions

Create custom type definitions in `types/` folder:

```typescript
// types/env.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    PORT: string;
    HOST: string;
    JWT_SECRET: string;
  }
}

// types/nexa.d.ts
declare global {
  interface Window {
    Nexa: {
      services: any;
    };
  }
}

export {};
```

### 2. Type Assertions

```typescript
// pages/dynamic.ts
import { html } from '../core/framework.js';

export default function DynamicPage() {
  return {
    head: html`<title>Dynamic Content - Nexa</title>`,
    body: html`
      <main class="p-10">
        <h1 class="text-4xl font-bold mb-4">Dynamic Content</h1>
        <div id="content"></div>
      </main>

      <script type="module">
        const dynamicData = await fetch('/api/data').then(res => res.json());
        
        // Type assertion
        const typedData = dynamicData as { title: string; items: string[] };
        
        const content = document.getElementById('content');
        content.innerHTML = `
          <h2>${typedData.title}</h2>
          <ul>
            ${typedData.items.map(item => `<li>${item}</li>`).join('')}
          </ul>
        `;
      </script>
    `
  };
}
```

### 3. Type Guards

```typescript
// lib/validators.ts
export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

export function isProduct(data: any): data is Product {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data && typeof data.id === 'number' &&
    'name' in data && typeof data.name === 'string' &&
    'price' in data && typeof data.price === 'number' &&
    'category' in data && typeof data.category === 'string'
  );
}

// Usage
const productData = await fetch('/api/product/1').then(res => res.json());
if (isProduct(productData)) {
  console.log('Valid product:', productData);
} else {
  console.error('Invalid product data');
}
```

## Comparison with Other Frameworks

| Feature | Nexa | Next.js | NestJS | SvelteKit |
|---------|------|---------|--------|-----------|
| **TypeScript Support** | Native | Via tsc | Via tsc | Via tsc |
| **Build Step** | No | Yes | Yes | Yes |
| **Performance** | Instant | Slow (30+ sec) | Slow (20+ sec) | Moderate (10+ sec) |
| **Configuration** | Zero | Complex tsconfig | Complex tsconfig | Moderate |
| **End-to-End Safety** | Yes (Zero-API) | No | Yes (with DTOs) | No |

## Best Practices

### 1. Strict Mode

Enable strict type checking in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

### 2. Type Safety First

- Use `interface` for object types
- Use `type` for unions and intersections
- Avoid `any` as much as possible
- Use type guards for runtime validation

### 3. Code Organization

- Keep types in separate files (e.g., `types/`, `interfaces/`)
- Use meaningful type names
- Document complex types with JSDoc
- Keep type definitions close to their usage

### 4. Error Handling

```typescript
// lib/errors.ts
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Usage in services
export async function getUser(id: number): Promise<User> {
  try {
    const user = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    if (!user) {
      throw new ApiError(404, `User with id ${id} not found`);
    }
    return user;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, 'Internal server error');
  }
}
```

## Migrating from JavaScript

### 1. Rename Files

Change file extensions from `.js` to `.ts` (or `.tsx` for JSX/TSX).

### 2. Add Type Annotations

```javascript
// JavaScript
export function add(a, b) {
  return a + b;
}
```

```typescript
// TypeScript
export function add(a: number, b: number): number {
  return a + b;
}
```

### 3. Handle Optional Values

```javascript
// JavaScript
export function getUserInfo(user) {
  return {
    name: user.name,
    email: user.email,
    age: user.age || 0
  };
}
```

```typescript
// TypeScript
export interface User {
  name: string;
  email: string;
  age?: number;
}

export function getUserInfo(user: User) {
  return {
    name: user.name,
    email: user.email,
    age: user.age ?? 0
  };
}
```

## TypeScript in Nexa Manifesto

> ### 30. Native Type Safety
> 
> * **First-Class TS:** Nexa supports TypeScript out of the box. No build step required.
> * **End-to-End Safety:** By using JSDoc or `.ts` files in `lib/services`, the `Nexa.proxy` provides full type inference to the UI.
> * **Zero Overhead:** TypeScript is used for developer sanity, but it never adds a "Compile Step" that slows down the deployment pipeline.

## Summary

Nexa Framework's TypeScript support is a game-changer for modern web development. It provides all the benefits of type safety and autocompletion without any of the traditional overhead. With Bun's built-in transpiler, you can write TypeScript code that executes instantly, maintaining Nexa's performance promises.

Whether you're building simple static sites or complex enterprise applications, TypeScript in Nexa will help you catch errors early, improve code maintainability, and provide a better developer experience.
