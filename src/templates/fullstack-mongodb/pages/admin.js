import { html } from '../core/framework.js';
import { Layout } from '../components/Layout.js';

export default function AdminDashboardPage(params, user) {
    return {
        head: html`<title>Admin Dashboard - Nexa Admin</title>`,
        body: Layout({
            user,
            children: html`
                <div class="px-4 py-6 sm:px-0">
                    <div class="bg-white overflow-hidden shadow sm:rounded-lg">
                        <div class="px-4 py-5 sm:p-6">
                            <h1 class="text-3xl font-bold text-gray-900 mb-4">Admin Dashboard</h1>
                            <p class="text-lg text-gray-600 mb-8">
                                Welcome to the administration panel. Here you can manage users, view system statistics, and configure application settings.
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
                            
                            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                <div class="bg-white p-6 rounded-lg border border-gray-200">
                                    <div class="flex items-center">
                                        <div class="flex-shrink-0 bg-blue-500 rounded-md p-3">
                                            <span class="text-white font-bold">👥</span>
                                        </div>
                                        <div class="ml-4">
                                            <p class="text-sm font-medium text-gray-500">Total Users</p>
                                            <p class="text-2xl font-semibold text-gray-900">125</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="bg-white p-6 rounded-lg border border-gray-200">
                                    <div class="flex items-center">
                                        <div class="flex-shrink-0 bg-green-500 rounded-md p-3">
                                            <span class="text-white font-bold">📈</span>
                                        </div>
                                        <div class="ml-4">
                                            <p class="text-sm font-medium text-gray-500">Active Users</p>
                                            <p class="text-2xl font-semibold text-gray-900">87</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="bg-white p-6 rounded-lg border border-gray-200">
                                    <div class="flex items-center">
                                        <div class="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                                            <span class="text-white font-bold">🚀</span>
                                        </div>
                                        <div class="ml-4">
                                            <p class="text-sm font-medium text-gray-500">New Today</p>
                                            <p class="text-2xl font-semibold text-gray-900">5</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="bg-white p-6 rounded-lg border border-gray-200">
                                    <div class="flex items-center">
                                        <div class="flex-shrink-0 bg-red-500 rounded-md p-3">
                                            <span class="text-white font-bold">⚡</span>
                                        </div>
                                        <div class="ml-4">
                                            <p class="text-sm font-medium text-gray-500">System Status</p>
                                            <p class="text-2xl font-semibold text-green-600">Online</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="border-t border-gray-200 pt-6">
                                <h2 class="text-xl font-semibold text-gray-900 mb-4">User Management</h2>
                                <div class="overflow-x-auto">
                                    <table class="min-w-full divide-y divide-gray-200">
                                        <thead class="bg-gray-50">
                                            <tr>
                                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    User
                                                </th>
                                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Role
                                                </th>
                                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Created
                                                </th>
                                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody class="bg-white divide-y divide-gray-200">
                                            <tr>
                                                <td class="px-6 py-4 whitespace-nowrap">
                                                    <div class="flex items-center">
                                                        <div class="flex-shrink-0 h-10 w-10">
                                                            <div class="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                                                <span class="text-indigo-600 font-medium">JD</span>
                                                            </div>
                                                        </div>
                                                        <div class="ml-4">
                                                            <div class="text-sm font-medium text-gray-900">John Doe</div>
                                                            <div class="text-sm text-gray-500">john@example.com</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td class="px-6 py-4 whitespace-nowrap">
                                                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                        Admin
                                                    </span>
                                                </td>
                                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    2024-01-15
                                                </td>
                                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <button class="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
                                                    <button class="text-red-600 hover:text-red-900">Delete</button>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="px-6 py-4 whitespace-nowrap">
                                                    <div class="flex items-center">
                                                        <div class="flex-shrink-0 h-10 w-10">
                                                            <div class="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                                                                <span class="text-gray-600 font-medium">SM</span>
                                                            </div>
                                                        </div>
                                                        <div class="ml-4">
                                                            <div class="text-sm font-medium text-gray-900">Sarah Miller</div>
                                                            <div class="text-sm text-gray-500">sarah@example.com</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td class="px-6 py-4 whitespace-nowrap">
                                                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                        User
                                                    </span>
                                                </td>
                                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    2024-02-20
                                                </td>
                                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <button class="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
                                                    <button class="text-red-600 hover:text-red-900">Delete</button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div class="mt-4 flex justify-center">
                                    <button class="px-4 py-2 text-sm text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                                        View All Users
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