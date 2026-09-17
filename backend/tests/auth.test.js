const request = require("supertest");
const app = require("../app");

describe("Authentication Protection", () => {

    test(
        "Protected route should reject requests without a JWT",
        async () => {

            const response =
                await request(app)
                    .get("/api/dashboard/statistics");

            expect(response.statusCode)
                .toBe(401);

            expect(response.body.status)
                .toBe("error");

            expect(response.body.message)
                .toBe(
                    "Access denied. No token provided."
                );

        }
    );


    test(
        "Protected route should reject an invalid JWT",
        async () => {

            const response =
                await request(app)
                    .get("/api/dashboard/statistics")
                    .set(
                        "Authorization",
                        "Bearer invalid-token"
                    );

            expect(response.statusCode)
                .toBe(401);

            expect(response.body.status)
                .toBe("error");

            expect(response.body.message)
                .toBe(
                    "Invalid or expired token."
                );

        }
    );

});