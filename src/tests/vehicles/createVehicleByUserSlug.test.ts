import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app } from "../../server.ts";

describe("Test for create one vehicle for one user", () => {
  let cookies: string[];
  let userSlug = "";
  let plate = "";
  let plate2 = "";
  let plate3 = "";

  beforeAll(async () => {
    const res = await request(app)
      .post("/api/auth/sign-up-session")
      .field("username", "test-2")
      .field("password", "TestPassword09?")
      .field("email", "test-2@gmail.com")
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

    const rawCookies = res.headers["set-cookie"];

    cookies = Array.isArray(rawCookies)
      ? rawCookies
      : rawCookies
        ? [rawCookies]
        : [];

    userSlug = res.body.data.slug;
  });

  /* Test happy path new user create */

  it("Should create a new vehicle", async () => {
    const res = await request(app)
      .post(`/api/users/${userSlug}/vehicles`)
      .field("vehicle_type", "car")
      .field("brand", "toyota")
      .field("model", "toyota 2022")
      .field("year", 2022)
      .field("color", "#FFFFFF")
      .field("plate", "ABC-321")
      .field("modifications", "wheels upgrated")
      .set("Cookie", cookies);

    console.log(res.body)

    plate = res.body.data.plate;

    /* Status code response */
    expect(res.status).toBe(201);

    /* Cookies response */
    expect(res.body).toHaveProperty("ok", true);
    expect(res.body).toHaveProperty("data");
    expect(res.body).toHaveProperty("message");
  });

  /* Test email equals */
  it("Shoud fail if you try send other type vehicle", async () => {
    const res = await request(app)
      .post(`/api/users/${userSlug}/vehicles`)
      .field("vehicle_type", "something")
      .field("brand", "toyota")
      .field("model", "toyota 2022")
      .field("year", 2022)
      .field("color", "#FFFFFF")
      .field("plate", "ABC-123")
      .field("modifications", "wheels upgrated")
      .set("Cookie", cookies);

    /* Status code response */
    expect(res.status).toBe(422);

    /* Cookies response */
    expect(res.body).toHaveProperty("ok", false);
    expect(res.body).toHaveProperty("error");
  });

  it("Shoud fail if you try send one year with other format", async () => {
    const res = await request(app)
      .post(`/api/users/${userSlug}/vehicles`)
      .field("vehicle_type", "car")
      .field("brand", "toyota")
      .field("model", "toyota 2022")
      .field("year", 203213)
      .field("color", "#FFFFFF")
      .field("plate", "ABC-123")
      .field("modifications", "wheels upgrated")
      .set("Cookie", cookies);

    /* Status code response */
    expect(res.status).toBe(422);

    /* Cookies response */
    expect(res.body).toHaveProperty("ok", false);
    expect(res.body).toHaveProperty("error");
  });

  it("Shoud fail if you try send plate like different format", async () => {
    const res = await request(app)
      .post(`/api/users/${userSlug}/vehicles`)
      .field("vehicle_type", "car")
      .field("brand", "toyota")
      .field("model", "toyota 2022")
      .field("year", "2022")
      .field("color", "white")
      .field("plate", "32213-fadfe")
      .field("modifications", "wheels upgrated")
      .set("Cookie", cookies);

    /* Status code response */
    expect(res.status).toBe(422);

    /* Cookies response */
    expect(res.body).toHaveProperty("ok", false);
    expect(res.body).toHaveProperty("error");
  });

  it("Shoud fail if you try create one type vehicle car or motorcycle without plate", async () => {
    const res = await request(app)
      .post(`/api/users/${userSlug}/vehicles`)
      .field("vehicle_type", "car")
      .field("brand", "toyota")
      .field("model", "toyota 2022")
      .field("year", "2022")
      .field("color", "white")
      .field("plate", "null")
      .field("modifications", "wheels upgrated")
      .set("Cookie", cookies);

    /* Status code response */
    expect(res.status).toBe(422);

    /* Cookies response */
    expect(res.body).toHaveProperty("ok", false);
    expect(res.body).toHaveProperty("error");
  });

  it("Shoud fail if you try create a new car witout cookies", async () => {
    const res = await request(app)
      .post(`/api/users/${userSlug}/vehicles`)
      .field("vehicle_type", "car")
      .field("brand", "toyota")
      .field("model", "toyota 2022")
      .field("year", "2022")
      .field("color", "white")
      .field("plate", "32213-fadfe")
      .field("modifications", "wheels upgrated");

    /* Status code response */
    expect(res.status).toBe(401);

    /* Cookies response */
    expect(res.body).toHaveProperty("ok", false);
    expect(res.body).toHaveProperty("error");
  });

  it("Should fail if you try to create more than 3 cars", async () => {
    const vehicle2 = await request(app)
      .post(`/api/users/${userSlug}/vehicles`)
      .field("vehicle_type", "car")
      .field("brand", "toyota")
      .field("model", "toyota 2022")
      .field("year", 2022)
      .field("color", "#FFFFFF")
      .field("plate", "CBA-123")
      .field("modifications", "wheels upgrated")
      .set("Cookie", cookies);

    plate2 = vehicle2.body.data.plate;

    const vehicle3 = await request(app)
      .post(`/api/users/${userSlug}/vehicles`)
      .field("vehicle_type", "car")
      .field("brand", "toyota")
      .field("model", "toyota 2022")
      .field("year", 2022)
      .field("color", "#FFFFFF")
      .field("plate", "CBA-321")
      .field("modifications", "wheels upgrated")
      .set("Cookie", cookies);

    plate3 = vehicle3.body.data.plate;

    const res = await request(app)
      .post(`/api/users/${userSlug}/vehicles`)
      .field("vehicle_type", "car")
      .field("brand", "toyota")
      .field("model", "toyota 2022")
      .field("year", "2022")
      .field("color", "white")
      .field("plate", "32213-fadfe")
      .field("modifications", "wheels upgrated");

    /* Status code response */
    expect(res.status).toBe(403);

    /* Cookies response */
    expect(res.body).toHaveProperty("ok", false);
    expect(res.body).toHaveProperty("error");
  });

  afterAll(async () => {
    await request(app)
      .delete(`/api/users/${userSlug}/vehicles/plate/${plate}`)
      .set("Cookie", cookies);
    await request(app)
      .delete(`/api/users/${userSlug}/vehicles/plate/${plate2}`)
      .set("Cookie", cookies);
    await request(app)
      .delete(`/api/users/${userSlug}/vehicles/plate/${plate3}`)
      .set("Cookie", cookies);
    await request(app).delete(`/api/users/${userSlug}`).set("Cookie", cookies);
  });
});
