import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase credentials not found. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Export types
export type Shipment = {
  id: string;
  tracking_code: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  origin: string;
  destination: string;
  current_status: string;
  estimated_arrival_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
};

export type ShipmentStatusHistory = {
  id: string;
  shipment_id: string;
  status: string;
  note?: string;
  created_at: string;
  created_by?: string;
};

export const SHIPMENT_STATUSES = [
  'Reçu en Chine',
  'En préparation',
  'Expédié',
  'En transit',
  'Arrivé à Abidjan',
  'En dédouanement',
  'Prêt pour livraison',
  'Livré',
  'Retardé',
] as const;

export type ShipmentStatus = (typeof SHIPMENT_STATUSES)[number];
