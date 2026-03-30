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

    // Get current page from URL
    const urlParams = new URLSearchParams(window.location.search);
    const currentPage = parseInt(urlParams.get('page')) || 1;

    try {
        const response = await fetch('posts/posts.json');
        if (!response.ok) throw new Error('Não foi possível carregar os registros.');
        
        let posts = await response.json();
        
        if (posts.length === 0) {
            postListElement.innerHTML = '<p>O abismo está vazio no momento.</p>';
            return;
        }

        // Sort posts by date (descending)
        posts.sort((a, b) => b.date.localeCompare(a.date));

        // Pagination Logic
        const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
        const start = (currentPage - 1) * POSTS_PER_PAGE;
        const end = start + POSTS_PER_PAGE;
        const paginatedPosts = posts.slice(start, end);

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
            html += `
                <div class="pagination-container">
                    ${currentPage > 1 
                        ? `<a href="index.html?page=${currentPage - 1}" class="pagination-btn">← Anterior</a>` 
                        : '<span class="pagination-btn disabled">← Anterior</span>'}
                    
                    <span class="pagination-info">Página ${currentPage} de ${totalPages}</span>
                    
                    ${currentPage < totalPages 
                        ? `<a href="index.html?page=${currentPage + 1}" class="pagination-btn">Próximo →</a>` 
                        : '<span class="pagination-btn disabled">Próximo →</span>'}
                </div>
            `;
        }
        
        postListElement.innerHTML = html;
    } catch (error) {
        console.error('Error loading post list:', error);
        postListElement.innerHTML = `<p>Erro ao invocar registros: ${error.message}</p>`;
    }
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
