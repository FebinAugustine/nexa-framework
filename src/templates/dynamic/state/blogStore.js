import { createNexaStore } from '../core/store.js';

// Mock blog data
const initialState = {
    articles: [
        {
            id: '1',
            title: 'Getting Started with Nexa Framework',
            excerpt: 'Learn how to build modern web applications with Nexa Framework - the no-build, resumable web framework.',
            content: `# Getting Started with Nexa Framework

Nexa Framework is a revolutionary approach to web development that combines the power of server-side rendering with the speed of client-side interactivity. In this guide, we'll walk you through the basics of getting started with Nexa.

## What is Nexa?

Nexa follows a "resumable" pattern where HTML is sent complete to the browser, and logic is attached only when a user interacts. This eliminates the need for build processes and hydration.

## Key Features

- **No Build Required**: Write code and deploy instantly
- **Resumable Architecture**: Pages are interactive as soon as they're visible
- **JIT Styling**: Server-side Tailwind CSS compilation
- **Fine-Grained Reactivity**: Direct DOM updates with signals
- **NexaStore**: Redux-like state management with signals

## Getting Started

1. Install Nexa CLI
2. Create a new project
3. Start building pages
4. Deploy to production

Nexa makes web development simpler and faster. Join the revolution today!`,
            author: 'John Doe',
            date: '2024-01-15',
            readTime: '5 min read'
        },
        {
            id: '2',
            title: 'State Management with NexaStore',
            excerpt: 'Master the art of state management in Nexa using the built-in NexaStore system.',
            content: `# State Management with NexaStore

Managing state in web applications can be complex, but NexaStore simplifies this with a signal-based orchestrator. In this article, we'll explore how to use NexaStore effectively.

## The Store Pattern

NexaStore combines the power of Redux-like actions with fine-grained reactivity. It provides:

- Centralized logic
- Action-only updates
- Traceable state changes
- Subscription model

## Creating a Store

\`\`\`javascript
// state/blogStore.js
import { createNexaStore } from '../core/store.js';

export const blogStore = createNexaStore({
    articles: []
}, {
    setArticles: (state, articles) => {
        state.articles.set(articles);
    },
    addArticle: (state, article) => {
        state.articles.set([...state.articles.get(), article]);
    },
    updateArticle: (state, article) => {
        state.articles.set(state.articles.get().map(a => 
            a.id === article.id ? article : a
        ));
    },
    deleteArticle: (state, articleId) => {
        state.articles.set(state.articles.get().filter(a => a.id !== articleId));
    }
});
\`\`\`

## Using the Store

\`\`\`javascript
import { blogStore } from '/state/blogStore.js';

// Get articles
console.log(blogStore.get('articles'));

// Dispatch actions
blogStore.dispatch('addArticle', newArticle);
\`\`\`

## Best Practices

- Keep stores focused
- Use actions for all updates
- Subscribe to changes for UI updates
- Initialize from server data for resumability

NexaStore provides a scalable way to manage state in complex applications without the overhead of traditional state management libraries.`,
            author: 'Jane Smith',
            date: '2024-01-20',
            readTime: '8 min read'
        },
        {
            id: '3',
            title: 'Building Dynamic Pages with Nexa',
            excerpt: 'Learn how to create dynamic, interactive pages in Nexa with signals and components.',
            content: `# Building Dynamic Pages with Nexa

Nexa excels at building dynamic, interactive pages. In this article, we'll explore how to create pages that respond to user interactions in real-time.

## Dynamic Routing

Nexa supports dynamic routing with file system conventions:

\`\`\`
pages/
├── blog/
│   ├── [slug].js    # Dynamic article page
│   └── index.js     # Blog index page
\`\`\`

## Server-Side Data

Pages can fetch data before rendering:

\`\`\`javascript
// pages/blog/[slug].js
export default function BlogPostPage({ params }) {
    // Fetch article data from API or database
    const article = await fetchArticle(params.slug);
    
    return {
        head: html\`<title>\${article.title}</title>\`,
        body: html\`
            <article>
                <h1>\${article.title}</h1>
                <div class="article-content">\${article.content}</div>
            </article>
        \`
    };
}
\`\`\`

## Client-Side Interactivity

Add interactivity with signals:

\`\`\`javascript
<script type="module">
    import { signal } from '/core/signals.js';
    import { blogStore } from '/state/blogStore.js';
    
    const likes = signal(article.likes);
    
    // Update UI when likes change
    likes.subscribe(value => {
        document.getElementById('like-count').textContent = value;
    });
    
    // Handle like button click
    document.getElementById('like-btn').addEventListener('click', () => {
        likes.set(likes.get() + 1);
        blogStore.dispatch('updateArticle', {
            ...article,
            likes: likes.get()
        });
    });
</script>
\`\`\`

## Performance Tips

- Keep scripts small and focused
- Use direct DOM manipulation
- Subscribe only to necessary signals
- Initialize with server data

By following these practices, you can build highly dynamic applications that are fast and efficient.`,
            author: 'Mike Johnson',
            date: '2024-01-25',
            readTime: '6 min read'
        }
    ],
    currentArticle: null,
    loading: false,
    error: null
};

// Store actions
const actions = {
    setArticles: (state, articles) => {
        state.articles.set(articles);
    },
    setCurrentArticle: (state, article) => {
        state.currentArticle.set(article);
    },
    setLoading: (state, loading) => {
        state.loading.set(loading);
    },
    setError: (state, error) => {
        state.error.set(error);
    },
    addArticle: (state, article) => {
        state.articles.set([...state.articles.get(), article]);
    },
    updateArticle: (state, article) => {
        state.articles.set(state.articles.get().map(a => 
            a.id === article.id ? article : a
        ));
    },
    deleteArticle: (state, articleId) => {
        state.articles.set(state.articles.get().filter(a => a.id !== articleId));
    }
};

export const blogStore = createNexaStore(initialState, actions);
