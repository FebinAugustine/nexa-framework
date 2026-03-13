import { html } from '../core/framework';
import { Layout } from '../components/Layout';

export default function DashboardPage({ user }: { params: any; user: any }) {
  return {
    head: html`<title>Dashboard - Nexa Admin</title>`,
    body: Layout({
      user,
      children: html`
                <div class="min-h-screen bg-gray-900 py-6 px-4 sm:px-6 lg:px-8">
                    <div class="max-w-7xl mx-auto">
                        <div class="flex justify-between items-center mb-8">
                            <h1 class="text-3xl font-bold text-white">
                                Welcome back, ${user.name}!
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

                        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div class="lg:col-span-2 bg-gray-800 p-6 rounded-lg shadow-lg">
                                <h2 class="text-xl font-bold text-white mb-4">Recent Activities</h2>
                                <div class="space-y-4">
                                    <div class="flex items-center space-x-4 p-3 bg-gray-700 rounded-md">
                                        <div class="flex-shrink-0">
                                            <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                                <span class="text-white text-sm font-medium">JD</span>
                                            </div>
                                        </div>
                                        <div class="flex-1 min-w-0">
                                            <p class="text-sm font-medium text-white">John Doe</p>
                                            <p class="text-sm text-gray-400">Updated their profile</p>
                                        </div>
                                        <div class="text-sm text-gray-400">2 hours ago</div>
                                    </div>

                                    <div class="flex items-center space-x-4 p-3 bg-gray-700 rounded-md">
                                        <div class="flex-shrink-0">
                                            <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                                <span class="text-white text-sm font-medium">SM</span>
                                            </div>
                                        </div>
                                        <div class="flex-1 min-w-0">
                                            <p class="text-sm font-medium text-white">Sarah Miller</p>
                                            <p class="text-sm text-gray-400">Logged in</p>
                                        </div>
                                        <div class="text-sm text-gray-400">3 hours ago</div>
                                    </div>

                                    <div class="flex items-center space-x-4 p-3 bg-gray-700 rounded-md">
                                        <div class="flex-shrink-0">
                                            <div class="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                                                <span class="text-white text-sm font-medium">MJ</span>
                                            </div>
                                        </div>
                                        <div class="flex-1 min-w-0">
                                            <p class="text-sm font-medium text-white">Michael Johnson</p>
                                            <p class="text-sm text-gray-400">Changed password</p>
                                        </div>
                                        <div class="text-sm text-gray-400">5 hours ago</div>
                                    </div>
                                </div>
                            </div>

                            <div class="bg-gray-800 p-6 rounded-lg shadow-lg">
                                <h2 class="text-xl font-bold text-white mb-4">Quick Actions</h2>
                                <div class="space-y-3">
                                    <button
                                        class="w-full flex items-center space-x-3 p-3 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors"
                                    >
                                        <svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                                        </svg>
                                        <span class="text-sm font-medium text-gray-300">Manage Users</span>
                                    </button>

                                    <button
                                        class="w-full flex items-center space-x-3 p-3 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors"
                                    >
                                        <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                                        </svg>
                                        <span class="text-sm font-medium text-gray-300">View Analytics</span>
                                    </button>

                                    <button
                                        class="w-full flex items-center space-x-3 p-3 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors"
                                    >
                                        <svg class="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543-.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                        </svg>
                                        <span class="text-sm font-medium text-gray-300">Settings</span>
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
