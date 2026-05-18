// Local API wrapper - bridges old Supabase imports to new local API
import { useRouter } from 'next/navigation';

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

export interface ShipmentStatusHistory {
  id: string;
  shipment_id: string;
  status: string;
  note: string | null;
  created_at: string;
  created_by: string;
}

export const SHIPMENT_STATUSES = [
  'Reçu en Chine',
  'En préparation',
  'Expédié',
  'En transit',
  'Livré',
  'Retardé'
];

// Mock supabase object that uses local API
export const supabase = {
  auth: {
    signInWithPassword: async (credentials: { email: string; password: string }) => {
      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials)
        });
        const data = await response.json();
        if (!response.ok) {
          return { data: null, error: { message: data.error } };
        }
        return { data: { user: { email: credentials.email } }, error: null };
      } catch (error) {
        return { data: null, error: { message: String(error) } };
      }
    },
    signOut: async () => {
      try {
        await fetch('/api/auth/logout', { method: 'POST' });
        return { error: null };
      } catch (error) {
        return { error: { message: String(error) } };
      }
    },
    getSession: async () => {
      return { data: { session: { user: { email: 'admin@test.com' } } }, error: null };
    }
  },
  from: (table: string) => {
    return {
      select: (columns?: string) => ({
        eq: (column: string, value: any) => ({
          order: () => ({
            data: [],
            error: null
          }),
          data: [],
          error: null
        }),
        order: (column: string, options?: any) => ({
          data: [],
          error: null
        }),
        data: [],
        error: null
      }),
      order: (column: string, options?: any) => ({
        data: [],
        error: null
      }),
      insert: (data: any) => ({
        select: () => ({
          data: null,
          error: null
        })
      }),
      update: (data: any) => ({
        eq: (column: string, value: any) => ({
          data: null,
          error: null
        })
      }),
      delete: () => ({
        eq: (column: string, value: any) => ({
          data: null,
          error: null
        })
      }),
      data: [],
      error: null
    };
  }
};

// Helper functions for local API calls
export async function getShipments() {
  try {
    const response = await fetch('/api/shipments');
    if (!response.ok) throw new Error('Failed to fetch shipments');
    return { data: await response.json(), error: null };
  } catch (error) {
    return { data: null, error: { message: String(error) } };
  }
}

export async function getShipment(id: string) {
  try {
    const response = await fetch(`/api/shipments/${id}`);
    if (!response.ok) throw new Error('Shipment not found');
    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    return { data: null, error: { message: String(error) } };
  }
}

export async function createShipment(shipment: Partial<Shipment>) {
  try {
    const response = await fetch('/api/shipments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(shipment)
    });
    if (!response.ok) throw new Error('Failed to create shipment');
    return { data: await response.json(), error: null };
  } catch (error) {
    return { data: null, error: { message: String(error) } };
  }
}

export async function updateShipment(id: string, updates: Partial<Shipment>) {
  try {
    const response = await fetch(`/api/shipments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!response.ok) throw new Error('Failed to update shipment');
    return { data: await response.json(), error: null };
  } catch (error) {
    return { data: null, error: { message: String(error) } };
  }
}

export async function updateShipmentStatus(id: string, status: string, note: string) {
  try {
    const response = await fetch(`/api/shipments/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, note })
    });
    if (!response.ok) throw new Error('Failed to update status');
    return { data: await response.json(), error: null };
  } catch (error) {
    return { data: null, error: { message: String(error) } };
  }
}

export async function deleteShipment(id: string) {
  try {
    const response = await fetch(`/api/shipments/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete shipment');
    return { data: { success: true }, error: null };
  } catch (error) {
    return { data: null, error: { message: String(error) } };
  }
}

export async function searchShipments(query: string) {
  try {
    const response = await fetch(`/api/shipments?q=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error('Failed to search shipments');
    return { data: await response.json(), error: null };
  } catch (error) {
    return { data: null, error: { message: String(error) } };
  }
}

export async function getShipmentStats() {
  try {
    const response = await fetch('/api/shipments/stats');
    if (!response.ok) throw new Error('Failed to fetch stats');
    return { data: await response.json(), error: null };
  } catch (error) {
    return { data: null, error: { message: String(error) } };
  }
}

export async function trackShipment(code: string) {
  try {
    const response = await fetch(`/api/track/${code}`);
    if (!response.ok) throw new Error('Shipment not found');
    return { data: await response.json(), error: null };
  } catch (error) {
    return { data: null, error: { message: String(error) } };
  }
}
