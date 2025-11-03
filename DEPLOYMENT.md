# Deployment Guide

## GitHub Pages Deployment

This project is configured to deploy to GitHub Pages with the following setup:

### Configuration

- **Base Path**: `/workpath` (production only)
- **Output**: Static export
- **Build Directory**: `out/`

### How It Works

#### Development (Local)

- Access at: `http://localhost:3000/`
- No base path prefix
- Run: `npm run dev`

#### Production (GitHub Pages)

- Access at: `https://[username].github.io/workpath/`
- Base path: `/workpath`
- Build: `npm run build`

### Automatic Deployment

The project uses GitHub Actions to automatically deploy on push to `main` branch:

1. **Build**: Runs `npm run build` which:
   - Builds Next.js with `basePath: "/workpath"`
   - Generates static files in `out/` directory
   - Updates `manifest.json` with correct paths

2. **Deploy**: Uploads `out/` directory to GitHub Pages

### Manual Deployment

To manually deploy:

```bash
# Build for production
NODE_ENV=production npm run build

# The out/ directory is ready to deploy
# GitHub Actions will handle the deployment automatically
```

### Configuration Files

- **next.config.ts**: Sets `basePath` based on environment
- **scripts/update-manifest.js**: Updates manifest.json paths after build
- **.github/workflows/deploy.yml**: GitHub Actions workflow

### Verifying Deployment

After deployment, verify:

1. Visit: `https://[username].github.io/workpath/`
2. Check that all pages load correctly
3. Verify PWA manifest loads: `https://[username].github.io/workpath/manifest.json`
4. Test offline functionality

### Troubleshooting

**404 Errors in Development**

- Make sure you're accessing `http://localhost:3000/` (no `/workpath` prefix)
- Restart dev server: `npm run dev`

**404 Errors in Production**

- Verify GitHub Pages is enabled in repository settings
- Check that source is set to "GitHub Actions"
- Verify deployment workflow completed successfully

**PWA Not Working**

- Check manifest.json has correct paths with `/workpath` prefix
- Verify service worker is registered
- Check browser console for errors

### Environment Variables

The basePath is determined by `NODE_ENV`:

- `development`: No base path
- `production`: `/workpath` base path

This is configured in `next.config.ts` and `src/app/layout.tsx`.
