const sequelize = require("../config/database");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async (req, res, next) => {
    try {
        // 1. EXTRACT JWT USER (IF LOGGED IN)
        let currentUser = null;
        const authHeader = req.headers.authorization;
        if (authHeader) {
            const token = authHeader.split(" ")[1];
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                currentUser = decoded;
            } catch (e) { /* Token invalid, ignore */ }
        }

        // 2. ADMIN BYPASS (No API Key needed)
        if (currentUser && currentUser.role === 'admin') {
            const user = await User.findByPk(currentUser.id);
            if (user) {
                req.user = user;
                return next();
            }
        }

        // 3. API KEY CHECK
        const apiKey = req.headers["x-api-key"];

        if (!apiKey) {
            return res.status(401).json({
                message: "API Key diperlukan"
            });
        }

        const [rows] = await sequelize.query(
            "SELECT * FROM api_keys WHERE api_key = ? AND is_active = 1",
            { replacements: [apiKey] }
        );

        if (rows.length === 0) {
            return res.status(403).json({
                message: "API Key tidak valid"
            });
        }

        const keyData = rows[0];

        // 4. OWNERSHIP VALIDATION (CRITICAL FIX)
        // Jika user sedang login (punya JWT), API Key harus milik user tersebut
        if (currentUser) {
            if (Number(keyData.user_id) !== Number(currentUser.id)) {
                return res.status(403).json({
                    message: "Akses Ditolak: Anda tidak dapat menggunakan API Key milik pengguna lain."
                });
            }
        }

        // update last_used
        await sequelize.query(
            "UPDATE api_keys SET last_used = NOW() WHERE id = ?",
            { replacements: [keyData.id] }
        );

        req.apiKey = keyData;

        // Fetch user associated with this API key (or trust JWT identity)
        const userId = currentUser ? currentUser.id : keyData.user_id;
        if (userId) {
            const [userRows] = await sequelize.query(
                "SELECT * FROM users WHERE id = ?",
                { replacements: [userId] }
            );

            if (userRows.length > 0) {
                req.user = userRows[0];
            }
        }

        next();

    } catch (err) {
        console.error("API KEY ERROR:", err);
        res.status(500).json({ message: "API Key error" });
    }
};
