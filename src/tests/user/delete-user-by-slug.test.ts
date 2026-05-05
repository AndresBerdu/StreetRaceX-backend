import request from "supertest";
import { describe, it, expect, beforeAll } from "vitest";
import { app } from "../../server.ts";

describe("User delete one user by slug", () => {
  let userSlug = "";
  let cookies: string[];

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
  });

  /* Test happu path user login and return access token and refresh tokn  */
  it("Should delete the user by slug", async () => {
    const res = await request(app)
      .delete(`/api/users/${userSlug}`)
      .set("Cookie", cookies);

    /* Status code response */
    expect(res.status).toBe(204);

    /* Body response */
    expect(res.body).toHaveProperty("ok", true);
    expect(res.body).toHaveProperty("data");
    expect(res.body).toHaveProperty("message");
  });
});
