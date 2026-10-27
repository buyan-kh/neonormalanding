import "server-only";
import crypto from "crypto";

export const INSIDE_COOKIE = "inside_session";
const SESSION_DAYS = 30;
const MAX_PASSCODE_LENGTH = 200;
const ALLOWED_NAME = "tugi";
const DISPLAY_NAME = "Tugi";

const BUILTIN_SALT = Buffer.from("76e33a6730b68b0d3e19f3fcced2cc9b", "hex");
const BUILTIN_HASH = Buffer.from("6db2b6cb573d1e4d01bcc7b9bd786a1ea6d71ebc58aeb136e1eb44b3c0d548ff", "hex");
const BUILTIN_SESSION_SECRET = "603f3f9f36311ecf7b454e76282551e2920d31086940023ce957aa50d408dd80";

export type InsideSession = { name: string };

function sessionSecret() {
  const override = process.env.INSIDE_SESSION_SECRET;
  return override && override.length > 0 ? override : BUILTIN_SESSION_SECRET;
}

function passcodeDigest(passcode: string, salt: Buffer) {
  return crypto.createHash("sha256").update(Buffer.concat([salt, Buffer.from(passcode, "utf8")])).digest();
}

function digestsMatch(actual: Buffer, expected: Buffer) {
  return actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
}

function passcodeMatches(passcode: string) {
  const material = passcode.slice(0, MAX_PASSCODE_LENGTH);
  const override = process.env.INSIDE_PASSCODE;
  if (override && override.length > 0) {
    const salt = crypto.createHash("sha256").update("neonorma-inside-passcode").digest();
    const expected = passcodeDigest(override, salt);
    const actual = passcodeDigest(material, salt);
    return passcode.length > 0 && passcode.length <= MAX_PASSCODE_LENGTH && digestsMatch(actual, expected);
  }
  const actual = passcodeDigest(material, BUILTIN_SALT);
  return passcode.length > 0 && passcode.length <= MAX_PASSCODE_LENGTH && digestsMatch(actual, BUILTIN_HASH);
}

export function credentialsMatch(name: string, passcode: string) {
  const passOk = passcodeMatches(passcode);
  const nameOk = name.trim().toLowerCase() === ALLOWED_NAME;
  return passOk && nameOk;
}

function sign(body: string) {
  return crypto.createHmac("sha256", sessionSecret()).update(body).digest();
}

export function createSessionToken() {
  const exp = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  const body = Buffer.from(JSON.stringify({ name: DISPLAY_NAME, exp }), "utf8").toString("base64url");
  const sig = sign(body).toString("base64url");
  return `${body}.${sig}`;
}

export function readSessionToken(token: string | undefined | null): InsideSession | null {
  if (!token) return null;
  const dot = token.indexOf(".");
  if (dot <= 0) return null;
  const body = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = sign(body);
  const actual = Buffer.from(sig, "base64url");
  if (!digestsMatch(actual, expected)) return null;
  try {
    const parsed = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as { name?: unknown; exp?: unknown };
    if (parsed.name !== DISPLAY_NAME || typeof parsed.exp !== "number" || parsed.exp < Date.now()) return null;
    return { name: DISPLAY_NAME };
  } catch {
    return null;
  }
}

export function sessionCookieOptions(secure: boolean) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure,
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  };
}

export function requestIsSecure(request: Request) {
  const forwarded = request.headers.get("x-forwarded-proto");
  if (forwarded) return forwarded.split(",")[0]?.trim() === "https";
  return new URL(request.url).protocol === "https:";
}
