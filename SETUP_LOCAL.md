# Abidjan Cargo Tracking - Local Setup Guide

This is a **completely local version** with no external dependencies. Everything runs on your machine using SQLite.

## What's Different from Cloud Version?

✅ **SQLite Database** - No Supabase needed  
✅ **Session-Based Auth** - Local login system  
✅ **Zero External Services** - 100% runs on localhost  
✅ **Same Features** - All functionality preserved  

## Prerequisites

- **Node.js** 18+ (https://nodejs.org/)
- **npm** or **yarn**
- ~200MB disk space

## Installation Steps

### 1. Replace package.json

```bash
# Copy the new package.json
cp LOCAL_VERSION_PACKAGE.json package.json

# Install dependencies
npm install
```

### 2. Copy New Files

Place these files in your project:

```
lib/
  ├── db-local.ts          (database operations)
  └── auth-local.ts        (authentication)

app/api/auth/
  ├── login/
  │   └── route.ts         (login endpoint)
  └── logout/
      └── route.ts         (logout endpoint)

scripts/
  └── init-db.js           (database setup script)
```

### 3. Initialize Database

```bash
npm run init-db
```

This will:
- Create `db/cargo.db` (SQLite database)
- Create all tables
- Add default admin user:
  - **Email:** `admin@test.com`
  - **Password:** `admin123456`
- Add 3 sample shipments

### 4. Start Development Server

```bash
npm run dev
```

The app will be available at: **http://localhost:3000**

## First Login

1. Navigate to **http://localhost:3000/admin/login**
2. Enter credentials:
   - Email: `admin@test.com`
   - Password: `admin123456`
3. You'll be logged into the dashboard

## Features Available

### Public Tracking (No Login Required)
- **URL:** http://localhost:3000/track
- Search shipments by tracking code
- View detailed shipment status
- See status history

### Admin Dashboard (Login Required)
- **URL:** http://localhost:3000/admin
- View all shipments
- Create new shipments
- Update shipment status
- Search shipments
- View statistics

## Database Location

The SQLite database is stored in:
```
./db/cargo.db
```

This file contains all shipments, users, and history. You can:
- **Backup:** Copy `db/cargo.db` to backup it
- **Reset:** Delete `db/cargo.db` and run `npm run init-db` again
- **Inspect:** Use any SQLite viewer (e.g., DB Browser for SQLite)

## Changing Admin Password

To change the admin password, run:

```bash
node -e "
const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const db = new Database('./db/cargo.db');

const newPassword = 'your-new-password-here';
const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync(newPassword, salt);

db.prepare('UPDATE users SET password_hash = ? WHERE email = ?')
  .run(hash, 'admin@test.com');

console.log('Password updated successfully');
db.close();
"
```

## Creating Additional Users

This local version only has admin users. To add more:

```bash
node -e "
const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const db = new Database('./db/cargo.db');
const { v4: uuidv4 } = require('crypto');

const email = 'user@example.com';
const password = 'password123';
const name = 'User Name';

const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync(password, salt);
const userId = 'user_' + uuidv4();

db.prepare('INSERT INTO users (id, email, password_hash, name, role) VALUES (?, ?, ?, ?, ?)')
  .run(userId, email, hash, name, 'admin');

console.log('User created:', email);
db.close();
"
```

## Build for Production

To create a production build:

```bash
npm run build
npm start
```

## Troubleshooting

### Database locked error
- Make sure only one instance of the app is running
- Check if other processes are accessing `db/cargo.db`

### Port 3000 already in use
```bash
# Use a different port
PORT=3001 npm run dev
```

### Changes not appearing
- Clear browser cache (Ctrl+Shift+Del or Cmd+Shift+Delete)
- Restart the development server

## File Structure

```
project/
├── app/
│   ├── api/auth/
│   │   ├── login/route.ts
│   │   └── logout/route.ts
│   ├── admin/
│   │   ├── page.tsx
│   │   ├── login/page.tsx
│   │   └── shipments/[id]/edit/page.tsx
│   ├── track/page.tsx
│   └── page.tsx
├── components/
│   ├── Header.tsx
│   ├── TrackingForm.tsx
│   ├── ShipmentDetails.tsx
│   └── ... (other components)
├── lib/
│   ├── db-local.ts        (NEW)
│   ├── auth-local.ts      (NEW)
│   └── ... (other utilities)
├── db/
│   └── cargo.db           (Created after init-db)
├── scripts/
│   └── init-db.js         (NEW)
└── package.json           (Updated)
```

## Security Notes

⚠️ **For Development Only:**
- Change `SESSION_SECRET` in production
- Use strong passwords
- Enable HTTPS in production
- Use environment variables for secrets

## Performance

SQLite is perfect for:
- ✅ Single-user or small team use
- ✅ Development and testing
- ✅ Up to ~1 million rows without issues
- ✅ Local/on-premise deployment

For large-scale production, consider:
- PostgreSQL
- MySQL
- MongoDB

## Backup & Restore

### Backup
```bash
cp db/cargo.db db/cargo.db.backup
```

### Restore
```bash
cp db/cargo.db.backup db/cargo.db
```

## Questions?

All data is stored locally in `db/cargo.db`. You have complete control and visibility.
