import fs from "fs";
import path from "path";

const ROOT = process.cwd();
function filePath(p: string) {
  return path.join(ROOT, p);
}

export function readJSON<T>(relativePath: string, fallback: T): T {
  const p = filePath(relativePath);
  try {
    const raw = fs.readFileSync(p, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeJSON<T>(relativePath: string, data: T): void {
  const p = filePath(relativePath);
  const dir = path.dirname(p);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(p, JSON.stringify(data, null, 2), "utf8");
}

export function appendFile(relativePath: string, content: string): void {
  const p = filePath(relativePath);
  const dir = path.dirname(p);
  fs.mkdirSync(dir, { recursive: true });
  fs.appendFileSync(p, content, "utf8");
}
