import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app } from "../../server.ts";

describe("", () => {
  let userSlug = "";
  let userTestSlug = "";
  let cookies: string[];
  let cookiesTest: string[];

  /* Preparation for sign in wih user and logue out after */
  beforeAll(async () => {
    const loginResult = await request(app)
      .post("/api/auth/sign-in-session")
      .send({ username: "pedro", password: "Frutamadre09?" });

    const rawCookiesLogin = loginResult.headers["set-cookie"];

    cookies = Array.isArray(rawCookiesLogin)
      ? rawCookiesLogin
      : rawCookiesLogin
        ? [rawCookiesLogin]
        : [];

    userSlug = loginResult.body.data.slug;

    const res = await request(app)
      .post("/api/auth/sign-up-session")
      .field("username", "test-9")
      .field("password", "TestPassword09?")
      .field("email", "test-9@gmail.com")
      .field(
        "locality",
        JSON.stringify({
          zone_localicity: "12 de Octubre",
          zone_city: "Medellín",
          zone_state: "Antioquia",
          zone_country: "Colombia",
        }),
      );

    userTestSlug = res.body.data.slug;
  });

  /* Test happy path user login and return access token and refresh tokn  */
  it("Should delete the user by slug with cookies of admin", async () => {
    const res = await request(app)
      .delete(`/api/users/${userTestSlug}`)
      .set("Cookie", cookies);

    /* Status code response */
    expect(res.status).toBe(204);
  });

  /* Test happy path user login and return access token and refresh tokn  */
  it("Should delete the user by slug with cookies of orginial user", async () => {
    const resultRegister = await request(app)
      .post("/api/auth/sign-up-session")
      .field("username", "test-9")
      .field("password", "TestPassword09?")
      .field("email", "test-9@gmail.com")
      .field(
        "locality",
        JSON.stringify({
          zone_localicity: "12 de Octubre",
          zone_city: "Medellín",
          zone_state: "Antioquia",
          zone_country: "Colombia",
        }),
      );

    const rawCookies = resultRegister.headers["set-cookie"];

    cookiesTest = Array.isArray(rawCookies)
      ? rawCookies
      : rawCookies
        ? [rawCookies]
        : [];

    userTestSlug = resultRegister.body.data.slug;

    const res = await request(app)
      .delete(`/api/users/${userTestSlug}`)
      .set("Cookie", cookiesTest);

    /* Status code response */
    expect(res.status).toBe(204);
  });

  /* Test happy path user login and return access token and refresh tokn  */
  it("Should fail if you try to send one user there dosen't exist", async () => {
    const res = await request(app)
      .delete(`/api/users/something`)
      .set("Cookie", cookies);

    /* Status code response */
    expect(res.status).toBe(404);
  });

  /* Test happy path user login and return access token and refresh tokn  */
  it("Should fail if you try to send cookies", async () => {
    const resultRegister = await request(app)
      .post("/api/auth/sign-up-session")
      .field("username", "test-9")
      .field("password", "TestPassword09?")
      .field("email", "test-9@gmail.com")
      .field(
        "locality",
        JSON.stringify({
          zone_localicity: "12 de Octubre",
          zone_city: "Medellín",
          zone_state: "Antioquia",
          zone_country: "Colombia",
        }),
      );

    const rawCookies = resultRegister.headers["set-cookie"];

    cookiesTest = Array.isArray(rawCookies)
      ? rawCookies
      : rawCookies
        ? [rawCookies]
        : [];

    userTestSlug = resultRegister.body.data.slug;

    const res = await request(app).delete(`/api/users/${userTestSlug}`);

    /* Status code response */
    expect(res.status).toBe(401);
  });

  afterAll(async () => {
    await request(app)
      .delete(`/api/users/${userTestSlug}`)
      .set("Cookie", cookies);
  });
});
