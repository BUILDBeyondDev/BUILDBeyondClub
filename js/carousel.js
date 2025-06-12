// Image Carousel functionality
function initializeCarousel() {
  const slides = document.querySelectorAll(".carousel-images img");
  const dots = document.querySelectorAll(".carousel-dots .dot");
  
  if (!slides.length || !dots.length) return; // Exit if no carousel on page
  
  let index = 0;

  function showSlide(i) {
    slides.forEach((slide, idx) => {
      slide.classList.toggle("active", idx === i);
      dots[idx].classList.toggle("active", idx === i);
    });
    index = i;
  }

  function nextSlide() {
    let next = (index + 1) % slides.length;
    showSlide(next);
  }

  // Add click handlers to dots
  dots.forEach(dot => {
    dot.addEventListener("click", () => {
      const i = parseInt(dot.getAttribute("data-index"));
      showSlide(i);
    });
  });

  // Auto-advance slides every 4 seconds
  setInterval(nextSlide, 4000);
}

// Export for use in main.js
window.initializeCarousel = initializeCarousel;