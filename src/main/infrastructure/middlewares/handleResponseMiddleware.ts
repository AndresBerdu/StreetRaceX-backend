import type { CookieOptions, Response } from "express";
import type { Result } from "../../domain/Result.ts";

type Cookie = {
  name: string;
  value: string;
  options?: CookieOptions;
};

export const handleResponse = <T>(
  res: Response,
  result: Result<T>,
  cookies?: Cookie[],
) => {
  if (!result.ok) {
    res.status(result.statusCode).json({ ok: false, error: result.error });
    return;
  }

  let response = res.status(result.statusCode);

  if (cookies) {
    cookies.forEach(({ name, value, options }) => {
      response = response.cookie(name, value, options ?? {});
    });
  }

  response.json({ ok: true, data: result.data, message: result.message });
};