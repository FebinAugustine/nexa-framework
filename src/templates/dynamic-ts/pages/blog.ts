import { html } from '../core/framework';
import { Navbar } from '../components/Navbar';
import { blogStore } from '../state/blogStore';

export default function BlogPage() {
    const articles = blogStore.get('articles');

    return {
        head: html`<title>Blog - NexaBlog</title>`,
        body: html`
            ${Navbar()}
            <main class="min-h-screen bg-gray-50">
                <!-- Hero Section -->
                <section class="bg-gradient-to-br from-indigo-600 to-purple-600 py-16 px-4">
                    <div class="max-w-4xl mx-auto text-center">
                        <h1 class="text-3xl md:text-5xl font-bold text-white mb-6">
                            Our Blog
                        </h1>
                        <p class="text-xl text-indigo-100 mb-8">
                            Thoughts, tutorials, and news about web development.
                        </p>
                    </div>
                </section>

                <!-- Blog Grid -->
                <section class="py-16 px-4">
                    <div class="max-w-6xl mx-auto">
                        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            ${articles.map((article: any) => html`
                                <article class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                                    <div class="p-6">
                                        <div class="text-sm text-gray-500 mb-2">${article.date} • ${article.readTime}</div>
                                        <h3 class="text-xl font-semibold mb-3 text-gray-900">
                                            ${article.title}
                                        </h3>
                                        <p class="text-gray-600 mb-4">
                                            ${article.excerpt}
                                        </p>
                                        <a href="/blog/${article.id}" class="text-indigo-600 hover:text-indigo-700 font-semibold">
                                            Read More →
                                        </a>
                                    </div>
                                </article>
                            `).join('')}
                        </div>

                        <!-- Pagination -->
                        <div class="mt-12 flex justify-center">
                            <nav class="inline-flex rounded-md shadow">
                                <a href="#" class="px-4 py-2 rounded-l-lg border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                                    Previous
                                </a>
                                <a href="#" class="px-4 py-2 border-t border-b border-gray-300 bg-indigo-600 text-sm font-medium text-white">
                                    1
                                </a>
                                <a href="#" class="px-4 py-2 border-t border-b border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                                    2
                                </a>
                                <a href="#" class="px-4 py-2 border-t border-b border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                                    3
                                </a>
                                <a href="#" class="px-4 py-2 rounded-r-lg border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                                    Next
                                </a>
                            </nav>
                        </div>
                    </div>
                </section>

                <!-- Newsletter Section -->
                <section class="py-16 px-4 bg-white">
                    <div class="max-w-4xl mx-auto text-center">
                        <h2 class="text-3xl font-bold text-gray-900 mb-4">
                            Subscribe to Our Newsletter
                        </h2>
                        <p class="text-gray-600 mb-8">
                            Get the latest articles and updates delivered to your inbox.
                        </p>
                        <form class="flex flex-col sm:flex-row gap-4 justify-center">
                            <input 
                                type="email" 
                                placeholder="Enter your email" 
                                class="px-4 py-2 rounded-lg flex-1 sm:max-w-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                            <button type="submit" class="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold">
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

            <script type="module">
                import { blogStore } from '/state/blogStore';
                
                // Initialize blog store
                console.log('Blog articles:', blogStore.get('articles'));
            </script>
        `
    };
}
