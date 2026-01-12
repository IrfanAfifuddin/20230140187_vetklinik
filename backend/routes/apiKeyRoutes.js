const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const apiKeyMiddleware = require("../middleware/apiKeyMiddleware");
const sequelize = require("../config/database");
const generateApiKey = require("../utils/generateApiKey");

/**
 * CREATE API KEY (LOGIN REQUIRED)
 */
router.post("/", authMiddleware, async (req, res) => {
    const apiKey = generateApiKey();

    await sequelize.query(
        "INSERT INTO api_keys (user_id, api_key, is_active) VALUES (?, ?, 1)",
        { replacements: [req.user.id, apiKey] }
    );

    res.json({ apiKey });
});

/**
 * GET MY API KEYS
 */
router.get("/", authMiddleware, async (req, res) => {
    const [keys] = await sequelize.query(
        "SELECT api_key, is_active, created_at FROM api_keys WHERE user_id = ?",
        { replacements: [req.user.id] }
    );

    res.json(keys);
});

module.exports = router;
