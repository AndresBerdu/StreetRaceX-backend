import request from "supertest";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { app } from "../../server.ts";

describe("User getting one user by slug", () => {
  let userSlug = "";
  let cookies: string[];
  /* Preparation for sign in wih user and logue out after */
  beforeAll(async () => {
    const res = await request(app)
      .post("/api/auth/sign-up-session")
      .field("username", "test-6")
      .field("password", "TestPassword09?")
      .field("email", "test-6@gmail.com")
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

  /* Test happy path user login and return access token and refresh token  */
  it("Should get the user by slug", async () => {
    const res = await request(app)
      .get(`/api/users/${userSlug}`)
      .set("Cookie", cookies);

    /* Status code response */
    expect(res.status).toBe(200);

    /* Body response */
    expect(res.body).toHaveProperty("ok", true);
    expect(res.body).toHaveProperty("data");
    expect(res.body).toHaveProperty("message");
  });

  /* Test if you don't provide one user on db */
  it("Should fail if you don't provide one user on db", async () => {
    const res = await request(app)
      .get("/api/users/whatEverUser")
      .set("Cookie", cookies);

    /* Status code response */
    expect(res.status).toBe(404);

    /* Body response */
    expect(res.body).toHaveProperty("error");
  });

  /* Test if you don't provide access_token  */
  it("Shoud fail if you don't provide access_token", async () => {
    const res = await request(app).get(`/api/users/${userSlug}`);

    /* Status code response */
    expect(res.status).toBe(401);

    /* Body response */
    expect(res.body).toHaveProperty("error");
  });

  afterAll(async () => {
    await request(app).delete(`/api/users/${userSlug}`).set("Cookie", cookies);
  });
});
