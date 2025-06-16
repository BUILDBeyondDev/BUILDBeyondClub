// Timeline functionality - now with Google Sheets integration
function initializeTimeline() {
  const timelineSection = document.querySelector('.timeline-section');
  let timelineProgress = document.querySelector('.timeline-progress');
  let timelineItems = [];
  let timelineMarkers = [];

  if (!timelineSection) {
    return; // Exit if timeline section doesn't exist on this page
  }

  // Google Sheets configuration
  const SHEET_ID = 'YOUR_GOOGLE_SHEET_ID'; // Replace with your actual sheet ID from the URL
  
  // Use CSV export (no API key needed)
  const SHEET_CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=0`;

  // Function to fetch and parse timeline data
  async function loadTimelineData() {
    try {
      // Using CSV export method (simpler, no API key needed)
      const response = await fetch(SHEET_CSV_URL);
      const csvText = await response.text();
      
      // Parse CSV data
      const lines = csvText.split('\n');
      const headers = lines[0].split(',');
      const timelineData = [];

      // Skip header row, process data rows
      for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim()) {
          const values = parseCSVLine(lines[i]);
          
          const item = {
            yearId: values[0],
            displayDate: values[1],
            eventType: values[2],
            title: values[3],
            description: values[4],
            images: [
              values[5], // Image1_ID
              values[6], // Image2_ID  
              values[7], // Image3_ID
              values[8]  // Image4_ID
            ].filter(img => img && img.trim()) // Remove empty images
          };
          
          timelineData.push(item);
        }
      }

      return timelineData;
    } catch (error) {
      console.error('Error loading timeline data:', error);
      return [];
    }
  }

  // Helper function to parse CSV line (handles commas within quoted fields)
  function parseCSVLine(line) {
    const values = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    values.push(current.trim());
    return values;
  }

  // Function to create timeline HTML from data
  function createTimelineHTML(timelineData) {
    // Create sidebar if it doesn't exist
    let sidebar = document.querySelector('.timeline-sidebar');
    if (!sidebar) {
      sidebar = document.createElement('div');
      sidebar.className = 'timeline-sidebar';
      sidebar.innerHTML = `
        <div class="timeline-track">
          <div class="timeline-progress"></div>
          <div class="timeline-markers"></div>
        </div>
      `;
      timelineSection.appendChild(sidebar);
    }

    // Create content area if it doesn't exist
    let content = document.querySelector('.timeline-content');
    if (!content) {
      content = document.createElement('div');
      content.className = 'timeline-content';
      timelineSection.appendChild(content);
    }

    // Clear existing content
    const markersContainer = sidebar.querySelector('.timeline-markers');
    markersContainer.innerHTML = '';
    content.innerHTML = '';

    // Generate timeline items and markers
    timelineData.forEach((item, index) => {
      // Calculate position for markers (distribute evenly)
      const markerPosition = 10 + (index * 75 / Math.max(timelineData.length - 1, 1));
      
      // Create marker
      const marker = document.createElement('div');
      marker.className = `timeline-marker ${index === 0 ? 'active' : ''}`;
      marker.dataset.year = item.yearId;
      marker.style.top = `${markerPosition}%`;
      marker.innerHTML = `<div class="timeline-year">${item.displayDate}</div>`;
      markersContainer.appendChild(marker);

      // Create timeline item
      const timelineItem = document.createElement('div');
      timelineItem.className = `timeline-item ${index === 0 ? 'active' : ''}`;
      timelineItem.dataset.year = item.yearId;

      // Create image gallery HTML from iframe embeds
      let imageGalleryHTML = '';
      if (item.images.length > 0) {
        const galleryImages = item.images.map(iframeCode => {
          // Clean up the iframe code and make it gallery-friendly
          if (iframeCode && iframeCode.includes('<iframe')) {
            return iframeCode
              .replace(/width="[^"]*"/g, 'width="100%"')
              .replace(/height="[^"]*"/g, 'height="120"')
              .replace(/<iframe/g, '<iframe class="timeline-gallery-image"');
          }
          return '';
        }).filter(img => img.trim()).join('');

        if (galleryImages) {
          imageGalleryHTML = `
            <div class="timeline-image-gallery">
              ${galleryImages}
            </div>
          `;
        }
      }

      timelineItem.innerHTML = `
        <div class="event-tag">${item.eventType}</div>
        <h3>${item.title}</h3>
        <p>${item.description}</p>
        ${imageGalleryHTML}
      `;

      content.appendChild(timelineItem);
    });

    // Update references to the new elements
    timelineProgress = document.querySelector('.timeline-progress');
    timelineItems = document.querySelectorAll('.timeline-item');
    timelineMarkers = document.querySelectorAll('.timeline-marker');
  }

  // Update timeline based on main window scroll
  function updateTimeline() {
    if (!timelineProgress || !timelineItems.length || !timelineMarkers.length) {
      return; // Exit if timeline elements don't exist
    }

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
  function setupMarkerClicks() {
    if (!timelineMarkers.length || !timelineItems.length) {
      return; // Exit if elements don't exist
    }

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
  }

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

  // Initialize timeline - try Google Sheets first, fallback to static HTML
  async function init() {
    // First check if we should use Google Sheets integration
    if (SHEET_ID && SHEET_ID !== 'YOUR_GOOGLE_SHEET_ID') {
      try {
        const timelineData = await loadTimelineData();
        
        if (timelineData.length > 0) {
          console.log('✅ Loading timeline from Google Sheets');
          createTimelineHTML(timelineData);
          setupInteractivity();
          return;
        }
      } catch (error) {
        console.warn('⚠️ Failed to load from Google Sheets, using static timeline:', error);
      }
    }

    // Fallback to existing static timeline
    console.log('📄 Using static timeline from HTML');
    useStaticTimeline();
  }

  // Function to use the existing static timeline elements
  function useStaticTimeline() {
    timelineProgress = document.querySelector('.timeline-progress');
    timelineItems = document.querySelectorAll('.timeline-item');
    timelineMarkers = document.querySelectorAll('.timeline-marker');

    if (!timelineProgress || !timelineItems.length || !timelineMarkers.length) {
      console.warn('Static timeline elements not found');
      return;
    }

    setupInteractivity();
  }

  // Setup all interactive functionality (works for both dynamic and static)
  function setupInteractivity() {
    setupMarkerClicks();
    
    // Listen for scroll events on the main window
    window.addEventListener('scroll', onScroll, { passive: true });

    // Initial update
    updateTimeline();

    // Handle window resize
    window.addEventListener('resize', () => {
      setTimeout(updateTimeline, 100);
    });
  }

  // Start the initialization
  init();
}

// Export for use in main.js
window.initializeTimeline = initializeTimeline;