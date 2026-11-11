# Lulu & Lumei's Little Tangerine Quest

A zero-build static frontend apology website built with HTML5, CSS3, ES6 JavaScript, bespoke Lulu & Lumei SVGs, and bundled keepsake photos.

## Local Preview

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

## Push to GitHub (`drdisprespect`)

To keep this private from anyone browsing your profile or team:

1. Create a **Private** repository on GitHub under `https://github.com/drdisprespect` (e.g. `reef-quest` or `hangyodon-for-ashley`, **without** initializing a README/license).
2. Copy this folder to your personal computer and run:

```bash
git remote add origin https://github.com/drdisprespect/<your-repo-name>.git
git branch -M main
git push -u origin main
```

## Deploy to Render ($0 Free Static Site)

Render Static Sites are free and support **private** GitHub repositories:

1. Log into [Render](https://dashboard.render.com/) and click **New +** -> **Static Site** (or **Blueprint** to auto-read `render.yaml`).
2. Connect your GitHub account (`drdisprespect`) and select your private repository.
3. Configure:
   - **Branch**: `main`
   - **Build Command**: *(leave blank)*
   - **Publish Directory**: `.`
4. Click **Create Static Site**. Render will give you a live `https://<site-name>.onrender.com` URL in ~30 seconds.
