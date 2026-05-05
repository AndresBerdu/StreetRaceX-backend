import request from "supertest";
import { describe, it, expect, beforeAll } from "vitest";
import { app } from "../../server.ts";

/* 
KEEP IN MAIN: if in db test you don't have access token the test will faild 
*/

describe("get users", () => {
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
  });

  /* Test happu path user login and return access token and refresh tokn  */
  it("Should return all users with pagination", async () => {
    const res = await request(app)
      .get("/api/users")
      .query({ page: 2, size: 10 })
      .set("Cookie", cookies);

    /* Status code response */
    expect(res.status).toBe(200);

    /* Body response */
    expect(res.body).toHaveProperty("ok", true);
    expect(res.body).toHaveProperty("data");
    expect(res.body).toHaveProperty("meta");
    expect(res.body).toHaveProperty("message");
  });

  it("Shoud return 403 if you don't provide access_token", async () => {
    const res = await request(app)
      .post("/api/users")
      .query({ page: 2, size: 10 });

    expect(res.status).toBe(401);
  });
});
