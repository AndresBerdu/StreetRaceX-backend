export type Result<T> =
  | { ok: true; data: T; message: string }
  | { ok: false; statusCode: number; error: string };

export const success = <T>(data: T, message: string): Result<T> => ({
  ok: true,
  data,
  message,
});

export const failure = (statusCode: number, error: string): Result<never> => ({
  ok: false,
  statusCode,
  error,
});
