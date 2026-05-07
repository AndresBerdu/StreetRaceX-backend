import request from "supertest";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { app } from "../../server.ts";

describe("Auth sign in session", () => {
  let userSlug = "";
  let cookies: string[];

  /* Preparation for sign in wih user and logue out after */
  beforeAll(async () => {
    const res = await request(app)
      .post("/api/auth/sign-up-session")
      .field("username", "test-1")
      .field("password", "TestPassword09?")
      .field("email", "test-1@gmail.com")
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

  /* Test happy path user login and return access token and refresh tokn  */
  it("Should sign in session and return cookies", async () => {
    const res = await request(app)
      .post("/api/auth/sign-in-session")
      .send({ username: "test-1", password: "TestPassword09?" });

    /* Status code response */
    expect(res.status).toBe(200);

    /* Body response */
    expect(res.body).toHaveProperty("ok", true);
    expect(res.body).toHaveProperty("data");
    expect(res.body).toHaveProperty("message");

    /* Cookies response */
    const cookies = res.headers["set-cookie"] ?? [];
    expect(cookies.length).toBeGreaterThan(0);

    if (Array.isArray(cookies)) {
      const accessCookie = cookies.find((c: string) =>
        c.startsWith("access_token="),
      );
      const refreshCookie = cookies.find((c: string) =>
        c.startsWith("refresh_token="),
      );
      expect(accessCookie).toContain("access_token=");
      expect(refreshCookie).toContain("refresh_token=");
    }
  });

  /* Test if user doesn't exist */
  it("Should fail if on db doesn't have user with this username", async () => {
    const res = await request(app)
      .post("/api/auth/sign-in-session")
      .send({ username: "NoUserExist", password: "WhatEver" });

    /* Status code response */
    expect(res.status).toBe(404);

    /* Cookies response */
    expect(res.body).toHaveProperty("ok", false);
    expect(res.body).toHaveProperty("error");
  });

  /* Test if you don't send the same password than user password on db */
  it("Should fail if there password doesn't equal to user password on db", async () => {
    const res = await request(app)
      .post("/api/auth/sign-in-session")
      .send({ username: "test-1", password: "whatEverPassword" });

    /* Status code response */
    expect(res.status).toBe(401);

    /* Cookies response */
    expect(res.body).toHaveProperty("ok", false);
    expect(res.body).toHaveProperty("error");
  });

  afterAll(async () => {
    await request(app).delete(`/api/users/${userSlug}`).set("Cookie", cookies);
  });
});
