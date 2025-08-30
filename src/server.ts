import http, { IncomingMessage, ServerResponse } from "http";
import url from "url";
import querystring from "querystring";
import { readJSON, writeJSON, appendFile } from "./lib/store.js";
import { validateEmail, validatePasswordStrength, hashPassword, verifyPassword, newId, nowISO, addDays, addHours, isExpired, signCookie, verifySignedCookie } from "./lib/security.js";
import { User, Session, PasswordResetToken, Flash } from "./types.js";

const USERS_PATH = "data/users.json";
const SESSIONS_PATH = "data/sessions.json";
const TOKENS_PATH = "data/resetTokens.json";
const OUTBOX_DIR = "data/outbox";
const COOKIE_NAME = "session";
const COOKIE_SECRET = process.env.COOKIE_SECRET || "dev-secret-change-me";
const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

type Ctx = {
  req: IncomingMessage & { body?: Record<string, string> };
  res: ServerResponse;
  user: User | null;
  session: Session | null;
  flash?: Flash | null;
};

function getUsers(): User[] {
  return readJSON<User[]>(USERS_PATH, []);
}
function saveUsers(users: User[]) {
  writeJSON<User[]>(USERS_PATH, users);
}
function getSessions(): Session[] {
  return readJSON<Session[]>(SESSIONS_PATH, []);
}
function saveSessions(sessions: Session[]) {
  writeJSON<Session[]>(SESSIONS_PATH, sessions);
}
function getTokens(): PasswordResetToken[] {
  return readJSON<PasswordResetToken[]>(TOKENS_PATH, []);
}
function saveTokens(tokens: PasswordResetToken[]) {
  writeJSON<PasswordResetToken[]>(TOKENS_PATH, tokens);
}

function parseCookies(req: IncomingMessage): Record<string, string> {
  const header = req.headers.cookie || "";
  return header.split(";").reduce((acc, part) => {
    const [k, v] = part.trim().split("=");
    if (!k) return acc;
    acc[k] = decodeURIComponent(v || "");
    return acc;
  }, {} as Record<string, string>);
}

function setCookie(res: ServerResponse, name: string, value: string, opts: { httpOnly?: boolean; path?: string; maxAge?: number; sameSite?: "Lax" | "Strict" | "None" } = {}) {
  const parts = [`${name}=${encodeURIComponent(value)}`];
  if (opts.maxAge) parts.push(`Max-Age=${opts.maxAge}`);
  parts.push(`Path=${opts.path || "/"}`);
  if (opts.httpOnly !== false) parts.push("HttpOnly");
  parts.push(`SameSite=${opts.sameSite || "Lax"}`);
  res.setHeader("Set-Cookie", parts.join("; "));
}

function clearCookie(res: ServerResponse, name: string) {
  res.setHeader("Set-Cookie", `${name}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax`);
}

function redirect(res: ServerResponse, to: string) {
  res.statusCode = 302;
  res.setHeader("Location", to);
  res.end();
}

function render(template: string, params: Record<string, any>): string {
  // naive template interpolation
  let out = template.replace(/{{\s*([a-zA-Z0-9_.]+)\s*}}/g, (_, key) => {
    const parts = key.split(".");
    let val: any = params;
    for (const p of parts) val = val?.[p];
    return (val ?? "").toString();
  });
  // conditional blocks {{#if var}} ... {{/if}}
  out = out.replace(/{{#if\s+([^}]+)}}([\s\S]*?){{\/if}}/g, (_, cond, content) => {
    const v = (params as any)[cond.trim()];
    return v ? content : "";
  });
  return out;
}

function page(title: string, user: User | null, content: string, message?: Flash | null) {
  const layout = readFile("src/views/layout.html");
  const wrapped = layout
    .replace("{{title}}", title)
    .replace("{{year}}", new Date().getFullYear().toString())
    .replace("{{#if user}}", user ? "" : "{{HIDE}}")
    .replace("{{#else}}", "{{ELSE}}")
    .replace("{{/if}}", "")
    .replace("{{ELSE}}", user ? "{{HIDE}}" : "")
    .replace(/{{HIDE}}/g, "");
  const msgPartial = readFile("src/views/partials/messages.html");
  const msgHtml = message ? render(msgPartial, { message }) : "";
  const finalContent = content.replace("{{messages}}", msgHtml);
  return wrapped.replace("{{content}}", finalContent).replace(/{{user\.([a-z]+)}}/g, (_, k) => (user as any)?.[k] ?? "");
}

function readFile(p: string) {
  const fs = awaitImport("fs") as typeof import("fs");
  return fs.readFileSync(p, "utf8");
}

async function awaitImport(mod: string) {
  // For ts-node/tsc compatibility; using require dynamically would break ESM
  // @ts-ignore
  return (await import(mod));
}

async function parseBody(req: IncomingMessage): Promise<Record<string, string>> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(chunk as Buffer);
  const raw = Buffer.concat(chunks).toString("utf8");
  const contentType = (req.headers["content-type"] || "").toString();
  if (contentType.includes("application/x-www-form-urlencoded")) {
    return querystring.parse(raw) as Record<string, string>;
  } else if (contentType.includes("application/json")) {
    try { return JSON.parse(raw); } catch { return {}; }
  }
  return {};
}

function findUserByEmail(email: string): User | undefined {
  return getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
}

function requireAuth(ctx: Ctx, next: () => void) {
  if (!ctx.user) {
    redirect(ctx.res, "/login?error=Please%20login%20to%20continue");
    return;
  }
  next();
}

function getFlashFromQuery(req: IncomingMessage): Flash | null {
  const parsed = url.parse(req.url || "", true);
  const q = parsed.query || {};
  if (q.success) return { type: "success", message: String(q.success) };
  if (q.error) return { type: "error", message: String(q.error) };
  if (q.info) return { type: "info", message: String(q.info) };
  return null;
}

async function sendEmail(to: string, subject: string, html: string) {
  const path = `${OUTBOX_DIR}/${Date.now()}_${to.replace(/[^a-zA-Z0-9@.]+/g, "_")}.eml`;
  const content = [
    `To: ${to}`,
    `Subject: ${subject}`,
    "Content-Type: text/html; charset=utf-8",
    "",
    html
  ].join("\n");
  appendFile(path, content + "\n");
}

async function handle(req: IncomingMessage, res: ServerResponse) {
  const parsed = url.parse(req.url || "", true);
  const path = parsed.pathname || "/";
  const method = (req.method || "GET").toUpperCase();
  const cookies = parseCookies(req);
  const signed = cookies[COOKIE_NAME];
  const sessionId = signed ? verifySignedCookie(signed, COOKIE_SECRET) : null;
  let session: Session | null = null;
  let user: User | null = null;
  let sessions = getSessions();
  if (sessionId) {
    session = sessions.find(s => s.id === sessionId) || null;
    if (session && !isExpired(session.expiresAt)) {
      const u = getUsers().find(x => x.id === session!.userId) || null;
      user = u;
    } else if (session) {
      // Clean up expired
      sessions = sessions.filter(s => s.id !== session!.id);
      saveSessions(sessions);
      session = null;
    }
  }
  const flash = getFlashFromQuery(req);
  const ctx: Ctx = { req: req as any, res, user, session, flash };

  if (method === "GET" && path === "/") {
    const tpl = readFile("src/views/home.html");
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.end(page("Home", user, tpl, flash));
    return;
  }

  if (method === "GET" && path === "/register") {
    const tpl = readFile("src/views/register.html");
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.end(page("Register", user, tpl, flash));
    return;
  }

  if (method === "POST" && path === "/register") {
    (req as any).body = await parseBody(req);
    const { name = "", email = "", password = "" } = (req as any).body;
    const errors: string[] = [];
    if (!validateEmail(email)) errors.push("Invalid email.");
    const strength = validatePasswordStrength(password);
    if (!strength.valid) errors.push(...strength.errors);
    if (findUserByEmail(email)) errors.push("An account with that email already exists.");

    if (errors.length) {
      redirect(res, "/register?error=" + encodeURIComponent(errors.join(" ")));
      return;
    }

    const passwordHash = await hashPassword(password);
    const users = getUsers();
    const newUser: User = {
      id: newId("usr_"),
      email: email.toLowerCase().trim(),
      name: String(name || "").trim() || "Anonymous",
      passwordHash,
      createdAt: nowISO(),
      updatedAt: nowISO()
    };
    users.push(newUser);
    saveUsers(users);
    redirect(res, "/login?success=" + encodeURIComponent("Account created. Please login."));
    return;
  }

  if (method === "GET" && path === "/login") {
    const tpl = readFile("src/views/login.html");
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.end(page("Login", user, tpl, flash));
    return;
  }

  if (method === "POST" && path === "/login") {
    (req as any).body = await parseBody(req);
    const { email = "", password = "" } = (req as any).body;
    const u = findUserByEmail(email);
    if (!u || !(await verifyPassword(password, u.passwordHash))) {
      redirect(res, "/login?error=" + encodeURIComponent("Invalid credentials."));
      return;
    }
    const sessions = getSessions();
    const s: Session = {
      id: newId("sess_"),
      userId: u.id,
      createdAt: nowISO(),
      expiresAt: addDays(7)
    };
    sessions.push(s);
    saveSessions(sessions);
    setCookie(res, COOKIE_NAME, signCookie(s.id, COOKIE_SECRET), { httpOnly: true, maxAge: 7 * 24 * 3600, sameSite: "Lax" });
    redirect(res, "/dashboard?success=" + encodeURIComponent("Logged in successfully."));
    return;
  }

  if (method === "POST" && path === "/logout") {
    if (session) {
      const sessions = getSessions().filter(s => s.id !== session!.id);
      saveSessions(sessions);
    }
    clearCookie(res, COOKIE_NAME);
    redirect(res, "/?success=" + encodeURIComponent("Logged out."));
    return;
  }

  if (method === "GET" && path === "/dashboard") {
    if (!user) { redirect(res, "/login?error=" + encodeURIComponent("Please login to continue")); return; }
    const tpl = readFile("src/views/dashboard.html");
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.end(page("Dashboard", user, tpl, flash));
    return;
  }

  if (method === "GET" && path === "/profile") {
    if (!user) { redirect(res, "/login?error=" + encodeURIComponent("Please login to continue")); return; }
    const tpl = readFile("src/views/profile.html");
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.end(page("Your Profile", user, tpl, flash));
    return;
  }

  if (method === "POST" && path === "/profile") {
    if (!user) { redirect(res, "/login?error=" + encodeURIComponent("Please login to continue")); return; }
    (req as any).body = await parseBody(req);
    const { name = "" } = (req as any).body;
    const users = getUsers();
    const idx = users.findIndex(u => u.id === user!.id);
    if (idx >= 0) {
      users[idx].name = String(name || "").trim() || users[idx].name;
      users[idx].updatedAt = nowISO();
      saveUsers(users);
      redirect(res, "/profile?success=" + encodeURIComponent("Profile updated."));
      return;
    }
    redirect(res, "/profile?error=" + encodeURIComponent("User not found."));
    return;
  }

  if (method === "GET" && path === "/forgot-password") {
    const tpl = readFile("src/views/forgot-password.html");
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.end(page("Forgot Password", user, tpl, flash));
    return;
  }

  if (method === "POST" && path === "/forgot-password") {
    (req as any).body = await parseBody(req);
    const { email = "" } = (req as any).body;
    const u = findUserByEmail(email);
    // For security, always show success.
    if (u) {
      const tokens = getTokens();
      const token = newId("rst_");
      const rec = {
        id: newId("tok_"),
        userId: u.id,
        token,
        createdAt: nowISO(),
        expiresAt: addHours(1)
      } as PasswordResetToken;
      tokens.push(rec);
      saveTokens(tokens);
      const link = `${BASE_URL}/reset-password?token=${encodeURIComponent(token)}`;
      await sendEmail(u.email, "Password Reset", `<p>Click the link to reset your password:</p><p><a href="${link}">${link}</a></p>`);
    }
    redirect(res, "/forgot-password?success=" + encodeURIComponent("If that email exists, a reset link has been sent."));
    return;
  }

  if (method === "GET" && path === "/reset-password") {
    const token = (parsed.query?.token as string) || "";
    const tokens = getTokens();
    const rec = tokens.find(t => t.token === token) || null;
    if (!rec || isExpired(rec.expiresAt)) {
      redirect(res, "/forgot-password?error=" + encodeURIComponent("Invalid or expired reset link."));
      return;
    }
    const tpl = readFile("src/views/reset-password.html");
    const withToken = tpl.replace("{{token}}", token);
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.end(page("Reset Password", user, withToken, flash));
    return;
  }

  if (method === "POST" && path === "/reset-password") {
    const token = (parsed.query?.token as string) || "";
    const tokens = getTokens();
    const rec = tokens.find(t => t.token === token) || null;
    if (!rec || isExpired(rec.expiresAt)) {
      redirect(res, "/forgot-password?error=" + encodeURIComponent("Invalid or expired reset link."));
      return;
    }
    (req as any).body = await parseBody(req);
    const { password = "" } = (req as any).body;
    const strength = validatePasswordStrength(password);
    if (!strength.valid) {
      redirect(res, `/reset-password?token=${encodeURIComponent(token)}&error=${encodeURIComponent(strength.errors.join(" "))}`);
      return;
    }
    const users = getUsers();
    const idx = users.findIndex(u => u.id === rec.userId);
    if (idx < 0) {
      redirect(res, "/forgot-password?error=" + encodeURIComponent("Could not reset password."));
      return;
    }
    users[idx].passwordHash = await hashPassword(password);
    users[idx].updatedAt = nowISO();
    saveUsers(users);
    const remaining = tokens.filter(t => t.token !== token);
    saveTokens(remaining);
    redirect(res, "/login?success=" + encodeURIComponent("Password has been reset. Please login."));
    return;
  }

  // 404
  res.statusCode = 404;
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.end("Not found");
}

const server = http.createServer((req, res) => {
  handle(req, res).catch(err => {
    console.error("Unhandled error:", err);
    res.statusCode = 500;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.end("Internal Server Error");
  });
});

const PORT = Number(process.env.PORT || 3000);
server.listen(PORT, () => {
  console.log(`Server running at ${BASE_URL}`);
});
