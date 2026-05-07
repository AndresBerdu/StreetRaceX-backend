import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app } from "../../server.ts";

describe("Auth refresh session", () => {
  let userSlug = "";
  let cookies: string[];

  /* Preparation for sign in wih user and logue out after */
  beforeAll(async () => {
    const res = await request(app)
      .post("/api/auth/sign-up-session")
      .field("username", "test-3")
      .field("password", "TestPassword09?")
      .field("email", "test-3@gmail.com")
      .field(
        "locality",
        JSON.stringify({
          zone_localicity: "12 de Octubre",
          zone_city: "Medellín",
          zone_state: "Antioquia",
          zone_country: "Colombia",
        }),
      );

    const rawCookies = res.headers["set-cookie"];

    cookies = Array.isArray(rawCookies)
      ? rawCookies
      : rawCookies
        ? [rawCookies]
        : [];

    userSlug = res.body.data.slug;
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

  afterAll(async () => {
    await request(app).delete(`/api/users/${userSlug}`).set("Cookie", cookies);
  });
});
