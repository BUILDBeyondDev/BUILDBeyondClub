document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelectorAll(".carousel-images img");
  const dots = document.querySelectorAll(".carousel-dots .dot");
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

  dots.forEach(dot => {
    dot.addEventListener("click", () => {
      const i = parseInt(dot.getAttribute("data-index"));
      showSlide(i);
    });
  });

  setInterval(nextSlide, 4000);
});

function includeHTML(id, url, callback) {
  const el = document.getElementById(id);
  if (!el) return;

  fetch(url)
    .then(res => {
      if (!res.ok) throw new Error(`Failed to load ${url}`);
      return res.text();
    })
    .then(html => {
      el.innerHTML = html;
      const newEl = el.cloneNode(true);
      el.parentNode.replaceChild(newEl, el);

      if (callback) callback();
    })
    .catch(err => {
      console.error(err);
    });
}

document.addEventListener('DOMContentLoaded', () => {
  includeHTML('nav-placeholder', 'nav.html', () => {
    const toggle = document.getElementById('nav-toggle');
    const nav = document.querySelector('.nav-links');
    const overlay = document.querySelector('.nav-overlay');

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

    // Dropdown button
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

    // Clicking a link closes menu on mobile
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 600 && nav.classList.contains('open')) {
          nav.classList.remove('open');
          overlay.classList.remove('open');
          document.body.style.overflow = '';
        }
      });
    });
  });

  includeHTML('footer-placeholder', 'footer.html');
});


// on DOMContentLoaded, pull in nav & footer
document.addEventListener('DOMContentLoaded', () => {
  includeHTML('nav-placeholder', 'nav.html');
  includeHTML('footer-placeholder', 'footer.html');
});



