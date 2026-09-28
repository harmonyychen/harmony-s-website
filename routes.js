// Directory entry points let clean URLs load on static hosts such as GitHub Pages.
// Normalize the visible URL while preserving query strings and anchors.
(() => {
  if (!/^https?:$/.test(window.location.protocol)) return;
  const aliases = {
    "/": "/home",
    "/index.html": "/home",
    "/about.html": "/about",
    "/art.html": "/art",
    "/resume.html": "/resume",
  };
  const routes = ["home", "projects", "community", "case-study", "graphics", "about", "art", "resume"];
  const pathname = window.location.pathname;
  const normalized = pathname.replace(/\/index\.html$/, "").replace(/\/$/, "");
  const destination = aliases[pathname] || (routes.includes(normalized.slice(1)) ? normalized : pathname);
  if (destination !== pathname) {
    window.history.replaceState(window.history.state, "", destination + window.location.search + window.location.hash);
  }
})();
