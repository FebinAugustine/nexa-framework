import { html } from '../core/framework';
import { Layout } from '../components/Layout';

export default function HomePage() {
  return {
    head: html`<title>Home - Nexa Admin</title>`,
    body: Layout({
      user: null,
      children: html`
                <div class="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
                    <div class="max-w-4xl mx-auto">
                        <div class="text-center">
                            <h1 class="text-5xl font-bold text-white mb-6">
                                Welcome to Nexa Admin
                            </h1>
                            <p class="text-xl text-gray-300 mb-8">
                                A modern, full-stack admin dashboard built with Nexa Framework and MongoDB
                            </p>
                            <div class="space-x-4">
                                <a href="/login" class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
                                    Sign In
                                </a>
                                <a href="/register" class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700">
                                    Create Account
                                </a>
                            </div>
                        </div>

                        <div class="mt-16">
                            <h2 class="text-2xl font-bold text-white mb-8 text-center">Features</h2>
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div class="bg-gray-800 p-6 rounded-lg shadow-lg">
                                    <div class="text-indigo-400 mb-4">
                                        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                                        </svg>
                                    </div>
                                    <h3 class="text-lg font-semibold text-white mb-2">Secure Authentication</h3>
                                    <p class="text-gray-400">JWT-based authentication with refresh tokens</p>
                                </div>

                                <div class="bg-gray-800 p-6 rounded-lg shadow-lg">
                                    <div class="text-green-400 mb-4">
                                        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                                        </svg>
                                    </div>
                                    <h3 class="text-lg font-semibold text-white mb-2">User Management</h3>
                                    <p class="text-gray-400">Full CRUD operations for user accounts</p>
                                </div>

                                <div class="bg-gray-800 p-6 rounded-lg shadow-lg">
                                    <div class="text-yellow-400 mb-4">
                                        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                        </svg>
                                    </div>
                                    <h3 class="text-lg font-semibold text-white mb-2">Role-Based Access</h3>
                                    <p class="text-gray-400">Admin and user roles with appropriate permissions</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `
    })
  };
}
