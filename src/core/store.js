// NexaStore: Signal-based State Orchestrator for Nexa Framework
// Combines fine-grained reactivity with Redux-like action management
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
