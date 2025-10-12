# Deployment Guide - Vercel

This guide will help you deploy the Daily Task app to Vercel in just a few minutes.

## Prerequisites

- A GitHub account (recommended) or Git installed locally
- A Vercel account (free tier is perfect for this app)

## Option 1: Deploy via GitHub (Recommended)

### Step 1: Push to GitHub

1. **Create a new repository on GitHub**:
   - Go to https://github.com/new
   - Name it `daily-task` (or whatever you prefer)
   - Keep it public or private (your choice)
   - Don't initialize with README (we already have one)
   - Click "Create repository"

2. **Push your code to GitHub**:
   ```bash
   # Add the remote (replace with your GitHub username)
   git remote add origin https://github.com/YOUR_USERNAME/daily-task.git

   # Push to GitHub
   git branch -M main
   git push -u origin main
   ```

### Step 2: Deploy on Vercel

1. **Go to Vercel**:
   - Visit https://vercel.com
   - Click "Sign Up" or "Log In"
   - Sign in with your GitHub account

2. **Import your project**:
   - Click "Add New..." → "Project"
   - Select "Import Git Repository"
   - Find your `daily-task` repository
   - Click "Import"

3. **Configure the project**:
   - **Framework Preset**: Vite (should auto-detect)
   - **Root Directory**: `app` (⚠️ IMPORTANT - click "Edit" and set this)
   - **Build Command**: `npm run build` (should auto-fill)
   - **Output Directory**: `dist` (should auto-fill)
   - **Install Command**: `npm install` (should auto-fill)

4. **Deploy**:
   - Click "Deploy"
   - Wait 1-2 minutes for the build to complete
   - 🎉 Your app is live!

5. **Get your URL**:
   - You'll get a URL like: `https://daily-task-abc123.vercel.app`
   - You can customize this in Project Settings → Domains

### Step 3: Set up Automatic Deployments

✅ Already done! Any time you push to GitHub, Vercel will automatically rebuild and deploy.

**To make changes:**
```bash
# Make your changes
git add .
git commit -m "Your update message"
git push

# Vercel will automatically deploy the changes!
```

---

## Option 2: Deploy via Vercel CLI (Alternative)

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

Follow the prompts to authenticate.

### Step 3: Deploy

```bash
# Navigate to the app directory
cd app

# Deploy to Vercel
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Choose your account
# - Link to existing project? No
# - Project name? daily-task (or your choice)
# - Directory? ./ (current directory)
# - Override settings? No
```

### Step 4: Deploy to Production

After the preview deployment succeeds:

```bash
vercel --prod
```

Your app is now live! 🎉

---

## Option 3: Drag & Drop (Easiest but Manual)

### Step 1: Build the app

```bash
cd app
npm run build
```

### Step 2: Deploy to Vercel

1. Go to https://vercel.com
2. Log in
3. Click "Add New..." → "Project"
4. Drag and drop the `app/dist` folder onto the upload area
5. Click "Deploy"

⚠️ **Note**: This method requires manual rebuilds and uploads for each update.

---

## Post-Deployment Checklist

After deployment, test these features:

- ✅ App loads at your Vercel URL
- ✅ Can add tasks
- ✅ Can complete tasks
- ✅ Can postpone tasks
- ✅ Can view all tasks
- ✅ PWA install prompt works
- ✅ Offline functionality works (Service Worker)
- ✅ Data persists in IndexedDB

---

## Custom Domain (Optional)

To use your own domain:

1. Go to your Vercel project dashboard
2. Click "Settings" → "Domains"
3. Add your domain (e.g., `dailytask.com`)
4. Follow DNS configuration instructions
5. Wait for DNS propagation (can take up to 48 hours)

---

## Environment Variables

This app doesn't need any environment variables since it's 100% client-side and local-first!

---

## Troubleshooting

### Build fails on Vercel

**Issue**: Build command not found
- **Solution**: Make sure Root Directory is set to `app`

**Issue**: Module not found errors
- **Solution**: Clear build cache in Vercel settings and redeploy

### App loads but pages are 404

**Issue**: Direct URLs don't work
- **Solution**: The `vercel.json` file handles SPA routing, make sure it's in the `app` folder

### PWA doesn't work

**Issue**: Service worker not registering
- **Solution**: PWAs require HTTPS. Vercel provides this automatically.

### App is slow

**Issue**: Large bundle size
- **Solution**: The app is already optimized (114KB gzipped). If needed, you can:
  - Enable compression in Vercel (automatic)
  - Add caching headers (already configured via PWA)

---

## Performance Tips

Vercel automatically provides:
- ✅ CDN distribution (global edge network)
- ✅ HTTPS/SSL
- ✅ Automatic compression (Brotli/Gzip)
- ✅ HTTP/2 support
- ✅ Smart caching headers

Your app should load in < 1 second globally!

---

## Monitoring

View your deployment analytics:
1. Go to your Vercel dashboard
2. Click on your project
3. View:
   - Deployment history
   - Build logs
   - Runtime logs (none for this static app)
   - Analytics (on paid plans)

---

## Updating the App

### Via GitHub (if using Option 1):
```bash
# Make changes to your code
git add .
git commit -m "Update: description of changes"
git push

# Vercel automatically deploys!
```

### Via CLI (if using Option 2):
```bash
cd app
npm run build
vercel --prod
```

### Via Drag & Drop (if using Option 3):
```bash
cd app
npm run build
# Then drag & drop the dist folder to Vercel
```

---

## Cost

**Free tier includes:**
- Unlimited deployments
- Automatic HTTPS
- Global CDN
- 100GB bandwidth/month
- Perfect for personal projects!

For this app, you'll likely never need to upgrade.

---

## Next Steps

After deployment:

1. **Share your app**: Copy the Vercel URL and share it!
2. **Install as PWA**: Visit on mobile and "Add to Home Screen"
3. **Test offline**: Turn off WiFi and see it still works
4. **Monitor usage**: Check Vercel dashboard for traffic
5. **Iterate**: Make improvements and push updates

---

## Support

- **Vercel Docs**: https://vercel.com/docs
- **Vercel Community**: https://github.com/vercel/vercel/discussions
- **This Project**: Open an issue in your GitHub repo

---

Congratulations! Your Daily Task app is now live on the internet! 🚀🎉
