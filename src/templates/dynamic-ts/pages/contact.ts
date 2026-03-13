import { html } from '../core/framework';
import { Navbar } from '../components/Navbar';

export default function ContactPage() {
    return {
        head: html`<title>Contact - NexaBlog</title>`,
        body: html`
            ${Navbar()}
            <main class="min-h-screen bg-gray-50">
                <!-- Hero Section -->
                <section class="bg-gradient-to-br from-indigo-600 to-purple-600 py-16 px-4">
                    <div class="max-w-4xl mx-auto text-center">
                        <h1 class="text-3xl md:text-5xl font-bold text-white mb-6">
                            Contact Us
                        </h1>
                        <p class="text-xl text-indigo-100 mb-8">
                            Have questions or want to collaborate? We'd love to hear from you.
                        </p>
                    </div>
                </section>

                <!-- Contact Form -->
                <section class="py-16 px-4">
                    <div class="max-w-6xl mx-auto">
                        <div class="grid md:grid-cols-2 gap-12">
                            <!-- Contact Info -->
                            <div>
                                <h2 class="text-2xl font-bold text-gray-900 mb-6">
                                    Get in Touch
                                </h2>
                                <p class="text-gray-600 mb-8">
                                    Whether you have a question about our framework, want to contribute, 
                                    or just want to say hello, we're here to help.
                                </p>

                                <div class="space-y-6">
                                    <div class="flex items-center">
                                        <div class="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                                            <svg class="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 class="font-semibold text-gray-900">Email</h3>
                                            <p class="text-gray-600">hello@nexablog.com</p>
                                        </div>
                                    </div>

                                    <div class="flex items-center">
                                        <div class="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                                            <svg class="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 class="font-semibold text-gray-900">Phone</h3>
                                            <p class="text-gray-600">+1 (555) 123-4567</p>
                                        </div>
                                    </div>

                                    <div class="flex items-center">
                                        <div class="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                                            <svg class="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 class="font-semibold text-gray-900">Address</h3>
                                            <p class="text-gray-600">123 Tech Street, San Francisco, CA 94107</p>
                                        </div>
                                    </div>
                                </div>

                                <!-- Social Media -->
                                <div class="mt-12">
                                    <h3 class="font-semibold text-gray-900 mb-4">Follow Us</h3>
                                    <div class="flex gap-4">
                                        <a href="#" class="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-colors">
                                            <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                            </svg>
                                        </a>
                                        <a href="#" class="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-colors">
                                            <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                                            </svg>
                                        </a>
                                        <a href="#" class="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-colors">
                                            <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                                            </svg>
                                        </a>
                                        <a href="#" class="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-colors">
                                            <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                            </svg>
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <!-- Form -->
                            <div class="bg-white rounded-xl shadow-md p-8">
                                <h2 class="text-2xl font-bold text-gray-900 mb-6">
                                    Send us a Message
                                </h2>
                                <form class="space-y-6">
                                    <div>
                                        <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
                                            Name
                                        </label>
                                        <input 
                                            type="text" 
                                            id="name" 
                                            name="name" 
                                            class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            placeholder="Your name"
                                            required
                                        >
                                    </div>

                                    <div>
                                        <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                                            Email
                                        </label>
                                        <input 
                                            type="email" 
                                            id="email" 
                                            name="email" 
                                            class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            placeholder="Your email"
                                            required
                                        >
                                    </div>

                                    <div>
                                        <label for="subject" class="block text-sm font-medium text-gray-700 mb-2">
                                            Subject
                                        </label>
                                        <input 
                                            type="text" 
                                            id="subject" 
                                            name="subject" 
                                            class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            placeholder="Subject"
                                            required
                                        >
                                    </div>

                                    <div>
                                        <label for="message" class="block text-sm font-medium text-gray-700 mb-2">
                                            Message
                                        </label>
                                        <textarea 
                                            id="message" 
                                            name="message" 
                                            rows="6" 
                                            class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            placeholder="Your message"
                                            required
                                        ></textarea>
                                    </div>

                                    <div>
                                        <button 
                                            type="submit" 
                                            class="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
                                        >
                                            Send Message
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Map Section -->
                <section class="py-16 px-4 bg-white">
                    <div class="max-w-6xl mx-auto">
                        <h2 class="text-2xl font-bold text-gray-900 mb-8 text-center">
                            Visit Us
                        </h2>
                        <div class="bg-gray-200 rounded-xl h-96 flex items-center justify-center">
                            <p class="text-gray-500">Map would be displayed here</p>
                        </div>
                    </div>
                </section>
            </main>

            <!-- Footer -->
            <footer class="bg-gray-900 py-8 px-4">
                <div class="max-w-6xl mx-auto text-center">
                    <p class="text-gray-400">© 2024 NexaBlog. Built with Nexa Framework.</p>
                    <div class="mt-4 flex justify-center gap-6">
                        <a href="#" class="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" class="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
                        <a href="/contact" class="text-gray-400 hover:text-white transition-colors">Contact</a>
                    </div>
                </div>
            </footer>

            <script type="module">
                // Contact form handling
                document.querySelector('form').addEventListener('submit', (e) => {
                    e.preventDefault();
                    
                    const formData = new FormData(e.target);
                    const data = Object.fromEntries(formData);
                    
                    console.log('Form submitted:', data);
                    
                    // Show success message
                    alert('Thank you for your message! We will get back to you soon.');
                    
                    // Reset form
                    e.target.reset();
                });
            </script>
        `
    };
}
