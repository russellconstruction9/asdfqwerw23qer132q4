# CustodyX.AI - Netlify Deployment Guide

This guide will help you deploy your CustodyX.AI application to Netlify.

## Prerequisites

- GitHub repository with your code
- Netlify account (free tier available)
- Supabase project setup
- Google Gemini AI API key
- Stripe account (optional, for payments)

## Step 1: Prepare Your Repository

1. **Ensure all files are committed to your GitHub repository**:
   ```bash
   git add .
   git commit -m "Prepare for Netlify deployment"
   git push origin main
   ```

2. **Verify required files are present**:
   - ✅ `netlify.toml` (configuration file)
   - ✅ `public/_redirects` (SPA routing)
   - ✅ `.env.example` (environment template)
   - ✅ Updated `vite.config.ts` (build optimization)

## Step 2: Deploy to Netlify

### Option A: Deploy from GitHub (Recommended)

1. **Connect to Netlify**:
   - Go to [netlify.com](https://netlify.com)
   - Sign up/login with your GitHub account
   - Click "New site from Git"
   - Choose GitHub and authorize Netlify
   - Select your repository

2. **Configure Build Settings**:
   - **Base directory**: Leave empty (root)
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - These should auto-populate from `netlify.toml`

3. **Deploy**:
   - Click "Deploy site"
   - Your site will get a random name like `amazing-hamster-123456.netlify.app`

### Option B: Manual Deploy

1. **Build locally**:
   ```bash
   npm install
   npm run build
   ```

2. **Deploy to Netlify**:
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop your `dist` folder to the deploy area

## Step 3: Configure Environment Variables

1. **Go to Site Settings**:
   - In your Netlify site dashboard
   - Click "Site settings" → "Environment variables"

2. **Add Required Variables**:
   ```
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   GEMINI_API_KEY=your_gemini_api_key_here
   API_KEY=your_gemini_api_key_here
   NODE_ENV=production
   ```

3. **Optional Variables** (if using Stripe):
   ```
   VITE_STRIPE_PUBLISHABLE_KEY=pk_live_or_test_key_here
   STRIPE_SECRET_KEY=sk_live_or_test_key_here
   ```

## Step 4: Get Your API Keys

### Supabase Setup
1. Go to [supabase.com](https://supabase.com)
2. Navigate to your project
3. Go to Settings → API
4. Copy your:
   - **Project URL** (for `VITE_SUPABASE_URL`)
   - **Anon public key** (for `VITE_SUPABASE_ANON_KEY`)

### Google Gemini AI Setup
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create a new API key
3. Copy the key (for both `GEMINI_API_KEY` and `API_KEY`)

### Stripe Setup (Optional)
1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to Developers → API keys
3. Copy your publishable and secret keys

## Step 5: Configure Custom Domain (Optional)

1. **Purchase Domain**: From any domain registrar
2. **Add Domain in Netlify**:
   - Site settings → Domain management
   - Add custom domain
   - Follow DNS configuration instructions

## Step 6: Enable Advanced Features

### Forms (if using contact forms)
- Forms are automatically handled by Netlify
- Add `netlify` attribute to your forms
- Access submissions in Netlify dashboard

### Functions (if needed)
- Create `netlify/functions` directory
- Add serverless functions for backend logic
- They'll auto-deploy with your site

## Step 7: Continuous Deployment

Your site will automatically redeploy when you push to your main branch:

```bash
git add .
git commit -m "Update application"
git push origin main
```

## Troubleshooting

### Build Fails
1. **Check build logs** in Netlify dashboard
2. **Verify environment variables** are set correctly
3. **Test build locally**:
   ```bash
   npm run build
   npm run preview
   ```

### Site Loads but Features Don't Work
1. **Check browser console** for JavaScript errors
2. **Verify API keys** are correct and have proper permissions
3. **Check network tab** for failed API requests

### 404 Errors on Page Reload
- This should be handled by `_redirects` file
- Verify the file exists in `public/_redirects`
- Check `netlify.toml` has the redirect rule

### Environment Variables Not Working
1. **Ensure VITE_ prefix** for client-side variables
2. **Redeploy after** adding environment variables
3. **Check variable names** match exactly

## Performance Optimization

1. **Enable Asset Optimization**:
   - Site settings → Build & deploy → Post processing
   - Enable CSS, JS, and HTML minification

2. **Configure Caching**:
   - Already configured in `netlify.toml`
   - Static assets cached for 1 year
   - Service worker cache handled separately

## Security

1. **HTTPS**: Automatically enabled by Netlify
2. **Security Headers**: Configured in `netlify.toml`
3. **Environment Variables**: Never expose secrets in client code

## Monitoring

1. **Analytics**: Enable Netlify Analytics for traffic insights
2. **Functions**: Monitor function logs and usage
3. **Forms**: Track form submissions and spam

## Support

- **Netlify Docs**: [docs.netlify.com](https://docs.netlify.com)
- **Community**: [community.netlify.com](https://community.netlify.com)
- **Status**: [netlifystatus.com](https://netlifystatus.com)

---

## Quick Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Netlify site created from GitHub repo
- [ ] Environment variables configured
- [ ] Supabase project connected
- [ ] Gemini AI API key added
- [ ] Test deployment works
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active
- [ ] Forms working (if applicable)

Your CustodyX.AI application should now be live on Netlify! 🎉