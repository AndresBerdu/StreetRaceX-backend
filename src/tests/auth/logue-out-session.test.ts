import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app } from "../../server.ts";

describe("Auth logue out session", () => {
  let userSlug = "";
  let cookies: string[];

  /* Preparation for sign in wih user and logue out after */
  beforeAll(async () => {
    const res = await request(app)
      .post("/api/auth/sign-up-session")
      .field("username", "test-4")
      .field("password", "TestPassword09?")
      .field("email", "test-4@gmail.com")
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
  it("Should logue out user and banned the tokens in db", async () => {
    const res = await request(app)
      .post("/api/auth/logue-out-session")
      .set("Cookie", cookies);
    /* Status code response */
    expect(res.status).toBe(204);
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
