import { signal } from '../core/signals.js';

// Example counter implementation
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
