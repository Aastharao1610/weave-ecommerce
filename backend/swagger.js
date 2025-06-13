import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import path from "path";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "My API",
      version: "1.0.0",
      description: "Auto-generated Swagger docs",
    },
    servers: [
      {
        url: "http://localhost:5000",
      },
    ],
  },

  apis: [path.join(path.resolve(), "routes/*.js")], // full absolute path
};
console.log("Swagger reading from:", path.join(path.resolve(), "routes/*.js"));

const swaggerSpec = swaggerJsdoc(options);

export { swaggerUi, swaggerSpec };
