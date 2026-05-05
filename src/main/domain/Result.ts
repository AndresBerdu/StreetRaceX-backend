import type { AppError } from "./AppError.ts";

export type Result<T> =
  | { ok: true; statusCode: number; data: T; message: string }
  | { ok: false; statusCode: number; error: string };

export const success = <T>(statusCode: number, data: T, message: string): Result<T> => ({
  ok: true,
  statusCode,
  data,
  message,
});

export const failure = (error: AppError): Result<never> => ({
  ok: false,
  statusCode: error.statusCode,
  error: error.message,
});
