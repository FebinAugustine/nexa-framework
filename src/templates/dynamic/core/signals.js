// Fine-Grained Reactivity System for Nexa Framework
// Direct DOM updates without Virtual DOM diffing

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

    return {
        get,
        set,
        subscribe
    };
}
