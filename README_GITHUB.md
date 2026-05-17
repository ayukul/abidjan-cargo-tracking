# Abidjan Cargo Tracking MVP

A fully functional shipment tracking portal built with Next.js 14+, TypeScript, Tailwind CSS, and Supabase.

## Features

✅ **Public Tracking** - Customers can track shipments without login
✅ **Admin Dashboard** - Complete shipment management interface
✅ **French Interface** - Fully localized for French-speaking users
✅ **WhatsApp Integration** - Notification system ready for Twilio/Meta integration
✅ **Real-time Updates** - Status tracking with history timeline
✅ **Row-Level Security** - Enterprise-grade database security

## Quick Start

1. **Clone and setup:**
```bash
npm install
```

2. **Create Supabase project:**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note your Project URL and API keys

3. **Configure environment:**
```bash
cp .env.example .env.local
# Edit .env.local with your Supabase credentials:
# NEXT_PUBLIC_SUPABASE_URL=your_project_url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
# SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

4. **Setup database:**
   - Open Supabase SQL Editor
   - Paste contents of `database.sql` and run
   - Paste contents of `seed.sql` and run

5. **Create admin user:**
   - Go to Supabase Authentication > Users
   - Click "Add user" > "Create new user"
   - Email: `admin@test.com`
   - Password: `test123456`
   - Check "Auto confirm user"

6. **Start development:**
```bash
npm run dev
```

7. **Access the app:**
   - Home: http://localhost:3000
   - Public Tracking: http://localhost:3000/track
   - Admin: http://localhost:3000/admin

## Test Data

**Admin Credentials:**
- Email: admin@test.com
- Password: test123456

**Test Tracking Codes:**
- ACT-2024-001 through ACT-2024-010

## Project Structure

```
├── app/
│   ├── page.tsx              # Home page
│   ├── track/page.tsx        # Public tracking
│   ├── admin/               # Admin section
│   │   ├── page.tsx         # Dashboard
│   │   ├── login/page.tsx   # Login page
│   │   └── shipments/       # Shipment management
│   ├── layout.tsx
│   └── globals.css
├── components/             # Reusable React components
├── lib/                    # Business logic & services
├── database.sql           # Database schema
├── seed.sql              # Demo data
└── package.json
```

## Deployment

Verified compatible with:
- ✅ Vercel (recommended)
- ✅ Netlify
- ✅ AWS Amplify
- ✅ DigitalOcean App Platform

## Documentation

- `README.md` - Full feature documentation
- `SETUP_GUIDE.md` - Detailed setup instructions
- `QUICK_START.md` - Quick reference
- `ARCHITECTURE.md` - System design & data flow
- `FILE_INDEX.md` - Complete file reference

## Tech Stack

- **Frontend:** Next.js 14+, React 18, TypeScript, Tailwind CSS
- **Backend:** Supabase (PostgreSQL, Auth, REST API)
- **Styling:** Tailwind CSS with custom theme
- **Icons:** Lucide React
- **Date Formatting:** date-fns
- **UI Components:** Custom React components

## Features Implemented

### Public Features
- 🔍 Shipment search by tracking code
- 📊 Real-time status display
- 📅 Timeline view of shipment history
- 🌍 Responsive design
- 🇫🇷 French language support

### Admin Features
- 🔐 Secure authentication
- 📈 Dashboard with KPI statistics
- ➕ Create new shipments
- ✏️ Edit shipment details
- 🗑️ Delete shipments
- 📱 Change shipment status
- 🔔 WhatsApp notifications (ready for integration)
- 🔍 Advanced search (code, name, phone)

## Shipment Statuses

1. Reçu en Chine (Received in China)
2. En préparation (In Preparation)
3. Expédié (Shipped)
4. En transit (In Transit)
5. Arrivé à Abidjan (Arrived in Abidjan)
6. En dédouanement (Customs Clearance)
7. Prêt pour livraison (Ready for Delivery)
8. Livré (Delivered)
9. Retardé (Delayed)

## Security

- ✅ Row-Level Security (RLS) policies
- ✅ Supabase Authentication with JWT
- ✅ No hardcoded secrets
- ✅ Environment variable configuration
- ✅ CSRF protection (Next.js built-in)

## Support & Troubleshooting

See `SETUP_GUIDE.md` for detailed troubleshooting steps.

## License

MIT License - See LICENSE file for details

## Next Steps

1. Set up your Supabase project
2. Configure environment variables
3. Run database setup (SQL scripts)
4. Create admin user
5. Start the dev server
6. Test public tracking and admin features
7. Customize for your branding
8. Deploy to production

---

**Status:** ✅ Production-ready MVP
**Built:** May 2026
**Support:** Check documentation files for detailed guides
