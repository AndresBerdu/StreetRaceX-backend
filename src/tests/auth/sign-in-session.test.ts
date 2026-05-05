import request from "supertest";
import { describe, it, expect } from "vitest";
import { app } from "../../server.ts";

/* 
KEEP IN MAIN: if in db test you don't have user with this credentials, the 
test will fail for the happy path 
*/

describe("Auth sign in session", () => {
  /* Test happy path user login and return access token and refresh tokn  */
  it("Should sign in session and return cookies", async () => {
    const res = await request(app)
      .post("/api/auth/sign-in-session")
      .send({ username: "pedro", password: "Frutamadre09?" });

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
  it("Should fail if there password doesn't equal to user passwoen on db", async () => {
    const res = await request(app)
      .post("/api/auth/sign-in-session")
      .send({ username: "pedro", password: "Frutamadre09" });

    /* Status code response */
    expect(res.status).toBe(401);
    
    /* Cookies response */
    expect(res.body).toHaveProperty("ok", false);
    expect(res.body).toHaveProperty("error");
  });
});
