# Abidjan Cargo Tracking - Shipment Tracking Portal MVP

A modern, responsive shipment tracking application built with Next.js 14+, TypeScript, Tailwind CSS, and Supabase. Designed for logistics companies in Abidjan, West Africa.

## 🌟 Features

### Public Tracking Page (`/track`)
- Customer-friendly shipment lookup by tracking code
- Displays comprehensive shipment details:
  - Tracking code, customer info, origin & destination
  - Current status with color-coded badges
  - Estimated arrival date
  - Shipment history timeline
- Responsive design works on mobile and desktop
- No login required

### Admin Panel (`/admin`)
- **Authentication**: Secure login with Supabase Auth
- **Dashboard**: Quick statistics on shipments
  - Total shipments count
  - In-transit, Delivered, and Delayed counts
- **Shipment Management**:
  - View all shipments in table format
  - Create new shipments
  - Edit shipment details
  - Delete shipments
  - Update shipment status with notes
- **Advanced Search**:
  - Search by tracking code
  - Search by customer name
  - Search by phone number
- **Notifications**: WhatsApp notification structure (ready for Twilio/Meta integration)

### Shipment Statuses (French)
- Reçu en Chine (Received in China)
- En préparation (Preparing)
- Expédié (Shipped)
- En transit (In Transit)
- Arrivé à Abidjan (Arrived in Abidjan)
- En dédouanement (Customs Clearance)
- Prêt pour livraison (Ready for Delivery)
- Livré (Delivered)
- Retardé (Delayed)

## 🛠️ Tech Stack

- **Frontend**: Next.js 14+ (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS 3
- **Backend/Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **UI Icons**: Lucide React
- **Date Formatting**: date-fns
- **Package Manager**: npm

## 📋 Prerequisites

- Node.js 16+ and npm
- Supabase account (free tier works)
- Modern web browser

## 🚀 Quick Start

### 1. Clone or Setup Project

```bash
# Navigate to your project directory
cd abidjan-cargo-tracking
npm install
```

### 2. Setup Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to the SQL Editor and run the SQL in `database.sql` to create tables
3. (Optional) Run `seed.sql` to add demo data
4. Create a test admin user via Supabase Auth dashboard

**To create admin user programmatically via Supabase CLI:**
```bash
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase functions deploy
```

**Or manually via Supabase Dashboard:**
1. Go to Authentication > Users
2. Click "Add user" 
3. Email: `admin@test.com`
4. Password: `test123456` (change in production)

### 3. Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
NEXT_PUBLIC_APP_NAME=Abidjan Cargo Tracking
```

Get these from Supabase Dashboard > Project Settings > API

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 Usage

### Public Tracking (No Login)
- Navigate to `/track`
- Enter a tracking code (e.g., `ACT-2024-001`)
- View shipment details and history

### Admin Panel

1. Go to `/admin`
2. If not logged in, redirect to `/admin/login`
3. Login with your credentials (e.g., `admin@test.com` / `test123456`)
4. Access the dashboard:
   - **View Shipments**: See all shipments in the table
   - **Search**: Filter shipments by code, name, or phone
   - **Create**: Click "Nouveau colis" to add new shipment
   - **Edit**: Click the edit icon to modify shipment or change status
   - **Delete**: Click the delete icon to remove shipment

### Status Updates & Notifications
1. In the edit page, change the "Nouveau statut" dropdown
2. Optionally add a note
3. Check "Envoyer une notification WhatsApp" if enabled
4. Click "Mettre à jour le statut"
5. WhatsApp message logs to console (see Notes below)

## 🗄️ Database Schema

### `shipments` Table
- `id` (UUID): Primary key
- `tracking_code` (VARCHAR): Unique tracking identifier
- `customer_name` (VARCHAR): Full name
- `customer_phone` (VARCHAR): Contact number
- `customer_email` (VARCHAR): Email address
- `origin` (VARCHAR): Departure location
- `destination` (VARCHAR): Destination location
- `current_status` (VARCHAR): Current status
- `estimated_arrival_date` (DATE): Expected arrival
- `notes` (TEXT): General notes
- `created_at` (TIMESTAMP): Creation time
- `updated_at` (TIMESTAMP): Last update time
- `created_by` (UUID): Admin who created

### `shipment_status_history` Table
- `id` (UUID): Primary key
- `shipment_id` (UUID): Reference to shipment
- `status` (VARCHAR): Status at this point
- `note` (TEXT): Notes for this status
- `created_at` (TIMESTAMP): When this status was set
- `created_by` (UUID): Admin who made the change

## 📱 WhatsApp Notifications

The system includes a reusable notification function that logs to console:

```typescript
// lib/notifications.ts
sendWhatsAppNotification({
  phoneNumber: '+225 07 12 34 56',
  customerName: 'Jean Kouamé',
  trackingCode: 'ACT-2024-001',
  status: 'En transit'
})
// Logs: "Bonjour Jean Kouamé, votre colis ACT-2024-001 est maintenant: En transit. Merci."
```

### Integration Instructions

**Option 1: Twilio WhatsApp API**
1. Install: `npm install twilio`
2. Set environment variables:
   - `TWILIO_ACCOUNT_SID`
   - `TWILIO_AUTH_TOKEN`
   - `TWILIO_PHONE_NUMBER`
3. Uncomment Twilio function in `lib/notifications.ts`

**Option 2: Meta WhatsApp Cloud API**
1. Set environment variables:
   - `WHATSAPP_API_KEY`
   - `WHATSAPP_PHONE_NUMBER_ID`
   - `WHATSAPP_BUSINESS_ACCOUNT_ID`
2. Uncomment Meta function in `lib/notifications.ts`

## 🎨 Branding & Colors

Current color scheme (logistics-focused):
- **Primary Blue**: `#1e3a8a` (cargo-blue) - Main brand color
- **Dark**: `#0f172a` (cargo-dark) - Header, text
- **Accent Orange**: `#ea580c` (cargo-orange) - Highlights, buttons
- **Light Gray**: `#f8fafc` (cargo-light) - Background
- **Border Gray**: `#e2e8f0` (cargo-gray) - Borders

Edit in `tailwind.config.js` and `components` to customize.

## 🔐 Security

- Row-Level Security (RLS) enabled on all tables
- Public read access for tracking
- Authenticated write/delete for admin
- Session-based authentication
- No sensitive data in URLs
- Password fields not exposed

## 📦 Demo Data

Seed data included in `seed.sql`:
- 10 sample shipments with various statuses
- Full status history for demonstration
- Real French shipment descriptions

Run seed data after creating tables:
```bash
# Via Supabase SQL Editor, paste seed.sql contents
```

## 🧪 Testing

### Test Account
- Email: `admin@test.com`
- Password: `test123456`
- Change in production!

### Test Tracking Codes
- `ACT-2024-001` through `ACT-2024-010` (from seed data)

### Manual Testing Checklist
- [ ] Public tracking works with valid code
- [ ] Error message shows for invalid code
- [ ] Admin login works
- [ ] Dashboard stats display correctly
- [ ] Can create new shipment
- [ ] Can edit shipment details
- [ ] Status change updates history
- [ ] WhatsApp notification logs to console
- [ ] Search filters work (code, name, phone)
- [ ] Delete removes shipment
- [ ] Logout returns to home
- [ ] Responsive on mobile (320px+)

## 📝 Project Structure

```
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home page
│   ├── globals.css             # Global styles
│   ├── track/
│   │   └── page.tsx            # Public tracking page
│   └── admin/
│       ├── layout.tsx          # Admin layout
│       ├── page.tsx            # Dashboard
│       ├── login/
│       │   └── page.tsx        # Login page
│       └── shipments/
│           ├── new/
│           │   └── page.tsx    # Create shipment
│           └── [id]/edit/
│               └── page.tsx    # Edit shipment
├── components/
│   ├── Header.tsx              # Navigation header
│   ├── TrackingForm.tsx        # Public search form
│   ├── ShipmentDetails.tsx     # Shipment info display
│   ├── Timeline.tsx            # Status history timeline
│   ├── DashboardCard.tsx       # Stat card component
│   └── ShipmentsTable.tsx      # Admin shipments table
├── lib/
│   ├── supabase.ts             # Supabase client setup
│   ├── shipments.ts            # Shipment operations
│   └── notifications.ts        # WhatsApp notifications
├── database.sql                # Database schema
├── seed.sql                    # Demo data
├── .env.example                # Environment template
├── tailwind.config.js          # Tailwind configuration
├── tsconfig.json               # TypeScript config
├── package.json                # Dependencies
└── README.md                   # This file
```

## 🚀 Production Deployment

### Build for Production
```bash
npm run build
npm start
```

### Recommended Hosting
- **Vercel** (recommended for Next.js)
- **Netlify**
- **AWS Amplify**
- **DigitalOcean App Platform**

### Production Checklist
- [ ] Change admin password
- [ ] Set strong RLS policies
- [ ] Enable HTTPS
- [ ] Setup backup strategy for Supabase
- [ ] Configure WhatsApp notifications
- [ ] Setup monitoring/logging
- [ ] Review environment variables
- [ ] Test all features in production
- [ ] Setup custom domain
- [ ] Enable rate limiting

### Environment Variables for Production
```
NEXT_PUBLIC_SUPABASE_URL=https://your-prod-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=prod_anon_key
SUPABASE_SERVICE_ROLE_KEY=prod_service_role_key
WHATSAPP_API_KEY=your_production_api_key
WHATSAPP_PHONE_NUMBER=your_production_phone
```

## 🤝 Support & Contributing

For issues, features, or questions:
1. Check existing documentation
2. Review demo data and examples
3. Test with provided test accounts
4. Check browser console for errors

## 📄 License

Created for Abidjan Cargo Tracking. Modify as needed for your organization.

## 🔄 Future Enhancements

- [ ] SMS notifications (via Twilio)
- [ ] Email notifications
- [ ] WhatsApp Cloud API integration
- [ ] Real-time status updates (WebSocket)
- [ ] Multiple language support
- [ ] Advanced analytics
- [ ] Batch shipment import (CSV)
- [ ] API for third-party integrations
- [ ] Mobile app (React Native)
- [ ] Document upload (invoices, receipts)
- [ ] Pickup location mapping
- [ ] Customer portal with account
- [ ] Admin role management
- [ ] Audit logging

---

**Built with ❤️ for African Logistics**

Last Updated: May 2024
