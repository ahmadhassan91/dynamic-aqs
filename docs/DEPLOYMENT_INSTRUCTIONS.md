# Deployment Instructions for Dynamic AQS CRM

## ⚠️ Important: Why You Can't Just Upload a Folder

This Next.js application **cannot be deployed by simply uploading the `.next` or `out` folder** because:

1. **Dynamic Routes**: The app uses dynamic routes like `/customers/[id]` that require server-side rendering
2. **API Routes**: Backend API endpoints need a Node.js server
3. **Database Connections**: Requires environment variables and database access
4. **Server Components**: Uses Next.js server components and middleware

## ✅ Proper Deployment Methods

### Method 1: Deploy via Netlify CLI (Recommended)

This is the easiest way to deploy properly:

```bash
# 1. Install Netlify CLI globally
npm install -g netlify-cli

# 2. Login to Netlify
netlify login

# 3. Initialize the site (first time only)
netlify init

# 4. Deploy to production
netlify deploy --prod
```

The CLI will:
- Automatically run `npm run build`
- Upload all necessary files
- Configure the Next.js runtime
- Set up redirects and functions

### Method 2: Deploy via GitHub/GitLab Integration (Best Practice)

**This is the BEST way for production apps:**

1. **Push your code to GitHub/GitLab:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Connect to Netlify:**
   - Go to https://app.netlify.com
   - Click "Add new site" → "Import an existing project"
   - Choose GitHub/GitLab
   - Select your repository
   - Netlify will auto-detect Next.js settings

3. **Configure Environment Variables:**
   - In Netlify dashboard: Site Settings → Environment Variables
   - Add all variables from `.env.example`:
     ```
     DATABASE_URL=your_database_url
     NEXTAUTH_URL=https://your-site.netlify.app
     NEXTAUTH_SECRET=generate_a_secret
     ```

4. **Deploy:**
   - Every `git push` will automatically deploy!

### Method 3: Manual Drag & Drop (Limited - For Static Sites Only)

**⚠️ This WILL NOT work for this app** because:
- No support for dynamic routes
- No server-side rendering
- No API routes
- No database connections

## 🔧 Pre-Deployment Checklist

Before deploying, ensure:

- [ ] All TypeScript errors are fixed: `npm run build`
- [ ] Tests pass: `npm test`
- [ ] Environment variables are documented in `.env.example`
- [ ] Database is accessible from Netlify (use hosted DB like Supabase/Railway)
- [ ] `.gitignore` excludes `.env.local` and sensitive files
- [ ] `_redirects` file exists in `public/` folder

## 📦 What Gets Deployed

When using Netlify CLI or GitHub integration:

```
Your Project
├── .next/              ← Build output (auto-generated)
├── public/            ← Static files
├── netlify.toml       ← Netlify configuration
├── package.json       ← Dependencies
└── All source files   ← Needed for builds
```

## 🎯 Quick Deploy Command

For fastest deployment via CLI:

```bash
# Run this single command (after installing netlify-cli)
netlify deploy --prod --build
```

This will:
1. Build your app (`npm run build`)
2. Upload everything to Netlify
3. Deploy to production
4. Give you a live URL

## 🔗 Post-Deployment

After deployment:

1. **Check the deployment URL** provided by Netlify
2. **Test all features** on the live site
3. **Configure custom domain** (optional) in Netlify dashboard
4. **Set up monitoring** and error tracking
5. **Enable HTTPS** (auto-enabled by Netlify)

## 📱 Environment Variables Needed

Copy these from `.env.example` to Netlify:

```bash
DATABASE_URL="your_production_database_url"
NEXTAUTH_URL="https://your-site.netlify.app"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXT_PUBLIC_APP_URL="https://your-site.netlify.app"
NEXT_PUBLIC_API_URL="https://your-site.netlify.app/api"
```

## 🆘 Troubleshooting

**Build fails with "Page is missing generateStaticParams":**
- This app uses dynamic routes and requires server-side rendering
- Don't use `output: 'export'` in `next.config.ts`

**"Can't connect to database":**
- Ensure DATABASE_URL is set in Netlify environment variables
- Use a hosted database (not localhost)

**"404 on page refresh":**
- Check `_redirects` file exists in `public/`
- Ensure `netlify.toml` has proper redirect rules

## 💡 Recommended Hosting for Database

Since this is a full-stack app, you'll also need:

- **Database**: [Supabase](https://supabase.com) (Free tier) or [Railway](https://railway.app)
- **File Storage**: Netlify Blobs or AWS S3
- **Email**: SendGrid or AWS SES

---

## 🚀 TL;DR - Fastest Deployment

```bash
# Install CLI
npm install -g netlify-cli

# Deploy
netlify login
netlify deploy --prod --build
```

That's it! 🎉
