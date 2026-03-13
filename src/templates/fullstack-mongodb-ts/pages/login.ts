import { html } from '../core/framework';
import { Layout } from '../components/Layout';

export default function LoginPage() {
  return {
    head: html`<title>Login - Nexa Admin</title>`,
    body: Layout({
      user: null,
      children: html`
                <div class="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
                    <div class="max-w-md mx-auto">
                        <div class="bg-gray-800 rounded-lg shadow-lg p-8">
                            <h2 class="text-2xl font-bold text-white mb-6 text-center">
                                Sign In to Your Account
                            </h2>
                            
                            <form id="login-form" class="space-y-6">
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
                                        class="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        placeholder="Enter your password"
                                    />
                                </div>

                                <div class="flex items-center justify-between">
                                    <div class="flex items-center">
                                        <input
                                            id="remember-me"
                                            name="remember-me"
                                            type="checkbox"
                                            class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-500 rounded bg-gray-700"
                                        />
                                        <label for="remember-me" class="ml-2 block text-sm text-gray-300">
                                            Remember me
                                        </label>
                                    </div>
                                    <a href="#" class="text-sm font-medium text-indigo-400 hover:text-indigo-300">
                                        Forgot your password?
                                    </a>
                                </div>

                                <button
                                    type="submit"
                                    class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Sign In
                                </button>
                            </form>

                            <div class="mt-6 text-center">
                                <p class="text-sm text-gray-400">
                                    Don't have an account?{' '}
                                    <a href="/register" class="font-medium text-indigo-400 hover:text-indigo-300">
                                        Sign up for free
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <script type="module">
                    import { login, setLoading, setError, clearError } from '/state/authState.js';

                    const loginForm = document.getElementById('login-form');
                    
                    loginForm.addEventListener('submit', async (e) => {
                        e.preventDefault();
                        
                        const email = document.getElementById('email').value;
                        const password = document.getElementById('password').value;
                        const rememberMe = document.getElementById('remember-me').checked;
                        
                        setLoading(true);
                        clearError();
                        
                        try {
                            const response = await fetch('/api/auth', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    action: 'login',
                                    email,
                                    password
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
                            console.error('Login error:', error);
                        } finally {
                            setLoading(false);
                        }
                    });
                </script>
            `
    })
  };
}
