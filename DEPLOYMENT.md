# Deployment Guide

## Deploy to Vercel (Recommended)

### First Time Setup

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy from project root**
   ```bash
   cd D:\Azmara\mui-carousel
   vercel
   ```

3. **Follow the prompts:**
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N**
   - What's your project's name? **mui-carousel** (or custom name)
   - In which directory is your code located? **./** (press Enter)
   - Want to override settings? **N**

4. **Production Deployment**
   ```bash
   vercel --prod
   ```

### Custom Domain Setup

After first deployment, add custom domain:

```bash
vercel domains add coderchef26.dev
```

Or configure in Vercel dashboard:
1. Go to project settings
2. Domains section
3. Add `coderchef26.dev` or subdomain `demo.coderchef26.dev`

### Automatic Deployments

Once linked, every `git push` to main will automatically deploy to Vercel.

## Configuration Files

- **vercel.json** - Vercel deployment configuration
- **.vercelignore** - Files to exclude from deployment

## Demo URL

After deployment, your demo will be available at:
- Vercel URL: `https://mui-carousel-<hash>.vercel.app`
- Custom domain: `https://www.muicarousel.azmara.io` (after domain setup)

## Deploy to GitHub Pages (Alternative)

If you prefer GitHub Pages:

1. **Install gh-pages**
   ```bash
   npm install gh-pages --save-dev
   ```

2. **Add deploy script to demo/package.json**
   ```json
   "scripts": {
     "deploy": "npm run build && gh-pages -d dist"
   }
   ```

3. **Deploy**
   ```bash
   cd demo
   npm run deploy
   ```

4. **Enable GitHub Pages**
   - Go to repository Settings > Pages
   - Source: Deploy from branch `gh-pages`
   - Save

Demo will be at: `https://coderchef26.github.io/mui-carousel/`
