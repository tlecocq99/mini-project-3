require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const connectDB = require("./config/db");
const Faction = require("./models/Faction");
const factionsRoutes = require("./routes/factionsRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

const fetchAndStoreFactions = require("./services/fetchExternalData");

// Seed DB from factions.json if empty
async function seedDatabase() {
  const count = await Faction.countDocuments();
  if (count === 0) {
    await fetchAndStoreFactions();
    console.log("✅ Database seeded with factions.json");
  }
}
seedDatabase();

// Routes
app.use("/api/factions", factionsRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
