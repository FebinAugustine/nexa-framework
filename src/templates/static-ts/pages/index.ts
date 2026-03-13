import { html } from '../core/framework';

export default function HomePage() {
    return {
        head: html`<title>Static Landing Page</title>`,
        body: html`<main class="min-h-screen bg-gray-900 text-gray-200">
                    <!-- Hero Section -->
                    <section class="h-auto py-20 flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black">
                        <div class="text-center px-6">
                            <h1 class="text-6xl font-black tracking-tighter text-indigo-500 mb-6">
                                NEXA
                            </h1>
                            <p class="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                                Zero-Build. Fully Scalable. <br class="md:hidden">
                                Power of the Server, Speed of the Browser.
                            </p>
                            <div class="flex flex-col sm:flex-row gap-4 justify-center">
                                <button class="px-8 py-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 font-semibold">
                                    Get Started
                                </button>
                                <button class="px-8 py-4 border-2 border-gray-600 text-gray-400 rounded-xl hover:border-indigo-500 hover:text-indigo-400 transition-all duration-300 font-semibold">
                                    Learn More
                                </button>
                            </div>
                        </div>
                    </section>
        
                    <!-- Features Section -->
                    <section class="py-10 px-6 bg-black">
                        <div class="max-w-6xl mx-auto">
                            <h2 class="text-4xl font-bold text-center mb-16">Why Choose Nexa?</h2>
                            <div class="grid md:grid-cols-3 gap-8">
                                <div class="bg-gray-900 p-8 rounded-xl hover:bg-gray-600 transition-all duration-300 transform hover:-translate-y-2">
                                    <div class="text-4xl mb-4">⚡</div>
                                    <h3 class="text-xl font-semibold mb-4">No Build Process</h3>
                                    <p class="text-gray-400">Deploy instantly. No bundling. No compilation. Just pure performance.</p>
                                </div>
                                <div class="bg-gray-900 p-8 rounded-xl hover:bg-gray-600 transition-all duration-300 transform hover:-translate-y-2">
                                    <div class="text-4xl mb-4">🎨</div>
                                    <h3 class="text-xl font-semibold mb-4">JIT Styling</h3>
                                    <p class="text-gray-400">Server-side Tailwind CSS compilation. Zero client-side overhead.</p>
                                </div>
                                <div class="bg-gray-900 p-8 rounded-xl hover:bg-gray-600 transition-all duration-300 transform hover:-translate-y-2">
                                    <div class="text-4xl mb-4">🔄</div>
                                    <h3 class="text-xl font-semibold mb-4">Resumable</h3>
                                    <p class="text-gray-400">HTML arrives complete. Logic attaches only when you interact.</p>
                                </div>
                            </div>
                        </div>
                    </section>
        
                    <!-- Counter Demo Section -->
                    <section class="py-10 px-6 bg-black">
                        <div class="max-w-4xl mx-auto">
                            <h2 class="text-4xl font-bold text-center mb-16">Built-in State Management</h2>
                            <div class="bg-gray-900 rounded-xl p-8 text-center">
                                <div class="mb-8">
                                    <h3 class="text-2xl font-semibold text-gray-300 mb-4">Interactive Counter</h3>
                                    <p class="text-gray-400 mb-8">Using Nexa's fine-grained reactivity system</p>
                                    <div class="flex items-center justify-center gap-6">
                                        <button id="decrement-btn" class="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold text-lg">
                                            −
                                        </button>
                                        <span id="counter-value" class="text-6xl font-bold text-indigo-500 min-w-20">0</span>
                                        <button id="increment-btn" class="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold text-lg">
                                            +
                                        </button>
                                    </div>
                                    <button id="reset-btn" class="mt-6 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors font-semibold">
                                        Reset
                                    </button>
                                </div>
                                <div class="border-t border-gray-600 pt-8">
                                    <h4 class="text-lg font-semibold text-gray-300 mb-4">How it works</h4>
                                    <p class="text-gray-400 mb-4">Click the buttons to see Nexa's fine-grained reactivity in action. The DOM updates directly without any Virtual DOM diffing.</p>
                                    <div class="bg-gray-800 p-6 rounded-lg text-left text-sm font-mono text-gray-300">
                                        <pre>// state/counter.js
        import { signal } from '../core/signals';
        
        export function createCounter(initialValue = 0) {
          const count = signal(initialValue);
          
          return {
            get count() { return count.get(); },
            increment: () => count.set(count.get() + 1),
            decrement: () => count.set(count.get() - 1),
            reset: () => count.set(0)
          };
        }</pre>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
        
                    <!-- Footer -->
                    <footer class="bg-black py-8 px-6 border-t border-gray-700">
                        <div class="max-w-6xl mx-auto text-center">
                            <p class="text-gray-400">© 2024 Nexa Framework. Built with Bun.</p>
                        </div>
                    </footer>
        
                    <script type="module">
                        import { createCounter } from '/state/counter';
                        
                        const counter = createCounter(0);
                        const counterValue = document.getElementById('counter-value');
                        const incrementBtn = document.getElementById('increment-btn');
                        const decrementBtn = document.getElementById('decrement-btn');
                        const resetBtn = document.getElementById('reset-btn');
        
                        // Update UI when counter changes
                        const unsubscribe = counterValue.addEventListener('DOMSubtreeModified', () => {
                            counterValue.textContent = counter.count;
                        });
        
                        incrementBtn.addEventListener('click', () => {
                            counter.increment();
                            counterValue.textContent = counter.count;
                        });
        
                        decrementBtn.addEventListener('click', () => {
                            counter.decrement();
                            counterValue.textContent = counter.count;
                        });
        
                        resetBtn.addEventListener('click', () => {
                            counter.reset();
                            counterValue.textContent = counter.count;
                        });
                    </script>
                </main>`
    };
}