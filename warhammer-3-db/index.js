require("dotenv").config();
const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const connectDB = require("./config/db");
const Faction = require("./models/Faction");
const factionsRoutes = require("./routes/factionsRoutes");
const fetchAndStoreFactions = require("./services/fetchExternalData");

const app = express();
app.use(cors());
app.use(express.json());

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Warhammer 3 Factions API",
      version: "1.0.0",
      description: "API for managing Warhammer 3 factions",
    },
    servers: [
      {
        url: "http://localhost:3001",
      },
    ],
    components: {
      schemas: {
        Faction: {
          type: "object",
          properties: {
            _id: { type: "string" },
            name: { type: "string" },
            race: { type: "string" },
            description: { type: "string" },
            icon_url: { type: "string" },
            dlc: { type: "string" },
            difficulty: { type: "string" },
            slug: { type: "string" },
          },
        },
      },
    },
  },
  apis: ["./routes/factionsRoutes.js"], // Path to your route files for annotation
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Connect to MongoDB
async function startServer() {
  try {
    await connectDB();

    // Seed DB from external API if empty
    const count = await Faction.countDocuments();
    if (count === 0) {
      await fetchAndStoreFactions();
      console.log("✅ Database seeded from external API");
    }

    // Routes
    app.use("/api/factions", factionsRoutes);

    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error("❌ Failed to start server:", err.message);
    process.exit(1);
  }
}

startServer();
