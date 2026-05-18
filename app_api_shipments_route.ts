import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-local';
import { getAllShipments, createShipment, searchShipments } from '@/lib/db-local';

export async function GET(request: NextRequest) {
  try {
    await requireAuth();

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    let shipments;
    if (query) {
      shipments = searchShipments(query);
    } else {
      shipments = getAllShipments();
    }

    return NextResponse.json(shipments);
  } catch (error) {
    console.error('Error fetching shipments:', error);
    return NextResponse.json(
      { error: 'Unauthorized or internal server error' },
      { status: error instanceof Error && error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();

    const {
      tracking_code,
      customer_name,
      customer_phone,
      customer_email,
      origin,
      destination,
      estimated_arrival_date,
      notes,
    } = await request.json();

    if (!tracking_code || !customer_name || !customer_phone || !origin || !destination) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const shipment = createShipment({
      tracking_code,
      customer_name,
      customer_phone,
      customer_email,
      origin,
      destination,
      estimated_arrival_date,
      notes,
      created_by: user.id,
    });

    return NextResponse.json(shipment);
  } catch (error) {
    console.error('Error creating shipment:', error);
    return NextResponse.json(
      { error: error instanceof Error && error.message === 'Unauthorized' ? 'Unauthorized' : 'Internal server error' },
      { status: error instanceof Error && error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}
