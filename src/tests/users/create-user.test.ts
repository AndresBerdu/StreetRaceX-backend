import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app } from "../../server.ts";

describe("User create new user", () => {
  let cookies: string[];
  let userSlug = "";

  beforeAll(async () => {
    const res = await request(app)
      .post("/api/auth/sign-in-session")
      .send({ username: "pedro", password: "Frutamadre09?" });

    const rawCookies = res.headers["set-cookie"];

    cookies = Array.isArray(rawCookies)
      ? rawCookies
      : rawCookies
        ? [rawCookies]
        : [];
  });

  /* Test happy path new user create */

  it("Should create a new user", async () => {
    const res = await request(app)
      .post("/api/users")
      .field("username", "test-7")
      .field("password", "TestPassword09?")
      .field("email", "test-7@gmail.com")
      .field(
        "locality",
        JSON.stringify({
          zone_localicity: "12 de Octubre",
          zone_city: "Medellín",
          zone_state: "Antioquia",
          zone_country: "Colombia",
        }),
      )
      .attach("profile_photo", "src/tests/files/takumiImage.jpg")
      .set("Cookie", cookies);

      console.log(res.body);

    /* Status code response */
    expect(res.status).toBe(201);

    /* Cookies response */
    expect(res.body).toHaveProperty("ok", true);
    expect(res.body).toHaveProperty("data");
    expect(res.body).toHaveProperty("message");

    userSlug = res.body.data.slug;
  });

  /* Test username equals */
  it("Shoud fail if there have a user with same username than other", async () => {
    const res = await request(app)
      .post("/api/users")
      .field("username", "test-7")
      .field("password", "Frutamadre09?")
      .field("email", "something@gmail.com")
      .field(
        "locality",
        JSON.stringify({
          zone_localicity: "12 de Octubre",
          zone_city: "Medellín",
          zone_state: "Antioquia",
          zone_country: "Colombia",
        }),
      )
      .attach("profile_photo", "src/tests/files/takumiImage.jpg")
      .set("Cookie", cookies);

    /* Status code response */
    expect(res.status).toBe(409);

    /* Cookies response */
    expect(res.body).toHaveProperty("ok", false);
    expect(res.body).toHaveProperty("error");
  });

  /* Test email equals */
  it("Shoud fail if there have a user with same email than other", async () => {
    const res = await request(app)
      .post("/api/users")
      .field("username", "something")
      .field("password", "Frutamadre09?")
      .field("email", "test-7@gmail.com")
      .field(
        "locality",
        JSON.stringify({
          zone_localicity: "12 de Octubre",
          zone_city: "Medellín",
          zone_state: "Antioquia",
          zone_country: "Colombia",
        }),
      )
      .attach("profile_photo", "src/tests/files/takumiImage.jpg")
      .set("Cookie", cookies);

    /* Status code response */
    expect(res.status).toBe(409);

    /* Cookies response */
    expect(res.body).toHaveProperty("ok", false);
    expect(res.body).toHaveProperty("error");
  });

  it("Should fail if you try to send some field with one error in syntasis", async () => {
    const res = await request(app)
      .post("/api/users")
      .field("username", "")
      .field("password", "Frutamadre")
      .field("email", "andres@")
      .field(
        "locality",
        JSON.stringify({
          zone_localicity: "12 de Octubre",
          zone_city: "Medellín",
          zone_state: "Antioquia",
          zone_country: "Colombia",
        }),
      )
      .set("Cookie", cookies);

    /* Status code response */
    expect(res.status).toBe(422);

    /* Cookies response */
    expect(res.body).toHaveProperty("ok", false);
    expect(res.body).toHaveProperty("error");
  });

  it("Should fail if you don't provide the cookies", async () => {
    const res = await request(app)
      .post("/api/users")
      .field("username", "test-other")
      .field("password", "Frutamadre09?")
      .field("email", "test-other@gmail.com")
      .field(
        "locality",
        JSON.stringify({
          zone_localicity: "12 de Octubre",
          zone_city: "Medellín",
          zone_state: "Antioquia",
          zone_country: "Colombia",
        }),
      );

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
