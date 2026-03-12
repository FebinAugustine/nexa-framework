import { html } from '../core/framework.js';
export default function DashboardPage() {
    return {
        head: html`<title>Dashboard - Admin Panel</title>`,
        body: html`<div class="min-h-screen bg-gray-900">
            <nav class="bg-gray-700 shadow-sm">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="flex justify-between h-16">
                        <div class="flex">
                            <div class="flex-shrink-0 flex items-center">
                                <h1 class="text-xl font-bold text-white">Admin Dashboard</h1>
                            </div>
                        </div>
                        <div class="flex items-center">
                            <button class="p-2 rounded-full hover:bg-gray-100">
                                <svg class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
            <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div class="px-4 py-6 sm:px-0">
                    <div class="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
                        <p class="text-gray-500">Dashboard content will appear here</p>
                    </div>
                </div>
            </main>
        </div>`
    };
}