import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app } from "../../server.ts";

describe("Test for get all vehicles of one user", () => {
  let cookies: string[];
  let userSlug = "";
  let plate = "";

  beforeAll(async () => {
    const res = await request(app)
      .post("/api/auth/sign-up-session")
      .field("username", "test-10")
      .field("password", "TestPassword09?")
      .field("email", "test-10@gmail.com")
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

    const vehicle = await request(app)
      .post(`/api/users/${userSlug}/vehicles`)
      .field("vehicle_type", "car")
      .field("brand", "toyota")
      .field("model", "toyota 2022")
      .field("year", 2022)
      .field("color", "#FFFFFF")
      .field("plate", "ABC-123")
      .field("modifications", "wheels upgrated")
      .set("Cookie", cookies);

    plate = vehicle.body.data.plate;
  });

  it("should get all vehicles of user", async () => {
    const res = await request(app)
      .get(`/api/users/${userSlug}/vehicles`)
      .set("Cookie", cookies);

    /* Status code response */
    expect(res.status).toBe(200);

    /* Cookies response */
    expect(res.body).toHaveProperty("ok", true);
    expect(res.body).toHaveProperty("data");
    expect(res.body).toHaveProperty("message");
  });

  it("should fail if user doesn't exist", async () => {
    const res = await request(app)
      .get(`/api/users/something/vehicles`)
      .set("Cookie", cookies);

    /* Status code response */
    expect(res.status).toBe(404);

    /* Cookies response */
    expect(res.body).toHaveProperty("ok", false);
    expect(res.body).toHaveProperty("error");
  });

  it("should fail if user doesn't send cookies", async () => {
    const res = await request(app).get(`/api/users/${userSlug}/vehicles`);

    /* Status code response */
    expect(res.status).toBe(401);

    /* Cookies response */
    expect(res.body).toHaveProperty("ok", false);
    expect(res.body).toHaveProperty("error");
  });

  afterAll(async () => {
    await request(app)
      .delete(`/api/users/${userSlug}/vehicles/plate/${plate}`)
      .set("Cookie", cookies);
    await request(app).delete(`/api/users/${userSlug}`).set("Cookie", cookies);
  });
});
