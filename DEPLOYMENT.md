# Deployment Guide

This guide explains how to deploy WorkPath to GitHub Pages using GitHub Actions.

## Prerequisites

- A GitHub account
- Your WorkPath code pushed to a GitHub repository

## Setup Steps

### 1. Configure GitHub Pages

1. Go to your repository on GitHub
2. Click on **Settings** (top menu)
3. In the left sidebar, click on **Pages**
4. Under **Source**, select **GitHub Actions**
5. Save the changes

### 2. Push Your Code

The GitHub Actions workflow is already configured in `.github/workflows/deploy.yml`. Simply push your code to the `main` branch:

```bash
git add .
git commit -m "Deploy to GitHub Pages"
git push origin main
```

### 3. Monitor Deployment

1. Go to the **Actions** tab in your GitHub repository
2. You should see a workflow run called "Deploy to GitHub Pages"
3. Click on it to see the progress
4. Wait for both the "build" and "deploy" jobs to complete (usually 2-3 minutes)

### 4. Access Your App

Once deployment is complete:

1. Go back to **Settings → Pages**
2. You'll see a message: "Your site is live at https://[username].github.io/workpath"
3. Click the link to open your app

## Subdirectory Deployment (Optional)

If your repository name is NOT "workpath", you'll need to update the base path:

1. Open `next.config.ts`
2. Uncomment and modify the `basePath` line:
   ```typescript
   basePath: '/your-repo-name',
   ```
3. Commit and push the changes

## Troubleshooting

### Build Fails

- Check the Actions tab for error messages
- Ensure all dependencies are in `package.json`
- Make sure `npm run build` works locally

### App Doesn't Load

- Check browser console for errors
- Verify the base path is correct (if using subdirectory)
- Clear browser cache and try again

### Service Worker Issues

- Service workers are disabled in development mode
- They only work on HTTPS (GitHub Pages provides this)
- Clear site data in browser DevTools if needed

## Manual Deployment

If you prefer to deploy manually:

```bash
# Build the app
npm run build

# The static files are in the 'out' directory
# Upload these files to any static hosting service
```

## Updating Your App

To update your deployed app:

1. Make your changes locally
2. Test with `npm run dev`
3. Commit and push to the `main` branch
4. GitHub Actions will automatically rebuild and redeploy

## Notes

- The app uses static export, so all data is stored locally in the browser
- No server-side functionality is needed
- The PWA features (offline mode, installability) work on GitHub Pages
- First deployment may take a few minutes to propagate

## Success!

Once deployed, your app will be available at:

- **https://[username].github.io/workpath** (if repo name is "workpath")
- **https://[username].github.io/[repo-name]** (for other repo names)

You can now install it as a PWA on your phone and use it offline!
