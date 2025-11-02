# Supabase Setup Guide for CustodyX.AI

This guide will help you set up Supabase as the backend for CustodyX.AI, enabling user authentication, data storage, and subscription management.

## Prerequisites

1. Node.js installed
2. A Supabase account (free at https://supabase.com)
3. Supabase CLI installed: `npm install -g supabase`

## Step 1: Create a Supabase Project

1. Go to https://supabase.com and sign up/login
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - Name: `custodyxai-production` (or your preferred name)
   - Database Password: Generate a secure password and save it
   - Region: Choose closest to your users
5. Click "Create new project"
6. Wait for the project to be ready (2-3 minutes)

## Step 2: Get Your Project Credentials

1. In your Supabase project dashboard, go to Settings → API
2. Copy the following values:
   - Project URL
   - Project API Keys → `anon` `public` key
   - Project API Keys → `service_role` `secret` key (keep this secure!)

## Step 3: Configure Environment Variables

Update your `.env.local` file with your Supabase credentials:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Optional: Service role key for server-side operations
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

## Step 4: Initialize Supabase Locally (Optional for Development)

```bash
# In your project directory
supabase init
supabase start
```

## Step 5: Run Database Migrations

### Option A: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `supabase/migrations/20241102000001_initial_schema.sql`
4. Click "Run" to execute the migration

### Option B: Using Supabase CLI

```bash
# Link your local project to Supabase
supabase link --project-ref your-project-ref

# Push migrations to Supabase
supabase db push
```

## Step 6: Configure Authentication

1. In Supabase Dashboard, go to Authentication → Settings
2. Configure Site URL: `http://localhost:3000` (for development)
3. Add production URL to "Additional Redirect URLs": `https://yourdomain.com`
4. Configure email templates if needed (optional)

## Step 7: Set Up Row Level Security

The migration script automatically sets up RLS policies, but verify:

1. Go to Authentication → Policies
2. Ensure all tables have policies enabled
3. Verify users can only access their own data

## Step 8: Test the Setup

1. Start your development server: `npm run dev`
2. Try creating an account
3. Verify data is being stored in Supabase (check Tables in dashboard)

## Step 9: Configure Stripe (For Payments)

1. Get your Stripe keys from https://dashboard.stripe.com/apikeys
2. Add to `.env.local`:
```bash
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_STRIPE_PLUS_PRICE_ID=price_...
VITE_STRIPE_PRO_PRICE_ID=price_...
```

## Production Deployment

### Environment Variables for Production:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_STRIPE_PUBLISHABLE_KEY`
- `VITE_STRIPE_PLUS_PRICE_ID`
- `VITE_STRIPE_PRO_PRICE_ID`

### Security Checklist:
- ✅ RLS enabled on all tables
- ✅ API keys properly configured
- ✅ Production URLs added to auth settings
- ✅ Service role key kept secure (server-side only)

## Common Issues

### "Invalid API key" error
- Check that environment variables are correctly set
- Ensure you're using the `anon` key for client-side code

### "Row Level Security" errors
- Verify RLS policies are properly set up
- Check that user is authenticated before accessing data

### Migration errors
- Ensure you have proper permissions
- Check for syntax errors in SQL
- Try running migrations one at a time

## Database Schema Overview

The setup creates these tables:
- `users` - User profiles and preferences
- `subscriptions` - Subscription tier and billing info  
- `reports` - Incident reports
- `documents` - File storage with metadata
- `incident_templates` - Reusable incident templates
- `token_usage` - AI token usage tracking

## Next Steps

1. Set up Stripe webhooks for subscription management
2. Configure email notifications
3. Set up backup and monitoring
4. Consider setting up Edge Functions for complex business logic

## Support

If you run into issues:
1. Check the Supabase documentation: https://supabase.com/docs
2. Review the Supabase Discord community
3. Check the project's GitHub issues