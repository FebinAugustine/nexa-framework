import { signal } from '../core/signals';

// Example counter implementation
export function createCounter(initialValue: number = 0) {
  const count = signal(initialValue);
  
  return {
    get count(): number { return count.get(); },
    increment: () => count.set(count.get() + 1),
    decrement: () => count.set(count.get() - 1),
    reset: () => count.set(0),
    setValue: (newValue: number) => count.set(newValue)
  };
}