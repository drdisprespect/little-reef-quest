# Lulu & Lumei's Little Tangerine Quest

A zero-build static frontend apology website built with HTML5, CSS3, ES6 JavaScript, bespoke Lulu & Lumei SVGs, and bundled keepsake photos.

## Local Preview

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

## Push to GitHub (`drdisprespect`)

To keep this private from anyone browsing your profile or team:

1. Create a **Private** repository on GitHub under `https://github.com/drdisprespect` (e.g. `tangerine-garden` or `lulu-tangerine-quest`, **without** initializing a README/license).
2. In your local copy of this folder:
   - If copying without `.git`, initialize a repo (`git init`), commit the files, and run `git remote add origin ...`.
   - If this folder already has an `origin` remote, point it to your new private repository with `git remote set-url origin ...`.

```bash
# Fresh folder without .git:
# git init && git add . && git commit -m "Initial commit"
# git remote add origin https://github.com/drdisprespect/<your-repo-name>.git

# Existing git clone with an existing origin:
git remote set-url origin https://github.com/drdisprespect/<your-repo-name>.git
git branch -M main
git push -u origin main
```

## Deploy to Render ($0 Free Static Site)

Render Static Sites are free and support **private** GitHub repositories (`render.yaml` also configures `X-Robots-Tag: noindex, nofollow`):

1. Log into [Render](https://dashboard.render.com/) and click **New +** -> **Static Site** (or **Blueprint** to auto-read `render.yaml`).
2. Connect your GitHub account (`drdisprespect`) and select your private repository.
3. Configure:
   - **Branch**: `main`
   - **Build Command**: *(leave blank)*
   - **Publish Directory**: `.`
4. Click **Create Static Site**. Render will give you a live `https://<site-name>.onrender.com` URL in ~30 seconds.

## Deploy to Vercel

`vercel.json` is included at the repository root and configures `X-Robots-Tag: noindex, nofollow` on all routes (`/(.*)`):

1. Import your private repository in [Vercel](https://vercel.com/new) (or run `vercel --prod` from the project root).
2. Leave **Framework Preset** as **Other** and **Build Command** empty (static files are served directly from `.`).
3. Deploy to receive your live `https://<project>.vercel.app` URL with `noindex, nofollow` headers automatically applied.
