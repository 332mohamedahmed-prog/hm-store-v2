import bcrypt from "bcryptjs";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

const SALT_ROUNDS = 10;

// ─── Password hashing ────────────────────────────────────────────
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// ─── User CRUD ───────────────────────────────────────────────────
export async function createUser(data: {
  name: string;
  email: string;
  password: string;
  phone?: string;
}) {
  const hashed = await hashPassword(data.password);
  const result = await db
    .insert(users)
    .values({
      name: data.name,
      email: data.email.toLowerCase(),
      phone: data.phone || null,
      password: hashed,
      role: "customer",
      active: true,
    })
    .returning();

  return result[0];
}

export async function getUserByEmail(email: string) {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.email, email.toLowerCase()))
    .limit(1);
  return result[0] || null;
}

export async function getUserById(id: string) {
  const result = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      phone: users.phone,
      address: users.address,
      city: users.city,
      governorate: users.governorate,
      role: users.role,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(eq(users.id, id))
    .limit(1);
  return result[0] || null;
}

export async function updateUser(id: string, data: {
  name?: string;
  phone?: string;
  address?: string;
  city?: string;
  governorate?: string;
}) {
  const result = await db
    .update(users)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(users.id, id))
    .returning();
  return result[0];
}

// ─── Simple session token (base64-encoded userId) ────────────────
// In production, use proper JWT with secret. For this phase, we use
// a signed cookie approach via the API.

export function generateToken(userId: string): string {
  // Simple reversible token — in production use JWT
  const payload = JSON.stringify({ userId, ts: Date.now() });
  return Buffer.from(payload).toString("base64url");
}

export function verifyToken(token: string): string | null {
  try {
    const payload = JSON.parse(Buffer.from(token, "base64url").toString());
    return payload.userId || null;
  } catch {
    return null;
  }
}
