import { html } from '../core/framework.js';
export default function HomePage() {
    return {
        head: html`<title>Static Landing Page</title>`,
        body: html`<main class="h-screen flex items-center justify-center bg-gray-900">
            <div class="text-center">
                <h1 class="text-5xl font-black tracking-tighter italic text-indigo-600">NEXA</h1>
                <p class="text-gray-400 mt-2 text-lg">Zero-Build. Fully Scalable.</p>
                <div class="mt-8 flex gap-4 justify-center">
                    <button class="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                        Get Started
                    </button>
                    <button class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        Learn More
                    </button>
                </div>
            </div>
        </main>`
    };
}