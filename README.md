# Skevia

Public marketing website for Skevia, ANVIL, and AVE. The site is static HTML,
CSS, JavaScript, and brand artwork; it does not contain an application backend.

## Run locally

```bash
python3 -m http.server 8080
```

Open [http://localhost:8080](http://localhost:8080).

## Publish

The site is hosted with GitHub Pages. `CNAME` contains the intentionally public
custom domain. All tracked files and their Git history are publicly accessible;
keep credentials, private configuration, customer data, and internal notes out
of this repository. Browser code cannot keep a credential secret.

The secret-scan workflow checks the complete fetched history on pushes and pull
requests. `.gitignore` excludes common local credential files, but ignored files
can still be force-added, and ignore rules do not remove previously tracked data.

See [the security audit](docs/security-audit.md) for the reviewed scope and results.

## Motion

`script.js` handles scroll-driven reveals and `ripple.js` renders the hero's
outward-moving green stripe effect with WebGL. Both respect reduced-motion
preferences; the CSS hero remains visible when WebGL is unavailable.
