# Clean URLs

The site supports `/home`, `/projects`, `/community`, `/case-study`, `/graphics`,
`/about`, `/art`, and `/resume`. The portfolio tabs are links and support direct
visits, refreshes, opening in another tab, and browser Back/Forward navigation.
Existing root and `.html` addresses still work and display the clean address.

Each route has a generated `index.html` so GitHub Pages (and other static hosts)
can serve it without custom rewrites or a JavaScript 404 fallback. Hosts may
redirect to a trailing slash; `routes.js` normalizes the address in the browser.
The root base URL keeps images, scripts, and styles working on every route.

Edit the root HTML files, then run `python3 build_routes.py` and include the
generated directories in the deployment. CSS and JavaScript remain shared and
do not require regeneration. Deploy the repository at the domain root as before.
