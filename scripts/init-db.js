const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Create db directory if it doesn't exist
const dbDir = path.join(__dirname, '..', 'db');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Initialize database
const dbPath = path.join(dbDir, 'cargo.db');
const db = new Database(dbPath);

console.log('Creating database schema...');

// Create users table
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Create shipments table
db.exec(`
  CREATE TABLE IF NOT EXISTS shipments (
    id TEXT PRIMARY KEY,
    tracking_code TEXT UNIQUE NOT NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT,
    origin TEXT NOT NULL,
    destination TEXT NOT NULL,
    current_status TEXT NOT NULL DEFAULT 'Reçu en Chine',
    estimated_arrival_date TEXT,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT NOT NULL,
    FOREIGN KEY (created_by) REFERENCES users(id)
  )
`);

// Create shipment status history table
db.exec(`
  CREATE TABLE IF NOT EXISTS shipment_status_history (
    id TEXT PRIMARY KEY,
    shipment_id TEXT NOT NULL,
    status TEXT NOT NULL,
    note TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT NOT NULL,
    FOREIGN KEY (shipment_id) REFERENCES shipments(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
  )
`);

// Create indexes for performance
db.exec(`
  CREATE INDEX IF NOT EXISTS idx_shipments_tracking_code ON shipments(tracking_code);
  CREATE INDEX IF NOT EXISTS idx_shipments_customer_name ON shipments(customer_name);
  CREATE INDEX IF NOT EXISTS idx_shipments_created_at ON shipments(created_at);
  CREATE INDEX IF NOT EXISTS idx_status_history_shipment_id ON shipment_status_history(shipment_id);
`);

console.log('Schema created successfully');

// Create default admin user
const adminId = 'user_' + uuidv4();
const adminPassword = 'admin123456';
const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync(adminPassword, salt);

try {
  db.prepare(`
    INSERT INTO users (id, email, password_hash, name, role)
    VALUES (?, ?, ?, ?, ?)
  `).run(adminId, 'admin@test.com', hash, 'Admin User', 'admin');
  console.log('✓ Default admin user created');
  console.log('  Email: admin@test.com');
  console.log('  Password: admin123456');
} catch (error) {
  if (error.message.includes('UNIQUE constraint failed')) {
    console.log('✓ Admin user already exists');
  } else {
    throw error;
  }
}

// Add sample shipments
const shipments = [
  {
    tracking_code: 'ABJ-001-2024',
    customer_name: 'Jean Dupont',
    customer_phone: '+225 07 12 34 56 78',
    customer_email: 'jean@example.com',
    origin: 'Shanghai',
    destination: 'Abidjan',
    current_status: 'En transit',
    estimated_arrival_date: '2024-06-15',
    notes: 'Standard shipment'
  },
  {
    tracking_code: 'ABJ-002-2024',
    customer_name: 'Marie Kouakou',
    customer_phone: '+225 07 87 65 43 21',
    customer_email: 'marie@example.com',
    origin: 'Guangzhou',
    destination: 'Abidjan',
    current_status: 'Expédié',
    estimated_arrival_date: '2024-06-20',
    notes: 'Fragile items'
  },
  {
    tracking_code: 'ABJ-003-2024',
    customer_name: 'Ahmed Ibrahim',
    customer_phone: '+225 06 12 34 56 78',
    customer_email: null,
    origin: 'Hong Kong',
    destination: 'Abidjan',
    current_status: 'Livré',
    estimated_arrival_date: '2024-06-10',
    notes: 'Delivered successfully'
  }
];

shipments.forEach(shipmentData => {
  try {
    const shipmentId = 'ship_' + uuidv4();
    const historyId = 'hist_' + uuidv4();
    
    db.prepare(`
      INSERT INTO shipments (
        id, tracking_code, customer_name, customer_phone, customer_email,
        origin, destination, current_status, estimated_arrival_date, notes, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      shipmentId,
      shipmentData.tracking_code,
      shipmentData.customer_name,
      shipmentData.customer_phone,
      shipmentData.customer_email,
      shipmentData.origin,
      shipmentData.destination,
      shipmentData.current_status,
      shipmentData.estimated_arrival_date,
      shipmentData.notes,
      adminId
    );

    db.prepare(`
      INSERT INTO shipment_status_history (id, shipment_id, status, note, created_by)
      VALUES (?, ?, ?, ?, ?)
    `).run(
      historyId,
      shipmentId,
      shipmentData.current_status,
      'Initial status',
      adminId
    );

    console.log(`✓ Sample shipment created: ${shipmentData.tracking_code}`);
  } catch (error) {
    if (!error.message.includes('UNIQUE constraint failed')) {
      throw error;
    }
  }
});

db.close();
console.log('\n✅ Database initialization complete!');
console.log(`📁 Database location: ${dbPath}`);
