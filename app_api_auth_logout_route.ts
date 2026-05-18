import { NextRequest, NextResponse } from 'next/server';
import { logoutUser } from '@/lib/auth-local';

export async function POST(request: NextRequest) {
  try {
    await logoutUser();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
