import { html } from '../core/framework.js';
export default function PostPage({ slug }) {
    return {
        head: html`<title>${slug} - My Blog</title>`,
        body: html`<article class="max-w-4xl mx-auto px-6 py-12 bg-gray-900">
            <h1 class="text-4xl font-bold text-white mb-4">${slug}</h1>
            <div class="text-gray-100 mb-8">
                <time>March 11, 2024</time> · <span>5 min read</span>
            </div>
            <div class="prose prose-lg text-gray-200">
                <p>This is a sample blog post page. In a real application, this content would be loaded from a database or markdown file.</p>
                <h2>Key Features</h2>
                <ul>
                    <li>Server-side rendering</li>
                    <li>Dynamic routing with parameters</li>
                    <li>JIT CSS compilation</li>
                    <li>Zero client-side JavaScript</li>
                </ul>
                <p>Enjoy writing your content without worrying about complex build processes!</p>
            </div>
        </article>`
    };
}