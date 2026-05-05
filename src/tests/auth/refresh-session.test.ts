import request from "supertest";
import { beforeAll, describe, expect, it } from "vitest";
import { app } from "../../server.ts";

describe("Auth refresh session", () => {
  let cookies: string[];

  /* Preparation for sign in with one user  */
  beforeAll(async () => {
    const loginResult = await request(app)
      .post("/api/auth/sign-in-session")
      .send({ username: "pedro", password: "Frutamadre09?" });

    const rawCookies = loginResult.headers["set-cookie"];

    cookies = Array.isArray(rawCookies)
      ? rawCookies
      : rawCookies
        ? [rawCookies]
        : [];
  });

  /* Test happy path new user create */
  it("Should return new cookies with access token and refresh token", async () => {
    const res = await request(app)
      .post("/api/auth/refresh-session")
      .set("Cookie", cookies);

    /* Status code response */
    expect(res.status).toBe(204);

    /* Cookies response */
    const newCookies = res.headers["set-cookie"] ?? [];
    expect(newCookies.length).toBeGreaterThan(0);

    if (Array.isArray(newCookies)) {
      const accessCookie = newCookies.find((c: string) =>
        c.startsWith("access_token="),
      );
      const refreshCookie = newCookies.find((c: string) =>
        c.startsWith("refresh_token="),
      );
      expect(accessCookie).toContain("access_token=");
      expect(refreshCookie).toContain("refresh_token=");
    }
  });

  /* Test if you don't provide the access token by cookies */
  it("Shoud faild if you don't provide access token", async () => {
    const res = await request(app).post("/api/auth/logue-out-session");

    expect(res.status).toBe(401);
  });
});
