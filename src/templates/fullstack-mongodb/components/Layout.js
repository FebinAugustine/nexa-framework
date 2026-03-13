import { html } from '../core/framework.js';
import { Navbar } from './Navbar.js';

export function Layout({ user, children }) {
    return html`
        <div class="min-h-screen bg-gray-900">
            ${Navbar({ user })}
            <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                ${children}
            </main>
        </div>
    `;
}
