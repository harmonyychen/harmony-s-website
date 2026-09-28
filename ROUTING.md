# Clean URLs

The site supports `/home`, `/projects`, `/community`, `/case-study`, `/graphics`,
`/about`, `/art`, and `/resume`. Portfolio tabs support direct visits, refreshes,
opening in another tab, and browser Back/Forward navigation. Existing root and
`.html` addresses still work and display the clean address when served over HTTP.

Each route has a generated `index.html` so static hosts such as GitHub Pages can
serve it without custom rewrites or a JavaScript 404 fallback. Hosts may redirect
to a trailing slash; `routes.js` normalizes the address in the browser.

Root HTML pages use `<base href="./">`; generated route pages use `../`.
Before normalizing the address, `routes.js` freezes that base as an absolute URL
so CSS, JavaScript, images, videos, hover photos, and slides always resolve from
the actual site root. Navigation uses that same root rather than assuming `/`.
This supports custom domains, project subdirectories, and localhost. When opening
HTML directly with `file://`, links use explicit `route/index.html` destinations
and native file navigation instead of HTTP-only clean paths.

Edit the root HTML files, then run `python3 build_routes.py` and include the
regenerated directories in the deployment. CSS and JavaScript remain shared and
do not require regeneration. Run `node tests/check-connections.cjs` to check all
local references, generated-page consistency, route selection, and navigation
across HTTP domain roots, subdirectories, and local files.
