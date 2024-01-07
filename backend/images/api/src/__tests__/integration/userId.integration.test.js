const request = require("supertest");
const app = require("../../app");
const knexfile = require("../../db/knexfile");
const db = require("knex")(knexfile);

describe("GET api/users/:userId", () => {
  beforeAll(async () => {
    await db.raw("BEGIN");
  });
  afterAll(async () => {
    await db.destroy();
  });

  test("should return the correct user record", async () => {
    const userId = "5ea3cd78-1f8f-49f0-bab0-c54f6c5660e0";
    const response = await request(app).get(`/api/users/${userId}`);
    expect(response.status).toBe(200);
    expect(response.body.user.data).toHaveProperty("id", userId);

    const dbRecord = await db("users").select("*").where("id", userId);
    expect(dbRecord[0]).toHaveProperty("id", userId);
    expect(dbRecord[0]).toHaveProperty("username", userId);
  });

  //   test("should return 404 for not-existent user", async () => {
  //     const nonExistentUserId = "123456789"; // Assuming this ID does not exist in the database
  //     const response = await request(app).get(`/api/users/${nonExistentUserId}`);

  //     expect(response.status).toBe(404);
  //   });

  test("should return 400 when the given userId doesnt follow the userId logic and uses weird signs", async () => {
    const nonExistentUserId = "123456789@@!!!ççç"; // Assuming this ID does not exist in the database
    const response = await request(app).get(`/api/users/${nonExistentUserId}`);

    expect(response.status).toBe(400);
  });
});
