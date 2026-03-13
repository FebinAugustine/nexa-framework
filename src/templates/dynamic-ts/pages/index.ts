import { html } from '../core/framework';
import { Navbar } from '../components/Navbar';

export default function HomePage() {
    return {
        head: html`<title>Home - NexaBlog</title>`,
        body: html`
            ${Navbar()}
            <main class="min-h-screen bg-gray-50">
                <!-- Hero Section -->
                <section class="bg-gradient-to-br from-indigo-600 to-purple-600 py-20 px-4">
                    <div class="max-w-6xl mx-auto text-center">
                        <h1 class="text-4xl md:text-6xl font-bold text-white mb-6">
                            Welcome to NexaBlog
                        </h1>
                        <p class="text-xl text-indigo-100 mb-8 max-w-3xl mx-auto">
                            A modern, no-build blogging platform powered by Nexa Framework. 
                            Experience the future of web development with resumable architecture.
                        </p>
                        <div class="flex flex-col sm:flex-row gap-4 justify-center">
                            <a href="/blog" class="px-8 py-4 bg-white text-indigo-600 rounded-xl hover:bg-indigo-50 transition-all duration-300 transform hover:scale-105 font-semibold">
                                Read Articles
                            </a>
                            <a href="/about" class="px-8 py-4 border-2 border-white text-white rounded-xl hover:bg-white hover:text-indigo-600 transition-all duration-300 font-semibold">
                                Learn More
                            </a>
                        </div>
                    </div>
                </section>

                <!-- Features Section -->
                <section class="py-16 px-4 bg-white">
                    <div class="max-w-6xl mx-auto">
                        <h2 class="text-3xl font-bold text-center mb-12 text-gray-900">
                            Why Choose NexaBlog?
                        </h2>
                        <div class="grid md:grid-cols-3 gap-8">
                            <div class="bg-gray-50 p-8 rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:-translate-y-2">
                                <div class="text-4xl mb-4">⚡</div>
                                <h3 class="text-xl font-semibold mb-4 text-gray-900">
                                    Blazing Fast
                                </h3>
                                <p class="text-gray-600">
                                    No build process. No hydration. Pages are interactive the moment they load.
                                </p>
                            </div>
                            <div class="bg-gray-50 p-8 rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:-translate-y-2">
                                <div class="text-4xl mb-4">🎨</div>
                                <h3 class="text-xl font-semibold mb-4 text-gray-900">
                                    Beautiful Design
                                </h3>
                                <p class="text-gray-600">
                                    Modern, responsive design with Tailwind CSS. JIT compilation on the server.
                                </p>
                            </div>
                            <div class="bg-gray-50 p-8 rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:-translate-y-2">
                                <div class="text-4xl mb-4">🔄</div>
                                <h3 class="text-xl font-semibold mb-4 text-gray-900">
                                    Resumable Architecture
                                </h3>
                                <p class="text-gray-600">
                                    HTML arrives complete. Logic attaches only when you interact with the page.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Latest Articles Preview -->
                <section class="py-16 px-4 bg-gray-50">
                    <div class="max-w-6xl mx-auto">
                        <div class="flex justify-between items-center mb-8">
                            <h2 class="text-3xl font-bold text-gray-900">
                                Latest Articles
                            </h2>
                            <a href="/blog" class="text-indigo-600 hover:text-indigo-700 font-semibold">
                                View All →
                            </a>
                        </div>
                        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <article class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                                <div class="p-6">
                                    <div class="text-sm text-gray-500 mb-2">Jan 15, 2024 • 5 min read</div>
                                    <h3 class="text-xl font-semibold mb-3 text-gray-900">
                                        Getting Started with Nexa Framework
                                    </h3>
                                    <p class="text-gray-600 mb-4">
                                        Learn how to build modern web applications with Nexa Framework - the no-build, resumable web framework.
                                    </p>
                                    <a href="/blog/1" class="text-indigo-600 hover:text-indigo-700 font-semibold">
                                        Read More →
                                    </a>
                                </div>
                            </article>

                            <article class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                                <div class="p-6">
                                    <div class="text-sm text-gray-500 mb-2">Jan 20, 2024 • 8 min read</div>
                                    <h3 class="text-xl font-semibold mb-3 text-gray-900">
                                        State Management with NexaStore
                                    </h3>
                                    <p class="text-gray-600 mb-4">
                                        Master the art of state management in Nexa using the built-in NexaStore system.
                                    </p>
                                    <a href="/blog/2" class="text-indigo-600 hover:text-indigo-700 font-semibold">
                                        Read More →
                                    </a>
                                </div>
                            </article>

                            <article class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                                <div class="p-6">
                                    <div class="text-sm text-gray-500 mb-2">Jan 25, 2024 • 6 min read</div>
                                    <h3 class="text-xl font-semibold mb-3 text-gray-900">
                                        Building Dynamic Pages with Nexa
                                    </h3>
                                    <p class="text-gray-600 mb-4">
                                        Learn how to create dynamic, interactive pages in Nexa with signals and components.
                                    </p>
                                    <a href="/blog/3" class="text-indigo-600 hover:text-indigo-700 font-semibold">
                                        Read More →
                                    </a>
                                </div>
                            </article>
                        </div>
                    </div>
                </section>

                <!-- Newsletter Section -->
                <section class="py-16 px-4 bg-indigo-600">
                    <div class="max-w-4xl mx-auto text-center">
                        <h2 class="text-3xl font-bold text-white mb-4">
                            Subscribe to Our Newsletter
                        </h2>
                        <p class="text-indigo-100 mb-8">
                            Get the latest articles and updates delivered to your inbox.
                        </p>
                        <form class="flex flex-col sm:flex-row gap-4 justify-center">
                            <input 
                                type="email" 
                                placeholder="Enter your email" 
                                class="px-4 py-2 rounded-lg flex-1 sm:max-w-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                            <button type="submit" class="px-6 py-2 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors font-semibold">
                                Subscribe
                            </button>
                        </form>
                    </div>
                </section>
            </main>

            <!-- Footer -->
            <footer class="bg-gray-900 py-8 px-4">
                <div class="max-w-6xl mx-auto text-center">
                    <p class="text-gray-400">© 2024 NexaBlog. Built with Nexa Framework.</p>
                    <div class="mt-4 flex justify-center gap-6">
                        <a href="#" class="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" class="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
                        <a href="/contact" class="text-gray-400 hover:text-white transition-colors">Contact</a>
                    </div>
                </div>
            </footer>
        `
    };
}
