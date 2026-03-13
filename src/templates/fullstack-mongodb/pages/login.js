import { html } from '../core/framework.js';
import { Navbar } from '../components/Navbar.js';

export default function LoginPage() {
    return {
        head: html`<title>Login - Nexa Admin</title>`,
        body: html`
            <div class="min-h-screen bg-gray-900">
                ${Navbar({ user: null })}
                <main class="max-w-md mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <div class="bg-gray-800 py-8 px-6 shadow rounded-lg sm:px-10">
                        <h2 class="text-2xl font-bold text-white mb-6 text-center">Sign in to your account</h2>
                        <form id="login-form" class="space-y-6">
                            <div>
                                <label for="email" class="block text-sm font-medium text-gray-300">Email address</label>
                                <input 
                                    id="email" 
                                    name="email" 
                                    type="email" 
                                    autocomplete="email" 
                                    required 
                                    class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-600 placeholder-gray-500 text-white bg-gray-700 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="Enter your email"
                                />
                            </div>
                            <div>
                                <label for="password" class="block text-sm font-medium text-gray-300">Password</label>
                                <input 
                                    id="password" 
                                    name="password" 
                                    type="password" 
                                    autocomplete="current-password" 
                                    required 
                                    class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-600 placeholder-gray-500 text-white bg-gray-700 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="Enter your password"
                                />
                            </div>
                            <div class="flex items-center justify-between">
                                <div class="flex items-center">
                                    <input 
                                        id="remember-me" 
                                        name="remember-me" 
                                        type="checkbox" 
                                        class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-500 rounded"
                                    />
                                    <label for="remember-me" class="ml-2 block text-sm text-gray-300">
                                        Remember me
                                    </label>
                                </div>
                                <div class="text-sm">
                                    <a href="#" class="font-medium text-indigo-400 hover:text-indigo-300">
                                        Forgot your password?
                                    </a>
                                </div>
                            </div>
                            <div>
                                <button 
                                    type="submit" 
                                    class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Sign in
                                </button>
                            </div>
                        </form>
                        <div class="mt-6 text-center">
                            <p class="text-sm text-gray-400">
                                Don't have an account? 
                                <a href="/register" class="font-medium text-indigo-400 hover:text-indigo-300">
                                    Sign up
                                </a>
                            </p>
                        </div>
                    </div>
                </main>
            </div>

            <script type="module">
                import { login, setLoading, setError, clearError } from '/state/authState.js';
                import { signal } from '/core/signals.js';

                const loginForm = document.getElementById('login-form');
                const errorMessage = signal('');

                // Error display component
                function showError(msg) {
                    const existingError = document.getElementById('error-message');
                    if (existingError) {
                        existingError.textContent = msg;
                    } else {
                        const errorDiv = document.createElement('div');
                        errorDiv.id = 'error-message';
                        errorDiv.className = 'p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm';
                        errorDiv.textContent = msg;
                        loginForm.appendChild(errorDiv);
                    }
                }

                loginForm.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    clearError();

                    const email = document.getElementById('email').value;
                    const password = document.getElementById('password').value;

                    try {
                        setLoading(true);
                        
                        const response = await fetch('/api/auth', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                action: 'login',
                                email,
                                password
                            })
                        });

                        const data = await response.json();

                        if (data.success) {
                            login(data.user);
                            // Show success notification
                            showSuccess('Login successful! Redirecting to dashboard...');
                            // Redirect after a short delay
                            setTimeout(() => {
                                window.location.href = '/dashboard';
                            }, 1500);
                        } else {
                            setError(data.error);
                            showError(data.error);
                        }
                    } catch (error) {
                        setError('Network error. Please try again.');
                        showError('Network error. Please try again.');
                        console.error('Login error:', error);
                    } finally {
                        setLoading(false);
                    }
                });

                // Success display component
                function showSuccess(msg) {
                    const existingSuccess = document.getElementById('success-message');
                    if (existingSuccess) {
                        existingSuccess.textContent = msg;
                    } else {
                        const successDiv = document.createElement('div');
                        successDiv.id = 'success-message';
                        successDiv.className = 'p-3 bg-green-50 border border-green-200 rounded-md text-green-700 text-sm';
                        successDiv.textContent = msg;
                        loginForm.appendChild(successDiv);
                    }
                }
            </script>
        `
    };
}