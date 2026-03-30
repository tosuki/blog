/**
 * Okaabe Blog - Application Logic
 */

// Configuration
const POSTS_PER_PAGE = 5;

// Theme Management
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.textContent = theme === 'light' ? '☀' : '☽';
    }
}

// Initialize theme as soon as possible
document.addEventListener('DOMContentLoaded', initTheme);

// Function to load the list of posts on index.html
async function loadPostList() {
    const postListElement = document.getElementById('post-list');
    if (!postListElement) return;

    // Get parameters from URL
    const urlParams = new URLSearchParams(window.location.search);
    const currentPage = parseInt(urlParams.get('page')) || 1;
    const searchQuery = urlParams.get('q') || '';
    const categoryFilter = urlParams.get('cat') || '';

    // Update search input value
    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.value = searchQuery;

    try {
        const response = await fetch('posts/posts.json');
        if (!response.ok) throw new Error('Não foi possível carregar os registros.');
        
        let posts = await response.json();
        
        if (posts.length === 0) {
            postListElement.innerHTML = '<p>O abismo está vazio no momento.</p>';
            return;
        }

        // 1. Sort posts by date (descending)
        posts.sort((a, b) => b.date.localeCompare(a.date));

        // 2. Extract Categories for UI
        renderCategoryFilters(posts, categoryFilter);

        // 3. Apply Filters (Search and Category)
        let filteredPosts = posts;

        if (categoryFilter) {
            filteredPosts = filteredPosts.filter(post => 
                post.file.startsWith(categoryFilter + '/')
            );
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filteredPosts = filteredPosts.filter(post => 
                post.title.toLowerCase().includes(query) || 
                post.summary.toLowerCase().includes(query)
            );
        }

        // Render Search Feedback
        renderSearchFeedback(filteredPosts.length, searchQuery, categoryFilter);

        if (filteredPosts.length === 0) {
            postListElement.innerHTML = '<p>Nenhum registro encontrado para estes critérios.</p>';
            return;
        }

        // 4. Pagination Logic
        const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
        const start = (currentPage - 1) * POSTS_PER_PAGE;
        const end = start + POSTS_PER_PAGE;
        const paginatedPosts = filteredPosts.slice(start, end);

        let html = '';
        paginatedPosts.forEach(post => {
            html += `
                <div class="post-card">
                    <h2 class="post-title"><a href="post.html?file=${post.file}">${post.title}</a></h2>
                    <p class="post-date">${post.date}</p>
                    <p>${post.summary}</p>
                    <a href="post.html?file=${post.file}" class="read-more">Ler registro completo →</a>
                </div>
            `;
        });
        
        // Add Pagination Controls
        if (totalPages > 1) {
            const baseUrl = `index.html?q=${encodeURIComponent(searchQuery)}&cat=${encodeURIComponent(categoryFilter)}`;
            html += `
                <div class="pagination-container">
                    ${currentPage > 1 
                        ? `<a href="${baseUrl}&page=${currentPage - 1}" class="pagination-btn">← Anterior</a>` 
                        : '<span class="pagination-btn disabled">← Anterior</span>'}
                    
                    <span class="pagination-info">Página ${currentPage} de ${totalPages}</span>
                    
                    ${currentPage < totalPages 
                        ? `<a href="${baseUrl}&page=${currentPage + 1}" class="pagination-btn">Próximo →</a>` 
                        : '<span class="pagination-btn disabled">Próximo →</span>'}
                </div>
            `;
        }
        
        postListElement.innerHTML = html;

        // Setup Event Listeners for Search
        setupSearchListeners();

    } catch (error) {
        console.error('Error loading post list:', error);
        postListElement.innerHTML = `<p>Erro ao invocar registros: ${error.message}</p>`;
    }
}

function renderCategoryFilters(posts, activeCategory) {
    const container = document.getElementById('category-filters');
    if (!container) return;

    // Extract unique categories from file paths (the first part of the path)
    const categories = new Set();
    posts.forEach(post => {
        if (post.file.includes('/')) {
            const cat = post.file.split('/')[0];
            categories.add(cat);
        }
    });

    let html = `<button class="category-btn ${!activeCategory ? 'active' : ''}" onclick="filterByCategory('')">Todos</button>`;
    
    categories.forEach(cat => {
        html += `<button class="category-btn ${activeCategory === cat ? 'active' : ''}" onclick="filterByCategory('${cat}')">${cat.charAt(0).toUpperCase() + cat.slice(1)}</button>`;
    });

    container.innerHTML = html;
}

function renderSearchFeedback(count, query, category) {
    const feedback = document.getElementById('search-feedback');
    if (!feedback) return;

    if (!query && !category) {
        feedback.innerHTML = '';
        return;
    }

    let message = `Encontrado(s) ${count} registro(s)`;
    if (query) message += ` para "${query}"`;
    if (category) message += ` na categoria "${category}"`;
    
    feedback.innerHTML = `${message}. <a href="index.html" style="color:var(--primary-color); cursor:pointer;">Limpar filtros</a>`;
}

function setupSearchListeners() {
    const searchBtn = document.getElementById('search-btn');
    const searchInput = document.getElementById('search-input');

    if (searchBtn && !searchBtn.dataset.listener) {
        searchBtn.addEventListener('click', () => {
            const query = searchInput.value.trim();
            const urlParams = new URLSearchParams(window.location.search);
            urlParams.set('q', query);
            urlParams.set('page', '1'); // Reset to page 1
            window.location.search = urlParams.toString();
        });
        searchBtn.dataset.listener = 'true';
    }

    if (searchInput && !searchInput.dataset.listener) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchBtn.click();
            }
        });
        searchInput.dataset.listener = 'true';
    }
}

function filterByCategory(cat) {
    const urlParams = new URLSearchParams(window.location.search);
    if (cat) {
        urlParams.set('cat', cat);
    } else {
        urlParams.delete('cat');
    }
    urlParams.set('page', '1'); // Reset to page 1
    window.location.search = urlParams.toString();
}

// Function to load and render a specific post on post.html
async function loadPost(filename) {
    const postContainer = document.getElementById('post-container');
    if (!postContainer) return;

    try {
        // First, fetch the posts list to get metadata
        const postsResponse = await fetch('posts/posts.json');
        if (!postsResponse.ok) throw new Error('O mapa das crônicas foi perdido.');
        const postsList = await postsResponse.json();
        const postData = postsList.find(p => p.file === filename);

        // Fetch the actual markdown content
        const response = await fetch(`posts/${filename}`);
        if (!response.ok) throw new Error('O registro não pôde ser recuperado do abismo.');
        
        const markdown = await response.text();
        
        // Use marked to parse markdown with path resolution
        if (typeof marked !== 'undefined') {
            const renderer = new marked.Renderer();
            const basePath = filename.includes('/') 
                ? `posts/${filename.substring(0, filename.lastIndexOf('/') + 1)}` 
                : 'posts/';

            // Custom image renderer to fix relative paths
            renderer.image = (href, title, text) => {
                let src = href;
                if (!href.startsWith('http') && !href.startsWith('/') && !href.startsWith('data:')) {
                    src = basePath + href;
                }
                return `<img src="${src}" alt="${text || ''}" title="${title || ''}" style="max-width:100%;">`;
            };

            // Custom link renderer to fix relative paths (for assets like PDFs or other md files)
            renderer.link = (href, title, text) => {
                let url = href;
                if (!href.startsWith('http') && !href.startsWith('/') && !href.startsWith('#')) {
                    url = basePath + href;
                }
                return `<a href="${url}" title="${title || ''}">${text}</a>`;
            };

            postContainer.innerHTML = marked.parse(markdown, { renderer });
        } else {
            postContainer.innerHTML = '<pre>' + markdown + '</pre>';
        }
        
        // Render Floating Next Button if exists
        if (postData && postData.next_file) {
            const nextButton = document.createElement('a');
            nextButton.href = `post.html?file=${postData.next_file}`;
            nextButton.className = 'floating-next-post';
            nextButton.innerHTML = postData.next_label || 'Próximo Registro →';
            nextButton.style.display = 'block'; // Ensure it's shown
            document.body.appendChild(nextButton);
        }

        // Update document title if first H1 exists
        const h1 = postContainer.querySelector('h1');
        if (h1) {
            document.title = h1.textContent + ' | Okaabe\'s Chronicles';
        }
    } catch (error) {
        console.error('Error loading post:', error);
        postContainer.innerHTML = `<p>Erro fatal: ${error.message}</p>`;
    }
}
