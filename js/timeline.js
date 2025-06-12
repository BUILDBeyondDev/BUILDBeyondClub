// Timeline functionality - rewritten for natural page scrolling
function initializeTimeline() {
  const timelineSection = document.querySelector('.timeline-section');
  const timelineProgress = document.querySelector('.timeline-progress');
  const timelineItems = document.querySelectorAll('.timeline-item');
  const timelineMarkers = document.querySelectorAll('.timeline-marker');

  if (!timelineSection || !timelineProgress || !timelineItems.length || !timelineMarkers.length) {
    return; // Exit if timeline elements don't exist on this page
  }

  // Calculate timeline boundaries
  function getTimelineBounds() {
    const sectionRect = timelineSection.getBoundingClientRect();
    const sectionTop = window.pageYOffset + sectionRect.top;
    const sectionBottom = sectionTop + sectionRect.height;
    
    return {
      start: sectionTop + 200, // Start tracking after header
      end: sectionBottom - 400  // End before footer
    };
  }

  // Update timeline based on main window scroll
  function updateTimeline() {
    const scrollTop = window.pageYOffset;
    const bounds = getTimelineBounds();
    
    // Calculate progress through timeline section
    let progress = 0;
    if (scrollTop >= bounds.start && scrollTop <= bounds.end) {
      progress = (scrollTop - bounds.start) / (bounds.end - bounds.start);
    } else if (scrollTop > bounds.end) {
      progress = 1;
    }
    
    // Update progress bar
    const progressPercent = Math.min(progress * 100, 100);
    timelineProgress.style.height = `${progressPercent}%`;

    // Find which timeline item should be active based on scroll position
    let activeIndex = 0;
    let minDistance = Infinity;

    timelineItems.forEach((item, index) => {
      const itemRect = item.getBoundingClientRect();
      const itemCenter = itemRect.top + itemRect.height / 2;
      const windowCenter = window.innerHeight / 2;
      const distance = Math.abs(windowCenter - itemCenter);

      if (distance < minDistance && itemRect.top < window.innerHeight && itemRect.bottom > 0) {
        minDistance = distance;
        activeIndex = index;
      }
    });

    // Update active states
    timelineItems.forEach((item, index) => {
      item.classList.toggle('active', index === activeIndex);
    });

    timelineMarkers.forEach((marker, index) => {
      marker.classList.toggle('active', index === activeIndex);
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
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });

  // Listen for scroll events on the main window
  let ticking = false;
  
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateTimeline);
      ticking = true;
    }
  });

  // Initial update
  updateTimeline();

  // Handle window resize
  window.addEventListener('resize', updateTimeline);
}

// Export for use in main.js
window.initializeTimeline = initializeTimeline;