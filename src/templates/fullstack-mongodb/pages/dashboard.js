import { html } from '../core/framework.js';
import { Layout } from '../components/Layout.js';

export default function DashboardPage(params, user) {
    return {
        head: html`<title>Dashboard - Nexa Admin</title>`,
        body: Layout({
            user,
            children: html`
                <div class="px-4 py-6 sm:px-0">
                    <div class="bg-white overflow-hidden shadow sm:rounded-lg">
                        <div class="px-4 py-5 sm:p-6">
                            <h1 class="text-3xl font-bold text-gray-900 mb-4">User Dashboard</h1>
                            <p class="text-lg text-gray-600 mb-8">
                                Welcome back! This is your personal dashboard. Here you can manage your account settings and view your recent activity.
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
                            
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div class="bg-indigo-50 p-6 rounded-lg">
                                    <h3 class="text-lg font-semibold text-indigo-900 mb-2">👤 Profile</h3>
                                    <p class="text-indigo-600 text-sm">View and update your personal information</p>
                                    <button class="mt-4 text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                                        Manage Profile →
                                    </button>
                                </div>
                                <div class="bg-green-50 p-6 rounded-lg">
                                    <h3 class="text-lg font-semibold text-green-900 mb-2">📊 Activity</h3>
                                    <p class="text-green-600 text-sm">View your recent activity and statistics</p>
                                    <button class="mt-4 text-green-600 hover:text-green-800 text-sm font-medium">
                                        View Activity →
                                    </button>
                                </div>
                                <div class="bg-purple-50 p-6 rounded-lg">
                                    <h3 class="text-lg font-semibold text-purple-900 mb-2">⚙️ Settings</h3>
                                    <p class="text-purple-600 text-sm">Manage your account settings and preferences</p>
                                    <button class="mt-4 text-purple-600 hover:text-purple-800 text-sm font-medium">
                                        Settings →
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `
        })
    };
}