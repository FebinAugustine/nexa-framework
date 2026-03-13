import { html } from '../core/framework';

interface NavbarProps {
  user: any;
}

export function Navbar({ user }: NavbarProps) {
  return html`
    <nav class="bg-gray-900 text-white shadow-lg">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <h1 class="text-2xl font-bold text-indigo-400">Nexa Admin</h1>
            </div>
            <div class="hidden md:block ml-10">
              <div class="flex items-baseline space-x-8">
                <a
                  href="/"
                  class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Home
                </a>
                ${user ? html`
                  <>
                    <a
                      href="/dashboard"
                      class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Dashboard
                    </a>
                    ${user.role === 'admin' ? html`
                      <a
                        href="/admin"
                        class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                      >
                        Admin Panel
                      </a>
                    ` : ''}
                    <a
                      href="/profile"
                      class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Profile
                    </a>
                  </>
                ` : ''}
              </div>
            </div>
          </div>
          <div class="flex items-center">
            ${user ? html`
              <div class="flex items-center space-x-4">
                <div class="text-sm text-gray-300">
                  <span>Welcome, ${user.name}</span>
                </div>
                <a
                  href="/api/auth/logout"
                  class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Logout
                </a>
              </div>
            ` : html`
              <div class="flex items-center space-x-4">
                <a
                  href="/login"
                  class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </a>
                <a
                  href="/register"
                  class="bg-indigo-600 text-white hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Register
                </a>
              </div>
            `}
          </div>
        </div>
      </div>
    </nav>
  `;
}
