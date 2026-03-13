// NexaStore: Signal-based State Orchestrator for Nexa Framework
// Combines fine-grained reactivity with Redux-like action management
import { signal } from './signals';

type StateObject = { [key: string]: any };
type ActionFunction = (state: { [key: string]: ReturnType<typeof signal> }, payload: any) => void;
type ActionsObject = { [key: string]: ActionFunction };

export function createNexaStore(initialState: StateObject, actions: ActionsObject = {}) {
    const state: { [key: string]: ReturnType<typeof signal> } = {};
    
    // Convert initial state to signals
    for (const [key, value] of Object.entries(initialState)) {
        state[key] = signal(value);
    }

    const store = {
        state,
        // Get current value (proxy to signal.get())
        get(key: string): any { 
            if (!state[key]) {
                throw new Error(`State key "${key}" not found`);
            }
            return state[key].get(); 
        },
        
        // Action Dispatcher
        dispatch(actionName: string, payload: any): void {
            if (actions[actionName]) {
                console.log(`[NexaStore] Action: ${actionName}`, payload);
                actions[actionName](state, payload);
            } else {
                console.warn(`[NexaStore] Action "${actionName}" not defined`);
            }
        },

        // Global Subscribe
        subscribe(key: string, fn: (value: any) => void): () => void {
            if (!state[key]) {
                throw new Error(`State key "${key}" not found`);
            }
            return state[key].subscribe(fn);
        }
    };

    return store;
}