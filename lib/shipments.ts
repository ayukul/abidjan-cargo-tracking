import { supabase, Shipment, ShipmentStatusHistory } from './supabase';

/**
 * Get shipment by tracking code
 */
export async function getShipmentByTrackingCode(trackingCode: string) {
  try {
    const { data, error } = await supabase
      .from('shipments')
      .select('*')
      .eq('tracking_code', trackingCode)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Not found
      }
      throw error;
    }

    return data as Shipment;
  } catch (error) {
    console.error('Error fetching shipment:', error);
    throw error;
  }
}

/**
 * Get shipment with its full history
 */
export async function getShipmentWithHistory(trackingCode: string) {
  try {
    const shipment = await getShipmentByTrackingCode(trackingCode);
    if (!shipment) return null;

    const { data: history, error } = await supabase
      .from('shipment_status_history')
      .select('*')
      .eq('shipment_id', shipment.id)
      .order('created_at', { ascending: true });

    if (error) throw error;

    return {
      shipment,
      history: history as ShipmentStatusHistory[],
    };
  } catch (error) {
    console.error('Error fetching shipment with history:', error);
    throw error;
  }
}

/**
 * Search shipments by various criteria
 */
export async function searchShipments(
  query: string,
  searchType: 'tracking_code' | 'customer_name' | 'customer_phone' = 'tracking_code'
) {
  try {
    let queryBuilder = supabase
      .from('shipments')
      .select('*')
      .order('created_at', { ascending: false });

    if (searchType === 'tracking_code') {
      queryBuilder = queryBuilder.ilike('tracking_code', `%${query}%`);
    } else if (searchType === 'customer_name') {
      queryBuilder = queryBuilder.ilike('customer_name', `%${query}%`);
    } else if (searchType === 'customer_phone') {
      queryBuilder = queryBuilder.ilike('customer_phone', `%${query}%`);
    }

    const { data, error } = await queryBuilder;

    if (error) throw error;

    return data as Shipment[];
  } catch (error) {
    console.error('Error searching shipments:', error);
    throw error;
  }
}

/**
 * Get all shipments (admin)
 */
export async function getAllShipments(limit = 50, offset = 0) {
  try {
    const { data, error, count } = await supabase
      .from('shipments')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return { shipments: data as Shipment[], total: count };
  } catch (error) {
    console.error('Error fetching all shipments:', error);
    throw error;
  }
}

/**
 * Get shipment statistics
 */
export async function getShipmentStats() {
  try {
    const { data, error } = await supabase
      .from('shipments')
      .select('current_status');

    if (error) throw error;

    const shipments = data as Pick<Shipment, 'current_status'>[];
    const total = shipments.length;
    const inTransit = shipments.filter(s => s.current_status === 'En transit').length;
    const delivered = shipments.filter(s => s.current_status === 'Livré').length;
    const delayed = shipments.filter(s => s.current_status === 'Retardé').length;

    return { total, inTransit, delivered, delayed };
  } catch (error) {
    console.error('Error fetching shipment stats:', error);
    throw error;
  }
}

/**
 * Create new shipment
 */
export async function createShipment(shipmentData: Omit<Shipment, 'id' | 'created_at' | 'updated_at'>) {
  try {
    const { data, error } = await supabase
      .from('shipments')
      .insert([shipmentData])
      .select()
      .single();

    if (error) throw error;

    // Add initial status history
    if (data) {
      await addStatusHistory(data.id, shipmentData.current_status, 'Colis créé et enregistré');
    }

    return data as Shipment;
  } catch (error) {
    console.error('Error creating shipment:', error);
    throw error;
  }
}

/**
 * Update shipment
 */
export async function updateShipment(
  shipmentId: string,
  updates: Partial<Shipment>
) {
  try {
    const { data, error } = await supabase
      .from('shipments')
      .update(updates)
      .eq('id', shipmentId)
      .select()
      .single();

    if (error) throw error;

    return data as Shipment;
  } catch (error) {
    console.error('Error updating shipment:', error);
    throw error;
  }
}

/**
 * Delete shipment
 */
export async function deleteShipment(shipmentId: string) {
  try {
    const { error } = await supabase
      .from('shipments')
      .delete()
      .eq('id', shipmentId);

    if (error) throw error;

    return true;
  } catch (error) {
    console.error('Error deleting shipment:', error);
    throw error;
  }
}

/**
 * Add status history entry
 */
export async function addStatusHistory(
  shipmentId: string,
  status: string,
  note?: string
) {
  try {
    const { data, error } = await supabase
      .from('shipment_status_history')
      .insert([{ shipment_id: shipmentId, status, note }])
      .select()
      .single();

    if (error) throw error;

    return data as ShipmentStatusHistory;
  } catch (error) {
    console.error('Error adding status history:', error);
    throw error;
  }
}

/**
 * Get shipment history
 */
export async function getShipmentHistory(shipmentId: string) {
  try {
    const { data, error } = await supabase
      .from('shipment_status_history')
      .select('*')
      .eq('shipment_id', shipmentId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    return data as ShipmentStatusHistory[];
  } catch (error) {
    console.error('Error fetching shipment history:', error);
    throw error;
  }
}
