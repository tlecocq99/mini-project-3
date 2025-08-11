require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const Faction = require("./models/Faction");
const factionsRoutes = require("./routes/factionsRoutes");
const fetchAndStoreFactions = require("./services/fetchExternalData");

const app = express();
app.use(cors());
app.use(express.json());

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
