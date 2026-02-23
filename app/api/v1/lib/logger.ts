// app/api/v1/lib/logger.ts
import type { NextRequest } from "next/server";

enum LogLevel { INFO, WARN, ERROR }
const LevelName = { [LogLevel.INFO]: "INFO", [LogLevel.WARN]: "WARN", [LogLevel.ERROR]: "ERROR" } as const;

function emit(level: LogLevel, message: string, context?: any) {
  const timestamp = new Date().toISOString();
  const line = `${timestamp} [${LevelName[level]}] ${message}`;
  // Single console call to keep logs together
  if (context) console.log(line, context); else console.log(line);
}

export function reqMeta(req: NextRequest) {
  const url = new URL(req.url);
  const headers = req.headers;
  const ip = headers.get("x-forwarded-for") || headers.get("x-real-ip") || undefined;
  return {
    method: req.method,
    url: url.toString(),
    path: url.pathname,
    search: url.search,
    origin: headers.get("origin") || undefined,
    referer: headers.get("referer") || undefined,
    ua: headers.get("user-agent") || undefined,
    ip,
  };
}

export const logger = {
  info(message: string, context?: any) { emit(LogLevel.INFO, message, context); },
  warn(message: string, context?: any) { emit(LogLevel.WARN, message, context); },
  error(message: string, context?: any) { emit(LogLevel.ERROR, message, context); },
  request(req: NextRequest, message: string, extra?: any) {
    emit(LogLevel.INFO, message, { ...reqMeta(req), ...extra });
  },
  response(req: NextRequest, status: number, extra?: any) {
    emit(LogLevel.INFO, "response", { ...reqMeta(req), status, ...extra });
  },
  failure(req: NextRequest, err: unknown, extra?: any) {
    const error = err instanceof Error ? { name: err.name, message: err.message, stack: err.stack } : err;
    emit(LogLevel.ERROR, "error", { ...reqMeta(req), error, ...extra });
  },
};
