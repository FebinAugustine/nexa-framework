// Fine-Grained Reactivity System for Nexa Framework
// Direct DOM manipulation without Virtual DOM or hydration

export function signal(initialValue) {
  let value = initialValue;
  const subscribers = new Set();

  function get() {
    return value;
  }

  function set(newValue) {
    if (value !== newValue) {
      value = newValue;
      subscribers.forEach(cb => cb(value));
    }
    return value;
  }

  function subscribe(callback) {
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
export function derived(sources, compute) {
  const result = signal(compute(sources));
  
  // Subscribe to all source signals
  sources.forEach(source => {
    source.subscribe(() => {
      result.set(compute(sources));
    });
  });

  return result;
}