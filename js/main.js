// Main initialization - coordinates all functionality
document.addEventListener('DOMContentLoaded', () => {
  // Initialize performance optimizations first
  if (typeof window.initializePerformance === 'function') {
    window.initializePerformance();
  }

  // Initialize carousel (only runs if carousel exists on page)
  if (typeof window.initializeCarousel === 'function') {
    window.initializeCarousel();
  }

  // Initialize navigation (nav is now included by Jekyll)
  if (typeof window.initializeNavigation === 'function') {
    window.initializeNavigation();
  }

  // Initialize timeline (only runs if timeline exists on page)
  if (document.querySelector('.timeline-container')) {
    if (typeof window.initializeTimeline === 'function') {
      window.initializeTimeline();
    }
  }

  // Initialize analytics tracking
  if (typeof window.initializeAnalytics === 'function') {
    window.initializeAnalytics();
  }
});