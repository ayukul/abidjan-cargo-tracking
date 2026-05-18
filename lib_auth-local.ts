import { getIronSession } from 'iron-session';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { getDb, getUserByEmail, getUserById } from './db-local';

// Session configuration
export const sessionOptions = {
  password: process.env.SESSION_SECRET || 'your-secret-key-change-in-production-min-32-chars!!',
  cookieName: 'cargo-auth',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
};

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

declare global {
  interface IronSessionData {
    user?: SessionUser;
  }
}

export async function getSession() {
  const cookieStore = await cookies();
  const session = await getIronSession<{ user?: SessionUser }>(cookieStore, sessionOptions);
  return session;
}

export async function isAuthenticated() {
  const session = await getSession();
  return !!session.user;
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const session = await getSession();
  return session.user || null;
}

export async function loginUser(email: string, password: string): Promise<{ success: boolean; error?: string }> {
  try {
    const db = getDb();

    // Get user
    const user = getUserByEmail(email);
    if (!user) {
      return { success: false, error: 'Invalid credentials' };
    }

    // Get password hash from DB
    const userRecord = db.prepare('SELECT password_hash FROM users WHERE id = ?').get(user.id) as any;
    if (!userRecord) {
      return { success: false, error: 'Invalid credentials' };
    }

    // Verify password
    const passwordMatch = bcrypt.compareSync(password, userRecord.password_hash);
    if (!passwordMatch) {
      return { success: false, error: 'Invalid credentials' };
    }

    // Set session
    const session = await getSession();
    session.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
    await session.save();

    return { success: true };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'An error occurred during login' };
  }
}

export async function logoutUser() {
  const session = await getSession();
  session.destroy();
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Unauthorized');
  }
  return user;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}
