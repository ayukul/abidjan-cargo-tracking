import Database from 'better-sqlite3';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    const dbPath = path.join(process.cwd(), 'db', 'cargo.db');
    db = new Database(dbPath);
    db.pragma('foreign_keys = ON');
  }
  return db;
}

// Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  created_at: string;
}

export interface Shipment {
  id: string;
  tracking_code: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  origin: string;
  destination: string;
  current_status: string;
  estimated_arrival_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface StatusHistory {
  id: string;
  shipment_id: string;
  status: string;
  note: string | null;
  created_at: string;
  created_by: string;
}

// User operations
export function getUserByEmail(email: string): User | undefined {
  const database = getDb();
  return database.prepare('SELECT * FROM users WHERE email = ?').get(email) as User | undefined;
}

export function getUserById(id: string): User | undefined {
  const database = getDb();
  return database.prepare('SELECT * FROM users WHERE id = ?').get(id) as User | undefined;
}

// Shipment operations
export function getShipmentByTrackingCode(trackingCode: string): Shipment | undefined {
  const database = getDb();
  return database.prepare('SELECT * FROM shipments WHERE tracking_code = ?').get(trackingCode) as Shipment | undefined;
}

export function getShipmentWithHistory(shipmentId: string) {
  const database = getDb();
  const shipment = database.prepare('SELECT * FROM shipments WHERE id = ?').get(shipmentId) as Shipment | undefined;
  const history = database.prepare('SELECT * FROM shipment_status_history WHERE shipment_id = ? ORDER BY created_at DESC').all(shipmentId) as StatusHistory[];
  return { shipment, history };
}

export function getAllShipments(): Shipment[] {
  const database = getDb();
  return database.prepare('SELECT * FROM shipments ORDER BY created_at DESC').all() as Shipment[];
}

export function searchShipments(query: string): Shipment[] {
  const database = getDb();
  const searchTerm = `%${query}%`;
  return database.prepare(`
    SELECT * FROM shipments
    WHERE tracking_code LIKE ?
       OR customer_name LIKE ?
       OR customer_phone LIKE ?
    ORDER BY created_at DESC
  `).all(searchTerm, searchTerm, searchTerm) as Shipment[];
}

export function getShipmentStats() {
  const database = getDb();
  const stats = database.prepare(`
    SELECT
      COUNT(*) as total,
      SUM(CASE WHEN current_status = 'Livré' THEN 1 ELSE 0 END) as delivered,
      SUM(CASE WHEN current_status IN ('Reçu en Chine', 'En préparation', 'Expédié', 'En transit') THEN 1 ELSE 0 END) as in_transit,
      SUM(CASE WHEN current_status = 'Retardé' THEN 1 ELSE 0 END) as delayed
    FROM shipments
  `).get() as any;
  return {
    total: stats.total || 0,
    delivered: stats.delivered || 0,
    in_transit: stats.in_transit || 0,
    delayed: stats.delayed || 0,
  };
}

export function createShipment(data: {
  tracking_code: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  origin: string;
  destination: string;
  estimated_arrival_date?: string;
  notes?: string;
  created_by: string;
}): Shipment {
  const database = getDb();
  const id = 'ship_' + uuidv4();
  database.prepare(`
    INSERT INTO shipments (
      id, tracking_code, customer_name, customer_phone, customer_email,
      origin, destination, estimated_arrival_date, notes, created_by
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    data.tracking_code,
    data.customer_name,
    data.customer_phone,
    data.customer_email || null,
    data.origin,
    data.destination,
    data.estimated_arrival_date || null,
    data.notes || null,
    data.created_by
  );
  return getShipmentWithHistory(id).shipment!;
}

export function updateShipment(id: string, data: Partial<Shipment>): Shipment {
  const database = getDb();
  const allowedFields = ['customer_name', 'customer_phone', 'customer_email', 'origin', 'destination', 'estimated_arrival_date', 'notes'];
  const updates: string[] = [];
  const values: any[] = [];

  allowedFields.forEach(field => {
    if (field in data) {
      updates.push(`${field} = ?`);
      values.push((data as any)[field]);
    }
  });

  updates.push('updated_at = CURRENT_TIMESTAMP');
  values.push(id);

  if (updates.length > 1) {
    database.prepare(`UPDATE shipments SET ${updates.join(', ')} WHERE id = ?`).run(...values);
  }

  return getShipmentWithHistory(id).shipment!;
}

export function updateShipmentStatus(shipmentId: string, newStatus: string, note: string, userId: string) {
  const database = getDb();

  // Update shipment status
  database.prepare('UPDATE shipments SET current_status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
    .run(newStatus, shipmentId);

  // Add to history
  const historyId = 'hist_' + uuidv4();
  database.prepare(`
    INSERT INTO shipment_status_history (id, shipment_id, status, note, created_by)
    VALUES (?, ?, ?, ?, ?)
  `).run(historyId, shipmentId, newStatus, note, userId);

  return getShipmentWithHistory(shipmentId);
}

export function deleteShipment(id: string): boolean {
  const database = getDb();
  const result = database.prepare('DELETE FROM shipments WHERE id = ?').run(id);
  return result.changes > 0;
}
