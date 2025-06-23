// Lightbox functionality for timeline images
function initializeLightbox() {
  console.log('🖼️ Initializing lightbox...');
  
  // Create lightbox HTML if it doesn't exist
  if (!document.querySelector('.lightbox')) {
    createLightboxHTML();
  }

  const lightbox = document.querySelector('.lightbox');
  const lightboxImage = document.querySelector('.lightbox-image');
  const lightboxCaption = document.querySelector('.lightbox-caption');
  const closeBtn = document.querySelector('.lightbox-close');
  const prevBtn = document.querySelector('.lightbox-prev');
  const nextBtn = document.querySelector('.lightbox-next');

  if (!lightbox || !lightboxImage) {
    console.error('❌ Lightbox elements not found');
    return;
  }

  let currentImages = [];
  let currentIndex = 0;

  // Function to open lightbox
  function openLightbox(imageSrc, imageAlt, allImages, clickedIndex) {
    currentImages = allImages;
    currentIndex = clickedIndex;
    
    lightboxImage.src = imageSrc;
    lightboxCaption.textContent = imageAlt;
    
    // Update navigation buttons
    updateNavButtons();
    
    // Show lightbox
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Focus on lightbox for keyboard navigation
    lightbox.focus();
  }

  // Function to close lightbox
  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    
    // Small delay to allow transition
    setTimeout(() => {
      if (!lightbox.classList.contains('active')) {
        lightboxImage.src = '';
        lightboxCaption.textContent = '';
      }
    }, 300);
  }

  // Function to navigate to next/previous image
  function navigateImage(direction) {
    if (direction === 'next' && currentIndex < currentImages.length - 1) {
      currentIndex++;
    } else if (direction === 'prev' && currentIndex > 0) {
      currentIndex--;
    } else {
      return; // No navigation needed
    }

    const newImage = currentImages[currentIndex];
    lightboxImage.src = newImage.src;
    lightboxCaption.textContent = newImage.alt;
    updateNavButtons();
  }

  // Update navigation button states
  function updateNavButtons() {
    if (prevBtn) {
      prevBtn.disabled = currentIndex === 0;
    }
    if (nextBtn) {
      nextBtn.disabled = currentIndex === currentImages.length - 1;
    }
  }

  // Add click handlers to all timeline gallery images
  function setupImageClickHandlers() {
    // Get all timeline sections
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    timelineItems.forEach(item => {
      const images = item.querySelectorAll('.timeline-gallery-image');
      
      if (images.length === 0) return;
      
      // Convert to array with src and alt info
      const imageData = Array.from(images).map(img => ({
        src: img.src,
        alt: img.alt || 'Timeline image'
      }));

      // Add click handler to each image in this timeline item
      images.forEach((img, index) => {
        img.addEventListener('click', (e) => {
          e.preventDefault();
          openLightbox(img.src, img.alt || 'Timeline image', imageData, index);
        });
        
        // Add keyboard support for images
        img.setAttribute('tabindex', '0');
        img.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openLightbox(img.src, img.alt || 'Timeline image', imageData, index);
          }
        });
      });
    });
  }

  // Event listeners
  if (closeBtn) {
    closeBtn.addEventListener('click', closeLightbox);
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => navigateImage('prev'));
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => navigateImage('next'));
  }

  // Close on background click
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;

    switch (e.key) {
      case 'Escape':
        closeLightbox();
        break;
      case 'ArrowLeft':
        navigateImage('prev');
        break;
      case 'ArrowRight':
        navigateImage('next');
        break;
    }
  });

  // Setup click handlers for images
  setupImageClickHandlers();

  console.log('✅ Lightbox initialized successfully');
}

// Create lightbox HTML structure
function createLightboxHTML() {
  const lightboxHTML = `
    <div class="lightbox" tabindex="-1">
      <div class="lightbox-content">
        <button class="lightbox-close" aria-label="Close lightbox">&times;</button>
        <button class="lightbox-nav lightbox-prev" aria-label="Previous image">&#8249;</button>
        <img class="lightbox-image" src="" alt="" />
        <button class="lightbox-nav lightbox-next" aria-label="Next image">&#8250;</button>
        <div class="lightbox-caption"></div>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', lightboxHTML);
}

// Function to reinitialize lightbox (useful when timeline is updated dynamically)
function reinitializeLightbox() {
  console.log('🔄 Reinitializing lightbox for updated content...');
  
  // Remove existing event listeners by recreating the lightbox
  const existingLightbox = document.querySelector('.lightbox');
  if (existingLightbox) {
    existingLightbox.remove();
  }
  
  initializeLightbox();
}

// Export for use in main.js
window.initializeLightbox = initializeLightbox;
window.reinitializeLightbox = reinitializeLightbox;