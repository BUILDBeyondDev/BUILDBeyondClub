// Analytics and tracking functionality
function initializeAnalytics() {
  // Track the main "Add to your Google Calendar" button click
  const calendarButton = document.querySelector('.calendar-button');
  if (calendarButton) {
    calendarButton.addEventListener('click', function() {
      if (typeof gtag !== 'undefined') {
        gtag('event', 'calendar_add_click', {
          event_category: 'engagement',
          event_label: 'main_calendar_button',
          value: 1
        });
      }
    });
  }

  // Track any other calendar-related links
  const allCalendarLinks = document.querySelectorAll('a[href*="calendar.google.com"]');
  allCalendarLinks.forEach(function(link, index) {
    link.addEventListener('click', function() {
      if (typeof gtag !== 'undefined') {
        gtag('event', 'calendar_add_click', {
          event_category: 'engagement',
          event_label: `calendar_link_${index}`,
          value: 1
        });
      }
    });
  });

  // Track Join button clicks
  const joinButtons = document.querySelectorAll('.homepage-join-button, .join-link');
  joinButtons.forEach(function(button, index) {
    button.addEventListener('click', function() {
      if (typeof gtag !== 'undefined') {
        gtag('event', 'join_button_click', {
          event_category: 'engagement',
          event_label: `join_button_${index}`,
          value: 1
        });
      }
    });
  });

  // Track RSVP button clicks
  const rsvpButtons = document.querySelectorAll('.rsvp-link, a[href*="rsvp.html"]');
  rsvpButtons.forEach(function(button, index) {
    button.addEventListener('click', function() {
      if (typeof gtag !== 'undefined') {
        gtag('event', 'rsvp_button_click', {
          event_category: 'engagement',
          event_label: `rsvp_button_${index}`,
          value: 1
        });
      }
    });
  });

  // Track external link clicks
  const externalLinks = document.querySelectorAll('a[href^="http"]:not([href*="' + window.location.hostname + '"])');
  externalLinks.forEach(function(link) {
    link.addEventListener('click', function() {
      if (typeof gtag !== 'undefined') {
        gtag('event', 'external_link_click', {
          event_category: 'engagement',
          event_label: this.href,
          value: 1
        });
      }
    });
  });

  // Track scroll depth (how far users scroll)
  let maxScroll = 0;
  let scrollTracked = false;
  
  window.addEventListener('scroll', function() {
    const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
    
    if (scrollPercent > maxScroll) {
      maxScroll = scrollPercent;
    }
    
    // Track when users scroll to 75% of page (indicates engagement)
    if (scrollPercent >= 75 && !scrollTracked) {
      scrollTracked = true;
      if (typeof gtag !== 'undefined') {
        gtag('event', 'scroll_depth', {
          event_category: 'engagement',
          event_label: '75_percent',
          value: 75
        });
      }
    }
  });

  // Track time spent on page (send when user leaves)
  let startTime = Date.now();
  
  window.addEventListener('beforeunload', function() {
    const timeSpent = Math.round((Date.now() - startTime) / 1000); // seconds
    
    if (timeSpent > 10 && typeof gtag !== 'undefined') { // Only track if more than 10 seconds
      gtag('event', 'time_on_page', {
        event_category: 'engagement',
        event_label: 'seconds_spent',
        value: timeSpent
      });
    }
  });
}

// Export for use in main.js
window.initializeAnalytics = initializeAnalytics;