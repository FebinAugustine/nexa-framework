// Fine-Grained Reactivity System for Nexa Framework
// Direct DOM manipulation without Virtual DOM or hydration

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

  return {
    get,
    set,
    subscribe
  };
}

// Helper for creating derived signals
export function derived<T>(sources: Array<ReturnType<typeof signal>>, compute: (sources: Array<ReturnType<typeof signal>>) => T) {
  const result = signal(compute(sources));
  
  // Subscribe to all source signals
  sources.forEach(source => {
    source.subscribe(() => {
      result.set(compute(sources));
    });
  });

  return result;
}