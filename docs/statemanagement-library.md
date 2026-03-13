# Nexa Framework State Management: Signals & NexaStore

## Overview

Nexa Framework provides a modern, lightweight state management system built around two core concepts:

1. **Signals**: Fine-grained reactivity system for simple state management
2. **NexaStore**: Signal-based orchestrator for complex state management with Redux-like action handling

This approach eliminates the need for heavyweight libraries like Redux or Zustand, while providing excellent performance and developer experience.

## 1. Signals: Fine-Grained Reactivity

### What are Signals?

Signals are the atomic unit of state in Nexa. They are lightweight reactive primitives that allow you to:
- Store values
- Subscribe to changes
- Update values and automatically notify subscribers

### Basic Usage

```javascript
import { signal } from '/core/signals.js';

// Create a signal with initial value
const count = signal(0);

// Get current value
console.log(count.get()); // 0

// Subscribe to changes
const unsubscribe = count.subscribe(value => {
    console.log('Count changed:', value);
});

// Update value
count.set(1); // Logs: Count changed: 1

// Unsubscribe
unsubscribe();
```

### Implementation Details

The signal implementation is minimal and efficient:

```javascript
// core/signals.js
export function signal(initialValue) {
    let value = initialValue;
    const subscribers = new Set();

    function get() {
        return value;
    }

    function set(newValue) {
        if (newValue !== value) {
            value = newValue;
            subscribers.forEach(callback => callback(value));
        }
    }

    function subscribe(callback) {
        subscribers.add(callback);
        return () => subscribers.delete(callback);
    }

    return { get, set, subscribe };
}
```

### Key Benefits

- **Minimal Overhead**: < 100 bytes per signal
- **Fine-Grained Updates**: Only affects subscribed components
- **Direct DOM Access**: No virtual DOM or diffing required
- **Resumable**: Works seamlessly with Nexa's server-rendered pages
- **Zero Dependencies**: Built into the framework

## 2. NexaStore: Signal-Based Orchestrator

For complex applications, NexaStore provides a structured, Redux-like state management system that builds on top of signals.

### What is NexaStore?

NexaStore is:
- A collection of "smart slices" of state that live in the `state/` directory
- Combines signals with action-based workflow
- Provides traceability and middleware capabilities
- Supports computed state and persistence

### Creating a Store

```javascript
// state/userStore.js
import { createNexaStore } from '../core/store.js';

export const userStore = createNexaStore(
    // Initial state
    { 
        name: 'Guest', 
        role: 'viewer', 
        isAuth: false 
    },
    // Actions
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
                    state[key].set(value);
                }
            });
        }
    }
);
```

### Store Implementation

```javascript
// core/store.js
import { signal } from './signals.js';

export function createNexaStore(initialState, actions = {}) {
    const state = {};
    
    // Convert initial state to signals
    for (const [key, value] of Object.entries(initialState)) {
        state[key] = signal(value);
    }

    const store = {
        state,
        // Get current value (proxy to signal.get())
        get(key) { 
            if (!state[key]) {
                throw new Error(`State key "${key}" not found`);
            }
            return state[key].get(); 
        },
        
        // Action Dispatcher
        dispatch(actionName, payload) {
            if (actions[actionName]) {
                console.log(`[NexaStore] Action: ${actionName}`, payload);
                actions[actionName](state, payload);
            } else {
                console.warn(`[NexaStore] Action "${actionName}" not defined`);
            }
        },

        // Global Subscribe
        subscribe(key, fn) {
            if (!state[key]) {
                throw new Error(`State key "${key}" not found`);
            }
            return state[key].subscribe(fn);
        }
    };

    return store;
}
```

### Using the Store in Components

```javascript
// pages/profile.js
import { html } from '../core/framework.js';
import { userStore } from '../state/userStore.js';

export default function ProfilePage() {
    return {
        head: html`<title>Profile - Nexa</title>`,
        body: html`
            <div class="p-10">
                <h1 class="text-4xl font-bold mb-4">
                    Welcome, <span id="username">${userStore.get('name')}</span>
                </h1>
                <p class="text-gray-600 mb-6">
                    Role: <span id="user-role">${userStore.get('role')}</span>
                </p>
                
                ${userStore.get('isAuth') ? html`
                    <button id="logout-btn" class="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                        Logout
                    </button>
                ` : html`
                    <button id="login-btn" class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Login
                    </button>
                `}
            </div>

            <script type="module">
                // Subscribe to state changes
                userStore.subscribe('name', (value) => {
                    document.getElementById('username').textContent = value;
                });

                userStore.subscribe('role', (value) => {
                    document.getElementById('user-role').textContent = value;
                });

                userStore.subscribe('isAuth', (value) => {
                    // Re-render login/logout button
                    document.querySelector('main').innerHTML = value ? 
                        '<button id="logout-btn" class="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">Logout</button>' :
                        '<button id="login-btn" class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Login</button>';
                });

                // Action handlers
                document.addEventListener('click', (e) => {
                    if (e.target.id === 'login-btn') {
                        userStore.dispatch('login', {
                            name: 'John Doe',
                            role: 'admin'
                        });
                    } else if (e.target.id === 'logout-btn') {
                        userStore.dispatch('logout');
                    }
                });
            </script>
        `
    };
}
```

## 3. State Management Patterns

### Component State

For local component state, use signals directly:

```javascript
// components/Counter.js
import { html } from '../core/framework.js';
import { signal } from '../core/signals.js';

export function Counter() {
    const count = signal(0);

    return html`
        <div class="flex gap-4 items-center">
            <button onclick="count.set(count.get() - 1)" class="px-4 py-2 bg-gray-200 rounded">
                -
            </button>
            <span id="counter-value" class="text-2xl font-bold">${count.get()}</span>
            <button onclick="count.set(count.get() + 1)" class="px-4 py-2 bg-gray-200 rounded">
                +
            </button>
        </div>

        <script type="module">
            const valueEl = document.getElementById('counter-value');
            count.subscribe(value => {
                valueEl.textContent = value;
            });
        </script>
    `;
}
```

### Global State

For shared state across components, use NexaStore:

```javascript
// state/cartStore.js
import { createNexaStore } from '../core/store.js';

export const cartStore = createNexaStore(
    { items: [], total: 0 },
    {
        addItem(state, item) {
            const newItems = [...state.items.get(), item];
            state.items.set(newItems);
            state.total.set(newItems.reduce((sum, i) => sum + i.price, 0));
        },
        removeItem(state, itemId) {
            const newItems = state.items.get().filter(item => item.id !== itemId);
            state.items.set(newItems);
            state.total.set(newItems.reduce((sum, i) => sum + i.price, 0));
        },
        clearCart(state) {
            state.items.set([]);
            state.total.set(0);
        }
    }
);
```

### Computed State

For derived state, use signal subscriptions:

```javascript
// state/productStore.js
import { createNexaStore } from '../core/store.js';
import { signal } from '../core/signals.js';

export const productStore = createNexaStore(
    { products: [], searchQuery: '', minPrice: 0 },
    {
        setSearchQuery(state, query) {
            state.searchQuery.set(query);
        },
        setMinPrice(state, price) {
            state.minPrice.set(price);
        }
    }
);

// Computed: filtered products
export const filteredProducts = signal([]);
productStore.subscribe('products', () => {
    updateFilteredProducts();
});
productStore.subscribe('searchQuery', () => {
    updateFilteredProducts();
});
productStore.subscribe('minPrice', () => {
    updateFilteredProducts();
});

function updateFilteredProducts() {
    const products = productStore.get('products');
    const searchQuery = productStore.get('searchQuery').toLowerCase();
    const minPrice = productStore.get('minPrice');
    
    const filtered = products.filter(product => {
        return product.name.toLowerCase().includes(searchQuery) && product.price >= minPrice;
    });
    
    filteredProducts.set(filtered);
}
```

## 4. Persistence & Middleware

### LocalStorage Persistence

```javascript
// state/userStore.js
import { createNexaStore } from '../core/store.js';

export const userStore = createNexaStore(
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
            // Persist to localStorage
            localStorage.setItem('user', JSON.stringify({
                name: userData.name,
                role: userData.role,
                isAuth: true
            }));
        },
        logout(state) {
            state.name.set('Guest');
            state.isAuth.set(false);
            // Clear persistence
            localStorage.removeItem('user');
        }
    }
);

// Initialize from localStorage on app start
const savedUser = localStorage.getItem('user');
if (savedUser) {
    const userData = JSON.parse(savedUser);
    userStore.dispatch('login', userData);
}
```

### Middleware for Logging

```javascript
// core/store.js (enhanced with middleware)
import { signal } from './signals.js';

export function createNexaStore(initialState, actions = {}, middleware = []) {
    const state = {};
    
    // Convert initial state to signals
    for (const [key, value] of Object.entries(initialState)) {
        state[key] = signal(value);
    }

    const store = {
        state,
        get(key) { 
            if (!state[key]) {
                throw new Error(`State key "${key}" not found`);
            }
            return state[key].get(); 
        },
        
        dispatch(actionName, payload) {
            if (actions[actionName]) {
                // Apply middleware
                middleware.forEach(mw => mw.beforeDispatch?.(actionName, payload));
                
                console.log(`[NexaStore] Action: ${actionName}`, payload);
                actions[actionName](state, payload);
                
                // Apply middleware after dispatch
                middleware.forEach(mw => mw.afterDispatch?.(actionName, payload, state));
            } else {
                console.warn(`[NexaStore] Action "${actionName}" not defined`);
            }
        },

        subscribe(key, fn) {
            if (!state[key]) {
                throw new Error(`State key "${key}" not found`);
            }
            return state[key].subscribe(fn);
        }
    };

    return store;
}

// Usage with logging middleware
const loggerMiddleware = {
    beforeDispatch: (action, payload) => {
        console.log(`[Middleware] Before ${action}`, payload);
    },
    afterDispatch: (action, payload, state) => {
        console.log(`[Middleware] After ${action}`, state);
    }
};

// Create store with middleware
export const userStore = createNexaStore(
    initialState,
    actions,
    [loggerMiddleware]
);
```

## 5. TypeScript Support

### Type-Safe Signals

```typescript
import { signal } from '/core/signals.js';

// Type-safe signal
const count = signal<number>(0);

// Type error if you try to set a string
count.set('1'); // Error: Argument of type 'string' is not assignable to parameter of type 'number'
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
    login: (state: { [K in keyof UserState]: { get(): UserState[K]; set(v: UserState[K]): void } }, 
            userData: { name: string; role: 'viewer' | 'admin' | 'editor' }) => void;
    logout: (state: { [K in keyof UserState]: { get(): UserState[K]; set(v: UserState[K]): void } }) => void;
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
        }
    }
);
```

## 6. Comparison with Other Libraries

| Feature | Nexa (Signals + NexaStore) | Redux | Zustand | React Context API |
|---------|-----------------------------|-------|---------|------------------|
| **Size** | < 2KB | ~15KB | ~3KB | Built-in |
| **Reactivity** | Fine-grained | Virtual DOM | Virtual DOM | Virtual DOM |
| **Performance** | O(1) per update | O(n) with diffing | O(n) with diffing | O(n) with diffing |
| **SSR Support** | Yes | No | No | Limited |
| **Boilerplate** | Minimal | High | Low | High |
| **Learning Curve** | Easy | Steep | Moderate | Easy |

## 7. Best Practices

### State Management Guidelines

1. **Keep State Minimal**: Only store what you need to render
2. **Use Local State First**: Prefer signals for component-specific state
3. **Global State for Shared Data**: Use NexaStore for data used across components
4. **Actions as Events**: Dispatch actions that describe user interactions
5. **Computed State**: Derive data from existing state instead of storing it

### Performance Optimizations

1. **Batching Updates**: Group related updates
2. **Debounce Computed State**: Throttle expensive calculations
3. **Selective Subscriptions**: Only subscribe to needed state changes
4. **Cleanup Subscriptions**: Always unsubscribe when components unmount

### Testing State

```javascript
// state/userStore.test.js
import { userStore } from './userStore.js';

test('initial state should be Guest', () => {
    expect(userStore.get('name')).toBe('Guest');
    expect(userStore.get('isAuth')).toBe(false);
});

test('login action should update state', () => {
    userStore.dispatch('login', { name: 'Test User', role: 'admin' });
    expect(userStore.get('name')).toBe('Test User');
    expect(userStore.get('role')).toBe('admin');
    expect(userStore.get('isAuth')).toBe(true);
});

test('logout action should reset state', () => {
    userStore.dispatch('logout');
    expect(userStore.get('name')).toBe('Guest');
    expect(userStore.get('isAuth')).toBe(false);
});
```

## Summary

Nexa's state management system provides a perfect balance between simplicity and power. For small applications, signals offer a lightweight and fast solution. For complex applications, NexaStore provides a structured approach with action handling, traceability, and middleware support.

By combining fine-grained reactivity with Redux-like patterns, Nexa's state management system eliminates the need for external libraries while providing excellent performance and developer experience.
