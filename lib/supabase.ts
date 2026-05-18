// Local API wrapper - bridges old Supabase imports to new local API

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

// Query builder for Supabase-like API
class QueryBuilder {
  private filters: any[] = [];
  private table: string;

  constructor(table: string) {
    this.table = table;
  }

  select() { return this; }
  eq(column: string, value: any) { this.filters.push({ type: 'eq', column, value }); return this; }
  ilike(column: string, value: any) { this.filters.push({ type: 'ilike', column, value }); return this; }
  order() { return this; }
  range() { return this; }

  async single() {
    const result = await this.buildAndFetch();
    const data = Array.isArray(result.data) ? result.data[0] : result.data;
    return { data, error: data ? null : { code: 'PGRST116' } };
  }

  private async buildAndFetch() {
    try {
      const trackingFilter = this.filters.find(f => f.type === 'eq' && f.column === 'tracking_code');
      if (trackingFilter) {
        const response = await fetch(`/api/track/${trackingFilter.value}`);
        if (!response.ok) return { data: null };
        return { data: await response.json() };
      }

      const ilikeFilter = this.filters.find(f => f.type === 'ilike');
      if (ilikeFilter) {
        const q = ilikeFilter.value.replace(/%/g, '');
        const response = await fetch(`/api/shipments?q=${encodeURIComponent(q)}`);
        if (!response.ok) return { data: [] };
        return { data: await response.json() };
      }

      const shipmentIdFilter = this.filters.find(f => f.type === 'eq' && f.column === 'shipment_id');
      if (shipmentIdFilter) {
        const response = await fetch(`/api/shipments/${shipmentIdFilter.value}`);
        if (!response.ok) return { data: [] };
        const result = await response.json();
        return { data: result.history || [] };
      }

      return { data: [] };
    } catch (error) {
      return { data: null, error };
    }
  }
}

// Supabase-like object
export const supabase = {
  auth: {
    signInWithPassword: async (creds: any) => {
      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(creds)
        });
        const data = await response.json();
        return response.ok ? { data: { user: creds }, error: null } : { data: null, error: { message: data.error } };
      } catch (error) {
        return { data: null, error: { message: String(error) } };
      }
    },
    signOut: async () => {
      await fetch('/api/auth/logout', { method: 'POST' });
      return { error: null };
    }
  },
  from: (table: string) => {
    const builder = new QueryBuilder(table);
    return {
      select: () => builder,
      insert: (data: any) => ({
        select: () => ({
          single: async () => {
            const response = await fetch(`/api/${table}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data)
            });
            return { data: await response.json(), error: null };
          }
        })
      }),
      update: (data: any) => ({
        eq: (col: string, val: any) => ({
          select: () => ({ single: async () => {
            const response = await fetch(`/api/${table}/${val}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data)
            });
            return { data: await response.json(), error: null };
          } })
        })
      }),
      delete: () => ({
        eq: (col: string, val: any) => ({ then: async () => {
          await fetch(`/api/${table}/${val}`, { method: 'DELETE' });
        }})
      })
    };
  }
};
