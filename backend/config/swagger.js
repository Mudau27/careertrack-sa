const swaggerJsdoc = require("swagger-jsdoc");

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",

        info: {
            title: "CareerTrack SA API",
            version: "1.0.0",
            description:
                "REST API documentation for the CareerTrack SA Job Application and Career Management Platform."
        },

        servers: [
            {
                url: "http://localhost:5000",
                description: "Local development server"
            }
        ],

        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            }
        },

        tags: [
            {
                name: "System",
                description:
                    "System health and database endpoints"
            },
            {
                name: "Authentication",
                description:
                    "User registration and login"
            },
            {
                name: "Profile",
                description:
                    "User profile and CV management"
            },
            {
                name: "Jobs",
                description:
                    "Job management"
            },
            {
                name: "Saved Jobs",
                description:
                    "Saved job management"
            },
            {
                name: "Applications",
                description:
                    "Job application tracking"
            },
            {
                name: "Interviews",
                description:
                    "Interview management"
            },
            {
                name: "Notifications",
                description:
                    "User notifications"
            },
            {
                name: "Dashboard",
                description:
                    "Dashboard statistics"
            },
            {
                name: "CV Analyzer",
                description:
                    "ATS-style CV analysis"
            },
            {
                name: "Admin",
                description:
                    "Administrator operations"
            }
        ]
    },

    apis: [
        "./routes/*.js",
        "./app.js"
    ]
};

const swaggerSpec =
    swaggerJsdoc(swaggerOptions);

module.exports = swaggerSpec;