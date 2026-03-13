import { html } from '../core/framework';
import { Layout } from '../components/Layout';

export default function RegisterPage() {
  return {
    head: html`<title>Register - Nexa Admin</title>`,
    body: Layout({
      user: null,
      children: html`
                <div class="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
                    <div class="max-w-md mx-auto">
                        <div class="bg-gray-800 rounded-lg shadow-lg p-8">
                            <h2 class="text-2xl font-bold text-white mb-6 text-center">
                                Create Your Account
                            </h2>
                            
                            <form id="register-form" class="space-y-6">
                                <div>
                                    <label for="name" class="block text-sm font-medium text-gray-300 mb-2">
                                        Full Name
                                    </label>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        required
                                        class="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        placeholder="Enter your full name"
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
                                        required
                                        class="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        placeholder="Enter your email"
                                    />
                                </div>

                                <div>
                                    <label for="password" class="block text-sm font-medium text-gray-300 mb-2">
                                        Password
                                    </label>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        required
                                        minlength="6"
                                        class="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        placeholder="Create a password"
                                    />
                                </div>

                                <div>
                                    <label for="confirm-password" class="block text-sm font-medium text-gray-300 mb-2">
                                        Confirm Password
                                    </label>
                                    <input
                                        id="confirm-password"
                                        name="confirm-password"
                                        type="password"
                                        required
                                        minlength="6"
                                        class="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        placeholder="Confirm your password"
                                    />
                                </div>

                                <div>
                                    <label for="role" class="block text-sm font-medium text-gray-300 mb-2">
                                        Role
                                    </label>
                                    <select
                                        id="role"
                                        name="role"
                                        class="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    >
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>

                                <button
                                    type="submit"
                                    class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                >
                                    Create Account
                                </button>
                            </form>

                            <div class="mt-6 text-center">
                                <p class="text-sm text-gray-400">
                                    Already have an account?{' '}
                                    <a href="/login" class="font-medium text-indigo-400 hover:text-indigo-300">
                                        Sign in instead
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <script type="module">
                    import { login, setLoading, setError, clearError } from '/state/authState.js';

                    const registerForm = document.getElementById('register-form');
                    
                    registerForm.addEventListener('submit', async (e) => {
                        e.preventDefault();
                        
                        const name = document.getElementById('name').value;
                        const email = document.getElementById('email').value;
                        const password = document.getElementById('password').value;
                        const confirmPassword = document.getElementById('confirm-password').value;
                        const role = document.getElementById('role').value;
                        
                        if (password !== confirmPassword) {
                            setError('Passwords do not match');
                            return;
                        }
                        
                        if (password.length < 6) {
                            setError('Password must be at least 6 characters');
                            return;
                        }
                        
                        setLoading(true);
                        clearError();
                        
                        try {
                            const response = await fetch('/api/auth', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    action: 'register',
                                    name,
                                    email,
                                    password,
                                    role
                                })
                            });
                            
                            const data = await response.json();
                            
                            if (data.success) {
                                login(data.user);
                                window.location.href = '/dashboard';
                            } else {
                                setError(data.error);
                            }
                        } catch (error) {
                            setError('Something went wrong. Please try again.');
                            console.error('Register error:', error);
                        } finally {
                            setLoading(false);
                        }
                    });
                </script>
            `
    })
  };
}
