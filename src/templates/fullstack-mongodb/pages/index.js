import { html } from '../core/framework.js';
import { Layout } from '../components/Layout.js';

export default function HomePage(params, user) {
    return {
        head: html`<title>Nexa Admin Dashboard</title>`,
        body: Layout({
            user,
            children: html`
                <div class="px-4 py-6 sm:px-0">
                    <div class="bg-gray-800 overflow-hidden shadow sm:rounded-lg">
                        <div class="px-4 py-5 sm:p-6">
                            <h1 class="text-3xl font-bold text-white mb-4">Welcome to Nexa Admin Dashboard</h1>
                            <p class="text-lg text-gray-300 mb-8">
                                A powerful admin dashboard built with Nexa Framework featuring authentication, role-based routing, and comprehensive user management.
                            </p>
                            
                            <script type="module">
                                import { logout } from '/state/authState.js';

                                const logoutBtn = document.getElementById('logout-btn');
                                if (logoutBtn) {
                                    logoutBtn.addEventListener('click', async () => {
                                        try {
                                            await fetch('/api/auth', {
                                                method: 'POST',
                                                headers: {
                                                    'Content-Type': 'application/json'
                                                },
                                                body: JSON.stringify({ action: 'logout' })
                                            });
                                            
                                            logout();
                                            window.location.href = '/login';
                                        } catch (error) {
                                            console.error('Logout error:', error);
                                            // Even if API fails, still log out locally
                                            logout();
                                            window.location.href = '/login';
                                        }
                                    });
                                }
                            </script>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div class="bg-indigo-900/50 p-6 rounded-lg">
                                    <h2 class="text-xl font-semibold text-indigo-300 mb-2">🎯 Features</h2>
                                    <ul class="space-y-2 text-indigo-400">
                                        <li>• User authentication with JWT</li>
                                        <li>• Role-based access control</li>
                                        <li>• Comprehensive user management</li>
                                        <li>• Responsive dashboard design</li>
                                        <li>• Secure API endpoints</li>
                                    </ul>
                                </div>
                                <div class="bg-green-900/50 p-6 rounded-lg">
                                    <h2 class="text-xl font-semibold text-green-300 mb-2">🚀 Quick Start</h2>
                                    <ul class="space-y-2 text-green-400">
                                        <li>• Run 'bun install' to install dependencies</li>
                                        <li>• Copy .env.example to .env and update configuration</li>
                                        <li>• Run 'bun --hot server.js' to start development server</li>
                                        <li>• Navigate to /register to create your first admin account</li>
                                        <li>• Login and explore the admin dashboard</li>
                                    </ul>
                                </div>
                            </div>
                            <div class="mt-8">
                                <a href="/register" class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
                                    Get Started
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            `
        })
    };
}