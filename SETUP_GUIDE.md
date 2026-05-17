# Complete Setup Guide - Abidjan Cargo Tracking

This guide walks you through setting up the shipment tracking portal step-by-step.

## Part 1: Supabase Setup

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up (free tier is fine)
2. Click "New Project"
3. Fill in:
   - Project name: `abidjan-cargo-tracking`
   - Database password: Choose a strong password (save it!)
   - Region: Select closest to you (EU is default)
4. Click "Create new project" and wait 2-3 minutes

### Step 2: Copy API Credentials

1. Go to **Settings** > **API**
2. Copy these two values (you'll need them later):
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Scroll down and copy:
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`
4. Keep these safe! Don't commit to git.

### Step 3: Create Database Tables

1. In Supabase, go to **SQL Editor**
2. Click **New Query**
3. Paste the entire contents of `database.sql` from this project
4. Click **Run**
5. Wait for success message

### Step 4: Create Admin User

**Option A: Via Supabase Dashboard (Recommended for first user)**

1. Go to **Authentication** > **Users**
2. Click **Add user manually**
3. Email: `admin@test.com`
4. Password: `test123456`
5. Click **Create user**

**Option B: Via Application (After deployment)**

Once the app is running, you can create users via the login page registration feature (if you enable it).

### Step 5: Add Demo Data (Optional)

1. Go back to **SQL Editor**
2. Click **New Query**
3. Paste the entire contents of `seed.sql`
4. Click **Run**
5. You'll now have 10 demo shipments to test with

## Part 2: Local Development Setup

### Step 1: Install Node.js

Download and install from [nodejs.org](https://nodejs.org) (version 16 or higher)

Verify installation:
```bash
node --version
npm --version
```

### Step 2: Install Project Dependencies

```bash
# Navigate to project directory
cd abidjan-cargo-tracking

# Install all dependencies
npm install
```

This may take 2-3 minutes. You'll see lots of package downloads.

### Step 3: Create Environment File

1. In the project root, copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Open `.env.local` in a text editor

3. Fill in the values from Step 2 above:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
   SUPABASE_SERVICE_ROLE_KEY=eyJxxx...
   NEXT_PUBLIC_APP_NAME=Abidjan Cargo Tracking
   ```

4. Save the file

### Step 4: Run Development Server

```bash
npm run dev
```

You should see:
```
> next dev

  ▲ Next.js 14.x.x
  - Local:        http://localhost:3000
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Part 3: Testing the Application

### Test Public Tracking

1. Go to [http://localhost:3000/track](http://localhost:3000/track)
2. Enter tracking code: `ACT-2024-001`
3. Click "Rechercher"
4. You should see shipment details and history

**To test error handling:**
- Enter: `FAKE-123-456`
- Should show: "Numéro de suivi introuvable"

### Test Admin Panel

1. Go to [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
2. Email: `admin@test.com`
3. Password: `test123456`
4. Click "Se connecter"
5. You should see the dashboard with stats

**Dashboard should show:**
- Total Shipments: 10
- En transit: 2
- Livré: 1
- Retardé: 1

### Test Admin Features

**Search Shipments:**
- Type "ACT-2024-001" and click Rechercher
- Type "Jean" to search by name
- Type "+225 07 12 34 56" to search by phone

**Create Shipment:**
- Click "Nouveau colis"
- Fill all required fields (marked with *)
- Click "Créer le colis"
- Should appear in the shipments table

**Edit Shipment:**
- Click the edit icon (pencil) on any shipment
- Change the status to "En transit"
- Add a note: "Arrived at port"
- Check "Envoyer une notification WhatsApp"
- Click "Mettre à jour le statut"
- Check browser console (F12 → Console) for WhatsApp message log
- Should say: "Bonjour [name], votre colis [code] est maintenant: En transit. Merci."

**Delete Shipment:**
- Click the delete icon (trash) on any shipment
- Confirm deletion
- Shipment should disappear from table

## Part 4: Configure WhatsApp Notifications (Optional)

### Option 1: Test Console Logging (Current)

Messages are logged to browser console for testing:

1. Open browser DevTools: Press `F12`
2. Go to **Console** tab
3. Change a shipment status
4. You'll see:
   ```
   📱 WhatsApp Notification:
     To: +225 07 12 34 56
     Message: Bonjour Jean Kouamé, votre colis ACT-2024-001 est maintenant: En transit. Merci.
   ```

### Option 2: Setup Twilio (Future)

1. Create [Twilio](https://www.twilio.com) account
2. Get WhatsApp number from Twilio
3. Install Twilio SDK:
   ```bash
   npm install twilio
   ```
4. Add to `.env.local`:
   ```
   TWILIO_ACCOUNT_SID=your_sid
   TWILIO_AUTH_TOKEN=your_token
   TWILIO_PHONE_NUMBER=whatsapp:+1234567890
   ```
5. Uncomment Twilio function in `lib/notifications.ts`

### Option 3: Setup Meta WhatsApp Cloud API (Future)

1. Create Meta Business account
2. Setup WhatsApp Business account
3. Add to `.env.local`:
   ```
   WHATSAPP_API_KEY=your_api_key
   WHATSAPP_PHONE_NUMBER_ID=your_phone_id
   WHATSAPP_BUSINESS_ACCOUNT_ID=your_account_id
   ```
4. Uncomment Meta function in `lib/notifications.ts`

## Part 5: Deployment

### Deploy to Vercel (Recommended)

1. Create [Vercel](https://vercel.com) account
2. Connect your GitHub repository
3. Add environment variables in Vercel dashboard
4. Deploy with one click

### Deploy to Other Platforms

See README.md for options: Netlify, AWS Amplify, DigitalOcean, etc.

## Troubleshooting

### "Cannot find module '@supabase/supabase-js'"

```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

### "NEXT_PUBLIC_SUPABASE_URL is not set"

Make sure `.env.local` exists and has the correct values:
```bash
# Check file exists
ls -la .env.local

# Restart dev server
npm run dev
```

### "Authentication session not found"

This is normal for public tracking. For admin:
1. Make sure you created the admin user in Supabase
2. Clear browser cookies: DevTools → Application → Cookies → Delete
3. Try logging in again

### "Shipment not found" when searching

1. Make sure seed data was loaded (Step 5 in Part 1)
2. Check that tracking code exists
3. Try searching with an exact match

### Localhost:3000 won't open

```bash
# Make sure dev server is running
npm run dev

# If port 3000 is busy, use different port
npm run dev -- -p 3001
```

### WhatsApp notification not logging

1. Make sure `sendNotification` checkbox is checked
2. Open DevTools: Press `F12`
3. Go to **Console** tab
4. Look for messages starting with "📱 WhatsApp Notification"
5. Check for errors in red

## File Structure Recap

```
project-root/
├── app/                   # Next.js app directory
│   ├── page.tsx          # Home page
│   ├── layout.tsx        # Root layout
│   ├── globals.css       # Styles
│   ├── track/            # Public tracking
│   └── admin/            # Admin panel
├── components/           # React components
├── lib/                  # Utilities & services
├── database.sql         # Create tables
├── seed.sql             # Demo data
├── .env.local           # Local secrets (create this)
├── package.json         # Dependencies
└── README.md            # Full documentation
```

## Next Steps

1. ✅ Supabase project created
2. ✅ Database tables created
3. ✅ Admin user created
4. ✅ Demo data loaded (optional)
5. ✅ Development environment setup
6. ✅ Application tested locally
7. → Deploy to production
8. → Integrate real WhatsApp service
9. → Add more users/admins
10. → Customize branding

## Getting Help

If you encounter issues:

1. **Check README.md** for full documentation
2. **Check Supabase docs**: https://supabase.com/docs
3. **Check Next.js docs**: https://nextjs.org/docs
4. **Review console errors**: Open DevTools (F12) and check Console tab
5. **Check browser Network tab**: See if API calls are failing

## Security Reminders

⚠️ **Before Going to Production:**

- Change admin password from `test123456`
- Never commit `.env.local` to git
- Enable HTTPS
- Review Supabase RLS policies
- Backup your database regularly
- Use strong passwords
- Setup proper authentication for all users
- Monitor logs for suspicious activity

---

**You're all set! Start with testing the public tracking page, then explore the admin panel.**
