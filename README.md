<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# CustodyX.AI - AI-Powered Custody Documentation Platform

This contains everything you need to run your CustodyX.AI app locally and deploy it to production.

View your app in AI Studio: https://ai.studio/apps/drive/1D26HOGc1ggl-_57RTG5OxkHOHqSrvbTb

## Run Locally

**Prerequisites:** Node.js 18+

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Then fill in your actual values in `.env`

3. Run the app:
   ```bash
   npm run dev
   ```

## Deploy to Netlify

This app is optimized for Netlify deployment with:
- ✅ Automatic builds from GitHub
- ✅ SPA routing support 
- ✅ Environment variable management
- ✅ Production optimizations
- ✅ Security headers

### Quick Deploy

1. **Automated Setup** (Windows):
   ```bash
   setup-netlify.bat
   ```
   
   **Automated Setup** (macOS/Linux):
   ```bash
   ./setup-netlify.sh
   ```

2. **Manual Deploy**: See [NETLIFY_DEPLOYMENT.md](NETLIFY_DEPLOYMENT.md) for detailed instructions

### Required Environment Variables

Set these in your Netlify dashboard:
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key  
- `GEMINI_API_KEY` - Your Google Gemini AI API key
- `API_KEY` - Same as GEMINI_API_KEY
