# Brhane Teamrat Gidey - Portfolio

Static GitHub Pages portfolio focused on PhD applications in AI for Software Engineering.

## Main updates

- Hero copy is PhD-focused, based on the uploaded CV.
- Visiting-scholar / research collaboration date is written as `2026` only.
- The profile photo is embedded directly in `index.html` as a data URI and also kept as static files in `/assets`.
- No fallback initials card and no profile-image JavaScript fallback.
- Big Data and distributed-data topics are listed only as supporting skills in the Skills section.
- Certifications are from the CV: Deep Learning, NLP, and MLOps specializations by deeplearning.ai/Coursera.
- Root-level favicons are included for browser tabs.

## Deploy

Push the repository root to GitHub Pages:

```bash
git add .
git commit -m "Update PhD-focused portfolio copy and hero image layout"
git push origin main
```

The included `.github/workflows/pages.yml` deploys the root folder using GitHub Actions.
