import request from "supertest";
import app from "../src/app.js";

describe("API tests", () => {

    test("GET / should return API running", async () => {

        const res = await request(app).get("/");

        expect(res.statusCode).toBe(200);
        expect(res.text).toBe("API running");

    });

});