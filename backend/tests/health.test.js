const request = require("supertest");

const app = require("../app");


describe(
    "CareerTrack SA API",
    () => {

        test(
            "GET /api/health should return success",
            async () => {

                const response =
                    await request(app)
                        .get("/api/health");


                expect(
                    response.statusCode
                ).toBe(200);


                expect(
                    response.body.status
                ).toBe("success");


                expect(
                    response.body.message
                ).toBe(
                    "CareerTrack SA backend is running!"
                );

            }
        );

    }
);