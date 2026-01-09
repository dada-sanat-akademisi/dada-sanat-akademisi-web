# Hostinger Deployment Guide
## Production Deployment for Dada Sanat Akademisi

> **Domain**: dadasanatakademisi.com  
> **Hosting**: Hostinger (Linux-based, Node.js)  
> **Framework**: Next.js 14+ (App Router)

---

## 📋 Pre-Deployment Checklist

### 1. Local Testing

Before deploying, verify everything works locally:

```bash
# Install dependencies
npm ci

# Build production bundle
npm run build

# Test production build locally
npm start

# Verify site loads
# Open http://localhost:3000
```

**Check**:
- [ ] Build completes without errors
- [ ] Site loads correctly
- [ ] Sanity CMS connection works (if configured)
- [ ] Images load (Sanity CDN)
- [ ] No console errors

### 2. Environment Variables

**Required Variables** (see `.env.production.example`):

```bash
# Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_api_token

# Next.js
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://dadasanatakademisi.com
```

**How to Get Sanity Credentials**:
1. Go to https://www.sanity.io/manage
2. Select your project
3. Copy Project ID → `NEXT_PUBLIC_SANITY_PROJECT_ID`
4. Copy Dataset name → `NEXT_PUBLIC_SANITY_DATASET`
5. Create API token → `SANITY_API_TOKEN`

**Security**:
- ✅ Never commit `.env.production` to Git
- ✅ Use Hostinger's environment variable management
- ✅ Rotate tokens regularly

### 3. Node.js Version

**Required**: Node.js 18.x LTS or 20.x LTS

**Check Version**:
```bash
node --version
```

**Update if Needed**:
- Via Hostinger control panel (recommended)
- Or use Node Version Manager (nvm) if you have shell access

**Why This Version**:
- Next.js 14+ requires Node 18+
- LTS versions have long-term support
- Better performance and security

---

## 🚀 Deployment Steps

### Option 1: Manual Deployment (Shared Hosting)

**Step 1: Upload Files**

1. Connect via FTP/SFTP (use Hostinger File Manager or FileZilla)
2. Upload project files to your domain directory (usually `public_html` or `domains/dadasanatakademisi.com/public_html`)

**Step 2: Install Dependencies**

Via SSH (if available) or Hostinger Terminal:

```bash
cd /path/to/your/domain
npm ci --production=false
```

**Step 3: Build Application**

```bash
npm run build
```

**Step 4: Set Environment Variables**

Via Hostinger control panel:
- Go to "Environment Variables" or ".env" section
- Add all variables from `.env.production.example`

**Step 5: Start Application**

```bash
npm start
```

**Note**: For persistent running, use PM2 (see Option 2).

### Option 2: PM2 Process Manager (VPS Recommended)

**Why PM2**:
- Keeps application running (auto-restart on crash)
- Process management (start, stop, restart)
- Log management
- Better for production

**Step 1: Install PM2**

```bash
npm install -g pm2
```

**Step 2: Build Application**

```bash
npm ci --production=false
npm run build
```

**Step 3: Start with PM2**

```bash
pm2 start npm --name "dada-akademisi" -- start
```

**Step 4: Save PM2 Configuration**

```bash
pm2 save
pm2 startup
```

**Step 5: Verify**

```bash
pm2 status
pm2 logs dada-akademisi
```

**PM2 Commands**:
- `pm2 restart dada-akademisi` - Restart application
- `pm2 stop dada-akademisi` - Stop application
- `pm2 logs dada-akademisi` - View logs
- `pm2 monit` - Monitor resources

### Option 3: Git Deployment (If Available)

**Step 1: Push to Repository**

```bash
git push origin main
```

**Step 2: Pull on Server**

```bash
cd /path/to/your/domain
git pull origin main
```

**Step 3: Build and Start**

```bash
npm ci --production=false
npm run build
pm2 restart dada-akademisi
```

---

## 🔧 Configuration

### Port Configuration

**Default**: Next.js runs on port 3000

**If Hostinger requires different port**:

1. Set environment variable:
```bash
PORT=8080
```

2. Or update `package.json`:
```json
{
  "scripts": {
    "start": "next start -p 8080"
  }
}
```

### Domain Configuration

**Point Domain to Application**:

1. In Hostinger control panel:
   - Go to "Domains" → "DNS Zone Editor"
   - Point A record to your server IP
   - Or use CNAME if using subdomain

2. Configure reverse proxy (if using Nginx):
   - Point domain to `http://localhost:3000`
   - Enable SSL (Let's Encrypt)

### SSL Certificate

**Recommended**: Use Let's Encrypt (free SSL)

1. Via Hostinger control panel:
   - Go to "SSL" section
   - Enable "Let's Encrypt SSL"
   - Auto-renewal should be enabled

2. Verify:
   - Visit `https://dadasanatakademisi.com`
   - Check for padlock icon

---

## ✅ Post-Deployment Verification

### 1. Site Loads

- [ ] Visit `https://dadasanatakademisi.com`
- [ ] Site loads without errors
- [ ] No console errors (check browser DevTools)

### 2. Sanity CMS Connection

- [ ] Content loads from Sanity
- [ ] Images display correctly
- [ ] No API errors in console

### 3. Performance Check

**Lighthouse Audit**:
1. Open Chrome DevTools
2. Go to "Lighthouse" tab
3. Run audit
4. Target scores:
   - Performance: > 90
   - Accessibility: > 90
   - Best Practices: > 90
   - SEO: > 90

**Core Web Vitals**:
- LCP (Largest Contentful Paint): < 2.5s ✅
- CLS (Cumulative Layout Shift): < 0.1 ✅
- FID (First Input Delay): < 100ms ✅

### 4. Error Monitoring

**Check Logs**:
```bash
# PM2 logs
pm2 logs dada-akademisi

# Or application logs
tail -f /path/to/logs/error.log
```

**Common Issues**:
- Memory errors → Optimize bundle size
- Port conflicts → Change port
- Environment variables missing → Check `.env.production`

---

## 🐛 Troubleshooting

### Issue 1: Build Fails

**Symptom**: `npm run build` fails with errors

**Solutions**:
1. Check Node version: `node --version` (should be 18+)
2. Clear cache: `rm -rf .next node_modules && npm ci`
3. Check memory: Build requires ~2GB RAM (upgrade if needed)
4. Check logs: Look for specific error messages

### Issue 2: Application Won't Start

**Symptom**: `npm start` fails or crashes

**Solutions**:
1. Check environment variables: `echo $NEXT_PUBLIC_SANITY_PROJECT_ID`
2. Check port: Ensure port 3000 (or configured port) is available
3. Check logs: `pm2 logs` or application logs
4. Verify build: `npm run build` should complete successfully

### Issue 3: Images Don't Load

**Symptom**: Sanity images return 404 or don't display

**Solutions**:
1. Verify `next.config.js` has `domains: ['cdn.sanity.io']`
2. Check Sanity project ID is correct
3. Verify image URLs in Sanity Studio
4. Check browser console for CORS errors

### Issue 4: Memory Errors

**Symptom**: "Out of memory" errors during build or runtime

**Solutions**:
1. Upgrade to VPS (shared hosting has memory limits)
2. Optimize bundle size (use Server Components)
3. Reduce image sizes
4. Use PM2 with memory limits: `pm2 start --max-memory-restart 500M`

### Issue 5: Slow Performance

**Symptom**: Site loads slowly

**Solutions**:
1. Enable caching (see `next.config.js` headers)
2. Use CDN for static assets
3. Optimize images (AVIF/WebP formats)
4. Monitor resource usage: `pm2 monit`

---

## 📊 Monitoring & Maintenance

### Regular Checks

**Weekly**:
- [ ] Check error logs
- [ ] Monitor Core Web Vitals (Google Search Console)
- [ ] Verify SSL certificate (auto-renewal)

**Monthly**:
- [ ] Update dependencies: `npm update`
- [ ] Review performance metrics
- [ ] Check for security updates

**Quarterly**:
- [ ] Full security audit
- [ ] Performance optimization review
- [ ] Backup verification

### Backup Strategy

**What to Backup**:
- Environment variables (`.env.production`)
- Sanity content (via Sanity Studio)
- Application code (Git repository)

**How to Backup**:
1. **Code**: Git repository (already versioned)
2. **Content**: Sanity Studio → Export
3. **Environment**: Document in secure location

---

## 🔐 Security Best Practices

1. **Environment Variables**: Never commit to Git
2. **API Tokens**: Rotate regularly
3. **SSL Certificate**: Always use HTTPS
4. **Dependencies**: Keep updated (`npm audit`)
5. **Headers**: Security headers in `next.config.js`

---

## 📞 Support

**If Issues Persist**:

1. Check logs: `pm2 logs` or application logs
2. Review this guide: Common issues section
3. Hostinger Support: Contact via control panel
4. Next.js Docs: https://nextjs.org/docs

---

**Last Updated**: 2024-01-XX  
**Maintained By**: Lead Frontend Engineer

