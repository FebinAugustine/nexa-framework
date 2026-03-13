import { signal } from '../core/signals';

// Simple counter example using signals
export const count = signal(0);

export function increment() {
  count.set(count.get() + 1);
}

export function decrement() {
  count.set(count.get() - 1);
}

export function reset() {
  count.set(0);
}
