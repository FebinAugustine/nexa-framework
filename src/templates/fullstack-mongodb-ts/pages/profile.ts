import { html } from '../core/framework';
import { Layout } from '../components/Layout';

export default function ProfilePage({ user }: { params: any; user: any }) {
  return {
    head: html`<title>Profile - Nexa Admin</title>`,
    body: Layout({
      user,
      children: html`
                <div class="min-h-screen bg-gray-900 py-6 px-4 sm:px-6 lg:px-8">
                    <div class="max-w-4xl mx-auto">
                        <div class="flex justify-between items-center mb-8">
                            <h1 class="text-3xl font-bold text-white">
                                My Profile
                            </h1>
                            <div class="flex items-center space-x-4">
                                <a
                                    href="/api/auth/logout"
                                    class="px-4 py-2 text-sm font-medium text-red-300 bg-red-900/20 rounded-md hover:bg-red-900/30 transition-colors"
                                >
                                    Logout
                                </a>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div class="lg:col-span-1">
                                <div class="bg-gray-800 rounded-lg shadow-lg p-6">
                                    <div class="text-center mb-6">
                                        <div class="mx-auto w-24 h-24 bg-indigo-500 rounded-full flex items-center justify-center mb-4">
                                            <span class="text-white text-2xl font-bold">${user.name.charAt(0)}</span>
                                        </div>
                                        <h2 class="text-xl font-bold text-white mb-1">${user.name}</h2>
                                        <p class="text-gray-400">${user.email}</p>
                                        <span class="inline-block mt-2 px-3 py-1 text-xs font-semibold rounded-full bg-gray-700 text-gray-300">
                                            ${user.role}
                                        </span>
                                    </div>
                                    <div class="space-y-4">
                                        <div>
                                            <h3 class="text-sm font-medium text-gray-400 mb-2">Account Info</h3>
                                            <ul class="space-y-2">
                                                <li class="flex justify-between text-sm">
                                                    <span class="text-gray-400">Member Since:</span>
                                                    <span class="text-white">2024-01-15</span>
                                                </li>
                                                <li class="flex justify-between text-sm">
                                                    <span class="text-gray-400">Last Login:</span>
                                                    <span class="text-white">Today</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="lg:col-span-2">
                                <div class="bg-gray-800 rounded-lg shadow-lg p-6">
                                    <h2 class="text-xl font-bold text-white mb-6">Edit Profile</h2>
                                    <form id="profile-form" class="space-y-6">
                                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label for="name" class="block text-sm font-medium text-gray-300 mb-2">
                                                    Full Name
                                                </label>
                                                <input
                                                    id="name"
                                                    name="name"
                                                    type="text"
                                                    value="${user.name}"
                                                    required
                                                    class="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                                />
                                            </div>
                                            <div>
                                                <label for="email" class="block text-sm font-medium text-gray-300 mb-2">
                                                    Email Address
                                                </label>
                                                <input
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    value="${user.email}"
                                                    required
                                                    class="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                                />
                                            </div>
                                        </div>

                                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label for="current-password" class="block text-sm font-medium text-gray-300 mb-2">
                                                    Current Password
                                                </label>
                                                <input
                                                    id="current-password"
                                                    name="current-password"
                                                    type="password"
                                                    class="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                                    placeholder="Enter current password"
                                                />
                                            </div>
                                            <div>
                                                <label for="new-password" class="block text-sm font-medium text-gray-300 mb-2">
                                                    New Password
                                                </label>
                                                <input
                                                    id="new-password"
                                                    name="new-password"
                                                    type="password"
                                                    minlength="6"
                                                    class="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                                    placeholder="Enter new password"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label for="confirm-password" class="block text-sm font-medium text-gray-300 mb-2">
                                                Confirm New Password
                                            </label>
                                            <input
                                                id="confirm-password"
                                                name="confirm-password"
                                                type="password"
                                                minlength="6"
                                                class="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                                placeholder="Confirm new password"
                                            />
                                        </div>

                                        <div class="flex items-center justify-end space-x-4">
                                            <button
                                                type="button"
                                                class="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors"
                                            >
                                                Save Changes
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <script type="module">
                    const profileForm = document.getElementById('profile-form');
                    
                    profileForm.addEventListener('submit', async (e) => {
                        e.preventDefault();
                        
                        const name = document.getElementById('name').value;
                        const email = document.getElementById('email').value;
                        const currentPassword = document.getElementById('current-password').value;
                        const newPassword = document.getElementById('new-password').value;
                        const confirmPassword = document.getElementById('confirm-password').value;
                        
                        // Add validation here
                        if (newPassword && newPassword !== confirmPassword) {
                            alert('New passwords do not match');
                            return;
                        }
                        
                        if (newPassword && newPassword.length < 6) {
                            alert('New password must be at least 6 characters');
                            return;
                        }
                        
                        try {
                            const response = await fetch('/api/users', {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    name,
                                    email,
                                    currentPassword,
                                    newPassword
                                })
                            });
                            
                            const data = await response.json();
                            
                            if (data.success) {
                                alert('Profile updated successfully');
                            } else {
                                alert(data.error);
                            }
                        } catch (error) {
                            alert('Something went wrong. Please try again.');
                            console.error('Profile update error:', error);
                        }
                    });
                </script>
            `
    })
  };
}
