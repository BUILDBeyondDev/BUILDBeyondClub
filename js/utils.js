// HTML Include functionality
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

// Export for use in other modules
window.includeHTML = includeHTML;