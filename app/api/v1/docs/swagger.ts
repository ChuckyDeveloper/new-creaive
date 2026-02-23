import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "My API",
            version: "1.0.0",
        },
    },
    apis: ["./app/api/v1/controllers/**/*.ts", "./app/api/v1/auth/**/*.ts"], // files to scan
};

export const swaggerSpec = swaggerJsdoc(options);
