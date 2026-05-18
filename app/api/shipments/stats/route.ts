import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-local';
import { getShipmentStats } from '@/lib/db-local';

export async function GET(request: NextRequest) {
  try {
    await requireAuth();

    const stats = getShipmentStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Unauthorized or internal server error' },
      { status: error instanceof Error && error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}
