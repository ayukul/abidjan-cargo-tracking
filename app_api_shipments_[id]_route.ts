import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-local';
import { getShipmentWithHistory, updateShipment, updateShipmentStatus, deleteShipment } from '@/lib/db-local';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAuth();

    const { id } = params;
    const result = getShipmentWithHistory(id);

    if (!result.shipment) {
      return NextResponse.json(
        { error: 'Shipment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching shipment:', error);
    return NextResponse.json(
      { error: 'Unauthorized or internal server error' },
      { status: error instanceof Error && error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAuth();

    const { id } = params;
    const data = await request.json();

    const updatedShipment = updateShipment(id, data);
    return NextResponse.json(updatedShipment);
  } catch (error) {
    console.error('Error updating shipment:', error);
    return NextResponse.json(
      { error: error instanceof Error && error.message === 'Unauthorized' ? 'Unauthorized' : 'Internal server error' },
      { status: error instanceof Error && error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAuth();

    const { id } = params;
    const success = deleteShipment(id);

    if (!success) {
      return NextResponse.json(
        { error: 'Shipment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting shipment:', error);
    return NextResponse.json(
      { error: error instanceof Error && error.message === 'Unauthorized' ? 'Unauthorized' : 'Internal server error' },
      { status: error instanceof Error && error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth();

    const { id } = params;
    const { status, note } = await request.json();

    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      );
    }

    const result = updateShipmentStatus(id, status, note || '', user.id);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating shipment status:', error);
    return NextResponse.json(
      { error: error instanceof Error && error.message === 'Unauthorized' ? 'Unauthorized' : 'Internal server error' },
      { status: error instanceof Error && error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}
