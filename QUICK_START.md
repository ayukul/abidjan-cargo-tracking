# Quick Start - 5 Minute Setup

## TL;DR

```bash
# 1. Install dependencies
npm install

# 2. Setup Supabase and get credentials
# Go to supabase.com, create project, copy API keys

# 3. Create .env.local
cp .env.example .env.local
# Edit with your Supabase URL and keys

# 4. Setup database
# Copy database.sql into Supabase SQL Editor and run

# 5. Create admin user
# In Supabase: Authentication > Users > Add admin@test.com / test123456

# 6. Run dev server
npm run dev

# 7. Test
# Public: http://localhost:3000/track - Try code: ACT-2024-001
# Admin: http://localhost:3000/admin/login - admin@test.com / test123456
```

## What You Get

| Feature | Public | Admin |
|---------|--------|-------|
| Track shipments | ✅ Yes | ✅ Yes |
| View details | ✅ Yes | ✅ Yes |
| Create shipment | ❌ No | ✅ Yes |
| Edit shipment | ❌ No | ✅ Yes |
| Delete shipment | ❌ No | ✅ Yes |
| Change status | ❌ No | ✅ Yes |
| Send notifications | ❌ No | ✅ Yes (logs to console) |
| Search | ❌ No | ✅ Yes (3 ways) |
| Dashboard stats | ❌ No | ✅ Yes |

## Key URLs

```
Public:
  Home:      http://localhost:3000
  Track:     http://localhost:3000/track

Admin:
  Login:     http://localhost:3000/admin/login
  Dashboard: http://localhost:3000/admin
  New:       http://localhost:3000/admin/shipments/new
  Edit:      http://localhost:3000/admin/shipments/[id]/edit
```

## Test Data

```
Tracking Codes: ACT-2024-001 to ACT-2024-010
Admin Email:    admin@test.com
Admin Pass:     test123456
```

## Important Files

| File | Purpose |
|------|---------|
| `database.sql` | Create database tables |
| `seed.sql` | Add demo shipments |
| `.env.example` | Environment template |
| `app/` | Next.js pages & routes |
| `components/` | React components |
| `lib/` | Utilities & API calls |
| `tailwind.config.js` | Styling config |

## Supabase Credentials Location

1. Supabase Dashboard
2. Project Settings → API
3. Copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Scroll down, copy:
   - service_role → `SUPABASE_SERVICE_ROLE_KEY`

## Commands

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm start            # Run production build
npm run lint         # Check code
npm run type-check   # TypeScript check
```

## Debugging

**Check Console for WhatsApp:**
1. Open browser DevTools: Press `F12`
2. Go to Console tab
3. Change shipment status
4. Look for "📱 WhatsApp Notification"

**Check Network Errors:**
1. DevTools → Network tab
2. Try an action
3. Look for red status codes
4. Click request to see details

**Check Supabase Logs:**
1. Supabase Dashboard
2. Logs (bottom left)
3. Filter by errors if needed

## Common Issues

| Problem | Solution |
|---------|----------|
| "Cannot find module" | `npm install` |
| "Supabase URL not set" | Check `.env.local` exists |
| "Port 3000 in use" | `npm run dev -- -p 3001` |
| "Login fails" | Create user in Supabase |
| "No shipments found" | Run `seed.sql` for demo data |
| "WhatsApp not logging" | Check browser Console (F12) |

## Next: Production Setup

See `SETUP_GUIDE.md` for:
- Detailed Supabase setup
- Environment configuration
- Database backup strategy
- Deployment options (Vercel, Netlify, etc.)
- WhatsApp integration

---

**Questions?** See `README.md` for full documentation
