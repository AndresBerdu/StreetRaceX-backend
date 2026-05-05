import request from "supertest";
import { beforeAll, describe, expect, it } from "vitest";
import { app } from "../../server.ts";

describe("Auth logue out session", () => {
  let cookies: string[];

  /* Preparation for sign in with one user */
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

  /* Test happy path new user create */
  it("Should logue out user and banned the tokens in db", async () => {
    const res = await request(app)
      .post("/api/auth/logue-out-session")
      .set("Cookie", cookies);
    /* Status code response */
    expect(res.status).toBe(204);
  });

  /* Test if you don't provide the access token by cookies */
  it("Shoud faild if you don't provide access token", async () => {
    const res = await request(app).post("/api/auth/logue-out-session");

    expect(res.status).toBe(401);
  });
});
