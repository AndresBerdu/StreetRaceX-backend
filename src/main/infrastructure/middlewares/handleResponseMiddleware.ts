import type { Response } from "express";
import type { Result } from "../../domain/Result.ts";

export const handleResponse = <T>(res: Response, result: Result<T>) => {
  if (!result.ok) {
    return res.status(result.statusCode).json({
      ok: false,
      error: result.error,
    });
  }

  res.status(result.statusCode).json({
    ok: true,
    data: result.data,
    message: result.message,
  });
};