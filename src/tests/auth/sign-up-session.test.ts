import request from "supertest";
import { afterAll, describe, expect, it } from "vitest";
import { app } from "../../server.ts";

describe("Auth sign up session", () => {
  /* Test happy path new user create */

  let userSlug = "";
  let cookies: string[];

  it("Should create a new user", async () => {
    const res = await request(app)
      .post("/api/auth/sign-up-session")
      .field("username", "andres")
      .field("password", "Frutamadre09?")
      .field("email", "andres@gmail.com")
      .field(
        "locality",
        JSON.stringify({
          zone_localicity: "12 de Octubre",
          zone_city: "Medellín",
          zone_state: "Antioquia",
          zone_country: "Colombia",
        }),
      )
      .attach("profile_photo", "src/tests/files/takumiImage.jpg");

    /* Status code response */
    expect(res.status).toBe(201);

    /* Cookies response */
    expect(res.body).toHaveProperty("ok", true);
    expect(res.body).toHaveProperty("data");
    expect(res.body).toHaveProperty("message");

    const rawCookies = res.headers["set-cookie"];

    // Normalizamos: siempre será un string[]
    cookies = Array.isArray(rawCookies)
      ? rawCookies
      : rawCookies
        ? [rawCookies]
        : [];

    userSlug = res.body.data.slug;
  });

  /* Test username equals */
  it("Shoud fail if there have a user with same username than other", async () => {
    const res = await request(app)
      .post("/api/auth/sign-up-session")
      .field("username", "andres")
      .field("password", "Frutamadre09?")
      .field("email", "pedro@gmail.com")
      .field(
        "locality",
        JSON.stringify({
          zone_localicity: "12 de Octubre",
          zone_city: "Medellín",
          zone_state: "Antioquia",
          zone_country: "Colombia",
        }),
      )
      .attach("profile_photo", "src/tests/files/takumiImage.jpg");

    /* Status code response */
    expect(res.status).toBe(409);

    /* Cookies response */
    expect(res.body).toHaveProperty("ok", false);
    expect(res.body).toHaveProperty("error");
  });

    /* Test email equals */
  it("Shoud fail if there have a user with same email than other", async () => {
    const res = await request(app)
      .post("/api/auth/sign-up-session")
      .field("username", "something")
      .field("password", "Frutamadre09?")
      .field("email", "andres@gmail.com")
      .field(
        "locality",
        JSON.stringify({
          zone_localicity: "12 de Octubre",
          zone_city: "Medellín",
          zone_state: "Antioquia",
          zone_country: "Colombia",
        }),
      )
      .attach("profile_photo", "src/tests/files/takumiImage.jpg");

    /* Status code response */
    expect(res.status).toBe(409);

    /* Cookies response */
    expect(res.body).toHaveProperty("ok", false);
    expect(res.body).toHaveProperty("error");
  });


  afterAll(async () => {
    await request(app).delete(`/api/users/${userSlug}`).set("Cookie", cookies);
  });
});
