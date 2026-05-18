const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Create db directory if it doesn't exist
const dbDir = path.join(process.cwd(), 'db');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(path.join(dbDir, 'cargo.db'));

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create tables
const schema = `
-- Users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'admin',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Shipments table
CREATE TABLE IF NOT EXISTS shipments (
  id TEXT PRIMARY KEY,
  tracking_code TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  current_status TEXT NOT NULL DEFAULT 'Reçu en Chine',
  estimated_arrival_date DATE,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_by TEXT REFERENCES users(id)
);

-- Shipment status history table
CREATE TABLE IF NOT EXISTS shipment_status_history (
  id TEXT PRIMARY KEY,
  shipment_id TEXT NOT NULL REFERENCES shipments(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  note TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_by TEXT REFERENCES users(id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_shipments_tracking_code ON shipments(tracking_code);
CREATE INDEX IF NOT EXISTS idx_shipments_customer_name ON shipments(customer_name);
CREATE INDEX IF NOT EXISTS idx_shipments_customer_phone ON shipments(customer_phone);
CREATE INDEX IF NOT EXISTS idx_shipments_created_at ON shipments(created_at);
CREATE INDEX IF NOT EXISTS idx_status_history_shipment_id ON shipment_status_history(shipment_id);
`;

// Execute schema
const statements = schema.split(';').filter(s => s.trim());
statements.forEach(statement => {
  if (statement.trim()) {
    db.exec(statement);
  }
});

console.log('✅ Database initialized successfully at db/cargo.db');

// Create default admin user if it doesn't exist
const bcrypt = require('bcryptjs');
const adminEmail = 'admin@test.com';
const adminPassword = 'admin123456';

const existingAdmin = db.prepare('SELECT * FROM users WHERE email = ?').get(adminEmail);

if (!existingAdmin) {
  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync(adminPassword, salt);
  const userId = 'user_' + Date.now();

  db.prepare(`
    INSERT INTO users (id, email, password_hash, name, role)
    VALUES (?, ?, ?, ?, ?)
  `).run(userId, adminEmail, passwordHash, 'Admin User', 'admin');

  console.log(`✅ Default admin user created:`);
  console.log(`   Email: ${adminEmail}`);
  console.log(`   Password: ${adminPassword}`);
}

// Add sample shipments if table is empty
const shipmentCount = db.prepare('SELECT COUNT(*) as count FROM shipments').get();

if (shipmentCount.count === 0) {
  const sampleShipments = [
    { tracking: 'TRACK001', name: 'Ahmed Hassan', phone: '+225 01 23 45 67', email: 'ahmed@example.com', origin: 'Shanghai', destination: 'Abidjan', status: 'Livré', note: 'Delivered successfully' },
    { tracking: 'TRACK002', name: 'Marie Kouassi', phone: '+225 07 89 01 23', email: 'marie@example.com', origin: 'Hong Kong', destination: 'Abidjan', status: 'En transit', note: 'On the way' },
    { tracking: 'TRACK003', name: 'Youssef Ibrahim', phone: '+225 05 12 34 56', email: 'youssef@example.com', origin: 'Shanghai', destination: 'Abidjan', status: 'Prêt pour livraison', note: 'Ready for delivery' },
  ];

  const userId = db.prepare('SELECT id FROM users LIMIT 1').get().id;

  sampleShipments.forEach(s => {
    const shipmentId = 'ship_' + Date.now() + Math.random();
    db.prepare(`
      INSERT INTO shipments (id, tracking_code, customer_name, customer_phone, customer_email, origin, destination, current_status, notes, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(shipmentId, s.tracking, s.name, s.phone, s.email, s.origin, s.destination, s.status, s.note, userId);

    // Add status history
    const historyId = 'hist_' + Date.now() + Math.random();
    db.prepare(`
      INSERT INTO shipment_status_history (id, shipment_id, status, note, created_by)
      VALUES (?, ?, ?, ?, ?)
    `).run(historyId, shipmentId, s.status, s.note, userId);
  });

  console.log(`✅ Sample shipments added (3 records)`);
}

db.close();
console.log('\n🚀 Database setup complete! Run "npm run dev" to start the application.');
