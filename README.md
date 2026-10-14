# Skevia

Public marketing website for Skevia, ANVIL, and AVE. The site is static HTML,
CSS, JavaScript, and brand artwork; it does not contain an application backend.

## Repository layout

The repository follows Anvil and AVE's separation of product code, shared
assets, documentation, and development workflows:

```text
skeviaweb/
├── Website/                # Stylesheets and browser scripts
├── Assets/
│   ├── Icons/              # Favicons and touch icon
│   └── Logos/              # Skevia mark and brand artwork
├── Documentation/         # Project reports and reference material
├── Rules & Workflows/     # Local commands and CI implementation
├── .github/workflows/     # GitHub Actions entry points
├── .gitignore             # Repository-wide ignore rules
├── CNAME                  # GitHub Pages custom domain
├── index.html             # Homepage served from the repository root
└── README.md
```

`index.html` and `CNAME` remain at the root for the existing GitHub Pages
publishing layout. GitHub Actions entry points and `.gitignore` stay in their
required locations; workflow implementation lives in `Rules & Workflows/`.
Use descriptive snake_case names for new project files, while preserving
platform filenames and the shared top-level directory names.

## Run locally

From the repository root:

```bash
make -f "Rules & Workflows/Makefile" serve
```

Open [http://localhost:8080](http://localhost:8080). Override the port with
`PORT=8081` if needed. Only Python 3 is required to serve the site; without
Make, run `python3 -m http.server 8080 --bind 127.0.0.1` from the repository root.
No compilation or package installation is needed.

## Publish

The site is hosted with GitHub Pages using the repository root. `CNAME` contains
the intentionally public custom domain. All tracked files and their Git history are publicly accessible;
keep credentials, private configuration, customer data, and internal notes out
of this repository. Browser code cannot keep a credential secret.

The secret-scan workflow checks the complete fetched history on pushes and pull
requests. `.gitignore` excludes common local credential files, but ignored files
can still be force-added, and ignore rules do not remove previously tracked data.

The workflow calls `Rules & Workflows/secret_scan.sh`. To run the same scan
locally on Linux x86_64 with Bash, curl, sha256sum, tar, and Git installed:

```bash
make -f "Rules & Workflows/Makefile" secret_scan
```

The script downloads the pinned Gitleaks release into a temporary directory,
verifies its checksum, scans the locally available Git history and working
tree, then removes the temporary files.

See [the security audit](Documentation/security_audit.md) for the reviewed scope
and results.

## Motion

`Website/script.js` handles scroll-driven reveals and `Website/ripple.js`
renders the hero's outward-moving green stripe effect with WebGL. Both respect
reduced-motion preferences; the CSS hero remains visible when WebGL is unavailable.
