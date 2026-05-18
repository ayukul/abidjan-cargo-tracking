import { NextRequest, NextResponse } from 'next/server';
import { getShipmentByTrackingCode, getShipmentWithHistory } from '@/lib/db-local';

export async function GET(request: NextRequest, { params }: { params: { code: string } }) {
  try {
    const { code } = params;

    const shipment = getShipmentByTrackingCode(code);

    if (!shipment) {
      return NextResponse.json(
        { error: 'Shipment not found' },
        { status: 404 }
      );
    }

    const result = getShipmentWithHistory(shipment.id);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching tracking info:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
