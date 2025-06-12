// Performance optimizations
function initializePerformance() {
  // Lazy load images that are not immediately visible
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            observer.unobserve(img);
          }
        }
      });
    });

    // Observe images with data-src attribute
    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }

  // Preload critical resources on hover (for better perceived performance)
  const criticalLinks = document.querySelectorAll('a[href$=".html"]');
  criticalLinks.forEach(link => {
    link.addEventListener('mouseenter', function() {
      const linkElement = document.createElement('link');
      linkElement.rel = 'prefetch';
      linkElement.href = this.href;
      document.head.appendChild(linkElement);
    }, { once: true });
  });

  // Optimize scroll performance
  let ticking = false;
  
  function updateScrollElements() {
    // Update any scroll-dependent elements here
    const scrollTop = window.pageYOffset;
    
    // Example: Update navbar on scroll
    const navbar = document.querySelector('.navbar');
    if (navbar) {
      if (scrollTop > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
    
    ticking = false;
  }

  window.addEventListener('scroll', function() {
    if (!ticking) {
      requestAnimationFrame(updateScrollElements);
      ticking = true;
    }
  });

  // Add smooth scroll behavior for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// Export for use in main.js
window.initializePerformance = initializePerformance;