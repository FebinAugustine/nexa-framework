import { html } from '../core/framework';
import { Navbar } from '../components/Navbar';

export default function AboutPage() {
    return {
        head: html`<title>About - NexaBlog</title>`,
        body: html`
            ${Navbar()}
            <main class="min-h-screen bg-gray-50">
                <!-- Hero Section -->
                <section class="bg-gradient-to-br from-indigo-600 to-purple-600 py-16 px-4">
                    <div class="max-w-4xl mx-auto text-center">
                        <h1 class="text-3xl md:text-5xl font-bold text-white mb-6">
                            About NexaBlog
                        </h1>
                        <p class="text-xl text-indigo-100 mb-8">
                            We're building the future of web development with resumable architecture.
                        </p>
                    </div>
                </section>

                <!-- About Content -->
                <section class="py-16 px-4 bg-white">
                    <div class="max-w-4xl mx-auto">
                        <div class="grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 class="text-3xl font-bold text-gray-900 mb-6">
                                    Our Mission
                                </h2>
                                <p class="text-gray-600 mb-4">
                                    NexaBlog was born from a simple idea: web development should be fast, 
                                    simple, and accessible to everyone. We believe that the complexity of 
                                    modern web frameworks has gone too far.
                                </p>
                                <p class="text-gray-600 mb-4">
                                    That's why we created Nexa Framework - a no-build, resumable web framework 
                                    that combines the power of server-side rendering with the speed of client-side 
                                    interactivity.
                                </p>
                                <p class="text-gray-600">
                                    Our mission is to simplify web development and help developers focus on what 
                                    matters most - creating great user experiences.
                                </p>
                            </div>
                            <div class="bg-gray-50 p-8 rounded-xl">
                                <div class="text-4xl mb-4">🚀</div>
                                <h3 class="text-xl font-semibold mb-4 text-gray-900">
                                    Innovation First
                                </h3>
                                <p class="text-gray-600">
                                    We're constantly pushing the boundaries of what's possible with web development.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Values Section -->
                <section class="py-16 px-4 bg-gray-50">
                    <div class="max-w-6xl mx-auto">
                        <h2 class="text-3xl font-bold text-center mb-12 text-gray-900">
                            Our Values
                        </h2>
                        <div class="grid md:grid-cols-3 gap-8">
                            <div class="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                                <div class="text-4xl mb-4">⚡</div>
                                <h3 class="text-xl font-semibold mb-4 text-gray-900">
                                    Performance
                                </h3>
                                <p class="text-gray-600">
                                    We believe that fast websites are better websites. Our architecture ensures 
                                    pages are interactive the moment they load.
                                </p>
                            </div>
                            <div class="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                                <div class="text-4xl mb-4">🎯</div>
                                <h3 class="text-xl font-semibold mb-4 text-gray-900">
                                    Simplicity
                                </h3>
                                <p class="text-gray-600">
                                    We avoid unnecessary complexity. Our API is simple, consistent, and easy to learn.
                                </p>
                            </div>
                            <div class="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                                <div class="text-4xl mb-4">🌍</div>
                                <h3 class="text-xl font-semibold mb-4 text-gray-900">
                                    Accessibility
                                </h3>
                                <p class="text-gray-600">
                                    We build for everyone. Our framework ensures your applications are accessible to all users.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Team Section -->
                <section class="py-16 px-4 bg-white">
                    <div class="max-w-6xl mx-auto">
                        <h2 class="text-3xl font-bold text-center mb-12 text-gray-900">
                            Meet Our Team
                        </h2>
                        <div class="grid md:grid-cols-3 gap-8">
                            <div class="text-center">
                                <div class="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                                    <span class="text-white text-2xl font-bold">JD</span>
                                </div>
                                <h3 class="text-xl font-semibold mb-2 text-gray-900">
                                    John Doe
                                </h3>
                                <p class="text-gray-600 mb-4">
                                    Founder & CEO
                                </p>
                                <p class="text-gray-600">
                                    John has been building web applications for over a decade. He's passionate about 
                                    simplifying web development.
                                </p>
                            </div>
                            <div class="text-center">
                                <div class="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                                    <span class="text-white text-2xl font-bold">JS</span>
                                </div>
                                <h3 class="text-xl font-semibold mb-2 text-gray-900">
                                    Jane Smith
                                </h3>
                                <p class="text-gray-600 mb-4">
                                    CTO
                                </p>
                                <p class="text-gray-600">
                                    Jane is an expert in web performance and has worked with some of the largest 
                                    technology companies.
                                </p>
                            </div>
                            <div class="text-center">
                                <div class="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                                    <span class="text-white text-2xl font-bold">MJ</span>
                                </div>
                                <h3 class="text-xl font-semibold mb-2 text-gray-900">
                                    Mike Johnson
                                </h3>
                                <p class="text-gray-600 mb-4">
                                    Lead Developer
                                </p>
                                <p class="text-gray-600">
                                    Mike is a full-stack developer with a passion for building scalable, 
                                    maintainable applications.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Contact CTA -->
                <section class="py-16 px-4 bg-indigo-600">
                    <div class="max-w-4xl mx-auto text-center">
                        <h2 class="text-3xl font-bold text-white mb-4">
                            Get in Touch
                        </h2>
                        <p class="text-indigo-100 mb-8">
                            Have questions or want to collaborate? We'd love to hear from you.
                        </p>
                        <a href="/contact" class="px-8 py-4 bg-white text-indigo-600 rounded-xl hover:bg-indigo-50 transition-all duration-300 transform hover:scale-105 font-semibold">
                            Contact Us
                        </a>
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
        `
    };
}
