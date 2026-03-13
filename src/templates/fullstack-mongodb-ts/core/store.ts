// NexaStore: Signal-based State Orchestrator for Nexa Framework
// Combines fine-grained reactivity with Redux-like action management
import { signal, type Signal } from './signals';

export interface StateObject {
  [key: string]: Signal<any>;
}

export interface ActionMap {
  [key: string]: (state: StateObject, payload: any) => void;
}

export interface NexaStore {
  state: StateObject;
  get: (key: string) => any;
  dispatch: (actionName: string, payload: any) => void;
  subscribe: (key: string, fn: (value: any) => void) => () => void;
}

export function createNexaStore(initialState: any, actions: ActionMap = {}): NexaStore {
  const state: StateObject = {};
  
  // Convert initial state to signals
  for (const [key, value] of Object.entries(initialState)) {
    state[key] = signal(value);
  }

  const store = {
    state,
    // Get current value (proxy to signal.get())
    get(key: string) { 
      if (!state[key]) {
        throw new Error(`State key "${key}" not found`);
      }
      return state[key].get(); 
    },
    
    // Action Dispatcher
    dispatch(actionName: string, payload: any) {
      if (actions[actionName]) {
        console.log(`[NexaStore] Action: ${actionName}`, payload);
        actions[actionName](state, payload);
      } else {
        console.warn(`[NexaStore] Action "${actionName}" not defined`);
      }
    },

    // Global Subscribe
    subscribe(key: string, fn: (value: any) => void) {
      if (!state[key]) {
        throw new Error(`State key "${key}" not found`);
      }
      return state[key].subscribe(fn);
    }
  };

  return store;
}
