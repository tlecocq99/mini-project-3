const express = require("express");
const router = express.Router();
const Faction = require("../models/Faction");

// GET all factions
router.get("/", async (req, res) => {
  const factions = await Faction.find();
  res.json(factions);
});

// GET faction by slug
router.get("/:slug", async (req, res) => {
  const faction = await Faction.findOne({ slug: req.params.slug });
  if (!faction) return res.status(404).json({ error: "Not found" });
  res.json(faction);
});

module.exports = router;
