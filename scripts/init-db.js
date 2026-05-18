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

// Get or create admin user
let adminId = null;
try {
  const existingAdmin = db.prepare('SELECT id FROM users WHERE email = ?').get('admin@test.com');
  if (existingAdmin) {
    adminId = existingAdmin.id;
    console.log('✓ Admin user already exists');
  } else {
    adminId = 'user_' + uuidv4();
    const adminPassword = 'admin123456';
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(adminPassword, salt);
    db.prepare(`
      INSERT INTO users (id, email, password_hash, name, role)
      VALUES (?, ?, ?, ?, ?)
    `).run(adminId, 'admin@test.com', hash, 'Admin User', 'admin');
    console.log('✓ Default admin user created');
    console.log('  Email: admin@test.com');
    console.log('  Password: admin123456');
  }
} catch (error) {
  console.error('Error with admin user:', error.message);
  process.exit(1);
}

// Add diverse sample shipments with different statuses
const shipments = [
  {
    tracking_code: 'ABJ-2024-001',
    customer_name: 'Jean Dupont',
    customer_phone: '+225 07 12 34 56 78',
    customer_email: 'jean@example.com',
    origin: 'Shanghai',
    destination: 'Abidjan',
    current_status: 'Reçu en Chine',
    estimated_arrival_date: '2026-06-15',
    notes: 'Just received at warehouse - processing'
  },
  {
    tracking_code: 'ABJ-2024-002',
    customer_name: 'Marie Kouakou',
    customer_phone: '+225 07 87 65 43 21',
    customer_email: 'marie@example.com',
    origin: 'Guangzhou',
    destination: 'Abidjan',
    current_status: 'En préparation',
    estimated_arrival_date: '2026-06-20',
    notes: 'Being packed for shipment'
  },
  {
    tracking_code: 'ABJ-2024-003',
    customer_name: 'Ahmed Ibrahim',
    customer_phone: '+225 06 12 34 56 78',
    customer_email: 'ahmed@example.com',
    origin: 'Hong Kong',
    destination: 'Abidjan',
    current_status: 'Expédié',
    estimated_arrival_date: '2026-06-10',
    notes: 'Shipped from port - en route'
  },
  {
    tracking_code: 'ABJ-2024-004',
    customer_name: 'Fatou Diallo',
    customer_phone: '+225 05 98 76 54 32',
    customer_email: null,
    origin: 'Shenzhen',
    destination: 'Abidjan',
    current_status: 'En transit',
    estimated_arrival_date: '2026-06-08',
    notes: 'In transit - halfway to destination'
  },
  {
    tracking_code: 'ABJ-2024-005',
    customer_name: 'Pierre Martin',
    customer_phone: '+225 04 56 78 90 12',
    customer_email: 'pierre@example.com',
    origin: 'Dalian',
    destination: 'Abidjan',
    current_status: 'Livré',
    estimated_arrival_date: '2026-06-01',
    notes: 'Successfully delivered to customer'
  },
  {
    tracking_code: 'ABJ-2024-006',
    customer_name: 'Aisha Hassan',
    customer_phone: '+225 03 21 09 87 65',
    customer_email: 'aisha@example.com',
    origin: 'Ningbo',
    destination: 'Abidjan',
    current_status: 'Retardé',
    estimated_arrival_date: '2026-05-28',
    notes: 'Delayed due to customs - investigating'
  },
  {
    tracking_code: 'INTL-2024-001',
    customer_name: 'Sophie Laurent',
    customer_phone: '+225 09 87 65 43 21',
    customer_email: 'sophie@example.com',
    origin: 'Shanghai',
    destination: 'Abidjan',
    current_status: 'Reçu en Chine',
    estimated_arrival_date: '2026-06-25',
    notes: 'Electronics shipment - fragile'
  },
  {
    tracking_code: 'INTL-2024-002',
    customer_name: 'David Okonkwo',
    customer_phone: '+225 08 76 54 32 10',
    customer_email: null,
    origin: 'Qingdao',
    destination: 'Abidjan',
    current_status: 'En préparation',
    estimated_arrival_date: '2026-06-22',
    notes: 'Textile goods - bulk order'
  },
  {
    tracking_code: 'INTL-2024-003',
    customer_name: 'Yuki Tanaka',
    customer_phone: '+225 07 65 43 21 09',
    customer_email: 'yuki@example.com',
    origin: 'Tianjin',
    destination: 'Abidjan',
    current_status: 'Expédié',
    estimated_arrival_date: '2026-06-18',
    notes: 'Industrial parts - high priority'
  },
  {
    tracking_code: 'INTL-2024-004',
    customer_name: 'Carlos Rodriguez',
    customer_phone: '+225 06 54 32 10 98',
    customer_email: 'carlos@example.com',
    origin: 'Xiamen',
    destination: 'Abidjan',
    current_status: 'En transit',
    estimated_arrival_date: '2026-06-12',
    notes: 'Machinery components'
  },
  {
    tracking_code: 'INTL-2024-005',
    customer_name: 'Amina Ndiaye',
    customer_phone: '+225 05 43 21 09 87',
    customer_email: 'amina@example.com',
    origin: 'Fuzhou',
    destination: 'Abidjan',
    current_status: 'Livré',
    estimated_arrival_date: '2026-06-05',
    notes: 'Consumer goods delivered'
  },
  {
    tracking_code: 'INTL-2024-006',
    customer_name: 'James Osei',
    customer_phone: '+225 04 32 10 98 76',
    customer_email: null,
    origin: 'Guangzhou',
    destination: 'Abidjan',
    current_status: 'Retardé',
    estimated_arrival_date: '2026-06-02',
    notes: 'Weather delay at port'
  },
  {
    tracking_code: 'EXPRESS-001',
    customer_name: 'Lisa Chen',
    customer_phone: '+225 03 10 98 76 54',
    customer_email: 'lisa@example.com',
    origin: 'Shanghai',
    destination: 'Abidjan',
    current_status: 'Reçu en Chine',
    estimated_arrival_date: '2026-06-10',
    notes: 'Express delivery - time sensitive'
  },
  {
    tracking_code: 'EXPRESS-002',
    customer_name: 'Mohammed Al-Rashid',
    customer_phone: '+225 02 98 76 54 32',
    customer_email: 'mohammed@example.com',
    origin: 'Shenzhen',
    destination: 'Abidjan',
    current_status: 'En transit',
    estimated_arrival_date: '2026-06-08',
    notes: 'Express shipment in transit'
  }
];

let successCount = 0;
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

    console.log(`✓ Shipment created: ${shipmentData.tracking_code} - ${shipmentData.current_status}`);
    successCount++;
  } catch (error) {
    if (!error.message.includes('UNIQUE constraint failed')) {
      console.error(`✗ Error creating ${shipmentData.tracking_code}:`, error.message);
    }
  }
});

db.close();
console.log('\n✅ Database initialization complete!');
console.log(`📁 Database location: ${dbPath}`);
console.log(`📦 Shipments created: ${successCount}/${shipments.length}`);
console.log('\n📋 Tracking codes for testing:');
shipments.forEach(s => console.log(`   • ${s.tracking_code} - ${s.current_status}`));
