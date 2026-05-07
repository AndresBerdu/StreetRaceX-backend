import request from "supertest";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { app } from "../../server.ts";

describe("get users", () => {
  let userSlug = "";
  let cookies: string[];
  /* Preparation for sign in wih user and logue out after */
  beforeAll(async () => {
    const res = await request(app)
      .post("/api/auth/sign-up-session")
      .field("username", "test-5")
      .field("password", "TestPassword09?")
      .field("email", "test-5@gmail.com")
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

  /* Test happu path user login and return access token and refresh tokn  */
  it("Should return all users with pagination", async () => {
    const res = await request(app)
      .get("/api/users")
      .query({ page: 2, size: 10 })
      .set("Cookie", cookies);

    /* Status code response */
    expect(res.status).toBe(200);

    /* Body response */
    expect(res.body).toHaveProperty("ok", true);
    expect(res.body).toHaveProperty("data");
    expect(res.body).toHaveProperty("meta");
    expect(res.body).toHaveProperty("message");
  });

  it("Shoud fail if you don't provide access_token", async () => {
    const res = await request(app)
      .post("/api/users")
      .query({ page: 2, size: 10 });

    expect(res.status).toBe(401);
  });

  afterAll(async () => {
    await request(app).delete(`/api/users/${userSlug}`).set("Cookie", cookies);
  });
});
