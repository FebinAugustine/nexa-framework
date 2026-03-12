import { html } from '../core/framework.js';
import { Navbar } from '../components/Navbar.js';

export default function RegisterPage() {
    return {
        head: html`<title>Register - Nexa Admin</title>`,
        body: html`
            <div class="min-h-screen bg-gray-50">
                ${Navbar({ user: null })}
                <main class="max-w-md mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <div class="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
                        <h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">Create your account</h2>
                        <form id="register-form" class="space-y-6">
                            <div>
                                <label for="name" class="block text-sm font-medium text-gray-700">Full name</label>
                                <input 
                                    id="name" 
                                    name="name" 
                                    type="text" 
                                    required 
                                    class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="Enter your full name"
                                />
                            </div>
                            <div>
                                <label for="email" class="block text-sm font-medium text-gray-700">Email address</label>
                                <input 
                                    id="email" 
                                    name="email" 
                                    type="email" 
                                    autocomplete="email" 
                                    required 
                                    class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="Enter your email"
                                />
                            </div>
                            <div>
                                <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                                <input 
                                    id="password" 
                                    name="password" 
                                    type="password" 
                                    autocomplete="new-password" 
                                    required 
                                    class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="Create a password (min 6 characters)"
                                    minlength="6"
                                />
                            </div>
                            <div>
                                <label for="confirm-password" class="block text-sm font-medium text-gray-700">Confirm password</label>
                                <input 
                                    id="confirm-password" 
                                    name="confirm-password" 
                                    type="password" 
                                    autocomplete="new-password" 
                                    required 
                                    class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="Confirm your password"
                                    minlength="6"
                                />
                            </div>
                            <div>
                                <label for="role" class="block text-sm font-medium text-gray-700">Role</label>
                                <select 
                                    id="role" 
                                    name="role" 
                                    class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <div>
                                <button 
                                    type="submit" 
                                    class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Create Account
                                </button>
                            </div>
                        </form>
                        <div class="mt-6 text-center">
                            <p class="text-sm text-gray-600">
                                Already have an account? 
                                <a href="/login" class="font-medium text-indigo-600 hover:text-indigo-500">
                                    Sign in
                                </a>
                            </p>
                        </div>
                    </div>
                </main>
            </div>

            <script type="module">
                import { login, setLoading, setError, clearError } from '/state/authState.js';
                import { signal } from '/core/signals.js';

                const registerForm = document.getElementById('register-form');
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
                        registerForm.appendChild(errorDiv);
                    }
                }

                registerForm.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    clearError();

                    const name = document.getElementById('name').value;
                    const email = document.getElementById('email').value;
                    const password = document.getElementById('password').value;
                    const confirmPassword = document.getElementById('confirm-password').value;
                    const role = document.getElementById('role').value;

                    // Validate passwords match
                    if (password !== confirmPassword) {
                        setError('Passwords do not match');
                        showError('Passwords do not match');
                        return;
                    }

                    // Validate password length
                    if (password.length < 6) {
                        setError('Password must be at least 6 characters');
                        showError('Password must be at least 6 characters');
                        return;
                    }

                    try {
                        setLoading(true);
                        
                        const response = await fetch('/api/auth', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
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
                            // Show success notification
                            showSuccess('Registration successful! Redirecting to dashboard...');
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
                        console.error('Register error:', error);
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
                        registerForm.appendChild(successDiv);
                    }
                }
            </script>
        `
    };
}