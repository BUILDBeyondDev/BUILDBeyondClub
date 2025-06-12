// Timeline functionality - rewritten for natural page scrolling
function initializeTimeline() {
  const timelineSection = document.querySelector('.timeline-section');
  const timelineProgress = document.querySelector('.timeline-progress');
  const timelineItems = document.querySelectorAll('.timeline-item');
  const timelineMarkers = document.querySelectorAll('.timeline-marker');

  if (!timelineSection || !timelineProgress || !timelineItems.length || !timelineMarkers.length) {
    return; // Exit if timeline elements don't exist on this page
  }

  // Update timeline based on main window scroll
  function updateTimeline() {
    const scrollTop = window.pageYOffset;
    const windowHeight = window.innerHeight;
    
    // Calculate progress through the entire timeline section
    const sectionRect = timelineSection.getBoundingClientRect();
    const sectionTop = scrollTop + sectionRect.top;
    const sectionHeight = sectionRect.height;
    
    // Progress calculation based on how far we've scrolled through the timeline section
    let progress = 0;
    if (scrollTop > sectionTop - windowHeight) {
      progress = Math.min((scrollTop - sectionTop + windowHeight) / sectionHeight, 1);
    }
    
    // Update progress bar height
    const progressPercent = Math.max(0, Math.min(progress * 100, 100));
    timelineProgress.style.height = `${progressPercent}%`;

    // Find which timeline item should be active based on viewport center
    let activeIndex = 0;
    let bestScore = -Infinity;

    timelineItems.forEach((item, index) => {
      const itemRect = item.getBoundingClientRect();
      const itemTop = itemRect.top;
      const itemBottom = itemRect.bottom;
      const itemCenter = itemTop + itemRect.height / 2;
      const windowCenter = windowHeight / 2;
      
      // Item is visible in viewport
      if (itemBottom > 0 && itemTop < windowHeight) {
        // Calculate how close the item center is to window center
        const distanceFromCenter = Math.abs(windowCenter - itemCenter);
        
        // Prefer items that are more centered and more visible
        const visibilityScore = Math.min(
          itemBottom - Math.max(itemTop, 0),
          windowHeight
        ) / windowHeight;
        
        const centerScore = 1 - (distanceFromCenter / windowHeight);
        const totalScore = visibilityScore * 0.7 + centerScore * 0.3;
        
        if (totalScore > bestScore) {
          bestScore = totalScore;
          activeIndex = index;
        }
      }
    });

    // Update active states - remove all active classes first
    timelineItems.forEach((item, index) => {
      if (index === activeIndex) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    timelineMarkers.forEach((marker, index) => {
      if (index === activeIndex) {
        marker.classList.add('active');
      } else {
        marker.classList.remove('active');
      }
    });
  }

  // Handle marker clicks - scroll to corresponding timeline item
  timelineMarkers.forEach((marker, index) => {
    marker.addEventListener('click', () => {
      const targetItem = timelineItems[index];
      if (targetItem) {
        const itemRect = targetItem.getBoundingClientRect();
        const offsetTop = window.pageYOffset + itemRect.top - (window.innerHeight / 2) + (itemRect.height / 2);
        
        window.scrollTo({
          top: Math.max(0, offsetTop),
          behavior: 'smooth'
        });
      }
    });
  });

  // Use throttled scroll listening for better performance
  let ticking = false;
  
  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateTimeline();
        ticking = false;
      });
      ticking = true;
    }
  }

  // Listen for scroll events on the main window
  window.addEventListener('scroll', onScroll, { passive: true });

  // Initial update
  updateTimeline();

  // Handle window resize
  window.addEventListener('resize', () => {
    setTimeout(updateTimeline, 100);
  });
}

// Export for use in main.js
window.initializeTimeline = initializeTimeline;