// Navigation functionality
function initializeNavigation() {
  const toggle = document.getElementById('nav-toggle');
  const nav = document.querySelector('.nav-links');
  const overlay = document.querySelector('.nav-overlay');

  // Mobile menu toggle
  if (toggle && nav && overlay) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('open');
      overlay.classList.toggle('open');
      document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
    });
    
    overlay.addEventListener('click', () => {
      nav.classList.remove('open');
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    });
  }

  // Dropdown functionality for mobile
  document.querySelectorAll('.dropbtn').forEach(btn => {
    btn.addEventListener('click', e => {
      if (window.innerWidth <= 600) {
        e.preventDefault();
        const dropdown = btn.parentElement;
        document.querySelectorAll('.dropdown').forEach(d => {
          if (d !== dropdown) d.classList.remove('open');
        });
        dropdown.classList.toggle('open');
      }
    });
  });

  // Close mobile menu when clicking links
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 600 && nav && nav.classList.contains('open')) {
        nav.classList.remove('open');
        overlay.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  });
}

// Export for use in main.js
window.initializeNavigation = initializeNavigation;