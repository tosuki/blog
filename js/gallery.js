/**
 * Okaabe Blog - Gallery Management
 */

async function loadGallery() {
    const galleryContainer = document.getElementById('gallery-container');
    if (!galleryContainer) return;

    try {
        const response = await fetch('assets/gallery.json');
        if (!response.ok) throw new Error('Não foi possível carregar a galeria.');
        
        const galleryItems = await response.json();
        
        if (galleryItems.length === 0) {
            galleryContainer.innerHTML = '<p>A galeria está vazia.</p>';
            return;
        }

        let html = '';
        galleryItems.forEach((item, index) => {
            html += `
                <div class="gallery-item" onclick="openLightbox('${item.src}', '${item.title}', '${item.post}', '${item.post_url}')">
                    <img src="${item.src}" alt="${item.title}" loading="lazy">
                    <div class="gallery-item-info">
                        <h3>${item.title}</h3>
                        <p>${item.post}</p>
                    </div>
                </div>
            `;
        });
        
        galleryContainer.innerHTML = html;

    } catch (error) {
        console.error('Error loading gallery:', error);
        galleryContainer.innerHTML = `<p>Erro ao invocar imagens: ${error.message}</p>`;
    }
}

function openLightbox(src, title, postTitle, postUrl) {
    const modal = document.getElementById('lightbox-modal');
    const modalImg = document.getElementById('lightbox-img');
    const caption = document.getElementById('lightbox-caption');

    if (!modal || !modalImg || !caption) return;

    modal.style.display = 'flex';
    modalImg.src = src;
    caption.innerHTML = `
        <h3>${title}</h3>
        <p>Post: <a href="${postUrl}">${postTitle}</a></p>
    `;
    
    // Disable scroll on body
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const modal = document.getElementById('lightbox-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Close lightbox on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeLightbox();
    }
});

// Initialize gallery on load
document.addEventListener('DOMContentLoaded', loadGallery);
