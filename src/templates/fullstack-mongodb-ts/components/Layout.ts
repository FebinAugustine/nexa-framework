import { html } from '../core/framework';
import { Navbar } from './Navbar';

interface LayoutProps {
  user: any;
  children: string;
}

export function Layout({ user, children }: LayoutProps) {
  return html`
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Nexa Admin</title>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
        />
      </head>
      <body class="bg-gray-900 text-white min-h-screen">
        ${Navbar({ user })}
        <main class="container mx-auto px-4 py-8">
          ${children}
        </main>
      </body>
    </html>
  `;
}
