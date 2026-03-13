import { html } from '../core/framework';
import { Layout } from '../components/Layout';

export default function AdminPage({ user }: { params: any; user: any }) {
  return {
    head: html`<title>Admin Dashboard - Nexa Admin</title>`,
    body: Layout({
      user,
      children: html`
                <div class="min-h-screen bg-gray-900 py-6 px-4 sm:px-6 lg:px-8">
                    <div class="max-w-7xl mx-auto">
                        <div class="flex justify-between items-center mb-8">
                            <h1 class="text-3xl font-bold text-white">
                                Admin Dashboard
                            </h1>
                            <div class="flex items-center space-x-4">
                                <span class="text-gray-400">
                                    Role: <span class="text-white">${user.role}</span>
                                </span>
                                <a
                                    href="/api/auth/logout"
                                    class="px-4 py-2 text-sm font-medium text-red-300 bg-red-900/20 rounded-md hover:bg-red-900/30 transition-colors"
                                >
                                    Logout
                                </a>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <div class="bg-gray-800 p-6 rounded-lg shadow-lg">
                                <div class="flex items-center">
                                    <div class="flex-shrink-0">
                                        <div class="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center">
                                            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                                            </svg>
                                        </div>
                                    </div>
                                    <div class="ml-4">
                                        <p class="text-sm font-medium text-gray-400">Total Users</p>
                                        <p class="text-2xl font-bold text-white">125</p>
                                    </div>
                                </div>
                            </div>

                            <div class="bg-gray-800 p-6 rounded-lg shadow-lg">
                                <div class="flex items-center">
                                    <div class="flex-shrink-0">
                                        <div class="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                                            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                                            </svg>
                                        </div>
                                    </div>
                                    <div class="ml-4">
                                        <p class="text-sm font-medium text-gray-400">Active Users</p>
                                        <p class="text-2xl font-bold text-white">87</p>
                                    </div>
                                </div>
                            </div>

                            <div class="bg-gray-800 p-6 rounded-lg shadow-lg">
                                <div class="flex items-center">
                                    <div class="flex-shrink-0">
                                        <div class="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
                                            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                                            </svg>
                                        </div>
                                    </div>
                                    <div class="ml-4">
                                        <p class="text-sm font-medium text-gray-400">New Today</p>
                                        <p class="text-2xl font-bold text-white">15</p>
                                    </div>
                                </div>
                            </div>

                            <div class="bg-gray-800 p-6 rounded-lg shadow-lg">
                                <div class="flex items-center">
                                    <div class="flex-shrink-0">
                                        <div class="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
                                            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                            </svg>
                                        </div>
                                    </div>
                                    <div class="ml-4">
                                        <p class="text-sm font-medium text-gray-400">Avg. Session</p>
                                        <p class="text-2xl font-bold text-white">12m</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
                            <h2 class="text-xl font-bold text-white mb-4">User Management</h2>
                            <div class="overflow-x-auto">
                                <table class="min-w-full divide-y divide-gray-700">
                                    <thead class="bg-gray-700">
                                        <tr>
                                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                User
                                            </th>
                                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                Role
                                            </th>
                                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                Created At
                                            </th>
                                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody class="bg-gray-800 divide-y divide-gray-700">
                                        <tr>
                                            <td class="px-6 py-4 whitespace-nowrap">
                                                <div class="flex items-center">
                                                    <div class="flex-shrink-0 h-10 w-10">
                                                        <div class="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                                                            <span class="text-white text-sm font-medium">JD</span>
                                                        </div>
                                                    </div>
                                                    <div class="ml-4">
                                                        <div class="text-sm font-medium text-white">John Doe</div>
                                                        <div class="text-sm text-gray-400">john@example.com</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap">
                                                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-900 text-green-300">
                                                    Admin
                                                </span>
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                                2024-01-15
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap">
                                                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-900 text-green-300">
                                                    Active
                                                </span>
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <a href="#" class="text-indigo-400 hover:text-indigo-300 mr-4">Edit</a>
                                                <button class="text-red-400 hover:text-red-300">Delete</button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="px-6 py-4 whitespace-nowrap">
                                                <div class="flex items-center">
                                                    <div class="flex-shrink-0 h-10 w-10">
                                                        <div class="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center">
                                                            <span class="text-white text-sm font-medium">SM</span>
                                                        </div>
                                                    </div>
                                                    <div class="ml-4">
                                                        <div class="text-sm font-medium text-white">Sarah Miller</div>
                                                        <div class="text-sm text-gray-400">sarah@example.com</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap">
                                                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-900 text-blue-300">
                                                    User
                                                </span>
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                                2024-01-18
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap">
                                                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-900 text-green-300">
                                                    Active
                                                </span>
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <a href="#" class="text-indigo-400 hover:text-indigo-300 mr-4">Edit</a>
                                                <button class="text-red-400 hover:text-red-300">Delete</button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="px-6 py-4 whitespace-nowrap">
                                                <div class="flex items-center">
                                                    <div class="flex-shrink-0 h-10 w-10">
                                                        <div class="h-10 w-10 rounded-full bg-yellow-500 flex items-center justify-center">
                                                            <span class="text-white text-sm font-medium">MJ</span>
                                                        </div>
                                                    </div>
                                                    <div class="ml-4">
                                                        <div class="text-sm font-medium text-white">Michael Johnson</div>
                                                        <div class="text-sm text-gray-400">michael@example.com</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap">
                                                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-900 text-blue-300">
                                                    User
                                                </span>
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                                2024-01-20
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap">
                                                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-900 text-yellow-300">
                                                    Pending
                                                </span>
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <a href="#" class="text-indigo-400 hover:text-indigo-300 mr-4">Edit</a>
                                                <button class="text-red-400 hover:text-red-300">Delete</button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div class="bg-gray-800 p-6 rounded-lg shadow-lg">
                                <h2 class="text-xl font-bold text-white mb-4">System Status</h2>
                                <div class="space-y-4">
                                    <div class="flex items-center justify-between p-3 bg-gray-700 rounded-md">
                                        <span class="text-sm font-medium text-gray-300">API Service</span>
                                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-900 text-green-300">
                                            Online
                                        </span>
                                    </div>
                                    <div class="flex items-center justify-between p-3 bg-gray-700 rounded-md">
                                        <span class="text-sm font-medium text-gray-300">Database</span>
                                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-900 text-green-300">
                                            Connected
                                        </span>
                                    </div>
                                    <div class="flex items-center justify-between p-3 bg-gray-700 rounded-md">
                                        <span class="text-sm font-medium text-gray-300">Cache</span>
                                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-900 text-yellow-300">
                                            Warning
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div class="bg-gray-800 p-6 rounded-lg shadow-lg">
                                <h2 class="text-xl font-bold text-white mb-4">Recent Logs</h2>
                                <div class="space-y-3">
                                    <div class="p-3 bg-gray-700 rounded-md">
                                        <p class="text-sm font-medium text-white">User login failed</p>
                                        <p class="text-xs text-gray-400">2024-01-20 14:30:00</p>
                                    </div>
                                    <div class="p-3 bg-gray-700 rounded-md">
                                        <p class="text-sm font-medium text-white">New user registered</p>
                                        <p class="text-xs text-gray-400">2024-01-20 13:45:00</p>
                                    </div>
                                    <div class="p-3 bg-gray-700 rounded-md">
                                        <p class="text-sm font-medium text-white">Password reset requested</p>
                                        <p class="text-xs text-gray-400">2024-01-20 12:15:00</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `
    })
  };
}
