import crypto from "crypto";

export function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim().toLowerCase());
}

export type PasswordStrength = {
  valid: boolean;
  errors: string[];
};

export function validatePasswordStrength(password: string): PasswordStrength {
  const errors: string[] = [];
  if (password.length < 8) errors.push("Password must be at least 8 characters.");
  if (!/[a-z]/.test(password)) errors.push("Include a lowercase letter.");
  if (!/[A-Z]/.test(password)) errors.push("Include an uppercase letter.");
  if (!/[0-9]/.test(password)) errors.push("Include a number.");
  if (!/[^A-Za-z0-9]/.test(password)) errors.push("Include a special character.");
  return { valid: errors.length === 0, errors };
}

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16);
  const derived = await new Promise<Buffer>((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (err, key) => (err ? reject(err) : resolve(key)));
  });
  return `${salt.toString("hex")}:${derived.toString("hex")}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [saltHex, hashHex] = stored.split(":");
  if (!saltHex || !hashHex) return false;
  const salt = Buffer.from(saltHex, "hex");
  const derived = await new Promise<Buffer>((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (err, key) => (err ? reject(err) : resolve(key)));
  });
  return crypto.timingSafeEqual(Buffer.from(hashHex, "hex"), derived);
}

export function newId(prefix = ""): string {
  return prefix + crypto.randomBytes(16).toString("hex");
}

export function nowISO(): string {
  return new Date().toISOString();
}

export function addDays(d: number): string {
  const t = new Date();
  t.setDate(t.getDate() + d);
  return t.toISOString();
}

export function addHours(h: number): string {
  const t = new Date();
  t.setHours(t.getHours() + h);
  return t.toISOString();
}

export function isExpired(iso: string): boolean {
  return new Date(iso).getTime() <= Date.now();
}

export function signCookie(value: string, secret: string): string {
  const h = crypto.createHmac("sha256", secret).update(value).digest("hex");
  return `${value}.${h}`;
}

export function verifySignedCookie(signed: string, secret: string): string | null {
  const parts = signed.split(".");
  if (parts.length < 2) return null;
  const value = parts.slice(0, -1).join(".");
  const sig = parts[parts.length - 1];
  const expected = crypto.createHmac("sha256", secret).update(value).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected)) ? value : null;
}
