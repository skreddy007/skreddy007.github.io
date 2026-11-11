# Saikiran Reddy Ramacharla

Portfolio site for Saikiran Reddy Ramacharla, published at [skreddy007.github.io](https://skreddy007.github.io/).

The site is an Astro project in `astro/`. Page copy lives in content collections under `astro/src/content/`:

- `experience/`
- `projects/`
- `certifications/`
- `education/`
- `skills/`
- `site/config.json` for the hero, about section, contact details, social links, and resume link

Schemas are in `astro/src/content.config.ts`. Images, the logo, and favicons are in `astro/public/assets/` and keep the public paths `/assets/images/...` and `/assets/logo/...`.

## Run and build

From `astro/`:

```sh
npm install
npm run dev
npm run build
npm run preview
```

`npm run dev` serves the site locally. `npm run build` writes the static site to `astro/dist`. `npm run preview` serves that build.

## Deploy

Pushes to `main` run **Deploy GitHub Pages**. That workflow builds `astro/` and publishes `astro/dist`. GitHub Pages is set to deploy from GitHub Actions.
