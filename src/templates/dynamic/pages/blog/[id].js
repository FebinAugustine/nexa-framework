import { html } from '../../core/framework.js';
import { Navbar } from '../../components/Navbar.js';
import { blogStore } from '../../state/blogStore.js';

export default function BlogPostPage({ params }) {
    const articles = blogStore.get('articles');
    const article = articles.find(a => a.id === params.id);

    if (!article) {
        return {
            head: html`<title>Article Not Found - NexaBlog</title>`,
            body: html`
                ${Navbar()}
                <main class="min-h-screen bg-gray-50">
                    <div class="max-w-4xl mx-auto py-20 px-4 text-center">
                        <h1 class="text-3xl font-bold text-gray-900 mb-4">
                            Article Not Found
                        </h1>
                        <p class="text-gray-600 mb-8">
                            The article you're looking for doesn't exist.
                        </p>
                        <a href="/blog" class="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold">
                            Back to Blog
                        </a>
                    </div>
                </main>
                <footer class="bg-gray-900 py-8 px-4">
                    <div class="max-w-6xl mx-auto text-center">
                        <p class="text-gray-400">© 2024 NexaBlog. Built with Nexa Framework.</p>
                    </div>
                </footer>
            `
        };
    }

    return {
        head: html`<title>${article.title} - NexaBlog</title>`,
        body: html`
            ${Navbar()}
            <main class="min-h-screen bg-gray-50">
                <!-- Article Header -->
                <article class="max-w-4xl mx-auto">
                    <div class="bg-white shadow-md">
                        <div class="p-8">
                            <div class="text-sm text-gray-500 mb-4">
                                ${article.date} • ${article.readTime}
                            </div>
                            <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                                ${article.title}
                            </h1>
                            <div class="flex items-center mb-8">
                                <div class="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mr-4 flex items-center justify-center">
                                    <span class="text-white font-bold">${article.author.charAt(0)}</span>
                                </div>
                                <div>
                                    <div class="font-semibold text-gray-900">${article.author}</div>
                                    <div class="text-sm text-gray-600">Author</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Article Content -->
                    <div class="bg-white shadow-md mt-4">
                        <div class="p-8">
                            <div class="prose max-w-none">
                                ${article.content.split('\n').map(line => {
                                    if (line.startsWith('#')) {
                                        const level = line.match(/^#+/)[0].length;
                                        const text = line.replace(/^#+/, '').trim();
                                        return `<h${level} class="text-2xl md:text-3xl font-bold text-gray-900 mb-4 mt-8">${text}</h${level}>`;
                                    } else if (line.startsWith('```')) {
                                        if (codeBlockOpen) {
                                            codeBlockOpen = false;
                                            return '</pre></div>';
                                        } else {
                                            codeBlockOpen = true;
                                            return '<div class="bg-gray-900 rounded-lg p-6 my-6"><pre class="text-white text-sm overflow-x-auto">';
                                        }
                                    } else if (line.startsWith('###')) {
                                        return `<h4 class="text-lg font-semibold text-gray-900 mb-2 mt-6">${line.replace(/^###+/, '').trim()}</h4>`;
                                    } else if (line.startsWith('##')) {
                                        return `<h3 class="text-xl font-semibold text-gray-900 mb-3 mt-7">${line.replace(/^##+/, '').trim()}</h3>`;
                                    } else if (line.startsWith('- ')) {
                                        return `<li class="text-gray-600 mb-2 ml-4">${line.replace(/^- /, '')}</li>`;
                                    } else if (line.trim() === '') {
                                        return '<br>';
                                    } else {
                                        return `<p class="text-gray-600 mb-4">${line}</p>`;
                                    }
                                }).join('')}
                            </div>
                        </div>
                    </div>

                    <!-- Article Footer -->
                    <div class="bg-white shadow-md mt-4">
                        <div class="p-8">
                            <div class="flex justify-between items-center">
                                <div class="flex items-center">
                                    <span class="text-gray-500 mr-2">Tags:</span>
                                    <div class="flex gap-2">
                                        <span class="px-3 py-1 bg-indigo-100 text-indigo-600 rounded-full text-sm">Nexa</span>
                                        <span class="px-3 py-1 bg-indigo-100 text-indigo-600 rounded-full text-sm">Web Development</span>
                                        <span class="px-3 py-1 bg-indigo-100 text-indigo-600 rounded-full text-sm">JavaScript</span>
                                    </div>
                                </div>
                                <div class="flex gap-4">
                                    <button class="p-2 rounded-full hover:bg-gray-100">
                                        <svg class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                                        </svg>
                                    </button>
                                    <button class="p-2 rounded-full hover:bg-gray-100">
                                        <svg class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                                        </svg>
                                    </button>
                                    <button class="p-2 rounded-full hover:bg-gray-100">
                                        <svg class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Related Articles -->
                    <div class="bg-white shadow-md mt-8">
                        <div class="p-8">
                            <h3 class="text-xl font-semibold text-gray-900 mb-6">
                                Related Articles
                            </h3>
                            <div class="grid md:grid-cols-2 gap-6">
                                ${articles.filter(a => a.id !== params.id).slice(0, 2).map(relatedArticle => html`
                                    <article class="flex gap-4">
                                        <div class="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <span class="text-white font-bold">${relatedArticle.title.charAt(0)}</span>
                                        </div>
                                        <div>
                                            <div class="text-sm text-gray-500 mb-1">${relatedArticle.date}</div>
                                            <h4 class="text-lg font-semibold text-gray-900 mb-2">
                                                ${relatedArticle.title}
                                            </h4>
                                            <a href="/blog/${relatedArticle.id}" class="text-indigo-600 hover:text-indigo-700 font-semibold text-sm">
                                                Read More →
                                            </a>
                                        </div>
                                    </article>
                                `).join('')}
                            </div>
                        </div>
                    </div>

                    <!-- Comments Section -->
                    <div class="bg-white shadow-md mt-8">
                        <div class="p-8">
                            <h3 class="text-xl font-semibold text-gray-900 mb-6">
                                Comments (3)
                            </h3>
                            <div class="space-y-6">
                                <div class="flex gap-4">
                                    <div class="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span class="text-white text-sm font-bold">A</span>
                                    </div>
                                    <div class="flex-1">
                                        <div class="flex justify-between items-center mb-2">
                                            <div class="font-semibold text-gray-900">Alice Smith</div>
                                            <div class="text-sm text-gray-500">2 days ago</div>
                                        </div>
                                        <p class="text-gray-600">
                                            Great article! I've been looking for a no-build framework for a while.
                                        </p>
                                        <button class="text-indigo-600 hover:text-indigo-700 font-semibold text-sm mt-2">
                                            Reply
                                        </button>
                                    </div>
                                </div>

                                <div class="flex gap-4 ml-14">
                                    <div class="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span class="text-white text-sm font-bold">B</span>
                                    </div>
                                    <div class="flex-1">
                                        <div class="flex justify-between items-center mb-2">
                                            <div class="font-semibold text-gray-900">Bob Johnson</div>
                                            <div class="text-sm text-gray-500">1 day ago</div>
                                        </div>
                                        <p class="text-gray-600">
                                            I agree! Nexa has completely changed how I build web applications.
                                        </p>
                                        <button class="text-indigo-600 hover:text-indigo-700 font-semibold text-sm mt-2">
                                            Reply
                                        </button>
                                    </div>
                                </div>

                                <div class="flex gap-4">
                                    <div class="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span class="text-white text-sm font-bold">C</span>
                                    </div>
                                    <div class="flex-1">
                                        <div class="flex justify-between items-center mb-2">
                                            <div class="font-semibold text-gray-900">Charlie Brown</div>
                                            <div class="text-sm text-gray-500">12 hours ago</div>
                                        </div>
                                        <p class="text-gray-600">
                                            The resumable architecture is fascinating. Looking forward to more articles!
                                        </p>
                                        <button class="text-indigo-600 hover:text-indigo-700 font-semibold text-sm mt-2">
                                            Reply
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <!-- Add Comment Form -->
                            <div class="mt-8">
                                <h4 class="text-lg font-semibold text-gray-900 mb-4">
                                    Add a Comment
                                </h4>
                                <form class="space-y-4">
                                    <div>
                                        <textarea 
                                            placeholder="Write your comment..." 
                                            class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            rows="4"
                                        ></textarea>
                                    </div>
                                    <div class="flex justify-between items-center">
                                        <div class="flex gap-4">
                                            <input 
                                                type="text" 
                                                placeholder="Name" 
                                                class="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            >
                                            <input 
                                                type="email" 
                                                placeholder="Email" 
                                                class="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            >
                                        </div>
                                        <button type="submit" class="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold">
                                            Post Comment
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </article>
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
                import { signal } from '/core/signals.js';
                import { blogStore } from '/state/blogStore.js';
                
                // Initialize article view count
                const viewCount = signal(0);
                
                // Simulate view count tracking
                viewCount.set(article.views || 0);
                blogStore.dispatch('updateArticle', {
                    ...article,
                    views: article.views ? article.views + 1 : 1
                });
                
                // Subscribe to article updates
                blogStore.subscribe('currentArticle', (currentArticle) => {
                    if (currentArticle) {
                        console.log('Article updated:', currentArticle);
                    }
                });
            </script>
        `
    };
}

let codeBlockOpen = false;
