import request from "supertest";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { app } from "../../server.ts";

describe("User getting one user by slug", () => {
  let userSlug = "";
  let userTestSlug = "";
  let cookies: string[];
  let cookiesTest: string[];

  /* Preparation for sign in wih user and logue out after */
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

    userSlug = loginResult.body.data.slug;

    const registerResult = await request(app)
      .post("/api/auth/sign-up-session")
      .field("username", "test-8")
      .field("password", "TestPassword09?")
      .field("email", "test-8@gmail.com")
      .field(
        "locality",
        JSON.stringify({
          zone_localicity: "12 de Octubre",
          zone_city: "Medellín",
          zone_state: "Antioquia",
          zone_country: "Colombia",
        }),
      );

    const rawCooliesTest = registerResult.headers["set-cookie"];

    cookiesTest = Array.isArray(rawCooliesTest)
      ? rawCooliesTest
      : rawCooliesTest
        ? [rawCooliesTest]
        : [];

    userTestSlug = registerResult.body.data.slug;
  });

  /* Test happy path user login and return access token and refresh tokn  */
  it("Should update the user by slug with cookies of admin", async () => {
    const res = await request(app)
      .patch(`/api/users/${userTestSlug}`)
      .send({
        username: "test-other",
        password: "TestPassword09?",
        email: "test-other@gmail.com",
        locality: {
          zone_localicity: "12 de Octubre",
          zone_city: "Medellín",
          zone_state: "Antioquia",
          zone_country: "Colombia",
        },
      })
      .set("Cookie", cookies);

    /* Status code response */
    expect(res.status).toBe(200);

    /* Body response */
    expect(res.body).toHaveProperty("ok", true);
    expect(res.body).toHaveProperty("data");
    expect(res.body).toHaveProperty("message");
  });

  it("Should update the user by slug with cookies of original user", async () => {
    const res = await request(app)
      .patch(`/api/users/${userTestSlug}`)
      .send({
        username: "test-other2",
        password: "TestPassword09?",
        email: "test-other2@gmail.com",
        locality: {
          zone_localicity: "12 de Octubre",
          zone_city: "Medellín",
          zone_state: "Antioquia",
          zone_country: "Colombia",
        },
      })
      .set("Cookie", cookiesTest);

    /* Status code response */
    expect(res.status).toBe(200);

    /* Body response */
    expect(res.body).toHaveProperty("ok", true);
    expect(res.body).toHaveProperty("data");
    expect(res.body).toHaveProperty("message");
  });

  it("Should fail if you don't send one user on db", async () => {
    const res = await request(app)
      .patch(`/api/users/whatEver`)
      .send({
        username: "test-other",
        password: "TestPassword09?",
        email: "test-other43@gmail.com",
        locality: {
          zone_localicity: "12 de Octubre",
          zone_city: "Medellín",
          zone_state: "Antioquia",
          zone_country: "Colombia",
        },
      })
      .set("Cookie", cookies);

    /* Status code response */
    expect(res.status).toBe(404);

    /* Body response */
    expect(res.body).toHaveProperty("ok", false);
    expect(res.body).toHaveProperty("error");
  });

  it("Should fail if you try update the id, slug or created_at", async () => {
    const res = await request(app)
      .patch(`/api/users/${userTestSlug}`)
      .send({
        id: "something2",
        slug: "TestPassword09?",
        created_at: "test-other@gmail.com",
      })
      .set("Cookie", cookiesTest);

    /* Status code response */
    expect(res.status).toBe(422);

    /* Body response */
    expect(res.body).toHaveProperty("ok", false);
    expect(res.body).toHaveProperty("error");
  });

  it("Should fail if you don't send cookies", async () => {
    const res = await request(app)
      .patch(`/api/users/${userSlug}`)
      .field("username", "something2")
      .field("password", "Somthing09?")
      .field("email", "something2@gmail.com")
      .field(
        "locality",
        JSON.stringify({
          zone_localicity: "something2",
          zone_city: "something2",
          zone_state: "something2",
          zone_country: "something2",
        }),
      );

    /* Status code response */
    expect(res.status).toBe(401);

    /* Body response */
    expect(res.body).toHaveProperty("ok", false);
    expect(res.body).toHaveProperty("error");
  });

  afterAll(async () => {
    await request(app)
      .delete(`/api/users/${userTestSlug}`)
      .set("Cookie", cookiesTest);
  });
});
