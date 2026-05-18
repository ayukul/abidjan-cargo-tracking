# 🚀 Abidjan Cargo Tracking - Local Version Quick Start

This is the **100% local version** with zero external dependencies. Everything runs on your machine using SQLite.

## ⚡ 5-Minute Setup

### 1️⃣ Copy package.json
```bash
cp LOCAL_VERSION_PACKAGE.json package.json
```

### 2️⃣ Install dependencies
```bash
npm install
```

### 3️⃣ Initialize database
```bash
npm run init-db
```

This creates:
- SQLite database at `db/cargo.db`
- Database schema (users, shipments, history)
- Default admin account: **admin@test.com** / **admin123456**
- 3 sample shipments

### 4️⃣ Start the app
```bash
npm run dev
```

Open **http://localhost:3000** in your browser! 🎉

## 📝 First Login

Navigate to: **http://localhost:3000/admin/login**

```
Email:    admin@test.com
Password: admin123456
```

## 🌐 Features

### Public Tracking (No Login)
- **URL**: http://localhost:3000/track
- Search shipments by tracking code
- View shipment status and history

### Admin Dashboard (Login Required)
- **URL**: http://localhost:3000/admin
- View all shipments
- Create new shipments
- Update status with notes
- View statistics
- Search functionality

## 🗄️ Database Location

```
./db/cargo.db
```

**Backup**: `cp db/cargo.db db/cargo.db.backup`  
**Reset**: Delete `db/cargo.db` and run `npm run init-db` again

## 🔐 Change Admin Password

```bash
node -e "
const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const db = new Database('./db/cargo.db');

const newPassword = 'your-new-password';
const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync(newPassword, salt);

db.prepare('UPDATE users SET password_hash = ? WHERE email = ?')
  .run(hash, 'admin@test.com');

console.log('Password updated!');
db.close();
"
```

## ⚙️ Environment Setup

Create `.env.local`:
```
SESSION_SECRET=your-random-secret-32-chars-min
NODE_ENV=development
```

Generate a random secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 🚨 Troubleshooting

**Database locked error**
- Close all instances of the app
- Make sure port 3000 is not in use

**Port 3000 already in use**
```bash
PORT=3001 npm run dev
```

**Database not updating**
- Clear browser cache (Cmd+Shift+Delete or Ctrl+Shift+Delete)
- Restart dev server

## 📦 Build for Production

```bash
npm run build
npm start
```

## ✅ What's Different from Cloud Version

| Feature | Cloud | Local |
|---------|-------|-------|
| Database | Supabase PostgreSQL | SQLite |
| Auth | Supabase Auth | Session-based |
| External Services | Required | None |
| Data Storage | Cloud | Local machine |
| Setup Complexity | Complex | Simple |

## 🎯 Next Steps

1. ✅ Database initialized
2. ✅ Admin user ready
3. ✅ Sample shipments loaded
4. ✅ Ready to track cargo!

Start the app and begin tracking! 🚚📍
