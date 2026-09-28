// Freeze the site root before changing the address. Relative assets then work
// on a custom domain, a project subdirectory, and when opened as local files.
(() => {
  const base = document.querySelector("base");
  const root = new URL(base.getAttribute("href"), window.location.href);
  base.href = root.href;
  const isHTTP = /^https?:$/.test(root.protocol);
  const routes = ["home", "projects", "community", "case-study", "graphics", "about", "art", "resume"];

  function currentRoute() {
    const relative = window.location.pathname.slice(root.pathname.length);
    const route = relative.replace(/\/index\.html$/, "").replace(/\/$/, "").replace(/\.html$/, "");
    return routes.includes(route) ? route : "home";
  }

  function url(route) {
    return new URL(isHTTP ? route : `${route}/index.html`, root).href;
  }

  window.siteRoutes = { currentRoute, url, isHTTP };
  if (isHTTP) {
    const destination = url(currentRoute()) + window.location.search + window.location.hash;
    if (destination !== window.location.href) {
      window.history.replaceState(window.history.state, "", destination);
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("a[data-route]").forEach((link) => {
      link.href = url(link.dataset.route);
    });
  });
})();
